import { fetchServiceBySlug } from "/js/wix/services.js";
import { createBookingFlowStore } from "/js/wix/booking-flow-store.js";

// The owner's "Free in-person estimate" service in Wix Bookings. Hours, approval and the booking
// form are edited in the Wix dashboard; this page follows.
var SLUG = "free-in-person-estimate";
var root = document.getElementById("schedule-app");

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function unavailable(msg) {
  root.innerHTML = '<div class="sched-note"><h2>Online scheduling isn\'t available right now</h2><p>' + esc(msg) + '</p><p><a class="btn btn-primary" href="quote.html">Request a free quote</a></p></div>';
}

function fieldHtml(f) {
  var id = "sf-" + String(f.target).replace(/[^a-zA-Z0-9_-]/g, "_");
  var rawLabel = f.label || f.target;
  var label = /multi-?line address/i.test(rawLabel) ? "Property address" : rawLabel;
  var h = '<div class="form-field"><label class="form-label" for="' + id + '">' + esc(label) + (f.required ? ' <span class="form-required" aria-hidden="true">*</span>' : "") + "</label>";
  var attrs = ' id="' + id + '" name="' + esc(f.target) + '" data-field="' + esc(f.target) + '"' + (f.required ? " required" : "");
  if (f.options && f.options.length) {
    h += '<select class="form-control"' + attrs + '><option value="">Select one</option>';
    f.options.forEach(function (o) {
      var v = typeof o === "string" ? o : (o.value != null ? o.value : o.label);
      var l = typeof o === "string" ? o : (o.label || v);
      h += '<option value="' + esc(v) + '">' + esc(l) + "</option>";
    });
    h += "</select>";
  } else if (/address|message/i.test(rawLabel + " " + f.target)) {
    h += '<textarea class="form-control" rows="' + (/address/i.test(rawLabel) ? 2 : 4) + '"' + attrs + "></textarea>";
  } else {
    var type = f.type === "EMAIL" ? "email" : f.type === "PHONE" ? "tel" : f.type === "NUMBER" ? "number" : f.type === "URL" ? "url" : "text";
    h += '<input class="form-control" type="' + type + '"' + attrs + ">";
  }
  return h + "</div>";
}

function start(service) {
  var store = createBookingFlowStore(service);
  var activeDay = null;
  var fieldsBuilt = false;

  var meta = [service.durationLabel, service.tagLine].filter(Boolean).join(", ");
  root.innerHTML =
    '<div class="sched-intro"><h2>' + esc(service.name) + '</h2>' +
    '<p class="sched-meta">' + esc(meta) + '</p>' +
    '<div class="sched-desc">' + (service.description || "") + '</div></div>' +
    '<div class="sched-picker" id="sched-picker"></div>' +
    '<form class="sched-form" id="sched-form" novalidate hidden>' +
    '<h3>Your details</h3><p class="sched-picked" id="sched-picked"></p>' +
    '<div id="sched-fields"></div>' +
    '<p class="form-error" id="sched-error" role="alert" hidden></p>' +
    '<button class="btn btn-primary" type="submit" id="sched-submit" disabled>Request this time</button></form>' +
    '<div class="sched-done" id="sched-done" hidden></div>';

  var picker = document.getElementById("sched-picker");
  var formEl = document.getElementById("sched-form");
  var fieldsEl = document.getElementById("sched-fields");
  var pickedEl = document.getElementById("sched-picked");
  var errEl = document.getElementById("sched-error");
  var btn = document.getElementById("sched-submit");
  var done = document.getElementById("sched-done");

  function dayOf(s, key) {
    return (s.days || []).filter(function (d) { return d.dayKey === key; })[0];
  }

  function slotByKey(s, key) {
    var found = null;
    (s.days || []).forEach(function (d) {
      d.slots.forEach(function (sl) { if (sl.key === key) { found = sl; } });
    });
    return found;
  }

  function renderPicker(s) {
    var days = s.days;
    var h = "<h3>Pick a day and time</h3>";
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var atStart = s.windowStart <= today;
    var label = "Week of " + s.windowStart.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    h += '<div class="week-nav"><button type="button" data-week="prev"' + (atStart ? " disabled" : "") + '>Earlier</button><span class="week-label">' + esc(label) + '</span><button type="button" data-week="next">Later</button></div>';
    if (s.error && !s.selectedSlot) { h += '<p class="form-error">' + esc(s.error) + "</p>"; }
    if (days === null) {
      h += '<p class="sched-status">Loading times...</p>';
    } else if (!days.length) {
      h += '<p class="sched-status">No open times this week.</p>';
      if (s.nextAvailable && s.nextAvailable.length) {
        h += '<p><button type="button" class="slot" data-jump="' + esc(s.nextAvailable[0].dayKey) + '">See the next opening</button></p>';
      }
    } else {
      h += '<div class="days">';
      days.forEach(function (d) {
        h += '<button type="button" class="day" data-day="' + esc(d.dayKey) + '" aria-pressed="' + (d.dayKey === activeDay) + '">' + esc(d.dayLabel) + "</button>";
      });
      h += "</div>";
      var day = dayOf(s, activeDay);
      h += '<div class="slots">';
      (day ? day.slots : []).forEach(function (sl) {
        var on = !!(s.selectedSlot && s.selectedSlot.key === sl.key);
        h += '<button type="button" class="slot" data-slot="' + esc(sl.key) + '"' + (sl.bookable ? "" : " disabled") + ' aria-pressed="' + on + '">' + esc(sl.label) + "</button>";
      });
      h += "</div>";
    }
    if (s.timeZoneLabel) { h += '<p class="sched-tz">Times shown in ' + esc(s.timeZoneLabel) + ".</p>"; }
    picker.innerHTML = h;
  }

  function syncForm(s) {
    document.querySelectorAll("#sched-fields [data-field]").forEach(function (c) {
      var v = s.values[c.getAttribute("data-field")];
      var str = v == null ? "" : String(v);
      if (c.value !== str && document.activeElement !== c) { c.value = str; }
    });
    if (s.selectedSlot) {
      var day = dayOf(s, activeDay);
      pickedEl.textContent = "You picked " + (day ? day.dayLabel + " at " : "") + s.selectedSlot.label + ".";
    }
    btn.textContent = s.booking ? "Sending..." : (s.ctaState === "requestToBook" ? "Request this time" : "Book this time");
    btn.disabled = !s.canBook || s.booking;
    errEl.textContent = s.error || "";
    errEl.hidden = !s.error;
  }

  function showDone(s) {
    picker.hidden = true;
    formEl.hidden = true;
    var req = s.ctaState === "requestToBook";
    done.hidden = false;
    done.innerHTML = "<h3>" + (req ? "Request sent" : "You're booked") + "</h3><p>" +
      (req ? "Thanks. We'll confirm your time with you." : "Your free estimate is booked.") +
      '</p><p><a href="index.html">Back to the home page</a></p>';
  }

  function render(s) {
    var days = s.days || [];
    var stillThere = days.filter(function (d) { return d.dayKey === activeDay; }).length > 0;
    if (!stillThere) { activeDay = days.length ? days[0].dayKey : null; }
    if (s.confirmed) { showDone(s); return; }
    renderPicker(s);
    formEl.hidden = !s.selectedSlot;
    if (!fieldsBuilt && s.formFields && s.formFields.length) {
      fieldsEl.innerHTML = s.formFields.map(fieldHtml).join("");
      fieldsBuilt = true;
    }
    syncForm(s);
  }

  root.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("button") : null;
    if (!b || !picker.contains(b)) { return; }
    var d = b.dataset;
    if (d.week === "next") { store.nextWeek(); }
    else if (d.week === "prev") { store.prevWeek(); }
    else if (d.day) {
      if (activeDay !== d.day) {
        activeDay = d.day;
        store.setSelectedSlot(null);
        render(store.getState());
      }
    }
    else if (d.slot) { store.setSelectedSlot(slotByKey(store.getState(), d.slot)); }
    else if (d.jump) { store.jumpTo(d.jump); }
  });

  function onField(e) {
    var t = e.target;
    if (t && t.getAttribute && t.getAttribute("data-field")) { store.setValue(t.getAttribute("data-field"), t.value); }
  }
  formEl.addEventListener("input", onField);
  formEl.addEventListener("change", onField);
  formEl.addEventListener("submit", function (e) {
    e.preventDefault();
    store.book().catch(function () {});
  });

  store.subscribe(render);
  render(store.getState());
  store.start();
}

async function init() {
  if (!root) { return; }
  var service = null;
  try { service = await fetchServiceBySlug(SLUG); } catch (e) { service = null; }
  if (!service) {
    unavailable("Please send a quote request instead and we'll get back to you.");
    return;
  }
  try { document.title = service.name + " | Nashoba Power Wash"; } catch (e) { /* ignore */ }
  start(service);
}

init();

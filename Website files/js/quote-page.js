import { renderForm } from "/js/form-renderer.js";

// The quote form is the owner's "Request a Quote" form in Wix Forms.
// Edit its fields, thank-you text and notifications in the Wix dashboard; this page follows.
var FORM_ID = "3e46dfc2-7dff-45da-a42d-54ea57a1d982";
var root = document.getElementById("quote-form");

// What the visitor picked on the house, matched to the form's own choice labels
var KEYWORDS = {
  siding: /siding|house/i,
  patio: /patio/i,
  deck: /deck/i,
  fence: /fence/i,
  other: /something else|other/i
};

function readPicks() {
  try {
    var saved = JSON.parse(sessionStorage.getItem("npw_picks") || "null");
    return saved && saved.state ? saved.state : null;
  } catch (e) {
    return null;
  }
}

function applyPicks(store) {
  var picks = readPicks();
  if (!picks) { return; }
  var s = store.getState();
  if (!s.form) { return; }

  var group = s.form.fields.filter(function (f) { return f.control === "checkboxGroup" || f.control === "tags"; })[0];
  if (group) {
    var current = s.values[group.target];
    if (!current || !current.length) {
      var chosen = [];
      (group.choices || []).forEach(function (c) {
        Object.keys(KEYWORDS).forEach(function (k) {
          if (picks[k] && KEYWORDS[k].test(c.label) && chosen.indexOf(c.value) === -1) { chosen.push(c.value); }
        });
      });
      if (chosen.length) { store.setValue(group.target, chosen); }
    }
  }

  var SIDE_NAMES = { front: "front", left: "left side", right: "right side", back: "back" };
  var notes = [];
  if (picks.siding && picks.sides) {
    var chosen = Object.keys(SIDE_NAMES).filter(function (k) { return picks.sides[k]; }).map(function (k) { return SIDE_NAMES[k]; });
    if (chosen.length === 4) { notes.push("House sides to wash: all four sides."); }
    else if (chosen.length) { notes.push("House sides to wash: " + chosen.join(", ") + "."); }
  }
  var extra = picks.other && picks.otherText ? String(picks.otherText).trim() : "";
  if (extra) { notes.push("Also needs cleaning: " + extra); }
  if (notes.length) {
    var area = s.form.fields.filter(function (f) { return f.control === "textarea" || f.identifier === "TEXT_AREA"; })[0];
    if (area && !s.values[area.target]) { store.setValue(area.target, notes.join(" ")); }
  }
}

if (root) {
  var store = renderForm(root, {
    formId: FORM_ID,
    classPrefix: "form",
    text: { submit: "Request my free quote" },
    onSuccess: function () {
      try { sessionStorage.removeItem("npw_picks"); } catch (e) { /* ignore */ }
      var box = document.getElementById("quote-picks");
      if (box) { box.hidden = true; }
    }
  });
  var applied = false;
  var tryApply = function (s) {
    if (!applied && s.form) {
      applied = true;
      applyPicks(store);
    }
  };
  store.subscribe(tryApply);
  tryApply(store.getState());
}

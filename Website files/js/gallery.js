(function () {
  var cfg = window.NPW || {};
  var grid = document.getElementById("gallery-grid");
  if (!grid) return;

  var section = document.getElementById("gallery");
  var empty = document.getElementById("gallery-empty");
  var tabs = document.getElementById("gallery-tabs");
  var more = document.getElementById("gallery-more");
  var note = document.getElementById("gallery-note");
  var limit = parseInt(grid.getAttribute("data-limit") || "0", 10);

  var items = Array.isArray(cfg.gallery) ? cfg.gallery.filter(function (it) { return it && it.before && it.after; }) : [];

  // ?demo=1 shows a labeled placeholder so the slider can be tried before real photos exist
  var demo = /[?&]demo=1(&|$)/.test(location.search);
  function placeholder(kind) {
    var color = kind === "before" ? "#7b8579" : "#5b8bd7";
    var label = kind === "before" ? "EXAMPLE BEFORE" : "EXAMPLE AFTER";
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect width='800' height='600' fill='" + color + "'/><text x='400' y='310' font-family='Arial' font-size='44' font-weight='700' fill='white' text-anchor='middle'>" + label + "</text></svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }
  var isDemo = false;
  if (!items.length && demo) {
    isDemo = true;
    items = [{ before: placeholder("before"), after: placeholder("after"), caption: "Layout preview only. This is not a real job.", category: "Preview" }];
  }

  if (!items.length) {
    if (empty) { empty.hidden = false; }
    if (tabs) { tabs.hidden = true; }
    if (grid) { grid.hidden = true; }
    if (section && !empty) { section.remove(); }
    return;
  }
  if (more) { more.hidden = false; }
  if (note && isDemo) { note.hidden = false; }

  var ARROWS = "<svg width='26' height='26' viewBox='0 0 26 26' aria-hidden='true'><path d='M9 7l-6 6 6 6M17 7l6 6-6 6' fill='none' stroke='#162d78' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>";

  function slider(it) {
    var wrap = document.createElement("div");
    wrap.className = "ba";

    var after = document.createElement("img");
    after.src = it.after;
    after.alt = (it.caption || "Power washing result") + ", after";
    after.loading = "lazy";

    var beforeWrap = document.createElement("div");
    beforeWrap.className = "ba-before";
    var before = document.createElement("img");
    before.src = it.before;
    before.alt = (it.caption || "Power washing result") + ", before";
    before.loading = "lazy";
    beforeWrap.append(before);

    var line = document.createElement("div");
    line.className = "ba-line";
    var knob = document.createElement("div");
    knob.className = "ba-knob";
    knob.innerHTML = ARROWS;

    var tb = document.createElement("span");
    tb.className = "ba-tag ba-tag-before";
    tb.textContent = "Before";
    var ta = document.createElement("span");
    ta.className = "ba-tag ba-tag-after";
    ta.textContent = "After";

    var range = document.createElement("input");
    range.type = "range";
    range.className = "ba-range";
    range.min = "0";
    range.max = "100";
    range.step = "0.1";
    range.value = "50";
    range.setAttribute("aria-label", "Drag to compare before and after" + (it.caption ? ": " + it.caption : ""));
    range.addEventListener("input", function () { wrap.style.setProperty("--pos", range.value + "%"); });

    wrap.append(after, beforeWrap, line, tb, ta, knob, range);
    return wrap;
  }

  var current = "All";
  function render() {
    grid.textContent = "";
    var list = items.filter(function (it) { return current === "All" || (it.category || "Other") === current; });
    if (limit > 0) { list = list.slice(0, limit); }
    list.forEach(function (it, i) {
      var fig = document.createElement("figure");
      if (i === 0 && (limit > 0 || (list.length > 1 && grid.getAttribute("data-featured") === "1"))) { fig.className = "featured"; }
      fig.append(slider(it));
      if (it.caption) {
        var cap = document.createElement("figcaption");
        cap.textContent = it.caption;
        fig.append(cap);
      }
      grid.append(fig);
    });
  }

  // Category tabs (only when the photos use more than one category)
  if (tabs && limit === 0) {
    var cats = [];
    items.forEach(function (it) { var c = it.category || "Other"; if (cats.indexOf(c) === -1) { cats.push(c); } });
    if (cats.length > 1) {
      tabs.hidden = false;
      ["All"].concat(cats).forEach(function (c) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = c;
        b.setAttribute("aria-pressed", String(c === current));
        b.addEventListener("click", function () {
          current = c;
          tabs.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          render();
        });
        tabs.append(b);
      });
    }
  }
  render();
})();

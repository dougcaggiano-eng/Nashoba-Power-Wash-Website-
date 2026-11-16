(function () {
  var root = document.getElementById("house");
  if (!root) return;

  var SIDE_KEYS = ["front", "left", "right", "back"];
  var SIDE_NAMES = { front: "front", left: "left side", right: "right side", back: "back" };
  var AREAS = ["patio", "deck", "fence"];
  var AREA_LABELS = { patio: "Patio", deck: "Composite deck", fence: "Fence" };
  var state = { sides: { front: false, left: false, right: false, back: false }, patio: false, deck: false, fence: false, other: false, otherText: "" };

  var stage = document.getElementById("h3d-stage");
  var world = document.getElementById("h3d-world");
  var scaler = document.getElementById("h3d-scale");
  var facingEl = document.getElementById("h3d-facing");
  var viewBtns = root.querySelectorAll("[data-view]");
  var sideBoxes = root.querySelectorAll("[data-side-box]");
  var areaBoxes = root.querySelectorAll("[data-part-box]");
  var allBox = document.getElementById("house-sides-all");
  var otherWrap = document.getElementById("house-other-wrap");
  var otherInput = document.getElementById("house-other");
  var summary = document.getElementById("house-summary");
  var cta = document.getElementById("house-cta");

  // Restore picks from earlier in this browser session
  try {
    var saved = JSON.parse(sessionStorage.getItem("npw_picks") || "null");
    if (saved && saved.state) {
      var s = saved.state;
      if (s.sides && typeof s.sides === "object") {
        SIDE_KEYS.forEach(function (k) { state.sides[k] = !!s.sides[k]; });
      } else if (s.siding) {
        SIDE_KEYS.forEach(function (k) { state.sides[k] = true; });
      }
      AREAS.concat(["other"]).forEach(function (k) { state[k] = !!s[k]; });
      state.otherText = String(s.otherText || "").slice(0, 120);
    }
  } catch (e) { /* storage unavailable: start empty */ }

  function sidesOn() { return SIDE_KEYS.filter(function (k) { return state.sides[k]; }); }

  function items() {
    var out = [];
    var on = sidesOn();
    if (on.length === SIDE_KEYS.length) { out.push("House siding (all four sides)"); }
    else if (on.length) { out.push("House siding (" + on.map(function (k) { return SIDE_NAMES[k]; }).join(", ") + ")"); }
    AREAS.forEach(function (k) { if (state[k]) { out.push(AREA_LABELS[k]); } });
    if (state.other) { out.push(state.otherText.trim() ? "Something else: " + state.otherText.trim() : "Something else"); }
    return out;
  }

  function save() {
    try {
      sessionStorage.setItem("npw_picks", JSON.stringify({
        items: items(),
        state: { siding: sidesOn().length > 0, sides: state.sides, patio: state.patio, deck: state.deck, fence: state.fence, other: state.other, otherText: state.otherText }
      }));
    } catch (e) { /* ignore */ }
  }

  function isOn(key) { return SIDE_KEYS.indexOf(key) > -1 ? !!state.sides[key] : !!state[key]; }

  function renderSummary() {
    var list = items();
    if (summary) { summary.textContent = list.length ? "You picked: " + list.join("; ") + "." : "Nothing selected yet."; }
    if (cta) {
      cta.textContent = list.length ? "Request a quote for these" : "Get a free quote";
      cta.setAttribute("href", list.length ? "quote.html#picks" : "quote.html");
    }
  }

  function render() {
    if (world) {
      var faces = world.querySelectorAll("[data-part]");
      for (var i = 0; i < faces.length; i++) {
        var f = faces[i];
        var on = isOn(f.getAttribute("data-part"));
        f.classList.toggle("on", on);
        if (f.hasAttribute("aria-pressed")) { f.setAttribute("aria-pressed", String(on)); }
      }
    }
    sideBoxes.forEach(function (b) { b.checked = !!state.sides[b.getAttribute("data-side-box")]; });
    areaBoxes.forEach(function (b) { b.checked = !!state[b.getAttribute("data-part-box")]; });
    if (allBox) {
      var n = sidesOn().length;
      allBox.checked = n === SIDE_KEYS.length;
      allBox.indeterminate = n > 0 && n < SIDE_KEYS.length;
    }
    if (otherWrap) { otherWrap.hidden = !state.other; }
    if (otherInput && otherInput.value !== state.otherText) { otherInput.value = state.otherText; }
    renderSummary();
  }

  function toggle(key) {
    if (SIDE_KEYS.indexOf(key) > -1) { state.sides[key] = !state.sides[key]; }
    else { state[key] = !state[key]; }
    render();
    save();
  }

  // ---------- 3D model ----------
  var W = 240, D = 170, H = 120, R = 56, O = 14;
  var ry = -30;

  function px(n) { return n + "px"; }

  function group(parent, x, y, z) {
    var g = document.createElement("div");
    g.className = "h3d-g";
    g.style.transform = "translate3d(" + px(x) + "," + px(y) + "," + px(z) + ")";
    parent.appendChild(g);
    return g;
  }

  function face(parent, cls, w, h, tf, part, o) {
    var f = document.createElement("div");
    f.className = "h3d-f " + cls;
    f.style.width = px(w);
    f.style.height = px(h);
    f.style.marginLeft = px(-w / 2);
    f.style.marginTop = px(-h / 2);
    f.style.transform = tf;
    if (part) { f.setAttribute("data-part", part); }
    if (o && o.label) {
      f.setAttribute("role", "button");
      f.setAttribute("tabindex", "0");
      f.setAttribute("aria-pressed", "false");
      f.setAttribute("aria-label", o.label);
    }
    if (o && o.text) {
      var t = document.createElement("span");
      t.className = "h3d-lbl" + (o.mid ? " mid" : "");
      t.textContent = o.text;
      f.appendChild(t);
    }
    parent.appendChild(f);
    return f;
  }

  function deco(f, cls, css) {
    var d = document.createElement("span");
    d.className = "h3d-" + cls;
    d.style.cssText = css || "";
    f.appendChild(d);
  }

  function box(parent, part, cls, w, h, d, x, y, z, o) {
    o = o || {};
    var g = group(parent, x, y, z);
    face(g, cls + " top", w, d, "rotateX(90deg) translateZ(" + px(h / 2) + ")", part, o.top);
    face(g, cls + " side", w, h, "translateZ(" + px(d / 2) + ")", part, o.front);
    face(g, cls + " side", w, h, "rotateY(180deg) translateZ(" + px(d / 2) + ")", part, o.back);
    face(g, cls + " side board", d, h, "rotateY(90deg) translateZ(" + px(w / 2) + ")", part, o.right);
    face(g, cls + " side board", d, h, "rotateY(-90deg) translateZ(" + px(w / 2) + ")", part, o.left);
  }

  function build() {
    face(world, "ground", 660, 660, "translateY(" + px(H / 2) + ") rotateX(90deg)");

    var house = group(world, 0, 0, 0);
    var front = face(house, "wall", W, H, "translateZ(" + px(D / 2) + ")", "front", { label: "Front of the house", text: "FRONT" });
    deco(front, "win", "left:11%");
    deco(front, "win", "right:11%");
    deco(front, "door");

    var back = face(house, "wall", W, H, "rotateY(180deg) translateZ(" + px(D / 2) + ")", "back", { label: "Back of the house", text: "BACK" });
    deco(back, "win", "left:11%");
    deco(back, "win", "right:11%");

    var right = face(house, "wall", D, H, "rotateY(90deg) translateZ(" + px(W / 2) + ")", "right", { label: "Right side of the house", text: "RIGHT SIDE" });
    deco(right, "win", "left:37%");
    var left = face(house, "wall", D, H, "rotateY(-90deg) translateZ(" + px(W / 2) + ")", "left", { label: "Left side of the house", text: "LEFT SIDE" });
    deco(left, "win", "left:37%");

    var gy = -(H / 2 + R / 2);
    face(house, "gable", D, R, "rotateY(90deg) translate3d(0," + px(gy) + "," + px(W / 2) + ")", "right");
    face(house, "gable", D, R, "rotateY(-90deg) translate3d(0," + px(gy) + "," + px(W / 2) + ")", "left");

    var run = D / 2 + O;
    var len = Math.sqrt(run * run + R * R);
    var ang = Math.atan2(run, R) * 180 / Math.PI;
    face(house, "roof", W + 2 * O, len, "translate3d(0," + px(gy) + "," + px(run / 2) + ") rotateX(" + ang + "deg)");
    face(house, "roof", W + 2 * O, len, "translate3d(0," + px(gy) + "," + px(-run / 2) + ") rotateX(" + (-ang) + "deg)");

    box(world, "patio", "h3d-patio", 220, 6, 120, 0, H / 2 - 3, D / 2 + 60, { top: { label: "Patio", text: "PATIO", mid: true } });
    box(world, "deck", "h3d-deck", 100, 22, 120, W / 2 + 50, H / 2 - 11, 10, { top: { label: "Composite deck", text: "DECK", mid: true } });
    box(world, "fence", "h3d-fence", 6, 50, 190, -W / 2 - 70, H / 2 - 25, 0, {
      left: { label: "Fence", text: "FENCE", mid: true },
      right: { text: "FENCE", mid: true }
    });
  }

  function facing() {
    var n = ((ry % 360) + 540) % 360 - 180;
    if (Math.abs(n) <= 45) return "front";
    if (n > 45 && n <= 135) return "left";
    if (n < -45 && n >= -135) return "right";
    return "back";
  }

  function applyRotation(animate) {
    world.classList.toggle("anim", !!animate);
    world.style.transform = "rotateX(-22deg) rotateY(" + ry + "deg)";
    var cur = facing();
    if (facingEl) { facingEl.textContent = "Facing: " + (cur === "front" || cur === "back" ? cur : cur + " side"); }
    viewBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === cur)); });
  }

  var TARGETS = { front: 0, right: -90, back: 180, left: 90 };
  function turnTo(name) {
    var t = TARGETS[name];
    if (t === undefined) return;
    ry += ((t - ry + 540) % 360) - 180;
    applyRotation(true);
  }

  function fit() {
    var s = Math.min(stage.clientWidth / 580, stage.clientHeight / 360, 1.1);
    scaler.style.transform = "scale(" + s.toFixed(3) + ")";
  }

  if (stage && world && scaler) {
    build();
    applyRotation(false);
    fit();
    if (window.ResizeObserver) { new ResizeObserver(fit).observe(stage); }
    else { window.addEventListener("resize", fit); }

    var dragging = false, moved = false, startX = 0, startRy = 0, downPart = null;
    stage.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startRy = ry;
      var hit = e.target && e.target.closest ? e.target.closest("[data-part]") : null;
      downPart = hit ? hit.getAttribute("data-part") : null;
      world.classList.remove("anim");
    });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 6) return;
      if (!moved) { moved = true; stage.classList.add("dragging"); }
      ry = startRy + dx * 0.55;
      applyRotation(false);
    });
    window.addEventListener("pointerup", function () {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove("dragging");
      if (!moved && downPart) { toggle(downPart); }
      downPart = null;
    });
    window.addEventListener("pointercancel", function () {
      dragging = false;
      stage.classList.remove("dragging");
      downPart = null;
    });
    stage.addEventListener("keydown", function (e) {
      var t = e.target;
      if ((e.key === "Enter" || e.key === " " || e.key === "Spacebar") && t && t.getAttribute && t.getAttribute("role") === "button") {
        e.preventDefault();
        toggle(t.getAttribute("data-part"));
      } else if (e.key === "ArrowLeft") { e.preventDefault(); ry -= 15; applyRotation(true); }
      else if (e.key === "ArrowRight") { e.preventDefault(); ry += 15; applyRotation(true); }
    });
    viewBtns.forEach(function (b) {
      b.addEventListener("click", function () { turnTo(b.getAttribute("data-view")); });
    });
  }

  // ---------- Checklist ----------
  sideBoxes.forEach(function (b) {
    b.addEventListener("change", function () {
      state.sides[b.getAttribute("data-side-box")] = b.checked;
      render();
      save();
    });
  });
  areaBoxes.forEach(function (b) {
    b.addEventListener("change", function () {
      state[b.getAttribute("data-part-box")] = b.checked;
      render();
      save();
    });
  });
  if (allBox) {
    allBox.addEventListener("change", function () {
      var all = allBox.checked;
      SIDE_KEYS.forEach(function (k) { state.sides[k] = all; });
      render();
      save();
    });
  }
  if (otherInput) {
    otherInput.addEventListener("input", function () {
      state.otherText = otherInput.value.slice(0, 120);
      save();
      renderSummary();
    });
  }

  render();
})();
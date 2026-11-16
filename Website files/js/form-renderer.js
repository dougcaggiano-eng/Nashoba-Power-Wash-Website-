// Draws a Wix Forms form on a static page using the store in /js/wix/form-store.js.
// The owner's fields, rules and thank-you text come from the Wix dashboard; nothing here names a field.
import { createFormStore, FORM_ERROR } from "/js/wix/form-store.js";

function el(tag, cls, txt) {
  var n = document.createElement(tag);
  if (cls) { n.className = cls; }
  if (txt != null) { n.textContent = txt; }
  return n;
}

function inputType(control) {
  switch (control) {
    case "email": return "email";
    case "phone": return "tel";
    case "url": return "url";
    case "password": return "password";
    case "number": return "number";
    case "rating": return "number";
    case "date": return "date";
    case "time": return "time";
    case "datetime": return "datetime-local";
    default: return "text";
  }
}

function safeId(t) {
  return "ff-" + String(t).replace(/[^a-zA-Z0-9_-]/g, "_");
}

function attr(node, name) {
  return node && node.getAttribute ? node.getAttribute(name) : null;
}

export function renderForm(root, opts) {
  var p = (opts && opts.classPrefix) || "form";
  var text = (opts && opts.text) || {};
  var store = createFormStore({ formId: opts.formId });
  var formEl = null;
  var builtKey = "";
  var wrappers = [];
  var formErr = null;
  var primary = null;
  var backBtn = null;
  var curMode = "";
  var succeeded = false;

  function cn(n) { return p + "-" + n; }

  function stepOf(s) {
    var steps = (s.form && s.form.steps) || [];
    return steps[s.step];
  }

  function stepFields(s) {
    var step = stepOf(s);
    return s.form.fields.filter(function (f) {
      return !f.hidden && (!step || !f.stepId || f.stepId === step.id);
    });
  }

  function keyOf(s) {
    return s.step + "|" + stepFields(s).map(function (f) {
      var parts = (f.addressParts || []).map(function (a) { return a.sub; }).join(",");
      var ch = (f.choices || []).map(function (c) { return c.value; }).join(",");
      return f.target + ":" + f.control + ":" + parts + ":" + ch;
    }).join(";");
  }

  // ---- control builders: each returns { nodes, controls, sync } ----

  function tag(ctrl, f, id, kind) {
    ctrl.id = id;
    ctrl.name = f.target;
    ctrl.setAttribute("data-target", f.target);
    ctrl.setAttribute("data-kind", kind);
    if (f.readOnly) { ctrl.disabled = true; }
    var ids = [];
    if (f.description) { ids.push(id + "-help"); }
    ids.push(id + "-error");
    ctrl.setAttribute("aria-describedby", ids.join(" "));
  }

  function makeText(f, id) {
    var ctrl;
    if (f.control === "textarea") {
      ctrl = el("textarea", cn("control"));
      ctrl.rows = 4;
      if (f.validation && f.validation.maxLength) { ctrl.maxLength = f.validation.maxLength; }
    } else {
      ctrl = el("input", cn("control"));
      ctrl.type = inputType(f.control);
      if (f.control === "phone") { ctrl.autocomplete = "tel"; }
      if (f.control === "email") { ctrl.autocomplete = "email"; }
      if (f.validation && f.validation.maxLength) { ctrl.maxLength = f.validation.maxLength; }
      if (f.control === "date" && f.validation && f.validation.minDate) { ctrl.min = String(f.validation.minDate).slice(0, 10); }
      if (f.control === "date" && f.validation && f.validation.maxDate) { ctrl.max = String(f.validation.maxDate).slice(0, 10); }
      if (f.control === "number" || f.control === "rating") {
        if (f.validation && f.validation.minimum != null) { ctrl.min = String(f.validation.minimum); }
        if (f.validation && f.validation.maximum != null) { ctrl.max = String(f.validation.maximum); }
      }
    }
    if (f.placeholder) { ctrl.placeholder = f.placeholder; }
    tag(ctrl, f, id, "text");
    return {
      nodes: [ctrl],
      controls: [ctrl],
      sync: function (s) {
        var v = s.values[f.target];
        var str = v == null ? "" : String(v);
        if (ctrl.value !== str && document.activeElement !== ctrl) { ctrl.value = str; }
      }
    };
  }

  function makeSelect(f, id) {
    var sel = el("select", cn("control"));
    tag(sel, f, id, "text");
    var blank = el("option", "", "Select one");
    blank.value = "";
    sel.append(blank);
    f.choices.forEach(function (c) {
      var o = el("option", "", c.label);
      o.value = c.value;
      sel.append(o);
    });
    return {
      nodes: [sel],
      controls: [sel],
      sync: function (s) {
        var v = s.values[f.target];
        var str = v == null ? "" : String(v);
        if (sel.value !== str) { sel.value = str; }
      }
    };
  }

  function makeChoices(f, id, kind) {
    var wrap = el("div", cn("choices"));
    wrap.setAttribute("role", kind === "radio" ? "radiogroup" : "group");
    wrap.setAttribute("aria-labelledby", id + "-label");
    var inputs = [];
    f.choices.forEach(function (c, i) {
      var lab = el("label", cn("choice"));
      var inp = el("input");
      inp.type = kind === "radio" ? "radio" : "checkbox";
      inp.id = id + "-" + i;
      inp.name = f.target;
      inp.value = c.value;
      inp.setAttribute("data-target", f.target);
      inp.setAttribute("data-kind", kind);
      if (f.readOnly) { inp.disabled = true; }
      lab.append(inp, el("span", "", c.label));
      wrap.append(lab);
      inputs.push({ inp: inp, lab: lab });
    });
    return {
      nodes: [wrap],
      controls: [],
      sync: function (s) {
        var v = s.values[f.target];
        inputs.forEach(function (x) {
          var on = kind === "radio" ? v === x.inp.value : (Array.isArray(v) && v.indexOf(x.inp.value) > -1);
          x.inp.checked = on;
          x.lab.classList.toggle(cn("choice") + "--selected", on);
        });
      }
    };
  }

  function makeCheckbox(f, id) {
    var lab = el("label", cn("choice"));
    var inp = el("input");
    inp.type = "checkbox";
    tag(inp, f, id, "checkbox");
    var span = el("span", "", f.label);
    lab.append(inp, span);
    return {
      nodes: [lab],
      controls: [inp],
      sync: function (s) {
        var on = s.values[f.target] === true;
        inp.checked = on;
        lab.classList.toggle(cn("choice") + "--selected", on);
      }
    };
  }

  function makeAddress(f, id) {
    var wrap = el("div");
    var syncs = [];
    var ctrls = [];
    (f.addressParts || []).forEach(function (part) {
      var row = el("div", cn("address-part"));
      var pid = id + "-" + part.sub;
      var lab = el("label", cn("label"), part.label + (part.required ? " *" : ""));
      lab.setAttribute("for", pid);
      row.append(lab);
      var ctrl;
      if (part.choices && part.choices.length) {
        ctrl = el("select", cn("control"));
        var blank = el("option", "", "Select one");
        blank.value = "";
        ctrl.append(blank);
        part.choices.forEach(function (c) {
          var o = el("option", "", c.label);
          o.value = c.value;
          ctrl.append(o);
        });
      } else {
        ctrl = el("input", cn("control"));
        ctrl.type = "text";
      }
      ctrl.id = pid;
      ctrl.name = f.target + "/" + part.sub;
      ctrl.setAttribute("data-target", f.target);
      ctrl.setAttribute("data-sub", part.sub);
      ctrl.setAttribute("data-kind", "address");
      if (f.readOnly) { ctrl.disabled = true; }
      row.append(ctrl);
      wrap.append(row);
      ctrls.push(ctrl);
      syncs.push(function (s) {
        var v = s.values[f.target];
        var cur = v && typeof v === "object" ? v[part.sub] : "";
        cur = cur == null ? "" : String(cur);
        if (ctrl.value !== cur && document.activeElement !== ctrl) { ctrl.value = cur; }
      });
    });
    return {
      nodes: [wrap],
      controls: ctrls,
      sync: function (s) { syncs.forEach(function (fn) { fn(s); }); }
    };
  }

  function buildField(f, s) {
    var id = safeId(f.target);
    var node = el("div", cn("field"));
    var reqMode = s.form.requiredIndicator || "ASTERISK";
    var isGroup = f.control === "radio" || f.control === "checkboxGroup" || f.control === "tags" || f.control === "address";
    var isCheckbox = f.control === "checkbox";

    if (!isCheckbox) {
      var labelNode = isGroup ? el("span", cn("label")) : el("label", cn("label"));
      if (isGroup) { labelNode.id = id + "-label"; } else { labelNode.setAttribute("for", id); }
      labelNode.append(document.createTextNode(f.label));
      if (f.required && !f.readOnly && reqMode !== "NONE") {
        var mark = el("span", cn("required"), reqMode === "TEXT" ? " (required)" : " *");
        if (reqMode !== "TEXT") { mark.setAttribute("aria-hidden", "true"); }
        labelNode.append(mark);
      }
      if (f.showLabel === false) { labelNode.className += " sr-only"; }
      node.append(labelNode);
    }

    var built;
    switch (f.control) {
      case "select": built = makeSelect(f, id); break;
      case "radio": built = makeChoices(f, id, "radio"); break;
      case "checkboxGroup":
      case "tags": built = makeChoices(f, id, "group"); break;
      case "checkbox": built = makeCheckbox(f, id); break;
      case "address": built = makeAddress(f, id); break;
      case "file":
      case "signature":
      case "payment":
      case "appointment":
      case "unknown":
        built = { nodes: [el("p", cn("help"), "This question can't be answered on this page.")], controls: [], sync: function () {} };
        break;
      default: built = makeText(f, id);
    }
    built.nodes.forEach(function (n) { node.append(n); });

    if (f.description) {
      var help = el("p", cn("help"), f.description);
      help.id = id + "-help";
      node.append(help);
    }
    var err = el("p", cn("error"));
    err.id = id + "-error";
    err.setAttribute("role", "alert");
    err.hidden = true;
    node.append(err);

    return { f: f, node: node, err: err, controls: built.controls, sync: built.sync };
  }

  // ---- form ----

  function setAddress(target, sub, value) {
    var cur = store.getState().values[target];
    var next = {};
    if (cur && typeof cur === "object") {
      Object.keys(cur).forEach(function (k) { next[k] = cur[k]; });
    }
    next[sub] = value;
    store.setValue(target, next);
  }

  function onInput(e) {
    var t = e.target;
    var kind = attr(t, "data-kind");
    var target = attr(t, "data-target");
    if (!target) { return; }
    if (kind === "text" && t.tagName !== "SELECT") { store.setValue(target, t.value); }
    else if (kind === "address" && t.tagName !== "SELECT") { setAddress(target, attr(t, "data-sub"), t.value); }
  }

  function onChange(e) {
    var t = e.target;
    var kind = attr(t, "data-kind");
    var target = attr(t, "data-target");
    if (!target) { return; }
    if (kind === "text" || kind === "radio") { store.setValue(target, t.value); }
    else if (kind === "checkbox") { store.setValue(target, !!t.checked); }
    else if (kind === "group") {
      var vals = [];
      formEl.querySelectorAll('input[data-kind="group"]').forEach(function (b) {
        if (attr(b, "data-target") === target && b.checked) { vals.push(b.value); }
      });
      store.setValue(target, vals);
      store.validate(target);
    } else if (kind === "address") { setAddress(target, attr(t, "data-sub"), t.value); }
  }

  function onBlur(e) {
    var target = attr(e.target, "data-target");
    if (target) { store.validate(target); }
  }

  function onSubmit(e) {
    e.preventDefault();
    var s = store.getState();
    var steps = (s.form && s.form.steps) || [];
    var r;
    if (s.form && s.step < steps.length - 1) { r = store.next(e); }
    else { r = store.submit(e); }
    if (r && typeof r.catch === "function") { r.catch(function () {}); }
  }

  function buildForm(s) {
    wrappers = [];
    formEl = el("form");
    formEl.noValidate = true;
    var fs = el("fieldset", cn("fields"));
    stepFields(s).forEach(function (f) {
      var w = buildField(f, s);
      wrappers.push(w);
      fs.append(w.node);
    });
    formEl.append(fs);
    formErr = el("p", cn("form-error"));
    formErr.setAttribute("role", "alert");
    formErr.hidden = true;
    formEl.append(formErr);
    var actions = el("div", cn("actions"));
    backBtn = el("button", cn("back"), s.form.previousText || "Back");
    backBtn.type = "button";
    backBtn.hidden = true;
    primary = el("button", cn("submit"));
    primary.type = "submit";
    actions.append(backBtn, primary);
    formEl.append(actions);
    formEl.addEventListener("input", onInput);
    formEl.addEventListener("change", onChange);
    formEl.addEventListener("focusout", onBlur);
    formEl.addEventListener("submit", onSubmit);
    backBtn.addEventListener("click", function () { store.previous(); });
    root.textContent = "";
    root.append(formEl);
  }

  function sync(s) {
    var steps = (s.form && s.form.steps) || [];
    var last = s.step >= steps.length - 1;
    wrappers.forEach(function (w) {
      var msgs = [];
      var e1 = s.errors[w.f.target];
      if (e1) { msgs.push(e1); }
      (w.f.addressParts || []).forEach(function (a) {
        var m = s.errors[w.f.target + "/" + a.sub];
        if (m) { msgs.push(m); }
      });
      var msg = msgs.join(" ");
      w.err.textContent = msg;
      w.err.hidden = !msg;
      w.controls.forEach(function (c) {
        if (msg) { c.setAttribute("aria-invalid", "true"); } else { c.removeAttribute("aria-invalid"); }
      });
      w.sync(s);
    });
    var fe = s.errors[FORM_ERROR] || "";
    formErr.textContent = fe;
    formErr.hidden = !fe;
    backBtn.hidden = s.step === 0;
    primary.className = last ? cn("submit") : cn("next");
    if (s.loading && last) { primary.textContent = "Sending..."; }
    else if (last) { primary.textContent = text.submit || s.form.submitText || "Submit"; }
    else { primary.textContent = s.form.nextText || "Next"; }
    primary.disabled = !!s.loading;
    if (s.loading) { primary.setAttribute("aria-busy", "true"); } else { primary.removeAttribute("aria-busy"); }
  }

  function showOutcome(o) {
    formEl = null;
    builtKey = "";
    curMode = "done";
    if (o.url && !o.newTab) {
      window.location.href = o.url;
      return;
    }
    if (o.url && o.newTab) { window.open(o.url, "_blank", "noopener"); }
    root.textContent = "";
    var box = el("div", cn("success"));
    var lines = String(o.message || "").split("\n").filter(function (l) { return l.trim(); });
    if (!lines.length) { lines = [text.thanks || "Thanks! We got your request and will be in touch."]; }
    lines.forEach(function (l) { box.append(el("p", cn("success-text"), l)); });
    root.append(box);
    if (!succeeded) {
      succeeded = true;
      if (opts.onSuccess) {
        try { opts.onSuccess(o); } catch (err) { /* ignore */ }
      }
    }
    if (o.durationSeconds) {
      setTimeout(function () { succeeded = false; store.reset(); }, o.durationSeconds * 1000);
    }
  }

  function render(s) {
    if (s.outcome) { showOutcome(s.outcome); return; }
    if (!s.form) {
      var failed = !!s.errors[FORM_ERROR];
      var mode = failed ? "error" : "loading";
      if (curMode !== mode) {
        curMode = mode;
        formEl = null;
        builtKey = "";
        root.textContent = "";
        root.append(failed
          ? el("p", cn("form-error"), "We couldn't load the form right now. Please refresh the page and try again.")
          : el("p", cn("loading"), "Loading the form..."));
      }
      return;
    }
    if (s.closed) {
      if (curMode !== "closed") {
        curMode = "closed";
        formEl = null;
        builtKey = "";
        root.textContent = "";
        root.append(el("p", cn("closed"), s.form.disabledMessage || "This form isn't taking requests right now. Please check back soon."));
      }
      return;
    }
    var key = keyOf(s);
    if (!formEl || key !== builtKey) {
      builtKey = key;
      curMode = "form";
      buildForm(s);
    }
    sync(s);
  }

  root.textContent = "";
  root.append(el("p", cn("loading"), "Loading the form..."));
  curMode = "loading";
  store.subscribe(render);
  render(store.getState());
  store.start();
  return store;
}

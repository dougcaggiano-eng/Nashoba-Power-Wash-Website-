(function () {
  var box = document.getElementById("quote-picks");
  if (!box) return;
  var items = [];
  try {
    var saved = JSON.parse(sessionStorage.getItem("npw_picks") || "null");
    if (saved && Array.isArray(saved.items)) {
      items = saved.items.slice(0, 6).map(function (s) { return String(s).slice(0, 160); });
    }
  } catch (e) { /* storage unavailable */ }
  if (!items.length) return;

  var h = document.createElement("h3");
  h.textContent = "What you picked on the house";
  var p = document.createElement("p");
  p.textContent = "We checked these in the form below. You can change them there.";
  var ul = document.createElement("ul");
  items.forEach(function (it) {
    var li = document.createElement("li");
    li.textContent = it;
    ul.append(li);
  });
  var edit = document.createElement("a");
  edit.className = "picks-edit";
  edit.href = "index.html#house";
  edit.textContent = "Change my picks";

  box.append(h, p, ul, edit);
  box.hidden = false;
})();

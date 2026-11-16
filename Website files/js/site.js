(function () {
  var cfg = window.NPW || {};

  document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  // Contact details (only the ones you filled in)
  document.querySelectorAll("[data-contact]").forEach(function (box) {
    if (cfg.phone) {
      var p = document.createElement("p");
      var a = document.createElement("a");
      a.href = "tel:" + String(cfg.phone).replace(/[^+\d]/g, "");
      a.textContent = cfg.phone;
      p.append("Call: ", a);
      box.append(p);
    }
    if (cfg.email) {
      var e = document.createElement("p");
      var m = document.createElement("a");
      m.href = "mailto:" + cfg.email;
      m.textContent = cfg.email;
      e.append("Email: ", m);
      box.append(e);
    }
  });

  // Service area and hours on the FAQ page
  if (cfg.towns) {
    document.querySelectorAll("[data-towns]").forEach(function (n) {
      n.textContent = "We serve homeowners in " + cfg.towns + ", and other towns within about 20 miles of Westford.";
    });
  }
  if (cfg.hours) {
    document.querySelectorAll("[data-hours]").forEach(function (n) { n.textContent = cfg.hours; });
    document.querySelectorAll("[data-hours-wrap]").forEach(function (n) { n.hidden = false; });
  }

  // Owner photo on the About page
  if (cfg.ownerPhoto) {
    document.querySelectorAll(".about-logo").forEach(function (img) {
      img.src = cfg.ownerPhoto;
      img.alt = "Doug, owner of Nashoba Power Wash";
    });
  }

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
})();

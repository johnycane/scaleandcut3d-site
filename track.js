// Counts the steps from landing to checkout in GoatCounter (no cookies).
// Events from the Reddit ad get a " (reddit)" suffix so the two funnels can
// be compared side by side in the GoatCounter dashboard.
(function () {
  var params = new URLSearchParams(location.search);
  var reddit = params.get("utm_source") === "reddit" || params.get("utm_campaign") === "hand_test";
  try {
    var saved = JSON.parse(localStorage.getItem("sac-offer") || "null");
    if (saved && saved.until > Date.now()) reddit = true;
  } catch (e) {}
  var suffix = reddit ? " (reddit)" : "";
  var phone = window.matchMedia && window.matchMedia("(max-width: 700px)").matches;
  var sent = {};

  function count(name) {
    var path = name + suffix;
    if (sent[path]) return;
    sent[path] = true;
    var tries = 0;
    (function send() {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: path, title: path, event: true });
      } else if (tries++ < 20) {
        setTimeout(send, 250);
      }
    })();
  }

  count(phone ? "visit: phone" : "visit: computer");

  // How far down the page visitors get.
  if ("IntersectionObserver" in window) {
    [["#made-with", "scrolled: builds"], ["#how-it-works", "scrolled: how it works"], ["#buy", "scrolled: buy box"]]
      .forEach(function (pair) {
        var el = document.querySelector(pair[0]);
        if (!el) return;
        var seen = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) {
            count(pair[1]);
            seen.disconnect();
          }
        }, { threshold: 0.3 });
        seen.observe(el);
      });
  }

  // Clicks that move someone toward buying.
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (href.indexOf("lemonsqueezy.com/checkout/buy/") !== -1) {
      count("click: checkout");
    } else if (href === "#buy" || href === "/#buy") {
      count(link.classList.contains("nav-buy") ? "click: buy (top bar)" : "click: buy (hero)");
    } else if (href === "#how-it-works") {
      count("click: watch it work");
    }
  });
})();

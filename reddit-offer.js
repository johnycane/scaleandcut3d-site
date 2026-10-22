// Visitors from the Reddit ad get REDDIT10 pre-filled at
// checkout, so ad sales show up under that code in Lemon Squeezy.
(function () {
  var CODE = "REDDIT10";
  var KEY = "sac-offer";
  var DAYS = 7;
  var active = false;
  // The live ad's link carries utm_campaign=hand_test but no utm_source, so
  // accept either marker.
  var params = new URLSearchParams(location.search);
  var fromReddit = params.get("utm_source") === "reddit" || params.get("utm_campaign") === "hand_test";
  try {
    if (fromReddit) {
      localStorage.setItem(KEY, JSON.stringify({ code: CODE, until: Date.now() + DAYS * 864e5 }));
    }
    var saved = JSON.parse(localStorage.getItem(KEY) || "null");
    active = !!(saved && saved.code === CODE && saved.until > Date.now());
  } catch (e) {
    active = fromReddit;
  }
  if (!active) return;

  document.querySelectorAll('a[href*="lemonsqueezy.com/checkout/buy/"]').forEach(function (link) {
    var url = new URL(link.href);
    url.searchParams.set("checkout[discount_code]", CODE);
    link.href = url.toString();
  });

  var banner = document.createElement("div");
  banner.setAttribute("role", "status");
  banner.style.cssText = "position:sticky;top:0;z-index:100;padding:10px 16px;text-align:center;" +
    "background:#f4a73a;color:#291604;font:600 14px/1.4 system-ui,-apple-system,sans-serif;";
  banner.innerHTML = 'Reddit special: <strong>10% off</strong>, applied automatically at checkout ' +
    '(<a href="#buy" style="color:inherit;text-decoration:underline">buy now</a>)';
  document.body.insertBefore(banner, document.body.firstChild);
})();

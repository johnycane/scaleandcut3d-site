// Visitors from the Reddit ad get REDDIT50 (50% off) pre-filled at checkout,
// so ad sales show up under that code in Lemon Squeezy, and the page shows
// them the discounted price (elements carry it in data-reddit).
(function () {
  var CODE = "REDDIT50";
  var KEY = "sac-offer";
  var DAYS = 7;
  var active = false;
  // The live ad's link carries utm_campaign=hand_test but no utm_source, so
  // accept either marker.
  var params = new URLSearchParams(location.search);
  var fromReddit = params.get("utm_source") === "reddit" || params.get("utm_campaign") === "hand_test";
  try {
    // ?offer=off forgets the offer in this browser (for checking the normal site).
    if (params.get("offer") === "off") {
      localStorage.removeItem(KEY);
      return;
    }
    if (fromReddit) {
      localStorage.setItem(KEY, JSON.stringify({ code: CODE, until: Date.now() + DAYS * 864e5 }));
    }
    var saved = JSON.parse(localStorage.getItem(KEY) || "null");
    // Any saved offer counts, including ones saved under the old REDDIT10 code.
    active = !!(saved && saved.until > Date.now());
  } catch (e) {
    active = fromReddit;
  }
  if (!active) return;

  document.querySelectorAll('a[href*="lemonsqueezy.com/checkout/buy/"]').forEach(function (link) {
    var url = new URL(link.href);
    url.searchParams.set("checkout[discount_code]", CODE);
    link.href = url.toString();
  });

  document.querySelectorAll("[data-reddit]").forEach(function (el) {
    el.innerHTML = el.getAttribute("data-reddit");
  });

  var banner = document.createElement("div");
  banner.setAttribute("role", "status");
  banner.style.cssText = "position:sticky;top:0;z-index:100;padding:10px 16px;text-align:center;" +
    "background:#f4a73a;color:#291604;font:600 14px/1.4 system-ui,-apple-system,sans-serif;";
  var checkout = "https://caneprints.lemonsqueezy.com/checkout/buy/68783033-7123-44ac-8ecc-c4909757244d?checkout%5Bdiscount_code%5D=" + CODE;
  banner.innerHTML = 'Reddit visitors get <strong>50% off</strong>: $10 instead of $20, no code needed ' +
    '(<a href="' + checkout + '" style="color:inherit;text-decoration:underline">buy now</a>)';
  document.body.insertBefore(banner, document.body.firstChild);
})();

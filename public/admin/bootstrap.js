(function () {
  if (typeof window === "undefined") return;

  normalizeAdminPath();
  handleIdentityRecoveryRedirect();
  waitForIdentity(wireIdentity);

  function normalizeAdminPath() {
    var path = window.location.pathname;
    if (path === "/admin/") return;

    var search = window.location.search || "";
    var hash = window.location.hash || "";
    var target = "/admin/" + (search || "") + (hash || "");

    if (path === "/admin") {
      window.history.replaceState({}, "", target);
    } else {
      window.history.replaceState({}, "", target);
    }
  }

  function handleIdentityRecoveryRedirect() {
    var tokenQuery = extractTokenQuery();
    var alreadyRecovering =
      window.location.pathname === "/admin/" &&
      /^#\/recover-password/.test(window.location.hash || "");

    if (tokenQuery && !alreadyRecovering) {
      window.location.replace("/admin/#/recover-password" + tokenQuery);
    }
  }

  function extractTokenQuery() {
    var search = window.location.search || "";
    var hash = window.location.hash || "";
    var markers = ["recovery_token=", "invite_token=", "confirmation_token="];

    var hasToken = markers.some(function (marker) {
      return search.indexOf(marker) !== -1 || hash.indexOf(marker) !== -1;
    });

    if (!hasToken) return "";

    if (markers.some(function (marker) { return search.indexOf(marker) !== -1; })) {
      return search;
    }

    if (hash) {
      var cleaned = hash.replace(/^#\/?/, "");
      if (cleaned.indexOf("?") !== -1) {
        cleaned = cleaned.slice(cleaned.indexOf("?"));
      } else if (cleaned && cleaned.indexOf("=") !== -1) {
        cleaned = "?" + cleaned;
      } else {
        cleaned = "";
      }
      return cleaned;
    }

    return "";
  }

  function waitForIdentity(cb) {
    if (window.netlifyIdentity) {
      cb(window.netlifyIdentity);
      return;
    }

    document.addEventListener("DOMContentLoaded", function onReady() {
      document.removeEventListener("DOMContentLoaded", onReady);
      if (window.netlifyIdentity) {
        cb(window.netlifyIdentity);
      }
    });
  }

  function wireIdentity(identity) {
    if (!identity) return;

    var loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.addEventListener("click", function (event) {
        event.preventDefault();
        openLogin(identity);
      });
    }

    identity.on("init", function (user) {
      if (user) {
        showCms(identity);
      } else {
        setTimeout(function () { openLogin(identity); }, 150);
      }
    });

    identity.on("login", function () {
      showCms(identity);
      window.location.replace("/admin/#/");
    });

    identity.on("logout", function () {
      document.body.classList.remove("cms-ready");
      window.location.replace("/admin/");
    });

    if (typeof identity.init === "function") {
      identity.init();
    }

    if (identity.currentUser()) {
      showCms(identity);
    }
  }

  function openLogin(identity) {
    try {
      identity.open("login");
    } catch (e) {
      /* no-op */
    }
  }

  function showCms(identity) {
    document.body.classList.add("cms-ready");
    try {
      if (identity && typeof identity.close === "function") {
        identity.close();
      }
    } catch (e) {
      /* no-op */
    }
  }
})();

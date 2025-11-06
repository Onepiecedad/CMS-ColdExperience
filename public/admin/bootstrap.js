(function () {
  if (typeof window === "undefined") return;

  normalizeAdminPath();
  handleIdentityRecoveryRedirect();
  initIdentity();

  function normalizeAdminPath() {
    var path = window.location.pathname;
    if (path === "/admin/") return;

    var search = window.location.search || "";
    var hash = window.location.hash || "";

    if (path === "/admin") {
      window.history.replaceState({}, "", "/admin/" + search + hash);
    } else {
      window.history.replaceState({}, "", "/admin/" + search + hash);
    }
  }

  function handleIdentityRecoveryRedirect() {
    var tokenQuery = extractTokenQuery();
    var alreadyRecovering =
      window.location.pathname === "/admin/" &&
      /^#\/recover-password/.test(window.location.hash || "");

    if (tokenQuery && !alreadyRecovering) {
      var dest = "/admin/#/recover-password" + tokenQuery;
      window.location.replace(dest);
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

  function initIdentity() {
    var loginBtn = document.getElementById("loginBtn");
    var wired = false;

    function attemptWire() {
      var identity = window.netlifyIdentity;
      if (!identity) {
        setTimeout(attemptWire, 50);
        return;
      }

      if (wired) return;
      wired = true;

      if (loginBtn) {
        loginBtn.addEventListener("click", function (e) {
          e.preventDefault();
          openLogin(identity);
        });
      }

      identity.on("init", function (user) {
        if (user) {
          markCmsReady();
          ensureCmsRoute();
        } else {
          openLogin(identity);
        }
      });

      identity.on("login", function () {
        markCmsReady();
        identity.close();
        ensureCmsRoute(true);
      });

      identity.on("logout", function () {
        document.body.classList.remove("cms-ready");
        identity.close();
        window.location.replace("/admin/");
      });

      if (identity.currentUser()) {
        markCmsReady();
        ensureCmsRoute();
      }

      if (typeof identity.init === "function") {
        identity.init();
      }
    }

    attemptWire();

    function openLogin(identity) {
      try {
        identity.open("login");
      } catch (e) {
        /* no-op */
      }
    }

    function ensureCmsRoute(force) {
      var hash = window.location.hash || "";
      var onRecover = hash.indexOf("#/recover-password") === 0;

      if (!force && onRecover) return;

      if (hash !== "#/" || force) {
        window.location.replace("/admin/#/");
      }
    }

    function markCmsReady() {
      document.body.classList.add("cms-ready");
      try {
        if (window.netlifyIdentity && typeof window.netlifyIdentity.close === "function") {
          window.netlifyIdentity.close();
        }
      } catch (e) {
        /* no-op */
      }
    }
  }
})();

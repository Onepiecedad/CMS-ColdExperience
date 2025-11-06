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

    function ensureOpen() {
      try {
        window.netlifyIdentity && window.netlifyIdentity.open("login");
      } catch (e) {
        /* noop */
      }
    }

    function wireIdentity(identity) {
      if (!identity) return;

      identity.on("init", function (user) {
        if (!user) ensureOpen();
      });

      ["login", "logout"].forEach(function (evt) {
        identity.on(evt, function () {
          window.location.href = "/admin/";
        });
      });

      if (loginBtn) {
        loginBtn.addEventListener("click", function (e) {
          e.preventDefault();
          ensureOpen();
        });
      }

      setTimeout(function () {
        if (!identity.currentUser()) ensureOpen();
      }, 200);
    }

    if (window.netlifyIdentity) {
      wireIdentity(window.netlifyIdentity);
    } else {
      window.addEventListener("load", function () {
        if (window.netlifyIdentity) {
          wireIdentity(window.netlifyIdentity);
        } else if (loginBtn) {
          loginBtn.textContent = "Netlify Identity failed to load";
          loginBtn.style.opacity = "0.6";
        }
      });
    }
  }
})();

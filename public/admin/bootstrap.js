(function () {
  if (typeof window === "undefined") return;

  handleIdentityRecoveryRedirect();
  initIdentity();

  function handleIdentityRecoveryRedirect() {
    var qs = window.location.search || "";
    if (/recovery_token=/.test(qs) || /invite_token=/.test(qs) || /confirmation_token=/.test(qs)) {
      var dest = "/admin/#/recover-password" + qs;
      if (window.location.pathname !== "/admin/" || !/\/admin\/#\/recover-password/.test(window.location.href)) {
        window.location.replace(dest);
      }
    }
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

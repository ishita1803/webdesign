/* ═══════════════════════════════════════════════════════════════
   Ishita Prajapati — Portfolio  |  script.js
   Pure vanilla JavaScript — no libraries required.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─── References ─── */
  const header        = document.getElementById("site-header");
  const hamburger     = document.getElementById("hamburger");
  const mainNav       = document.getElementById("main-nav");
  const navLinks      = document.querySelectorAll(".nav-link");
  const themeToggle   = document.getElementById("theme-toggle");
  const contactForm   = document.getElementById("contact-form");
  const footerYear    = document.getElementById("footer-year");
  const sections      = document.querySelectorAll(".section");

  /* ═══════════════════ 1. MOBILE NAVIGATION TOGGLE ═══════════════════ */

  function closeMenu() {
    mainNav.classList.remove("nav-open");
    hamburger.classList.remove("is-active");
    hamburger.setAttribute("aria-expanded", "false");
  }

  hamburger.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("nav-open");
    hamburger.classList.toggle("is-active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  // Close mobile menu after clicking a link
  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  /* ═══════════════════ 2. DARK / LIGHT THEME TOGGLE ═══════════════════ */

  function applyTheme(dark) {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (_) { /* storage unavailable */ }
  }

  // Initialise: respect saved preference or OS preference
  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (_) { /* ignore */ }
    if (saved === "dark") {
      applyTheme(true);
    } else if (saved === "light") {
      applyTheme(false);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme(true);
    }
  })();

  themeToggle.addEventListener("click", function () {
    var isDark = document.documentElement.classList.contains("dark");
    applyTheme(!isDark);
  });

  /* ═══════════════════ 3. SMOOTH SCROLL & ACTIVE LINK ═══════════════════ */

  // Smooth-scroll is set via CSS (scroll-behavior: smooth) but we also
  // handle the offset for the sticky header here.

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = header.offsetHeight + 8;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  // Highlight the nav link matching the section in view
  function highlightActiveLink() {
    var scrollPos = window.pageYOffset + header.offsetHeight + 40;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        var id = section.getAttribute("id");
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  }

  window.addEventListener("scroll", highlightActiveLink, { passive: true });
  highlightActiveLink(); // run once on load

  /* ═══════════════════ 4 & 5. CONTACT FORM VALIDATION ═══════════════════ */

  var nameInput    = document.getElementById("contact-name");
  var emailInput   = document.getElementById("contact-email");
  var messageInput = document.getElementById("contact-message");
  var nameError    = document.getElementById("name-error");
  var emailError   = document.getElementById("email-error");
  var messageError = document.getElementById("message-error");
  var formSuccess  = document.getElementById("form-success");

  function showError(element, message) {
    element.textContent = message;
    element.previousElementSibling.classList.add("input-error");
  }

  function clearError(element) {
    element.textContent = "";
    element.previousElementSibling.classList.remove("input-error");
  }

  function validateEmail(email) {
    // Simple pattern — sufficient for client-side UX feedback
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;

    // Name
    if (nameInput.value.trim() === "") {
      showError(nameError, "Please enter your name.");
      valid = false;
    } else {
      clearError(nameError);
    }

    // Email
    if (emailInput.value.trim() === "") {
      showError(emailError, "Please enter your email address.");
      valid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      showError(emailError, "Please enter a valid email address.");
      valid = false;
    } else {
      clearError(emailError);
    }

    // Message
    if (messageInput.value.trim() === "") {
      showError(messageError, "Please enter a message.");
      valid = false;
    } else {
      clearError(messageError);
    }

    if (valid) {
      formSuccess.hidden = false;
      contactForm.reset();
      // Hide the success message after a few seconds
      setTimeout(function () {
        formSuccess.hidden = true;
      }, 6000);
    }
  });

  // Live clearing of errors on input
  [nameInput, emailInput, messageInput].forEach(function (input) {
    input.addEventListener("input", function () {
      var errorSpan = document.getElementById(input.id.replace("contact-", "") + "-error");
      if (errorSpan) clearError(errorSpan);
    });
  });

  /* ═══════════════════ 6. DYNAMIC FOOTER YEAR ═══════════════════ */

  footerYear.textContent = new Date().getFullYear();

  // Copy email button functionality
  const copyBtn = document.querySelector('.copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const email = 'ishitaprajapati1803@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopyToast).catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }
    });
  }

  function showCopyToast() {
    const toast = document.createElement('span');
    toast.textContent = 'Copied!';
    toast.className = 'copy-toast';
    // simple styling via inline for quick feedback
    toast.style.position = 'absolute';
    toast.style.top = '-1.5rem';
    toast.style.right = '0';
    toast.style.background = 'var(--accent)';
    toast.style.color = '#fff';
    toast.style.padding = '2px 6px';
    toast.style.borderRadius = '4px';
    toast.style.fontSize = '0.75rem';
    copyBtn.parentNode.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopyToast();
    } catch (err) {
      // ignore
    }
    document.body.removeChild(textarea);
  }


  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ─── Shrink header on scroll ─── */
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.pageYOffset > 60);
  }, { passive: true });

})();

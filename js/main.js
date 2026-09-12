/*
  Louis Tucker Digital - main.js
  Two jobs: the mobile nav toggle (every page) and the contact form
  submit handler (contact page only). Kept in one file since the site
  is small; split it up if it grows past these two concerns.
*/

(function () {
  "use strict";

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the mobile menu if the viewport grows past the breakpoint
    // while it's open, so it doesn't stay stuck open on resize.
    var mq = window.matchMedia("(min-width: 901px)");
    mq.addEventListener("change", function (e) {
      if (e.matches) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var statusBox = document.getElementById("form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    var requiredFields = ["name", "email", "message"];

    function showStatus(kind, message) {
      statusBox.textContent = message;
      statusBox.className = "form-status is-visible is-" + kind;
      statusBox.setAttribute("role", kind === "error" ? "alert" : "status");
    }

    function clearFieldError(field) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
    }

    function setFieldError(field) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.add("has-error");
      field.setAttribute("aria-invalid", "true");
    }

    function isValidEmail(value) {
      // Deliberately simple: catches typos, doesn't try to be a full RFC 5322 parser.
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validate() {
      var valid = true;

      requiredFields.forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        clearFieldError(field);

        if (!field.value.trim()) {
          setFieldError(field);
          valid = false;
          return;
        }

        if (name === "email" && !isValidEmail(field.value.trim())) {
          setFieldError(field);
          valid = false;
        }
      });

      return valid;
    }

    // Clear a field's error state as soon as the visitor fixes it,
    // rather than waiting for the next full submit attempt.
    Array.prototype.forEach.call(form.elements, function (field) {
      if (!field.name) return;
      field.addEventListener("input", function () {
        clearFieldError(field);
      });
    });

    form.addEventListener("submit", function (event) {
      // Honeypot: a real visitor never fills this in, a bot usually does.
      var honeypot = form.elements["company_website"];
      if (honeypot && honeypot.value) {
        event.preventDefault();
        return;
      }

      if (!validate()) {
        event.preventDefault();
        showStatus("error", "Check the fields marked above, a couple of details are missing.");
        return;
      }

      // Progressive enhancement: if fetch isn't available for any reason,
      // let the browser fall through to the form's native action/method
      // so the message still sends via a normal POST and page load.
      if (!window.fetch) return;

      event.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            showStatus("success", "Thanks, that's sent. I'll reply within a couple of working days.");
          } else {
            showStatus("error", "That didn't send, sorry. Try again, or email me directly.");
          }
        })
        .catch(function () {
          showStatus("error", "That didn't send, your connection may have dropped. Try again, or email me directly.");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        });
    });
  }

  function initStickyHeader() {
    var header = document.querySelector(".site-header-on-dark");
    if (!header) return;

    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function initOfferCarousel() {
    var carousel = document.getElementById("offer-carousel");
    if (!carousel) return;

    var track = carousel.querySelector(".offer-carousel-track");
    var prevBtn = carousel.querySelector(".offer-carousel-arrow-prev");
    var nextBtn = carousel.querySelector(".offer-carousel-arrow-next");
    if (!track || !prevBtn || !nextBtn) return;

    function step() {
      var card = track.querySelector(".offer-card");
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    }

    function updateArrows() {
      var maxScroll = track.scrollWidth - track.clientWidth - 1;
      prevBtn.disabled = track.scrollLeft <= 0;
      nextBtn.disabled = track.scrollLeft >= maxScroll;
    }

    prevBtn.addEventListener("click", function () {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", function () {
      track.scrollBy({ left: step(), behavior: "smooth" });
    });

    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    updateArrows();
  }

  function initFooterYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initAccordion() {
    var items = document.querySelectorAll(".accordion-item");
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector(".accordion-trigger");
      if (!trigger) return;

      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        items.forEach(function (other) {
          other.classList.remove("is-open");
          var otherTrigger = other.querySelector(".accordion-trigger");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function initShowcase() {
    var showcase = document.getElementById("showcase");
    if (!showcase) return;

    var tabs = showcase.querySelectorAll(".showcase-tab");
    var labels = showcase.querySelectorAll(".showcase-visual-label");
    var titles = showcase.querySelectorAll(".showcase-visual-title");
    var descs = showcase.querySelectorAll(".showcase-visual-desc");
    var detailPanels = showcase.querySelectorAll(".showcase-detail-panel");
    var visualGrid = showcase.querySelector(".showcase-visual-grid");
    var visualGroups = showcase.querySelectorAll(".showcase-visual-group");
    var visualLink = visualGrid ? null : showcase.querySelector("a.showcase-visual");
    var visualImage = visualLink ? visualLink.querySelector(".showcase-visual-image") : null;
    var visualLabel = labels.length ? labels[0] : null;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-panel");

        tabs.forEach(function (t) {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");

        if (target !== "all") {
          labels.forEach(function (label) {
            label.textContent = tab.textContent;
          });
          titles.forEach(function (title) {
            title.textContent = tab.textContent;
          });
          var desc = tab.getAttribute("data-desc");
          if (desc) {
            descs.forEach(function (descEl) {
              descEl.textContent = desc;
            });
          }

          if (visualImage) {
            var image = tab.getAttribute("data-image");
            if (image) {
              visualImage.src = image;
              visualImage.alt = tab.getAttribute("data-image-alt") || "";
              visualImage.hidden = false;
              if (visualLabel) visualLabel.hidden = true;
            } else {
              visualImage.hidden = true;
              if (visualLabel) visualLabel.hidden = false;
            }
          }

          if (visualLink) {
            var caseStudyUrl = tab.getAttribute("data-case-study");
            if (caseStudyUrl) {
              visualLink.setAttribute("href", caseStudyUrl);
              visualLink.classList.remove("is-static");
            } else {
              visualLink.removeAttribute("href");
              visualLink.classList.add("is-static");
            }
          }
        }

        detailPanels.forEach(function (panel) {
          panel.classList.toggle("is-active", panel.getAttribute("data-detail") === target);
        });

        if (visualGrid) {
          visualGrid.classList.toggle("is-all", target === "all");
        }

        visualGroups.forEach(function (group) {
          group.classList.toggle("is-active", group.getAttribute("data-detail") === target);
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initContactForm();
    initFooterYear();
    initAccordion();
    initShowcase();
    initStickyHeader();
    initOfferCarousel();
  });
})();

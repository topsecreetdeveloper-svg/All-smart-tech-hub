const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector(".primary-nav");

if (menuToggle && primaryNavigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open menu" : "Close menu");
    primaryNavigation.classList.toggle("is-open", !isExpanded);
  });

  primaryNavigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      primaryNavigation.classList.remove("is-open");
    }
  });
}

const serviceSelect = document.querySelector('select[name="Service of interest"]');
const requestedProgram = new URLSearchParams(window.location.search).get("program");

if (serviceSelect && requestedProgram) {
  const program = requestedProgram.toLowerCase();
  const matchingOption = Array.from(serviceSelect.options).find((option) => {
    const label = option.textContent.toLowerCase();
    return label.includes(program) || program.includes(label) ||
      (program.startsWith("solar") && label.startsWith("solar")) ||
      (program.startsWith("cctv") && label.startsWith("solar & cctv")) ||
      (program.startsWith("ai") && label.startsWith("ai engineering"));
  });

  if (matchingOption) {
    serviceSelect.value = matchingOption.value;
  }
}

const impactCounters = document.querySelectorAll(".impact-item strong[data-count]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setCounterValue(counter, value) {
  const numberNode = Array.from(counter.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
  if (numberNode) {
    numberNode.textContent = Math.round(value).toLocaleString();
  }
}

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  if (!Number.isFinite(target)) {
    return;
  }

  if (prefersReducedMotion) {
    setCounterValue(counter, target);
    return;
  }

  const duration = 1400;
  const startTime = performance.now();
  setCounterValue(counter, 0);

  function updateCounter(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - (1 - progress) ** 3;
    setCounterValue(counter, target * easedProgress);

    if (progress < 1) {
      window.requestAnimationFrame(updateCounter);
    }
  }

  window.requestAnimationFrame(updateCounter);
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  impactCounters.forEach((counter) => counterObserver.observe(counter));
} else {
  impactCounters.forEach(animateCounter);
}

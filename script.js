/* Catrames — site interactions
   Vanilla JS. Progressive enhancement: every important section is readable without it. */

(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Header ---------- */
  const header = document.getElementById("siteHeader");
  const heroMedia = document.querySelector(".hero-media");

  let scrollQueued = false;
  const updateOnScroll = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle("is-scrolled", y > 24);

    if (heroMedia && !reducedMotion && window.innerWidth > 760 && y < window.innerHeight * 1.25) {
      heroMedia.style.transform = `translate3d(0, ${y * 0.16}px, 0)`;
    }
    scrollQueued = false;
  };

  window.addEventListener("scroll", () => {
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(updateOnScroll);
    }
  }, { passive: true });
  updateOnScroll();

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  const setNav = (open) => {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    siteNav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    const label = navToggle.querySelector(".sr-only");
    if (label) label.textContent = open ? "Close menu" : "Open menu";
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNav(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setNav(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) setNav(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Active navigation link ---------- */
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const navSections = navLinks
    .map((link) => document.getElementById(link.dataset.nav))
    .filter(Boolean);

  /* Scroll-position based so the highlight never gets stuck between two
     observers while a section is taller than the viewport. */
  const markActive = (links, activeLink) => {
    links.forEach((link) => {
      const isActive = link === activeLink;
      if (link.classList.contains("is-active") !== isActive) {
        link.classList.toggle("is-active", isActive);
      }
    });
  };

  if (navSections.length) {
    const updateNav = () => {
      const marker = window.scrollY + window.innerHeight * 0.34;
      let current = null;
      navSections.forEach((section) => {
        if (section.getBoundingClientRect().top + window.scrollY <= marker) current = section;
      });
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = navSections[navSections.length - 1];
      }
      markActive(navLinks, current ? navLinks.find((link) => link.dataset.nav === current.id) : null);
    };
    let navQueued = false;
    const scheduleNav = () => {
      if (navQueued) return;
      navQueued = true;
      requestAnimationFrame(() => { navQueued = false; updateNav(); });
    };
    updateNav();
    window.addEventListener("scroll", scheduleNav, { passive: true });
    window.addEventListener("resize", scheduleNav);
  }

  /* ---------- Rules index ---------- */
  const ruleLinks = Array.from(document.querySelectorAll(".rules-link"));
  const ruleBlocks = ruleLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (ruleBlocks.length) {
    const updateRulesIndex = () => {
      const marker = window.scrollY + window.innerHeight * 0.3;
      let current = ruleBlocks[0];
      ruleBlocks.forEach((block) => {
        if (block.getBoundingClientRect().top + window.scrollY <= marker) current = block;
      });
      markActive(ruleLinks, ruleLinks.find((link) => link.getAttribute("href") === `#${current.id}`));
    };
    let rulesQueued = false;
    const scheduleRulesIndex = () => {
      if (rulesQueued) return;
      rulesQueued = true;
      requestAnimationFrame(() => { rulesQueued = false; updateRulesIndex(); });
    };
    updateRulesIndex();
    window.addEventListener("scroll", scheduleRulesIndex, { passive: true });
    window.addEventListener("resize", scheduleRulesIndex);
  }

  /* ---------- Cursor glow ---------- */
  const cursorGlow = document.getElementById("cursorGlow");
  if (cursorGlow && finePointer && !reducedMotion) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.opacity = "1";
      cursorGlow.style.transform =
        `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });
    window.addEventListener("pointerleave", () => {
      cursorGlow.style.opacity = "0";
    });
  }

  /* ---------- Embers ---------- */
  const emberBox = document.getElementById("embers");
  if (emberBox && !reducedMotion) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 18; i += 1) {
      const ember = document.createElement("span");
      ember.className = "ember";
      ember.style.setProperty("--x", `${Math.random() * 100}%`);
      ember.style.setProperty("--size", `${2 + Math.random() * 4}px`);
      ember.style.setProperty("--duration", `${9 + Math.random() * 11}s`);
      ember.style.setProperty("--delay", `${Math.random() * 12}s`);
      ember.style.setProperty("--drift", `${-60 + Math.random() * 120}px`);
      fragment.appendChild(ember);
    }
    emberBox.appendChild(fragment);
  }

  /* ---------- Card tilt ---------- */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--ry", `${px * 3.2}deg`);
        card.style.setProperty("--rx", `${-py * 3.2}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  /* ---------- Soul Orb preview ---------- */
  const soulOrb = document.getElementById("soulOrb");
  const orbState = document.getElementById("orbState");
  if (soulOrb && orbState) {
    const states = ["STABLE", "CRACKED", "CRACKED", "UNSTABLE", "UNSTABLE", "CRITICAL", "CRITICAL"];
    let hits = 0;
    soulOrb.addEventListener("click", () => {
      hits = (hits + 1) % states.length;
      soulOrb.classList.remove("is-hit");
      void soulOrb.offsetWidth;
      soulOrb.classList.add("is-hit");
      orbState.textContent = states[hits];
      window.setTimeout(() => soulOrb.classList.remove("is-hit"), 520);
    });
  }

  /* ---------- Timeline ---------- */
  const currentState = [
    "410 record closed — the project file is the front door",
    "Public rules guide revised for 1v1",
    "Turn time: 180s base, −10% per round, −5% per damage",
    "Withering Rose: 0 souls, 0 ATK, 1 HP, Spikes 1",
    "Sacrifice economy: 1 soul per unit",
    "Timeline selector + motion pass",
    "Four-player FFA marked as testing"
  ];

  const timelineData = [
    {
      date: "09 OCT 2026",
      version: "RECORD 000",
      status: "CLOSED",
      statusClass: "closed",
      title: "The 410 record",
      summary: "A single placeholder page. The project had no public file, no rules and no screenshots. The record claimed the game never existed.",
      then: [
        "410 — “It never did exist.”",
        "One undated statement about the cards",
        "A “view correction” toggle",
        "No rules, no images, no project file"
      ],
      delta: 4,
      visual: {
        type: "terminal",
        code: "ARCHIVE / 000",
        label: "ARCHIVE ENTRY 00—17",
        big: "410",
        text: "It never<br>did exist.",
        foot: "STATUS: INCOMPLETE"
      }
    },
    {
      date: "10 OCT 2026",
      version: "DOMAIN",
      status: "CLOSED",
      statusClass: "closed",
      title: "The name found a home",
      summary: "catrames.com was connected. The archive note and the 410 page survived unchanged.",
      then: [
        "catrames.com connected",
        "Archive note: “The cards were real. I think.”",
        "Correction 01: “There is no evidence that this page was here yesterday.”",
        "Still no project file"
      ],
      delta: 4,
      visual: {
        type: "terminal",
        code: "NETWORK / 001",
        label: "CATRAMES.COM",
        big: "CNAME",
        text: "catrames.com<br>connected.",
        foot: "STATUS: STILL INCOMPLETE"
      }
    },
    {
      date: "05 NOV 2026",
      version: "FILE 17B",
      status: "SUPERSEDED",
      statusClass: "superseded",
      title: "The project file opened",
      summary: "The first real dossier: core loop, pressure, world, five development screenshots and a draft rules section.",
      then: [
        "Recovered project file 17B",
        "Core loop, pressure and world",
        "Five development screenshots",
        "Draft rules: board and turn flow",
        "Tech stack: Godot 4.7 / C# / PS1-CRT"
      ],
      delta: 3,
      visual: {
        type: "image",
        src: "pics/title.jpg",
        alt: "Catrames title screen from the 05 Nov project file",
        caption: "FILE 17B / IDENTITY PASS"
      }
    },
    {
      date: "11 NOV 2026",
      version: "BUILD 0.4",
      status: "CURRENT",
      statusClass: "current",
      title: "The record is open",
      summary: "The 410 placeholder is gone. The site leads with the game, a revised rules guide and a timeline selector.",
      next: [
        "Main deck limits and copy caps",
        "PvP handling of card levels",
        "Timer tuning against the 15-minute target",
        "FFA status timing and turn boundaries",
        "Playable build and devlog"
      ],
      delta: 0,
      visual: {
        type: "image",
        src: "pics/menu.jpg",
        alt: "Catrames main menu in the current build",
        caption: "CURRENT BUILD / MAIN MENU"
      }
    }
  ];

  const timelineNav = document.getElementById("timelineNav");
  const timelinePanel = document.getElementById("timelinePanel");
  const timelineProgress = document.getElementById("timelineProgress");
  const timelineNodes = timelineNav
    ? Array.from(timelineNav.querySelectorAll(".timeline-node"))
    : [];

  if (timelineNav && timelinePanel && timelineNodes.length === timelineData.length) {
    let activeIndex = timelineData.length - 1;

    const listMarkup = (items) => (
      `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`
    );

    const visualMarkup = (visual) => {
      if (visual.type === "terminal") {
        return `
          <div class="terminal-visual">
            <div class="terminal-bar"><span></span><span></span><span></span><em>${visual.code}</em></div>
            <div class="terminal-body">
              <span class="terminal-label">${visual.label}</span>
              <strong>${visual.big}</strong>
              <p>${visual.text}</p>
              <span class="terminal-foot">${visual.foot}</span>
            </div>
          </div>`;
      }
      return `
        <figure class="timeline-image">
          <img src="${visual.src}" alt="${visual.alt}" loading="lazy" decoding="async">
          <figcaption>${visual.caption}</figcaption>
        </figure>`;
    };

    const panelMarkup = (item) => {
      const isCurrent = item.statusClass === "current";
      const leftLabel = isCurrent ? "NOW" : "AT THIS DATE";
      const rightLabel = isCurrent ? "NEXT / PLANNED" : "NOW";
      const leftItems = isCurrent ? currentState : item.then;
      const rightItems = isCurrent ? item.next : currentState;
      const deltaText = item.delta === 0
        ? "CURRENT STATE"
        : `${item.delta} CHANGES SINCE THIS RECORD`;

      return `
        <div class="timeline-panel-head">
          <div class="timeline-panel-title">
            <span class="eyebrow">STATE AT ${item.date} / ${item.version}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
          </div>
          <span class="timeline-status timeline-status-${item.statusClass}"><span class="status-dot"></span> ${item.status}</span>
        </div>
        <div class="timeline-compare">
          ${visualMarkup(item.visual)}
          <div class="timeline-columns">
            <div class="timeline-col">
              <span class="col-label">${leftLabel}</span>
              ${listMarkup(leftItems)}
            </div>
            <div class="timeline-col">
              <span class="col-label">${rightLabel}</span>
              ${listMarkup(rightItems)}
            </div>
          </div>
        </div>
        <div class="timeline-panel-foot">
          <span class="timeline-delta">${deltaText}</span>
          <div class="timeline-controls">
            <button type="button" data-tl-prev ${activeIndex === 0 ? "disabled" : ""}>← PREV</button>
            <button type="button" data-tl-next ${activeIndex === timelineData.length - 1 ? "disabled" : ""}>NEXT →</button>
          </div>
        </div>`;
    };

    const scrollActiveNodeIntoView = (node) => {
      if (timelineNav.scrollWidth <= timelineNav.clientWidth) return;
      const left = node.offsetLeft - timelineNav.clientWidth / 2 + node.clientWidth / 2;
      timelineNav.scrollTo({ left, behavior: reducedMotion ? "auto" : "smooth" });
    };

    const renderTimeline = (index, moveFocus = false) => {
      const nextIndex = Math.max(0, Math.min(timelineData.length - 1, index));
      activeIndex = nextIndex;
      const item = timelineData[nextIndex];

      timelineNodes.forEach((node, i) => {
        const active = i === nextIndex;
        node.classList.toggle("is-active", active);
        node.setAttribute("aria-selected", String(active));
        node.tabIndex = active ? 0 : -1;
      });

      if (timelineProgress) {
        timelineProgress.style.width = `${((nextIndex + 1) / timelineData.length) * 100}%`;
      }

      timelinePanel.setAttribute("aria-labelledby", timelineNodes[nextIndex].id);
      timelinePanel.innerHTML = panelMarkup(item);
      timelinePanel.classList.remove("is-entering");
      void timelinePanel.offsetWidth;
      timelinePanel.classList.add("is-entering");

      scrollActiveNodeIntoView(timelineNodes[nextIndex]);
      if (moveFocus) timelineNodes[nextIndex].focus();
    };

    timelineNodes.forEach((node, index) => {
      node.addEventListener("click", () => renderTimeline(index));
    });

    timelineNav.addEventListener("keydown", (event) => {
      let nextIndex = activeIndex;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex += 1;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex -= 1;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = timelineData.length - 1;
      else return;
      event.preventDefault();
      renderTimeline(nextIndex, true);
    });

    timelinePanel.addEventListener("click", (event) => {
      if (event.target.closest("[data-tl-prev]")) {
        renderTimeline(activeIndex - 1);
      } else if (event.target.closest("[data-tl-next]")) {
        renderTimeline(activeIndex + 1);
      }
    });

    renderTimeline(activeIndex);
  }
})();

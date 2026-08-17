(function () {
  "use strict";

  var CHAPTERS = [
    window.DECK_CH_INTRO,
    window.DECK_CH_LITREVIEW,
    window.DECK_CH_METHOD,
    window.DECK_CH_FEASIBILITY,
    window.DECK_CH_TIMELINE,
    window.DECK_CH_CONCLUSION
  ].filter(Boolean);

  var REFERENCES = window.DECK_REFERENCES || [];

  function crumb(chapterTitle, sectionTitle, slideTitle) {
    var trail = chapterTitle;
    if (sectionTitle && sectionTitle !== slideTitle) trail += " &rsaquo; " + sectionTitle;
    return '<p class="deck-crumb">' + trail + "</p>";
  }

  function contentSlide(idAttr, chapterTitle, sectionTitle, title, body) {
    return (
      "<section" + (idAttr ? ' id="' + idAttr + '"' : "") + ' data-chapter="' + chapterTitle + '">' +
      crumb(chapterTitle, sectionTitle, title) +
      '<h2 class="deck-title">' + title + "</h2>" +
      '<div class="deck-body">' + body + "</div>" +
      "</section>"
    );
  }

  function coverBlock() {
    return (
      '<section class="slide-cover">' +
      '<div class="cover-slide">' +
      '<span class="eyebrow">BSc Eng (Hons) &middot; Project Proposal</span>' +
      "<h1>Structure-Function-Aware Pruning<br/>for Continual Learning</h1>" +
      '<p class="cover-authors">D.M.N.S. Gunarathna &middot; W.B.S.S. Harinakshi &middot; K.W.M.R.S.B. Wanigasooriya &middot; S.W.G.M.Y.G.D.M. Wijekoon</p>' +
      '<p class="cover-supervisors">Supervised by Dr. Charith Chitraranjan (Internal) &amp; Prof. Varuna de Silva (External)</p>' +
      '<p class="cover-dept">Department of Computer Science and Engineering &middot; Faculty of Engineering &middot; University of Moratuwa</p>' +
      '<p class="cover-hint">&darr; Press Down, or use the arrow keys / on-screen controls to begin</p>' +
      "</div></section>"
    );
  }

  function dividerBlock(chapter, index) {
    var outline = chapter.sections
      .map(function (s) {
        return "<li>" + s.title + "</li>";
      })
      .join("");
    return (
      '<section class="slide-divider" data-chapter="' + chapter.title + '">' +
      '<div class="divider-slide">' +
      '<span class="divider-index">Chapter ' + index + "</span>" +
      "<h1>" + chapter.title + "</h1>" +
      '<ol class="divider-outline">' + outline + "</ol>" +
      "</div></section>"
    );
  }

  function referencesBlock() {
    var items = REFERENCES.map(function (r) {
      return '<li class="ref-item"><span class="ref-key">' + r.key + "</span>" + r.text + "</li>";
    }).join("");
    return contentSlide(
      null,
      "References",
      "References",
      "References",
      '<p class="slide-lede">Full bibliography for the proposal (citations were shown inline in the formal ' +
        "document; they're collected here for the web presentation).</p>" +
        '<ol class="ref-list">' + items + "</ol>"
    );
  }

  var topLevelBlocks = [];
  var chapterJumpEntries = [];

  topLevelBlocks.push(coverBlock());

  CHAPTERS.forEach(function (chapter, ci) {
    chapterJumpEntries.push({ title: chapter.title, index: topLevelBlocks.length });
    topLevelBlocks.push(dividerBlock(chapter, ci + 1));

    chapter.sections.forEach(function (section) {
      if (section.subs && section.subs.length) {
        var inner = contentSlide(
          section.anchor || null,
          chapter.title,
          section.title,
          section.title,
          section.minimal
        );
        inner += section.subs
          .map(function (sub) {
            return contentSlide(sub.anchor || null, chapter.title, section.title, sub.title, sub.body);
          })
          .join("");
        topLevelBlocks.push("<section>" + inner + "</section>");
      } else {
        topLevelBlocks.push(
          contentSlide(section.anchor || null, chapter.title, section.title, section.title, section.minimal)
        );
      }
    });
  });

  topLevelBlocks.push(referencesBlock());

  var slidesRoot = document.getElementById("deck-slides");
  slidesRoot.innerHTML = topLevelBlocks.join("\n");

  var jumpSelect = document.getElementById("deck-chapter-jump");
  if (jumpSelect) {
    var options = ['<option value="">Jump to&hellip;</option>'];
    chapterJumpEntries.forEach(function (e) {
      options.push('<option value="' + e.index + '">' + e.title + "</option>");
    });
    jumpSelect.innerHTML = options.join("");
    jumpSelect.addEventListener("change", function () {
      if (jumpSelect.value === "") return;
      Reveal.slide(parseInt(jumpSelect.value, 10), 0);
      jumpSelect.value = "";
    });
  }

  var mounted = typeof WeakSet !== "undefined" ? new WeakSet() : null;
  var mountedFallback = [];

  function alreadyMounted(el) {
    if (mounted) return mounted.has(el);
    return mountedFallback.indexOf(el) !== -1;
  }

  function markMounted(el) {
    if (mounted) mounted.add(el);
    else mountedFallback.push(el);
  }

  function mountWidgetsIn(sectionEl) {
    if (!sectionEl || !window.Widgets) return;
    sectionEl.querySelectorAll("[data-widget]").forEach(function (mountEl) {
      if (alreadyMounted(mountEl)) return;
      markMounted(mountEl);
      window.requestAnimationFrame(function () {
        window.Widgets.mount(mountEl.getAttribute("data-widget"), mountEl);
      });
    });
  }

  function renderMathIn(sectionEl) {
    if (!sectionEl || !window.renderMathInElement) return;
    window.renderMathInElement(sectionEl, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false
    });
  }

  Reveal.initialize({
    width: "100%",
    height: "100%",
    margin: 0.04,
    minScale: 1,
    maxScale: 1,
    center: false,
    hash: true,
    controls: true,
    progress: true,
    slideNumber: "c/t",
    transition: "slide",
    backgroundTransition: "fade"
  }).then(function () {
    var current = Reveal.getCurrentSlide();
    mountWidgetsIn(current);
    renderMathIn(current);
  });

  Reveal.on("slidechanged", function (event) {
    mountWidgetsIn(event.currentSlide);
    renderMathIn(event.currentSlide);
  });
})();

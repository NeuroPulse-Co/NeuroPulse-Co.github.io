/* Interactive illustrations for the proposal deck. Each mount function takes the
   .widget-mount container and builds its own self-contained DOM + listeners. */
(function () {
  "use strict";

  var mounts = {};

  function svg(w, h, inner) {
    return (
      '<svg viewBox="0 0 ' + w + " " + h + '" width="100%" height="' + h + '" ' +
      'preserveAspectRatio="xMidYMid meet">' + inner + "</svg>"
    );
  }

  function rerenderMath(el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
    }
  }

  /* ---------------------------------------------------------------------
   * 1. Stability <-> Plasticity balance
   * ------------------------------------------------------------------- */
  mounts["stability-plasticity"] = function (el) {
    el.innerHTML =
      '<div class="widget-card">' +
      '<div class="seesaw-wrap">' +
      '<div class="seesaw-fulcrum"></div>' +
      '<div class="seesaw-bar"><div class="seesaw-node node-plastic">Plasticity</div>' +
      '<div class="seesaw-node node-stable">Stability</div></div>' +
      "</div>" +
      '<input type="range" min="0" max="100" value="50" class="widget-slider" />' +
      '<p class="widget-readout"></p>' +
      "</div>";

    var bar = el.querySelector(".seesaw-bar");
    var slider = el.querySelector(".widget-slider");
    var readout = el.querySelector(".widget-readout");

    function update() {
      var v = Number(slider.value);
      var tilt = ((v - 50) / 50) * 14;
      bar.style.transform = "rotate(" + tilt + "deg)";
      var msg;
      if (v < 25) msg = "High plasticity, low stability &mdash; rapid adaptation, but incoming gradients overwrite older representations (catastrophic forgetting).";
      else if (v > 75) msg = "High stability, low plasticity &mdash; old knowledge is locked in, but the network struggles to acquire new tasks (intransigence).";
      else msg = "Balanced regime &mdash; the goal of continual learning: retain old knowledge while remaining receptive to new tasks.";
      readout.innerHTML = msg;
    }

    slider.addEventListener("input", update);
    update();
  };

  /* ---------------------------------------------------------------------
   * 2. Subnetwork masking across tasks
   * ------------------------------------------------------------------- */
  mounts["subnetwork-masking"] = function (el) {
    var layers = 4;
    var perLayer = 5;
    var nodes = [];
    for (var l = 0; l < layers; l++) {
      for (var n = 0; n < perLayer; n++) {
        nodes.push({ id: l * perLayer + n, layer: l, pos: n });
      }
    }
    var edges = [];
    for (var l2 = 0; l2 < layers - 1; l2++) {
      for (var n2 = 0; n2 < perLayer; n2++) {
        var from = l2 * perLayer + n2;
        var to1 = (l2 + 1) * perLayer + n2;
        var to2 = (l2 + 1) * perLayer + ((n2 + 1) % perLayer);
        edges.push([from, to1]);
        edges.push([from, to2]);
      }
    }

    var taskMasks = {
      "1": [0, 1, 6, 7, 11, 13, 16, 18],
      "2": [2, 3, 5, 8, 10, 12, 17, 19],
      "3": [1, 4, 6, 9, 11, 14, 15, 18]
    };

    var W = 420, H = 220;
    var xStep = W / (layers + 1), yStep = H / (perLayer + 1);

    function coord(node) {
      return { x: (node.layer + 1) * xStep, y: (node.pos + 1) * yStep };
    }

    function draw(active) {
      var activeSet = taskMasks[active] || [];
      var edgeSvg = edges
        .map(function (e) {
          var a = coord(nodes[e[0]]), b = coord(nodes[e[1]]);
          var isActive = activeSet.indexOf(e[0]) !== -1 && activeSet.indexOf(e[1]) !== -1;
          return (
            '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" ' +
            'stroke="' + (isActive ? "#0f9b8e" : "#e5e2d9") + '" stroke-width="' + (isActive ? 2.4 : 1.4) + '" />'
          );
        })
        .join("");

      var nodeSvg = nodes
        .map(function (nd) {
          var c = coord(nd);
          var isActive = activeSet.indexOf(nd.id) !== -1;
          var fill = isActive ? "#0f9b8e" : "#d97706";
          var opacity = isActive ? 1 : 0.55;
          return (
            '<circle cx="' + c.x + '" cy="' + c.y + '" r="7" fill="' + fill + '" opacity="' + opacity + '" stroke="#1b1d23" stroke-width="0.6" />'
          );
        })
        .join("");

      return svg(W, H, edgeSvg + nodeSvg);
    }

    el.innerHTML =
      '<div class="widget-card">' +
      '<div class="widget-tabs">' +
      '<button class="widget-tab active" data-task="1">Task 1</button>' +
      '<button class="widget-tab" data-task="2">Task 2</button>' +
      '<button class="widget-tab" data-task="3">Task 3</button>' +
      "</div>" +
      '<div class="widget-diagram">' + draw("1") + "</div>" +
      '<p class="widget-readout"><span class="dot dot-teal"></span> Consolidated for this task &nbsp; ' +
      '<span class="dot dot-amber"></span> Free / unassigned</p>' +
      "</div>";

    var diagram = el.querySelector(".widget-diagram");
    el.querySelectorAll(".widget-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        el.querySelectorAll(".widget-tab").forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        diagram.innerHTML = draw(tab.getAttribute("data-task"));
      });
    });
  };

  /* ---------------------------------------------------------------------
   * 3. Cumulative variance threshold (tau) — Chart.js
   * ------------------------------------------------------------------- */
  mounts["variance-threshold"] = function (el) {
    var sigmas = [9.8, 7.4, 5.9, 4.6, 3.4, 2.6, 1.9, 1.4, 1.0, 0.7, 0.5, 0.3];
    var sq = sigmas.map(function (s) { return s * s; });
    var total = sq.reduce(function (a, b) { return a + b; }, 0);
    var cum = [];
    sq.reduce(function (acc, v, i) { cum[i] = acc + v; return cum[i]; }, 0);
    var labels = sigmas.map(function (_, i) { return "σ" + (i + 1); });

    el.innerHTML =
      '<div class="widget-card">' +
      '<label class="widget-label">Variance-explained threshold &tau; = <span class="tau-value">0.90</span></label>' +
      '<input type="range" min="0.5" max="0.99" step="0.01" value="0.9" class="widget-slider" />' +
      '<div class="chart-diagram"><canvas></canvas></div>' +
      '<p class="widget-readout"></p>' +
      "</div>";

    var slider = el.querySelector(".widget-slider");
    var tauValue = el.querySelector(".tau-value");
    var canvas = el.querySelector("canvas");
    var readout = el.querySelector(".widget-readout");

    function computeK(tau) {
      for (var i = 0; i < sq.length; i++) {
        if (cum[i] / total >= tau) return i + 1;
      }
      return sq.length;
    }

    function barColors(k) {
      return sq.map(function (_, i) { return i < k ? "#4f46e5" : "#d9d7f8"; });
    }

    var chart = new Chart(canvas, {
      data: {
        labels: labels,
        datasets: [
          {
            type: "bar",
            label: "Singular energy (σᵢ²)",
            data: sq,
            backgroundColor: barColors(computeK(0.9)),
            borderRadius: 3,
            yAxisID: "y"
          },
          {
            type: "line",
            label: "Cumulative fraction",
            data: cum.map(function (c) { return c / total; }),
            borderColor: "#0f9b8e",
            backgroundColor: "#0f9b8e",
            tension: 0.15,
            pointRadius: 3,
            yAxisID: "y1"
          },
          {
            type: "line",
            label: "τ threshold",
            data: sigmas.map(function () { return 0.9; }),
            borderColor: "#d97706",
            borderDash: [6, 4],
            borderWidth: 1.5,
            pointRadius: 0,
            yAxisID: "y1"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        scales: {
          y: { position: "left", title: { display: true, text: "σᵢ²" } },
          y1: { position: "right", min: 0, max: 1, grid: { drawOnChartArea: false }, title: { display: true, text: "cumulative" } }
        },
        plugins: { legend: { display: false } }
      }
    });

    function update() {
      var tau = Number(slider.value);
      tauValue.textContent = tau.toFixed(2);
      var k = computeK(tau);
      chart.data.datasets[0].backgroundColor = barColors(k);
      chart.data.datasets[2].data = sigmas.map(function () { return tau; });
      chart.update();
      var pct = Math.round((k / sigmas.length) * 100);
      readout.innerHTML =
        "&tau; = " + tau.toFixed(2) + " &rarr; retain the top <strong>k* = " + k + "</strong> of " +
        sigmas.length + " gradient components (" + pct + "% of this layer's rank). " +
        '<span class="chart-legend"><span class="dot dot-indigo"></span> singular energy &nbsp; <span class="dot dot-teal"></span> cumulative fraction</span>';
    }

    slider.addEventListener("input", update);
    update();
  };

  /* ---------------------------------------------------------------------
   * 4. Metaplastic decay curve — Chart.js
   * ------------------------------------------------------------------- */
  mounts["metaplastic-decay"] = function (el) {
    var xMax = 5;

    function fMeta(c) {
      var cosh = (Math.exp(c) + Math.exp(-c)) / 2;
      return 1 / (cosh * cosh);
    }

    var curvePts = [];
    for (var x = 0; x <= xMax; x += 0.05) curvePts.push({ x: x, y: fMeta(x) });

    el.innerHTML =
      '<div class="widget-card">' +
      '<label class="widget-label">Consolidation index c<sub>i</sub> = <span class="c-value">1.00</span></label>' +
      '<input type="range" min="0" max="5" step="0.05" value="1" class="widget-slider" />' +
      '<div class="chart-diagram"><canvas></canvas></div>' +
      '<p class="widget-readout"></p>' +
      "</div>";

    var slider = el.querySelector(".widget-slider");
    var cValue = el.querySelector(".c-value");
    var canvas = el.querySelector("canvas");
    var readout = el.querySelector(".widget-readout");

    var chart = new Chart(canvas, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Approach 2 (soft decay)",
            data: curvePts,
            borderColor: "#4f46e5",
            backgroundColor: "#4f46e5",
            borderWidth: 2.4,
            pointRadius: 0,
            tension: 0.1
          },
          {
            label: "Approach 1 (hard freeze)",
            data: [{ x: 0, y: 1 }, { x: 0.02, y: 0 }, { x: xMax, y: 0 }],
            borderColor: "#0f9b8e",
            borderDash: [6, 4],
            pointRadius: 0,
            borderWidth: 2,
            stepped: true
          },
          {
            label: "Current c",
            data: [{ x: 1, y: fMeta(1) }],
            borderColor: "#d97706",
            backgroundColor: "#d97706",
            pointRadius: 6,
            showLine: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { type: "linear", min: 0, max: xMax, title: { display: true, text: "cᵢ" } },
          y: { min: 0, max: 1, title: { display: true, text: "f_meta(cᵢ)" } }
        },
        plugins: { legend: { display: false } }
      }
    });

    function update() {
      var c = Number(slider.value);
      cValue.textContent = c.toFixed(2);
      var f = fMeta(c);
      chart.data.datasets[2].data = [{ x: c, y: f }];
      chart.update();
      readout.innerHTML =
        "Effective learning-rate multiplier <strong>f<sub>meta</sub> = " + f.toFixed(3) + "</strong> &mdash; this parameter " +
        "keeps " + Math.round(f * 100) + "% of its base plasticity. " +
        '<span class="chart-legend"><span class="dot dot-indigo"></span> Approach 2 (soft decay) &nbsp; <span class="dot dot-teal"></span> Approach 1 (hard freeze, step)</span>';
    }

    slider.addEventListener("input", update);
    update();
  };

  /* ---------------------------------------------------------------------
   * 5. Train -> prune -> freeze/consolidate -> infer pipeline stepper
   * ------------------------------------------------------------------- */
  mounts["pipeline-stepper"] = function (el) {
    var steps = [
      { title: "Train on Task t", body: "Optimize only the unassigned free parameters \\(\\Theta_{\\text{free}}^{(t)}\\) until convergence on the active task." },
      { title: "Compute PGI", body: "Collect layer-wise gradients into \\(G_l\\), take a truncated SVD \\(G_l = U_l \\Sigma_l V_l^\\top\\), and score each parameter's Principal Gradient Importance." },
      { title: "Select Subnetwork", body: "Approach 1 keeps a static top-p% of PGI scores. Approach 2 instead grows the rank \\(k_l\\) until cumulative variance explained reaches \\(\\tau\\)." },
      { title: "Protect the Subnetwork", body: "" },
      { title: "Move to Task t+1", body: "Re-initialize any parameters left unassigned so they're available to learn the next task, and repeat." }
    ];

    el.innerHTML =
      '<div class="widget-card">' +
      '<div class="widget-tabs">' +
      '<button class="widget-tab active" data-approach="1">Approach 1: Hard Freezing</button>' +
      '<button class="widget-tab" data-approach="2">Approach 2: Soft Consolidation</button>' +
      "</div>" +
      '<div class="stepper-row"></div>' +
      '<div class="stepper-detail"></div>' +
      "</div>";

    var row = el.querySelector(".stepper-row");
    var detail = el.querySelector(".stepper-detail");
    var approach = "1";
    var activeStep = 0;

    function protectBody() {
      return approach === "1"
        ? "Parameters in the selected mask are transferred to \\(\\Theta_{\\text{cons}}\\) and hard-frozen: \\(\\nabla_{\\theta_i}\\mathcal{L} \\leftarrow 0\\) for all future tasks."
        : "Consolidation index \\(c_i\\) accumulates PGI across tasks, continuously decaying the learning rate via \\(\\eta_i = \\eta_0 \\cdot \\mathrm{sech}^2(\\gamma c_i)\\) instead of freezing outright.";
    }

    function renderSteps() {
      row.innerHTML = steps
        .map(function (s, i) {
          return (
            '<button class="stepper-node ' + (i === activeStep ? "active" : "") + '" data-index="' + i + '">' +
            '<span class="stepper-num">' + (i + 1) + "</span>" + s.title +
            "</button>" +
            (i < steps.length - 1 ? '<span class="stepper-arrow">&rarr;</span>' : "")
          );
        })
        .join("");

      var body = activeStep === 3 ? protectBody() : steps[activeStep].body;
      detail.innerHTML =
        "<strong>" + (activeStep === 3 ? (approach === "1" ? "Hard Freeze Parameters" : "Soft-Consolidate Parameters") : steps[activeStep].title) +
        ".</strong> " + body;
      rerenderMath(detail);

      row.querySelectorAll(".stepper-node").forEach(function (btn) {
        btn.addEventListener("click", function () {
          activeStep = Number(btn.getAttribute("data-index"));
          renderSteps();
        });
      });
    }

    el.querySelectorAll(".widget-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        el.querySelectorAll(".widget-tab").forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        approach = tab.getAttribute("data-approach");
        renderSteps();
      });
    });

    renderSteps();
  };

  /* ---------------------------------------------------------------------
   * 6. Network capacity growth across tasks — Chart.js
   * ------------------------------------------------------------------- */
  mounts["capacity-growth"] = function (el) {
    var approach1 = [15, 30, 45, 60, 75, 90, 100, 100, 100, 100];
    var approach2 = [9, 17, 24, 31, 37, 43, 48, 53, 57, 61];
    var labels = approach1.map(function (_, i) { return "T" + (i + 1); });

    el.innerHTML =
      '<div class="widget-card">' +
      '<label class="widget-label">After task t = <span class="t-value">5</span></label>' +
      '<input type="range" min="1" max="10" step="1" value="5" class="widget-slider" />' +
      '<div class="chart-diagram"><canvas></canvas></div>' +
      '<p class="widget-readout"></p>' +
      '<p class="widget-caption">Illustrative comparison of growth shape, not measured results &mdash; real figures come from the Phase 2&ndash;3 experiments.</p>' +
      "</div>";

    var slider = el.querySelector(".widget-slider");
    var tValue = el.querySelector(".t-value");
    var canvas = el.querySelector("canvas");
    var readout = el.querySelector(".widget-readout");

    function colors(base, dim, t) {
      return approach1.map(function (_, i) { return i < t ? base : dim; });
    }

    var chart = new Chart(canvas, {
      data: {
        labels: labels,
        datasets: [
          {
            type: "bar",
            label: "Approach 1 (static top-p%)",
            data: approach1,
            backgroundColor: colors("#f59e0b", "#f3e3c8", 5)
          },
          {
            type: "bar",
            label: "Approach 2 (adaptive τ)",
            data: approach2,
            backgroundColor: colors("#4f46e5", "#d9d7f8", 5)
          },
          {
            type: "line",
            label: "Capacity ceiling",
            data: approach1.map(function () { return 100; }),
            borderColor: "#b91c1c",
            borderDash: [5, 4],
            borderWidth: 1.2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 105, title: { display: true, text: "% frozen" } } },
        plugins: { legend: { display: false } }
      }
    });

    function update() {
      var t = Number(slider.value);
      tValue.textContent = t;
      chart.data.datasets[0].backgroundColor = colors("#f59e0b", "#f3e3c8", t);
      chart.data.datasets[1].backgroundColor = colors("#4f46e5", "#d9d7f8", t);
      chart.update();
      readout.innerHTML =
        "Approach 1 (static top-p%): <strong>" + approach1[t - 1] + "%</strong> frozen &mdash; " +
        "Approach 2 (adaptive &tau;): <strong>" + approach2[t - 1] + "%</strong> frozen. " +
        '<span class="chart-legend"><span class="dot dot-amber"></span> Approach 1 &nbsp; <span class="dot dot-indigo"></span> Approach 2</span>';
    }

    slider.addEventListener("input", update);
    update();
  };

  window.Widgets = {
    mount: function (name, el) {
      if (mounts[name]) mounts[name](el);
    }
  };
})();

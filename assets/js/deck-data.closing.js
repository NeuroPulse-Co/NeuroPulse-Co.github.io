window.DECK_CH_FEASIBILITY = {
  title: "Feasibility Study",
  sections: [
    {
      title: "Technical Feasibility",
      minimal:
        "<ul>" +
        "<li>Built entirely on <strong>open-source frameworks</strong> and widely accessible hardware.</li>" +
        "<li><strong>Python + PyTorch</strong> &mdash; native support for computational graphs, gradient manipulation (for PGI), and tensor masking (for subnetwork freezing).</li>" +
        "<li><strong>Avalanche / PyCIL</strong> libraries provide existing CL baselines (EWC, PackNet) without building them from scratch.</li>" +
        "<li><strong>GPU acceleration</strong> for Conv6Net-scale training is available via university GPU clusters or cloud platforms (Google Colab Pro, Kaggle &mdash; NVIDIA T4/P100).</li>" +
        "<li>No novel data curation required &mdash; standard, open-access benchmarks (MNIST, CIFAR-10) via <code>torchvision.datasets</code>.</li>" +
        "</ul>"
    },
    {
      title: "Economic and Financial Feasibility",
      minimal:
        "<p>Minimal investment required &mdash; all core tools (Python, PyTorch, NumPy, Matplotlib) and benchmark datasets are free and open for academic use. The main cost is computational resources when university/free-tier cloud GPUs are insufficient.</p>" +
        '<div class="table-wrap"><table class="data-table"><thead><tr><th>Budget Item</th><th>Amount (LKR)</th></tr></thead><tbody>' +
        "<tr><td>Cloud GPU &amp; additional compute resources</td><td>Rs. 30,000</td></tr>" +
        "<tr><td>External storage &amp; backup (datasets, models, results, code)</td><td>Rs. 12,000</td></tr>" +
        "<tr><td>Cloud storage &amp; related services</td><td>Rs. 8,000</td></tr>" +
        "<tr><td><strong>Total</strong></td><td><strong>Rs. 50,000</strong></td></tr>" +
        "</tbody></table></div>" +
        "<p>This budget is judged financially feasible for the scope of the project.</p>"
    }
  ]
};

window.DECK_CH_TIMELINE = {
  title: "Research Timeline",
  sections: [
    {
      title: "Research Timeline",
      minimal:
        "<p>The project runs <strong>June 2026 &ndash; March 2027</strong> across six consecutive phases: Foundations &amp; Proposal preparation, Environment Setup &amp; Baseline Formulation, AFS-based Continual Learning Pipeline Development, Pipeline Refinement, Final Experiments, and Documentation.</p>" +
        "<p>This phased approach reduces risk by validating ASF-S pruning logic on a simplified model before scaling to deeper architectures &mdash; keeping every experimental benchmark and academic deliverable on schedule.</p>" +
        '<div class="callout"><p>See the full interactive Gantt chart with exact dates and task-level detail on the ' +
        '<a href="../timeline/index.html">dedicated Timeline page</a>.</p></div>'
    }
  ]
};

window.DECK_CH_CONCLUSION = {
  title: "Conclusion",
  sections: [
    {
      title: "Conclusion",
      minimal:
        "<p>Continual learning remains fundamentally challenged by catastrophic forgetting. Existing architecture-based methods mitigate it, but reliance on magnitude/activation pruning heuristics severs vital functional pathways &mdash; incurring a severe retraining bottleneck and premature capacity saturation from static allocation.</p>" +
        "<p>This research proposes a <strong>structure-function-aware continual learning framework</strong> built on Artificial Structure Function Search (ASF-S). Replacing magnitude-based pruning with Principal Gradient Importance (PGI) isolates task-critical representations without post-pruning fine-tuning loops.</p>" +
        '<div class="two-col">' +
        "<div><h4>Approach 1 &mdash; Hard Freezing</h4><p>Adapts the baseline ASF-S metric to enforce strict binary masking and hard parameter freezing.</p></div>" +
        "<div><h4>Approach 2 &mdash; Soft Consolidation</h4><p>A boundary-free framework that dynamically sizes task subnetworks via cumulative variance thresholding and protects weights through continuous metaplastic learning-rate modulation.</p></div>" +
        "</div>" +
        "<p>Both will be validated through a progressive, three-phase pipeline &mdash; from MNIST baseline checks to rigorous Split CIFAR-100 benchmarking on Conv6Net &mdash; with ablation studies and direct comparisons against PackNet and EWC.</p>" +
        "<p>Ultimately, this project aims to deliver a <strong>replay-free, zero-retraining</strong> lifelong learning pipeline that advances the feasibility of adaptive AI directly on decentralized edge devices.</p>"
    }
  ]
};

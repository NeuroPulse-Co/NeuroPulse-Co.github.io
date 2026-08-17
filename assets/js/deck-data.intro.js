window.DECK_CH_INTRO = {
  title: "Introduction",
  sections: [
    {
      title: "Background",
      minimal:
        "<ul>" +
        "<li>Deep neural networks have transformed AI &mdash; but the standard paradigm assumes a <strong>static, centralized</strong> training phase: all data, all tasks, all at once, i.i.d.</li>" +
        "<li>Real deployments face <strong>non-stationary streams</strong> &mdash; new classes, domains, and tasks arriving sequentially over long operational lifespans.</li>" +
        "<li>Training continuously with standard backpropagation causes <strong>catastrophic forgetting</strong>: gradient updates for new objectives overwrite parameters needed for old ones.</li>" +
        "<li>Continual Learning (CL) exists to resolve the <strong>stability&ndash;plasticity dilemma</strong> &mdash; adapting to new concepts without erasing consolidated knowledge.</li>" +
        "<li>The ideal: no persistent raw-data storage, no post-task retraining loops, no unbounded parameter growth.</li>" +
        "</ul>"
    },
    {
      title: "Problem Statement",
      minimal:
        "<ul>" +
        "<li>Parameter-isolation methods prevent forgetting, but fail to balance <strong>structural awareness</strong>, <strong>computational efficiency</strong>, and <strong>dynamic allocation</strong>.</li>" +
        "<li>Most rely on <strong>weight-magnitude heuristics</strong> (zero the weights closest to zero) &mdash; evaluated in isolation, ignoring functional dependencies and topology.</li>" +
        "<li>Pruning alters internal representations, forcing expensive <strong>post-pruning fine-tuning</strong> after every task.</li>" +
        "<li>Static, hard-coded pruning ratios ignore task difficulty &mdash; wasting capacity on easy tasks, starving hard ones, saturating the network prematurely.</li>" +
        "</ul>" +
        '<div class="callout"><p><strong>Research Question:</strong> How can we design a structure-function-aware continual ' +
        "learning framework that preserves classification performance across sequential task streams without incurring " +
        "post-task fine-tuning overhead or premature parameter capacity saturation?</p></div>"
    },
    {
      title: "Motivation",
      minimal:
        "<ul>" +
        "<li>AI is migrating from centralized cloud servers to <strong>decentralized, resource-constrained edge hardware</strong> &mdash; autonomous vehicles, industrial sensors, mobile health monitors, field robotics.</li>" +
        "<li>Replay-based methods require storing raw historical data &mdash; conflicting with regulations like <strong>GDPR</strong> and exhausting limited on-device flash memory.</li>" +
        "<li>Edge processors run under strict <strong>energy and thermal budgets</strong> &mdash; multi-epoch fine-tuning loops after every task are impractical for real-time, on-device adaptation.</li>" +
        "<li>Moving adaptation off cloud-scale server farms and onto lightweight local processing drastically cuts the cumulative energy cost of lifelong learning.</li>" +
        "<li>&rArr; the case for a <strong>replay-free, zero-retraining</strong> continual learning pipeline.</li>" +
        "</ul>"
    },
    {
      title: "Novelty and Study Contribution",
      minimal:
        "<p>This project introduces a <strong>Structure-Function-Aware Continual Learning Framework</strong> built on " +
        "Artificial Structure Function Search (ASF-S) for dynamic multi-task learning &mdash; replacing magnitude pruning " +
        "and static allocation with <strong>topological gradient importance</strong> for replay-free, fine-tuning-free " +
        "lifelong learning.</p>" +
        '<div class="two-col">' +
        '<div><h4>Theoretical Contributions</h4><ol type="i">' +
        "<li><strong>AFC for CL Isolation</strong> &mdash; establishing Artificial Functional Connectivity (AFC) and Principal Gradient Importance (PGI) as an architectural isolation scheme.</li>" +
        "<li><strong>Scalable Layer-Wise Subspace Extraction</strong> &mdash; a layer-wise mechanism for PGI scores, bypassing global covariance matrix construction.</li>" +
        "<li><strong>Metaplastic Soft Consolidation</strong> &mdash; a continuous consolidation function that decays learning rates to protect critical pathways while preserving capacity for forward transfer.</li>" +
        "</ol></div>" +
        '<div><h4>Practical Contribution</h4><ol type="i">' +
        "<li><strong>Replay-Free, Zero-Retraining Pipeline</strong> &mdash; eliminating raw-data buffers and post-pruning fine-tuning epochs, reducing on-device energy and latency at task transitions.</li>" +
        "</ol></div></div>"
    },
    {
      title: "Research Objectives",
      minimal:
        "<p class='slide-lede'>Design, implement, and benchmark a structure-function-aware, task-incremental continual learning framework balancing accuracy, parameter efficiency, and computational overhead.</p>" +
        "<ol>" +
        "<li><strong>Design a modular CL architecture</strong> integrating free-parameter optimization with post-task structural extraction via ASF-S, eliminating fine-tuning epochs.</li>" +
        "<li><strong>Implement an efficient layer-wise PGI extraction engine</strong> in PyTorch for real-time topological path extraction without GPU memory explosion.</li>" +
        "<li><strong>Construct a dynamic capacity allocation algorithm</strong> based on a cumulative explained-variance threshold (\\(\\tau\\)) that sizes subnetworks by task complexity.</li>" +
        "<li><strong>Develop a metaplastic soft consolidation mechanism and compression pipeline</strong> using continuous learning-rate decay \\(f_{\\text{meta}}(c_i)\\) and Huffman-coded task bitmasks.</li>" +
        "<li><strong>Evaluate and benchmark</strong> against PackNet and WSN in a Task-Incremental setting across ACC, FWT, BWT, capacity usage (\\(C_t\\)), and retraining overhead (\\(O_{retrain}^{(t)}\\)).</li>" +
        "</ol>"
    }
  ]
};

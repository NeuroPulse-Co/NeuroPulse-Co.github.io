window.DECK_CH_LITREVIEW = {
  title: "Literature Review",
  sections: [
    {
      title: "The Continual Learning Paradigm and Catastrophic Forgetting",
      minimal:
        "<ul>" +
        "<li>CL trains a model across a non-stationary sequence of \\(K\\) tasks, each drawn from its own distribution \\(D^{(t)}\\); historical data becomes inaccessible as learning proceeds.</li>" +
        "<li>Three benchmark scenarios: <strong>Task-IL</strong> (task ID always known), <strong>Domain-IL</strong> (task ID hidden, shared label space), <strong>Class-IL</strong> (task ID hidden, expanding classes).</li>" +
        "<li>The core tension is the <strong>Stability&ndash;Plasticity Dilemma</strong> &mdash; plasticity to learn, stability to remember.</li>" +
        "<li>Catastrophic forgetting arises from conflicting gradients across tasks, rooted in both structural (representational overlap, label-space erosion) and functional (weight drift, activation drift, recency bias) factors.</li>" +
        "</ul>",
      subs: [
        {
          title: "Mathematical Formulation of Sequential Learning",
          body:
            "<p>A CL model with global weights \\(\\theta \\in \\mathbb{R}^{|\\theta|}\\) encounters a sequential stream of \\(K\\) tasks:</p>" +
            "\\[ \\mathcal{T} = \\{1, 2, \\dots, K\\} \\]" +
            "<p>Each task \\(t\\) introduces \\(\\mathcal{D}^{(t)} = \\{(x_n^{(t)}, y_n^{(t)})\\}_{n=1}^{N_t}\\) drawn from \\(D^{(t)} := P^{(t)}(X, Y)\\). The objective across the full lifespan is:</p>" +
            "\\[ \\min_{\\theta} \\sum_{t=1}^{K} \\mathbb{E}_{(X^{(t)}, Y^{(t)}) \\sim D^{(t)}} \\left[ \\mathcal{L}\\left(f_t(X^{(t)}; \\theta), Y^{(t)}\\right) \\right] \\]" +
            "<p>Under realistic constraints, when learning task \\(k\\), access to \\(\\{\\mathcal{D}^{(1)}, \\dots, \\mathcal{D}^{(k-1)}\\}\\) is prohibited or restricted &mdash; \\(\\theta\\) must update from \\(\\mathcal{D}^{(k)}\\) alone while preserving performance on past tasks.</p>"
        },
        {
          title: "Categorization of Learning Scenarios",
          body:
            "<ul>" +
            "<li><strong>Task-Incremental (TIL)</strong>: task index \\(t\\) is given at both train and test time, enabling task-specific heads or isolated subnetworks. The primary setting for parameter-isolation research.</li>" +
            "<li><strong>Domain-Incremental (DIL)</strong>: task ID unknown at test, but the label space \\(Y\\) stays fixed &mdash; the challenge is a shifting input domain \\(P^{(t)}(X)\\).</li>" +
            "<li><strong>Class-Incremental (CIL)</strong>: task ID unknown, classes expand every task, evaluated with one unified head &mdash; the hardest setting due to cross-class confusion.</li>" +
            "</ul>" +
            '<div class="table-wrap"><table class="data-table"><thead><tr>' +
            "<th>Setting</th><th>Task ID (Train)</th><th>Task ID (Test)</th><th>Label Space</th><th>Head Type</th><th>Primary Challenge</th>" +
            "</tr></thead><tbody>" +
            "<tr><td>Task-IL</td><td>&check;</td><td>&check;</td><td>Task-isolated</td><td>Multi-head</td><td>Inter-task parameter interference</td></tr>" +
            "<tr><td>Domain-IL</td><td>&check;</td><td>&times;</td><td>Shared across tasks</td><td>Single-head</td><td>Input domain shift / feature drift</td></tr>" +
            "<tr><td>Class-IL</td><td>&check;</td><td>&times;</td><td>Disjoint / expanding</td><td>Single-head</td><td>Global decision boundary erosion</td></tr>" +
            "</tbody></table></div>"
        },
        {
          title: "The Stability-Plasticity Dilemma",
          body:
            "<ul>" +
            "<li><strong>Plasticity</strong> &mdash; the capacity to rapidly adapt parameters to integrate novel information.</li>" +
            "<li><strong>Stability</strong> &mdash; the capacity to lock in and preserve consolidated parameters against overwriting.</li>" +
            "</ul>" +
            "<p>Unconstrained plasticity causes catastrophic forgetting; excessive stability causes <strong>intransigence</strong> &mdash; the inability to learn anything new. An effective framework needs an optimal trade-off.</p>" +
            '<div class="widget-mount" data-widget="stability-plasticity"></div>',
          widget: "stability-plasticity"
        },
        {
          title: "Structural and Mathematical Roots of Catastrophic Interference",
          body:
            "<p>Standard backpropagation minimizes only the active loss \\(\\mathcal{L}_k\\), producing update directions that can directly conflict with historical loss landscapes:</p>" +
            "\\[ \\langle \\nabla_{\\theta} \\mathcal{L}_k(\\mathcal{D}^{(k)}; \\theta), \\nabla_{\\theta} \\mathcal{L}_j(\\mathcal{D}^{(j)}; \\theta) \\rangle < 0 \\quad \\text{for } j < k \\]" +
            '<div class="two-col">' +
            "<div><h4>Structural roots</h4><ul>" +
            "<li><strong>Representational overlap</strong> &mdash; shared weight spaces map multiple tasks; new updates disrupt old pathways.</li>" +
            "<li><strong>Inter-task label-space erosion</strong> &mdash; missing cross-class negatives collapse shared decision boundaries.</li>" +
            "</ul></div>" +
            "<div><h4>Functional factors</h4><ul>" +
            "<li><strong>Weight drift</strong> away from historical optima \\(\\mu_{k-1}\\).</li>" +
            "<li><strong>Activation drift</strong> amplified through deep layers.</li>" +
            "<li><strong>Task-recency bias</strong> skewing final-layer weights toward recent classes.</li>" +
            "</ul></div></div>"
        }
      ]
    },
    {
      title: "Taxonomy of Continual Learning Strategies",
      minimal:
        "<ul>" +
        "<li><strong>Replay-based</strong>: interleave past samples (real or generated) during new-task training &mdash; strong accuracy, but privacy and buffer-scaling issues.</li>" +
        "<li><strong>Regularization-based</strong>: penalize drift on important weights (EWC, SI) or distill past behavior (LwF) &mdash; no replay buffer, but degrades badly over long streams.</li>" +
        "<li><strong>Architecture-based (parameter isolation)</strong>: physically isolate task subnetworks (PackNet, Piggyback, WSN, CLNP) &mdash; zero forgetting on isolated paths, but magnitude heuristics and static ratios cause a retraining bottleneck and capacity saturation.</li>" +
        "</ul>",
      subs: [
        {
          title: "Replay-Based Approaches: Data and Pseudo-Rehearsal",
          body:
            "<p>Replay interleaves a small episodic memory buffer \\(\\mathcal{M}\\) with new-task data:</p>" +
            "\\[ \\min_{\\theta} \\left[ \\mathcal{L}\\left(f_t(X^{(t)}; \\theta), Y^{(t)}\\right) + \\gamma \\cdot \\mathcal{L}_{\\text{replay}}\\left(f_t(X_{\\mathcal{M}}; \\theta), Y_{\\mathcal{M}}\\right) \\right] \\]" +
            "<ul><li><strong>Experience Replay</strong> &mdash; iCaRL selects exemplar prototypes via nearest-mean-of-exemplars; DER/DER++ also logs past logits for functional consistency.</li>" +
            "<li><strong>Pseudo-Rehearsal</strong> &mdash; generative models (GANs, VAEs, diffusion) synthesize pseudo-samples instead of storing raw data.</li></ul>" +
            "<p>Used in embodied AI (autonomous-vehicle steering/lane-keeping, turbomachinery anomaly detection).</p>" +
            '<p><strong>Failure modes:</strong> privacy/regulatory exposure from stored exemplars; buffers scale poorly on edge hardware, causing overfitting and backprop overhead.</p>'
        },
        {
          title: "Regularization-Based Approaches: Structural and Functional Penalties",
          body:
            "<p><strong>Weight regularization</strong> anchors important parameters with a quadratic penalty:</p>" +
            "\\[ \\mathcal{L}_{\\text{reg}}(\\theta) = \\mathcal{L}_t(\\theta) + \\sum_{i} \\frac{\\lambda}{2} \\Omega_i^{(<t)} \\left( \\theta_i - \\theta_{i, (<t)}^* \\right)^2 \\]" +
            "<p><strong>EWC</strong> approximates \\(\\Omega_i\\) via the diagonal Fisher Information Matrix (famously used to sequentially learn distinct Atari games); <strong>SI</strong> instead tracks a path integral of each weight's loss contribution.</p>" +
            "<p><strong>Function regularization</strong> preserves behavior via distillation &mdash; <strong>LwF</strong> regularizes a student against a frozen teacher's logits, proven across ImageNet&rarr;PASCAL VOC, CUB, and MIT Indoor Scenes.</p>" +
            "<p><strong>Failure modes:</strong> EWC's Fisher estimate vanishes under high-confidence predictions, under-protecting weights; errors accumulate into intransigence or forgetting over long streams.</p>"
        },
        {
          title: "Architecture-Based Approaches: Parameter Isolation and Subnetwork Masking",
          body:
            "<p>A fixed backbone \\(\\Theta\\) is masked per task:</p>" +
            "\\[ \\theta^{(t)} = m^{(t)} \\odot \\Theta \\]" +
            "<ul><li><strong>PackNet</strong> iteratively prunes and retrains to \"pack\" multiple tasks into one network.</li>" +
            "<li><strong>Piggyback</strong> learns binary masks over a fully frozen backbone (WikiArt, sketches).</li>" +
            "<li><strong>WSN</strong> jointly trains + finds task-adaptive subnetworks, Huffman-compressed, SOTA on Tiny ImageNet.</li>" +
            "<li><strong>CLNP</strong> sparsifies regions to prevent forgetting (CIFAR-10/100).</li></ul>" +
            "<p><strong>Primary flaws:</strong> magnitude heuristics (\\(|w_i| \\approx 0\\)) ignore gradient topology; static ratio \\(p\\%\\) ignores task difficulty; pruning forces costly multi-epoch fine-tuning.</p>" +
            '<div class="widget-mount" data-widget="subnetwork-masking"></div>',
          widget: "subnetwork-masking"
        },
        {
          title: "Comparative Taxonomic Analysis",
          body:
            '<div class="table-wrap"><table class="data-table"><thead><tr>' +
            "<th>Strategy Family</th><th>Replay?</th><th>Memory Scaling</th><th>Task Isolation</th><th>Forgetting</th><th>Primary Failure</th>" +
            "</tr></thead><tbody>" +
            "<tr><td>Replay-Based</td><td>&check; (raw/synth)</td><td>O(K) data/buffer</td><td>Low</td><td>Low&ndash;moderate</td><td>Privacy risk, buffer scaling</td></tr>" +
            "<tr><td>Regularization</td><td>&times;</td><td>O(1) model copies</td><td>Low</td><td>High (long streams)</td><td>Weight drift, FIM vanishing, intransigence</td></tr>" +
            "<tr><td>Parameter Isolation</td><td>&times;</td><td>O(K) mask bits</td><td>Complete</td><td>Zero (isolated paths)</td><td>Retraining loops, static p%, saturation</td></tr>" +
            "</tbody></table></div>"
        }
      ]
    },
    {
      title: "Model Compression, Pruning Criteria, and the Retraining Bottleneck",
      minimal:
        "<ul>" +
        "<li>Pruning transforms a dense network \\(\\Theta\\) into a sparse \\(f(x; M \\odot \\Theta)\\); the Lottery Ticket Hypothesis motivates finding sparse \"winning tickets.\"</li>" +
        "<li><strong>Magnitude pruning</strong> (remove \\(|w_i| \\le \\tau\\)) is an opaque, local heuristic that severs cross-layer functional pathways and misfires under continual weight drift.</li>" +
        "<li>Recovering accuracy after pruning needs multi-epoch <strong>retraining</strong> &mdash; a severe bottleneck for real-time, energy-constrained edge deployment.</li>" +
        "<li>Gradient-subspace methods (GPM, AdamNSCL) and <strong>Artificial Functional Connectivity (AFC) / ASF-S</strong> replace magnitude with functional importance, enabling single-shot extraction with little or no fine-tuning.</li>" +
        "</ul>",
      subs: [
        {
          title: "Magnitude Pruning vs. Structural Dependency",
          body:
            "<p>Pruning applies a binary mask \\(M \\in \\{0,1\\}^{|\\Theta|}\\) to produce \\(f(x; M \\odot \\Theta)\\). The <strong>Lottery Ticket Hypothesis</strong> asserts dense random networks contain sparse \"winning tickets\" that match full accuracy trained in isolation.</p>" +
            "<p>Most pruning literature removes weights with \\(|w_i| \\le \\tau\\), assuming near-zero weights barely matter.</p>" +
            "<ul><li><strong>Opaque heuristics</strong> &mdash; no indication of structural dependency or global connectivity.</li>" +
            "<li><strong>Severed connections</strong> &mdash; damages intermediate representations and topographical organization.</li>" +
            "<li><strong>Weight drift / \"avalanche effect\"</strong> &mdash; in CL, shifting weights mean reused paths get misidentified and destroyed.</li></ul>"
        },
        {
          title: "The Retraining Bottleneck in Continual Learning",
          body:
            "<p>Severing connections collapses accuracy immediately; recovery needs multi-epoch <em>pruning-and-retraining</em> loops.</p>" +
            "<ol><li><strong>Prohibitive latency/energy</strong> &mdash; repeated fine-tuning multiplies FLOPs, infeasible on battery-powered edge hardware.</li>" +
            "<li><strong>Hyperparameter sensitivity</strong> &mdash; manual threshold tuning needed per task complexity.</li>" +
            "<li><strong>Inter-task disruption</strong> &mdash; retraining shared parameters risks reintroducing forgetting.</li></ol>" +
            "<p>Circumventing this needs a <strong>single-shot, structure-function-aware</strong> selection metric.</p>"
        },
        {
          title: "Artificial Functional Connectivity (AFC) and Gradient Subspaces",
          body:
            "<p><strong>Gradient Subspace Decomposition</strong> (GPM, AdamNSCL) applies SVD to representation/gradient matrices, projecting new updates into the null space of historical gradients &mdash; no replay needed.</p>" +
            "<p><strong>AFC / ASF-S</strong>, inspired by structure&ndash;function coupling in biological visual cortices, defines the essential relationship between prunable structure and the output layer's functional organization. Instead of raw weight values, it evaluates <strong>Principal Gradient Importance (PGI)</strong> &mdash; the dominant eigenvectors of output-layer class-contrast vectors via SVD or diffusion embedding.</p>" +
            "<p>Masks preserving AFC along principal gradient directions recover baseline accuracy by fine-tuning only the output head &mdash; or not at all &mdash; resolving the retraining bottleneck.</p>"
        }
      ]
    },
    {
      title: "Biological Metaplasticity and Dynamic Subnetwork Sizing",
      minimal:
        "<ul>" +
        "<li>Hard parameter freezing (PackNet, WSN) eliminates forgetting on isolated paths but blocks backward transfer and accelerates saturation.</li>" +
        "<li>Biological <strong>synaptic metaplasticity</strong> &mdash; \"the plasticity of synaptic plasticity\" &mdash; modulates future plasticity via history, without a hard lock.</li>" +
        "<li>Artificial analogue: state-dependent learning-rate modulation \\(\\eta_i^{(t)} = \\eta_0 \\cdot g(\\Omega_i^{(<t)})\\).</li>" +
        "<li>Static allocation ratios also waste capacity &mdash; <strong>cumulative variance-explained thresholding</strong> (\\(\\tau\\)) instead sizes each task's subnetwork by its spectral energy.</li>" +
        "</ul>",
      subs: [
        {
          title: "Biological Synaptic Metaplasticity vs. Hard Parameter Freezing",
          body:
            "<p>Conventional isolation (PackNet, WSN) hard-locks critical parameters: \\(\\nabla_{\\theta_i}\\mathcal{L} \\leftarrow 0\\) for all future tasks &mdash; eliminating overwriting, but blocking backward transfer and refinement.</p>" +
            "<p>Biological synapses instead use <strong>metaplasticity</strong>: prior activity modulates future plasticity without freezing the weight itself.</p>" +
            "\\[ \\eta_i^{(t)} = \\eta_0 \\cdot g\\left( \\Omega_i^{(<t)} \\right) \\]" +
            "<p>where \\(g(\\cdot) \\in (0,1]\\) decreases monotonically with historical importance. Frameworks: <strong>Binarized Metaplastic Networks</strong> (continuous consolidation, no task boundaries needed), <strong>MESU</strong> (Bayesian posterior-variance-scaled learning rates with a controlled forgetting window), and <strong>Complex Synaptic States</strong> (multi-timescale hidden variables per synapse).</p>" +
            '<div class="widget-mount" data-widget="metaplastic-decay"></div>',
          widget: "metaplastic-decay"
        },
        {
          title: "Adaptive Capacity Allocation via Cumulative Energy Thresholding",
          body:
            "<p>Fixed ratios (e.g. \\(p = 10\\%\\) or \\(20\\%\\)) ignore task complexity: <strong>under-fitting</strong> complex tasks with restricted capacity, <strong>wasting</strong> capacity on simple ones and accelerating saturation.</p>" +
            "<p>Cumulative variance-explained thresholding replaces \\(p\\%\\) with an energy-driven threshold \\(\\tau \\in (0,1]\\). Given SVD singular values \\(\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_r\\) of a gradient matrix, the subnetwork rank \\(k^*\\) satisfies:</p>" +
            "\\[ \\frac{\\sum_{i=1}^{k^*} \\sigma_i^2}{\\sum_{j=1}^{r} \\sigma_j^2} \\ge \\tau \\]" +
            "<p>Simple tasks (energy concentrated in few components) yield compact subnetworks; complex tasks automatically expand \\(k^*\\) &mdash; preserving capacity for the tasks that need it.</p>" +
            '<div class="widget-mount" data-widget="variance-threshold"></div>',
          widget: "variance-threshold"
        }
      ]
    },
    {
      title: "Literature Gap & Comparative Synthesis Matrix",
      minimal:
        "<ul>" +
        "<li><strong>Gap 1</strong> &mdash; magnitude-based isolation needs multi-epoch retraining after pruning.</li>" +
        "<li><strong>Gap 2</strong> &mdash; static top-p% sizing ignores task complexity.</li>" +
        "<li><strong>Gap 3</strong> &mdash; hard freezing blocks backward transfer.</li>" +
        "<li><strong>Gap 4</strong> &mdash; regularization-based importance estimates (EWC, MAS) degrade over long streams.</li>" +
        "<li>This thesis proposes two approaches: <strong>ASF-S Hard Freezing</strong> and a <strong>Metaplastic Soft Framework</strong> combining PGI with dynamic \\(\\tau\\)-thresholding and soft consolidation.</li>" +
        "</ul>",
      subs: [
        {
          title: "Summary of Identified Theoretical and Algorithmic Gaps",
          body:
            "<ol>" +
            "<li><strong>The Retraining Bottleneck in Subnetwork Extraction</strong> &mdash; PackNet/SparCL-style magnitude heuristics sever functional dependencies, forcing multi-epoch fine-tuning with high latency and energy cost.</li>" +
            "<li><strong>Uniform Subnetwork Sizing vs. Task Complexity</strong> &mdash; a fixed \\(p\\%\\) ratio under-fits complex tasks while wasting capacity and accelerating saturation on simple ones.</li>" +
            "<li><strong>Rigidity of Hard Freezing vs. Backward Transfer</strong> &mdash; binary weight locking (WSN, PackNet) prevents catastrophic forgetting but completely inhibits refining past representations.</li>" +
            "<li><strong>Importance Estimation Failure in Rehearsal-Free Regimes</strong> &mdash; EWC/MAS-style importance metrics misalign over long streams (e.g. FIM gradient vanishing), causing drift and intransigence or forgetting.</li>" +
            "</ol>"
        },
        {
          title: "Comparative Synthesis Matrix",
          body:
            "<p>To address these gaps, this thesis introduces two complementary approaches:</p>" +
            "<ul><li><strong>Approach 1 (ASF-S Hard Freezing)</strong> &mdash; single-shot, structure-function-aware extraction preserving AFC via PGI, with cumulative variance thresholding (\\(\\tau\\)) for adaptive sizing &mdash; no post-pruning fine-tuning.</li>" +
            "<li><strong>Approach 2 (Metaplastic Soft Framework)</strong> &mdash; PGI combined with metaplastic accumulation (\\(c_i\\)) to continuously modulate learning rates (\\(f_{\\text{meta}}\\)), replacing rigid freezing to enable backward refinement while suppressing overwriting.</li></ul>" +
            '<div class="table-wrap"><table class="data-table"><thead><tr>' +
            "<th>Taxonomy / SOTA</th><th>Replay-Free?</th><th>Requires Retraining?</th><th>Adapts to Complexity?</th><th>Selection Metric</th><th>Weight Protection</th>" +
            "</tr></thead><tbody>" +
            "<tr><td>Experience Replay (iCaRL, DER++)</td><td>&times;</td><td>No</td><td>No (fixed buffer)</td><td>Prototype distance / logits</td><td>Raw/synthetic rehearsal</td></tr>" +
            "<tr><td>Weight Regularization (EWC, MAS)</td><td>&check;</td><td>No</td><td>No (global space)</td><td>FIM curvature / synaptic energy</td><td>Quadratic loss penalty</td></tr>" +
            "<tr><td>Magnitude Isolation (PackNet, Piggyback)</td><td>&check;</td><td><strong>Yes</strong> (severe)</td><td>No (static p%)</td><td>Absolute magnitude</td><td>Binary hard freeze</td></tr>" +
            "<tr><td>Score-Based Isolation (WSN, SupSup)</td><td>&check;</td><td>No</td><td>No (static capacity)</td><td>Learned score params</td><td>Binary hard freeze</td></tr>" +
            "<tr><td><strong>Approach 1 (Baseline)</strong> &mdash; ASF-S Hard</td><td>&check;</td><td><strong>No</strong></td><td><strong>Yes</strong> (dynamic &tau;)</td><td>Principal Gradient Importance</td><td>Binary hard freeze</td></tr>" +
            "<tr><td><strong>Approach 2 (Proposed)</strong> &mdash; Metaplastic Soft</td><td>&check;</td><td><strong>No</strong></td><td><strong>Yes</strong> (dynamic &tau;)</td><td>PGI + metaplastic accumulation</td><td>Soft metaplastic decay</td></tr>" +
            "</tbody></table></div>"
        },
        {
          title: "Architectural Positioning and Research Progression",
          body:
            "<ol>" +
            "<li><strong>Magnitude Pruning &rarr; PGI (Approach 1)</strong> &mdash; replacing opaque magnitude heuristics with AFC-derived PGI extracts functional winning tickets in a single shot; combined with dynamic \\(\\tau\\), this resolves the retraining bottleneck and adapts to task complexity.</li>" +
            "<li><strong>Hard Freezing &rarr; Metaplasticity (Approach 2)</strong> &mdash; Approach 1's binary freezing still blocks backward transfer; Approach 2 replaces it with soft metaplastic learning-rate modulation (\\(f_{\\text{meta}}\\)), continuous and importance-guided.</li>" +
            "</ol>" +
            "<p>Together, these establish a framework for efficient, lifelong learning on edge hardware &mdash; without data replay, multi-epoch retraining, or static capacity limits. The detailed design follows in Chapter 3.</p>"
        }
      ]
    }
  ]
};

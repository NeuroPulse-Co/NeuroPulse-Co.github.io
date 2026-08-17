window.DECK_CH_METHOD = {
  title: "Proposed Methodology",
  sections: [
    {
      title: "System Overview and Task Stream Formulation",
      minimal:
        "<p>A network parameterized by \\(\\Theta \\in \\mathbb{R}^D\\) is trained across a sequential stream of \\(K\\) tasks \\(\\mathcal{T} = \\{T_1, \\dots, T_K\\}\\), each with its own dataset \\(\\mathcal{D}_t\\) sampled from distribution \\(\\mathcal{P}_t\\). In a task-incremental setting, the goal is to maximize performance on \\(T_t\\) without forgetting \\(T_1, \\dots, T_{t-1}\\) &mdash; with no replay buffers and no post-task fine-tuning loops.</p>" +
        "<p>This work formulates two structural isolation mechanisms based on Artificial Structure Function Search (ASF-S):</p>" +
        "<ol><li><strong>Approach 1</strong> &mdash; Hard Freezing via ASF-S.</li>" +
        "<li><strong>Approach 2</strong> &mdash; Structure-Function-Aware Metaplastic Soft Consolidation with dynamic variance thresholding (\\(\\tau\\)) and bitmask compression.</li></ol>" +
        "<p>Both share a parameter allocation scheme where total capacity \\(\\Theta\\) splits at task \\(t\\) into consolidated parameters \\(\\Theta_{\\text{cons}}\\) and unassigned free parameters \\(\\Theta_{\\text{free}}\\), with \\(\\Theta = \\Theta_{\\text{cons}} \\cup \\Theta_{\\text{free}}\\) and \\(\\Theta_{\\text{cons}} \\cap \\Theta_{\\text{free}} = \\emptyset\\).</p>"
    },
    {
      title: "Mathematical Formulation of Artificial Functional Connectivity",
      minimal:
        "<p>Both approaches extract Artificial Functional Connectivity (AFC) at the end of each task's training by computing Principal Gradient Importance (PGI) scores.</p>" +
        "<p>For layer \\(l\\) with parameters \\(\\theta_l \\in \\mathbb{R}^{d_l}\\), gradients over a validation mini-batch of size \\(B\\) form a gradient matrix \\(G_l \\in \\mathbb{R}^{B \\times d_l}\\), decomposed via truncated SVD:</p>" +
        "\\[ G_l = U_l \\Sigma_l V_l^\\top \\]" +
        "<p>The PGI score for parameter \\(i\\) within the top-\\(k\\) singular directions is:</p>" +
        "\\[ P_i^{(l)} = \\sum_{j=1}^{k} \\sigma_{l,j} \\cdot \\big| V_{l,(i,j)} \\big| \\]" +
        "<p>This layer-wise SVD avoids the memory blow-up of a global covariance matrix, keeping PGI extraction tractable at real-time, on-device scale.</p>"
    },
    {
      title: "Proposed Continual Learning Approaches",
      minimal:
        "<div class='two-col'>" +
        "<div><h4>Approach 1 &mdash; Hard Freezing</h4><p>Static top-\\(p\\%\\) PGI selection per task; selected parameters are transferred to \\(\\Theta_{\\text{cons}}\\) and their gradients hard-zeroed for all future tasks. Zero forgetting on isolated paths, but capacity saturates linearly regardless of task difficulty.</p></div>" +
        "<div><h4>Approach 2 &mdash; Metaplastic Soft Framework</h4><p>Dynamic subnetwork sizing via cumulative variance threshold \\(\\tau\\), plus a continuous consolidation index \\(c_i\\) that decays learning rate instead of freezing outright &mdash; and Huffman-compressed bitmasks for lightweight storage.</p></div>" +
        "</div>",
      subs: [
        {
          title: "Approach 1: Hard Freezing via ASF-S",
          anchor: "approach-1",
          body:
            "<p>Adapts the original ASF-S methodology directly into task-incremental CL via binary masking and strict weight freezing.</p>" +
            "<p><strong>Task training and static selection.</strong> Optimization during task \\(T_t\\) is restricted to \\(\\Theta_{\\text{free}}^{(t)}\\). At convergence, PGI scores \\(P^{(l)}\\) are computed per layer, and a binary mask selects the top-\\(p\\%\\) highest-scoring parameters:</p>" +
            "\\[ M_i^{(t,l)} = \\begin{cases} 1, & P_i^{(l)} \\ge \\text{Percentile}(P^{(l)}, 100-p) \\\\ 0, & \\text{otherwise} \\end{cases} \\]" +
            "<p><strong>Hard freezing and inference.</strong> Masked parameters move to \\(\\Theta_{\\text{cons}}\\); future gradients on them are zeroed:</p>" +
            "\\[ \\nabla_{\\theta_i} \\mathcal{L} \\leftarrow \\nabla_{\\theta_i} \\mathcal{L} \\odot \\left( 1 - \\bigcup_{s=1}^{t} M_i^{(s,l)} \\right) \\]" +
            "<p>Inference for task \\(T_t\\) applies the effective mask: \\(W_{\\text{effective}}^{(t,l)} = W^{(l)} \\odot M^{(t,l)}\\).</p>" +
            "<p>Approach 1 guarantees zero forgetting on consolidated pathways, but its static \\(p\\%\\) causes equal parameter consumption regardless of task difficulty &mdash; accelerating capacity saturation.</p>" +
            '<div class="widget-mount" data-widget="pipeline-stepper"></div>'
        },
        {
          title: "Approach 2: Proposed Structure-Function-Aware Framework",
          anchor: "approach-2",
          body:
            "<p><strong>Dynamic allocation via variance thresholding.</strong> The retained rank \\(k_l\\) for layer \\(l\\) satisfies a cumulative variance-explained threshold \\(\\tau \\in (0,1]\\):</p>" +
            "\\[ k_l = \\min \\left\\{ m \\; \\Bigg| \\; \\frac{\\sum_{j=1}^{m} \\sigma_{l,j}^2}{\\sum_{n=1}^{\\min(B,d_l)} \\sigma_{l,n}^2} \\ge \\tau \\right\\} \\]" +
            '<div class="widget-mount" data-widget="variance-threshold"></div>' +
            "<p><strong>Metaplastic soft consolidation.</strong> Instead of binary freezing, a continuous index \\(c_i^{(l)}\\) accumulates importance across tasks:</p>" +
            "\\[ c_i^{(l)} \\leftarrow c_i^{(l)} + PGI_i^{(t,l)} \\]" +
            "<p>and modulates the learning rate via a metaplastic decay function:</p>" +
            "\\[ \\eta_i^{(l)} = \\eta_0 \\cdot f_{\\text{meta}}(c_i^{(l)}) = \\eta_0 \\cdot \\text{sech}^2(\\gamma \\cdot c_i^{(l)}) \\]" +
            "<p>High cumulative importance drives \\(f_{\\text{meta}} \\to 0\\) (protected); low importance keeps \\(f_{\\text{meta}} \\approx 1\\) (plastic, allowing forward transfer).</p>" +
            '<div class="widget-mount" data-widget="metaplastic-decay"></div>' +
            "<p><strong>Huffman mask encoding.</strong> Sparse binary masks \\(M^{(t)}\\) under threshold \\(\\tau\\) are losslessly Huffman-compressed; at inference, the edge system decompresses the relevant mask in \\(\\mathcal{O}(1)\\) and applies \\(W_{\\text{effective}}^{(t)} = W \\odot M^{(t)}\\) at native speed.</p>"
        }
      ]
    },
    {
      title: "Methodological Comparison of Approaches",
      minimal:
        '<div class="table-wrap"><table class="data-table"><thead><tr>' +
        "<th>Algorithmic Property</th><th>Approach 1: ASF-S Hard Freezing</th><th>Approach 2: Proposed Soft Framework</th>" +
        "</tr></thead><tbody>" +
        "<tr><td>Subnetwork selection</td><td>Static top-p% percentile</td><td>Dynamic variance explanation (&tau;)</td></tr>" +
        "<tr><td>Weight protection</td><td>Binary hard freezing</td><td>Metaplastic soft decay</td></tr>" +
        "<tr><td>Capacity saturation</td><td>Rapid / linear growth</td><td>Adaptive / delayed saturation</td></tr>" +
        "<tr><td>Forward transfer</td><td>Inhibited by strict locking</td><td>Enabled via modulated plasticity</td></tr>" +
        "<tr><td>Storage footprint</td><td>Uncompressed binary bitmasks</td><td>Huffman-compressed bitstreams</td></tr>" +
        "<tr><td>Retraining overhead</td><td>Zero post-pruning fine-tuning</td><td>Zero post-pruning fine-tuning</td></tr>" +
        "</tbody></table></div>"
    },
    {
      title: "Experimental Setup",
      minimal:
        "<ul>" +
        "<li><strong>Architectures</strong>: LeNet-300-100 (debugging), Conv2Net (5-task prototyping), Conv6Net (final academic evaluation).</li>" +
        "<li><strong>Datasets</strong>: Standard/Split MNIST, Split CIFAR-10 (5 tasks &times; 2 classes), Split CIFAR-100 (10 tasks &times; 10 classes).</li>" +
        "<li>Test sets are <strong>never</strong> used for training, pruning decisions, or hyperparameter selection.</li>" +
        "<li>Strictly Task-Incremental: a task identifier at inference retrieves the corresponding binary mask.</li>" +
        "</ul>",
      subs: [
        {
          title: "Base Network Architectures",
          body:
            "<ul>" +
            "<li><strong>LeNet300_100</strong> &mdash; fully connected, flattened input, two hidden layers (300, 100 neurons). Used exclusively for initial framework debugging to verify PGI calculations.</li>" +
            "<li><strong>Conv2Net</strong> &mdash; small CNN with two convolutional layers + FC layers; matches the original ASF-S authors' testbed. Primary backbone for prototyping over a 5-task sequence.</li>" +
            "<li><strong>Conv6Net</strong> &mdash; medium CNN with six convolutional layers + FC layers, for the final academic evaluation on complex hierarchical features.</li>" +
            "</ul>" +
            "<p>Architecture choice is matched to dataset complexity; larger architectures may be introduced later if smaller networks lack capacity.</p>"
        },
        {
          title: "Datasets and Task Splits",
          body:
            "<ul>" +
            "<li><strong>Standard / Split MNIST</strong> &mdash; 28&times;28 grayscale digits, 10 classes, 60k train / 10k test. Split MNIST: 5 tasks &times; 2 classes, ~12k train / ~2k test per task.</li>" +
            "<li><strong>Split CIFAR-10</strong> &mdash; 32&times;32 RGB, 10 classes, 50k train / 10k test, split into 5 tasks &times; 2 classes.</li>" +
            "<li><strong>Split CIFAR-100</strong> &mdash; 32&times;32 RGB, 100 classes, 50k train / 10k test, split into 10 tasks &times; 10 classes &mdash; the primary academic benchmark.</li>" +
            "</ul>" +
            '<div class="table-wrap"><table class="data-table"><thead><tr><th>Dataset</th><th>Total Classes</th><th>Tasks</th><th>Classes / Task</th></tr></thead><tbody>' +
            "<tr><td>Standard MNIST</td><td>10</td><td>1</td><td>10</td></tr>" +
            "<tr><td>Split MNIST</td><td>10</td><td>5</td><td>2</td></tr>" +
            "<tr><td>Split CIFAR-10</td><td>10</td><td>5</td><td>2</td></tr>" +
            "<tr><td>Split CIFAR-100</td><td>100</td><td>10</td><td>10</td></tr>" +
            "</tbody></table></div>" +
            '<div class="table-wrap"><table class="data-table"><thead><tr><th>Task</th><th>Classes</th></tr></thead><tbody>' +
            "<tr><td>Task 1</td><td>(0, 1)</td></tr><tr><td>Task 2</td><td>(2, 3)</td></tr><tr><td>Task 3</td><td>(4, 5)</td></tr>" +
            "<tr><td>Task 4</td><td>(6, 7)</td></tr><tr><td>Task 5</td><td>(8, 9)</td></tr>" +
            "</tbody></table></div>" +
            "<p>MNIST first verifies the pruning process works; Split MNIST is the main initial CL benchmark; CIFAR-10/100 test whether the approach holds up as complexity and class count grow.</p>"
        },
        {
          title: "Task Identification Mechanism",
          body:
            "<p>Because parameters are shared across tasks, the framework operates strictly within a <strong>Task-Incremental Learning (TIL)</strong> setting. At inference, the system is given an explicit task identifier (e.g. Task 1, Task 2) alongside the input.</p>" +
            "<p>That identifier retrieves a lightweight, task-specific binary mask, which is applied directly to the network's units &mdash; forcing the network to physically reproduce the exact structural state it had when it finished learning that task.</p>"
        }
      ]
    },
    {
      title: "Experimental Phases",
      minimal:
        "<ul>" +
        "<li><strong>Phase 1 &mdash; Sanity Check</strong>: LeNet-300-100 on standard MNIST, verifying the ASF-S pruning engine works before introducing CL.</li>" +
        "<li><strong>Phase 2 &mdash; Continual Learning Prototype</strong>: Conv2Net on Split MNIST and Split CIFAR-10, running both approaches across a 5-task sequence.</li>" +
        "<li><strong>Phase 3 &mdash; Academic Benchmark</strong>: Conv6Net on Split CIFAR-100, compared against PackNet, Ada-QPackNet, and EWC across 10 tasks.</li>" +
        "</ul>",
      subs: [
        {
          title: "Phase 1: The Sanity Check (Single Task)",
          body:
            "<p>Confirms the core ASF-S pruning engine is functional while maintaining acceptable accuracy, using LeNet-300-100 on standard MNIST (all 10 classes at once).</p>" +
            "<ol>" +
            "<li>Fully train the base network to convergence &mdash; the unpruned reference model.</li>" +
            "<li>Evaluate the unpruned reference model on the MNIST test set.</li>" +
            "<li>Calculate PGI scores for all neurons based on their contribution to the output layer.</li>" +
            "<li>Apply the ASF-S threshold to prune the lowest-scoring connections.</li>" +
            "<li>Apply a brief head-only fine-tuning phase to verify baseline accuracy is recoverable.</li>" +
            "<li>Evaluate the pruned model on the MNIST test set.</li>" +
            "</ol>" +
            "<p>This establishes whether ASF-S can shrink the network without unacceptable accuracy loss, ahead of the CL experiments.</p>"
        },
        {
          title: "Phase 2: The Continual Learning Prototype",
          body:
            "<p>The main proof-of-concept: Conv2Net on Split MNIST and Split CIFAR-10 (separately), running both Approach 1 and Approach 2 independently.</p>" +
            "<ol>" +
            "<li>Train to convergence on the current task \\(T\\)'s training subset.</li>" +
            "<li>Evaluate task \\(T\\) and all previously learned tasks.</li>" +
            "<li>Calculate PGI scores; isolate the subnetwork via hard static masking (Approach 1) or dynamic variance thresholding (Approach 2).</li>" +
            "<li>Protect surviving weights via strict freezing (Approach 1) or metaplastic soft consolidation (Approach 2).</li>" +
            "<li>Briefly fine-tune the output layer to recover accuracy.</li>" +
            "<li>Re-initialize freed weights so they're available for task \\(T+1\\).</li>" +
            "<li>Move to \\(T+1\\) and repeat until all 5 tasks are processed.</li>" +
            "</ol>" +
            "<p>After each task, <em>all</em> tasks learned so far are re-evaluated, directly exposing any drop in earlier-task performance. Running both MNIST and CIFAR-10 checks whether the same behavior holds for richer color images.</p>"
        },
        {
          title: "Phase 3: The Academic Benchmark",
          body:
            "<p>Scaling up to prove generalizability: Conv6Net on Split CIFAR-100.</p>" +
            "<ol>" +
            "<li>Execute the same sequential training/pruning/freezing loop across all 10 tasks.</li>" +
            "<li>Evaluate on all 10 tasks' test sets to build the \\(10 \\times 10\\) accuracy matrix.</li>" +
            "<li>Run the identical sequence under baselines (standard PackNet, Ada-QPackNet, EWC).</li>" +
            "<li>Compare results to validate ASF-S logic over magnitude-based pruning for capacity preservation and forgetting prevention.</li>" +
            "</ol>" +
            "<p>The goal: determine whether the method remains practical as task count and class count grow substantially.</p>"
        }
      ]
    },
    {
      title: "Baseline Comparison",
      minimal:
        "<ul>" +
        "<li><strong>Empirical bounds</strong>: naive sequential fine-tuning (lower bound) vs. joint i.i.d. training (upper bound).</li>" +
        "<li><strong>Regularization baseline</strong>: Elastic Weight Consolidation (EWC).</li>" +
        "<li><strong>Isolation baselines</strong>: PackNet (magnitude pruning) and Piggyback (learned binary masks over a frozen backbone).</li>" +
        "</ul>" +
        "<p>Evaluated on Split-CIFAR-10 and MNIST with a standard Conv6Net.</p>",
      subs: [
        {
          title: "Empirical Bounds",
          body:
            "<p><strong>Naive Sequential Fine-Tuning (Lower Bound)</strong> &mdash; trained sequentially on \\(T_1, \\dots, T_N\\) with no CL mechanism or memory buffer; establishes the severity of catastrophic forgetting for the chosen architecture/dataset.</p>" +
            "<p><strong>Joint Training (Upper Bound)</strong> &mdash; trained concurrently on a shuffled, i.i.d. aggregate of all tasks; sets the empirical ceiling on representational power and the target accuracy for the proposed method.</p>"
        },
        {
          title: "Regularization-Based Methods",
          body:
            "<p><strong>Elastic Weight Consolidation (EWC)</strong> &mdash; a foundational CL baseline estimating weight importance via the diagonal Fisher Information Matrix and applying a quadratic penalty to anchor parameters to previously learned tasks.</p>" +
            "<p>Comparing against EWC highlights the advantages of strict parameter isolation in the proposed AFS framework.</p>"
        },
        {
          title: "Parameter-Isolation and Pruning Methods",
          body:
            "<p><strong>PackNet</strong> &mdash; trains, magnitude-prunes, and retrains iteratively; releases low-magnitude parameters for new tasks while freezing high-magnitude ones. Directly tests naive magnitude pruning against structural-functional pruning.</p>" +
            "<p><strong>Piggyback</strong> &mdash; learns task-specific binary masks over a fixed backbone; used as a secondary baseline for capacity consumption and forward-transfer efficiency.</p>"
        }
      ]
    },
    {
      title: "Evaluation Metrics",
      minimal:
        "<p>Let \\(T\\) be the number of tasks and \\(A_{i,j}\\) the accuracy of a model trained on task \\(i\\), tested on task \\(j\\).</p>" +
        "<ul>" +
        "<li><strong>Average Accuracy (ACC)</strong> &mdash; overall performance across all tasks at the end of training.</li>" +
        "<li><strong>Backward Transfer (BWT)</strong> &mdash; effect of new-task learning on old-task performance; target near-zero (forget-free).</li>" +
        "<li><strong>Forward Transfer (FWT)</strong> &mdash; advantage from prior knowledge when learning a new task.</li>" +
        "<li><strong>Network Capacity Usage (\\(C_t\\))</strong> &mdash; % of parameters permanently frozen after each task.</li>" +
        "<li><strong>Computational Efficiency &amp; Retraining Overhead (\\(O_{retrain}^{(t)}\\))</strong> &mdash; FLOPs and latency spent recovering accuracy post-pruning.</li>" +
        "</ul>",
      subs: [
        {
          title: "Average Accuracy",
          body:
            "\\[ \\mathrm{ACC} = \\frac{1}{T}\\sum_{j=1}^{T} A_{T,j} \\]" +
            "<p>Measures overall performance across all learned tasks at the end of the full sequence &mdash; demonstrating that AFS-isolated subnetworks stay highly expressive and competitive with full-network fine-tuning.</p>"
        },
        {
          title: "Backward Transfer",
          body:
            "\\[ \\mathrm{BWT} = \\frac{1}{T-1}\\sum_{j=1}^{T-1}\\left(A_{T,j} - A_{j,j}\\right) \\]" +
            "<p>Negative BWT signals catastrophic forgetting. Because the AFS-derived subnetwork for a task is architecturally isolated, the primary objective is a BWT of exactly or near zero &mdash; effectively forget-free continual learning.</p>"
        },
        {
          title: "Forward Transfer",
          body:
            "\\[ \\mathrm{FWT} = \\frac{1}{T-1}\\sum_{i=2}^{T}\\left(A_{i-1,i} - \\bar{b}_i\\right) \\]" +
            "<p>where \\(\\bar{b}_i\\) is the accuracy of an independently initialized network trained from scratch on task \\(i\\). A significantly higher FWT than baselines would show that functional pruning reduces the representational damage caused by unstructured magnitude pruning.</p>"
        },
        {
          title: "Network Capacity Usage",
          body:
            "\\[ C_t = \\frac{P_t^{\\mathrm{frozen}}}{P^{\\mathrm{total}}} \\times 100\\% \\]" +
            "<p>Tracks the percentage of parameters permanently frozen after each task, showing whether functional pruning isolates smaller, denser subnetworks than standard pruning &mdash; extending how many tasks the network can learn before saturating.</p>" +
            '<div class="widget-mount" data-widget="capacity-growth"></div>'
        },
        {
          title: "Computational Efficiency and Retraining Overhead",
          body:
            "\\[ O_{retrain}^{(t)} = \\frac{\\text{FLOPs}_{fine\\text{-}tune}^{(t)}}{\\text{FLOPs}_{initial}^{(t)}} \\]" +
            "<p>Alongside FLOPs, cumulative training time \\(\\Delta\\tau_t\\) (epochs and wall-clock seconds) is logged per task. The primary objective is to demonstrate that ASF-S's single-shot extraction achieves near-zero retraining overhead (\\(O_{retrain}^{(t)} \\approx 0\\)), validating real-time feasibility on decentralized hardware.</p>"
        }
      ]
    },
    {
      title: "Ablation Study",
      minimal:
        "<p>Six controlled ablations isolate the contribution of each design decision, holding dataset and architecture fixed:</p>" +
        "<ol>" +
        "<li>ASF-S (PGI) vs. L1/L2-norm and random pruning.</li>" +
        "<li>Impact of pruning ratio (10&ndash;90%).</li>" +
        "<li>One-shot vs. iterative pruning.</li>" +
        "<li>Effect of post-pruning retraining (none / head-only / full).</li>" +
        "<li>Task order and inter-task interference (forward / reverse / random).</li>" +
        "<li>Constant vs. adaptive (PGI-driven) sparsity.</li>" +
        "</ol>",
      subs: [
        {
          title: "ASF-S (PGI) vs. Magnitude-Based Pruning",
          body: "<p>Tests whether ASF-S more effectively identifies important parameters than classical L1-norm, L2-norm, and random pruning &mdash; same architecture and pruning ratio throughout. Compares classification accuracy, sparsity, and retained parameter count to determine whether functional importance beats magnitude alone.</p>"
        },
        {
          title: "Impact of Pruning Ratio",
          body: "<p>Explores pruning percentages of 10%, 30%, 50%, 70%, 80%, and 90%, assessing accuracy, sparsity, and remaining parameters at each level &mdash; identifying how far the network can be pruned before it degrades, and where over-pruning begins.</p>"
        },
        {
          title: "One-Shot vs. Iterative Pruning",
          body: "<p>Compares removing parameters in a single step against pruning over several steps with recalculation in between, at the same final ratio &mdash; testing whether iterative pruning's extra computational cost is justified by any accuracy gain.</p>"
        },
        {
          title: "Effect of Post-Pruning Retraining",
          body: "<p>Compares three settings: no retraining, head-only fine-tuning, and full fine-tuning &mdash; measuring accuracy and training cost to determine how much retraining is actually necessary, and whether ASF-S's functional information reduces the need for full retraining.</p>"
        },
        {
          title: "Task Order and Inter-Task Interference",
          body: "<p>Learns tasks under forward, reverse, and randomly shuffled orderings, with ASF-S-identified critical parameters frozen after each task &mdash; assessing whether the selection and freezing strategy reduces interference regardless of task sequence.</p>"
        },
        {
          title: "Constant vs. Adaptive Sparsity",
          body: "<p>Compares a constant pruning ratio per layer/task against an adaptive ratio driven by ASF-S importance scores (higher-importance layers/tasks keep more parameters) &mdash; testing whether adaptive sparsity uses network capacity more efficiently and delays saturation.</p>"
        }
      ]
    }
  ]
};

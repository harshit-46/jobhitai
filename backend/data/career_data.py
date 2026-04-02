career_data = {
    "Data Scientist": {
        "salary": "₹6 LPA - ₹12 LPA",
        "icon": "📊",
        "category": "Data & AI",
        "description": "Analyze complex data to help organizations make better decisions using statistical and ML techniques.",
        "skills": ["Python", "Machine Learning", "Statistics", "SQL", "Pandas", "NumPy"],
        "roadmap": {
            "Beginner": ["Learn Python basics", "Statistics & Probability", "Excel & SQL fundamentals"],
            "Intermediate": ["Pandas, NumPy, Matplotlib", "ML algorithms (Scikit-learn)", "Data cleaning & EDA"],
            "Advanced": ["Deep Learning (TensorFlow/PyTorch)", "Feature Engineering", "Model Deployment (Flask/FastAPI)"]
        },
        "questions": {
            "What is overfitting?": "Overfitting happens when a model learns the training data too well — including its noise and outliers — and performs poorly on new, unseen data. It means the model has memorized instead of learned patterns. You can detect it when training accuracy is very high but test accuracy is low. To fix it, use techniques like cross-validation, regularization (L1/L2), or adding more training data. Tip: Always evaluate your model on a separate test set, never just the training set.",
            "Explain bias-variance tradeoff": "Bias is the error from wrong assumptions in the model (underfitting), while variance is the error from sensitivity to small fluctuations in training data (overfitting). A high-bias model is too simple; a high-variance model is too complex. The goal is to find a balance where both are reasonably low. This tradeoff is fundamental to choosing the right model complexity. Tip: Start simple, then gradually increase complexity while monitoring test error.",
            "Difference between supervised and unsupervised learning?": "In supervised learning, the model is trained on labeled data — each input has a known correct output (e.g., email spam detection). In unsupervised learning, the model finds hidden patterns in unlabeled data on its own (e.g., customer segmentation). Supervised learning is used for prediction; unsupervised for discovery. Most real-world ML problems are supervised. Tip: Always check if you have labeled data first — it determines which approach to use.",
            "What is p-value?": "A p-value measures the probability that the observed results happened by random chance, assuming the null hypothesis is true. A low p-value (typically < 0.05) means the result is statistically significant and unlikely due to chance. It does NOT tell you the size or importance of an effect. It's widely used in hypothesis testing in data analysis. Tip: Never rely on p-value alone — always look at effect size and confidence intervals too.",
            "Explain linear regression": "Linear regression is a statistical method to model the relationship between a dependent variable and one or more independent variables using a straight line (y = mx + c). It predicts continuous values like house prices or salaries. The model learns the best-fit line by minimizing the sum of squared errors. It assumes a linear relationship between variables. Tip: Always check assumptions like linearity, normality of errors, and no multicollinearity before using it."
        }
    },
    "Data Analyst": {
        "salary": "₹4 LPA - ₹9 LPA",
        "icon": "📈",
        "category": "Data & AI",
        "description": "Transform raw data into actionable insights through analysis, reporting, and visualization.",
        "skills": ["Excel", "SQL", "Python", "Power BI", "Tableau"],
        "roadmap": {
            "Beginner": ["Excel (pivot tables, VLOOKUP)", "SQL basics (SELECT, JOIN, GROUP BY)", "Basic statistics"],
            "Intermediate": ["Python for data (Pandas)", "Power BI / Tableau dashboards", "Data storytelling"],
            "Advanced": ["Advanced SQL (window functions)", "Python automation", "Business intelligence strategy"]
        },
        "questions": {
            "What is data cleaning?": "Data cleaning is the process of fixing or removing incorrect, incomplete, duplicate, or improperly formatted data in a dataset. It's often the most time-consuming part of a data project — taking up to 80% of an analyst's time. Common tasks include handling null values, removing duplicates, fixing data types, and standardizing formats. Clean data is essential for accurate analysis and trustworthy insights. Tip: Always explore your data with df.info() and df.describe() in Pandas before cleaning.",
            "Difference between inner and outer join?": "An INNER JOIN returns only the rows where there is a match in both tables. An OUTER JOIN returns all rows from one or both tables, filling in NULLs where there's no match. LEFT JOIN keeps all rows from the left table; RIGHT JOIN from the right; FULL OUTER JOIN keeps all rows from both. Use INNER JOIN when you need only matched records, and OUTER JOIN when you want to preserve unmatched rows too. Tip: Draw a Venn diagram when confused — it makes join types much clearer.",
            "What is pivot table?": "A pivot table is a data summarization tool that reorganizes and aggregates data from a larger table. It lets you group, filter, and calculate totals, averages, or counts across different categories without writing formulas. In Excel, you drag fields to rows, columns, and values areas to create summaries. It's incredibly powerful for quick business reporting. Tip: In Python, use pd.pivot_table() to replicate Excel pivot tables in code.",
            "Explain KPI": "KPI stands for Key Performance Indicator — a measurable value that shows how effectively a company or team is achieving a business objective. Examples include monthly revenue, customer churn rate, or website conversion rate. Good KPIs are specific, measurable, achievable, relevant, and time-bound (SMART). As a data analyst, your job is to track and visualize KPIs for decision-makers. Tip: Always understand the business goal first, then define KPIs that directly measure progress toward it.",
            "What is data visualization?": "Data visualization is the graphical representation of data to help people understand patterns, trends, and outliers more easily than looking at raw numbers. Common types include bar charts, line graphs, pie charts, heatmaps, and scatter plots. Tools like Tableau, Power BI, and Python's Matplotlib/Seaborn are widely used. Good visualization tells a clear story and guides the viewer to an insight. Tip: Choose the chart type based on your data — use bar charts for comparisons, line charts for trends over time."
        }
    },
    "Web Developer": {
        "salary": "₹3 LPA - ₹8 LPA",
        "icon": "🌐",
        "category": "Development",
        "description": "Build and maintain websites and web applications, handling both frontend UI and backend logic.",
        "skills": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        "roadmap": {
            "Beginner": ["HTML5 & CSS3 basics", "JavaScript fundamentals", "Responsive design"],
            "Intermediate": ["React.js / Vue.js", "Node.js & Express", "REST APIs & databases"],
            "Advanced": ["TypeScript", "System design for web", "Performance optimization & deployment"]
        },
        "questions": {
            "What is DOM?": "The DOM (Document Object Model) is a programming interface that represents an HTML page as a tree of objects. Each element (like a div or button) is a node in this tree that JavaScript can access and manipulate. When you change the DOM, the browser updates the page in real time — that's how dynamic web pages work. React and other frameworks manage the DOM efficiently through a virtual DOM. Tip: Open your browser DevTools and type document.querySelector('h1') in the Console to see DOM manipulation live.",
            "Difference between var, let, const?": "var is function-scoped and can be re-declared and updated; it's the old way and can cause bugs due to hoisting. let is block-scoped, can be updated but not re-declared — use it for variables that will change. const is also block-scoped but cannot be reassigned after declaration — use it for values that stay constant. Modern JavaScript (ES6+) prefers let and const over var. Tip: Default to const; switch to let only when you know the value needs to change.",
            "What is event bubbling?": "Event bubbling is when an event (like a click) on a child element automatically triggers the same event on its parent elements, going up the DOM tree. For example, clicking a button inside a div also triggers the div's click handler. You can stop this with event.stopPropagation(). It's important to understand when adding event listeners to nested elements. Tip: Use event delegation — attach one listener to a parent element instead of multiple listeners to each child.",
            "Explain REST API": "REST (Representational State Transfer) is an architectural style for designing web APIs. It uses standard HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove). Data is typically exchanged in JSON format. RESTful APIs are stateless — each request contains all information needed to process it. Tip: Use tools like Postman or Thunder Client (VS Code extension) to test REST APIs without writing any code.",
            "What is closure?": "A closure is a function that remembers and can access variables from its outer scope even after the outer function has finished executing. It's like the inner function carries a backpack of the outer function's variables. Closures are used for data privacy, factory functions, and callbacks. They're one of JavaScript's most powerful and commonly misunderstood features. Tip: Every time you use a callback or return a function from another function, you're using closures."
        }
    },
    "Software Engineer": {
        "salary": "₹4 LPA - ₹10 LPA",
        "icon": "💻",
        "category": "Development",
        "description": "Design, develop, and maintain software systems across various domains and platforms.",
        "skills": ["DSA", "Java/C++/Python", "OOPs", "DBMS", "Operating Systems"],
        "roadmap": {
            "Beginner": ["Pick a language (Java/C++/Python)", "OOP concepts", "Basic DSA (arrays, linked lists)"],
            "Intermediate": ["Advanced DSA (trees, graphs, DP)", "DBMS & OS concepts", "System design basics"],
            "Advanced": ["Distributed systems", "Design patterns", "Large-scale system architecture"]
        },
        "questions": {
            "Explain OOP concepts": "OOP (Object-Oriented Programming) is built on four pillars: Encapsulation (bundling data and methods together, hiding internal details), Abstraction (showing only what's necessary), Inheritance (a child class reusing properties/methods of a parent class), and Polymorphism (same method behaving differently in different contexts). These principles make code modular, reusable, and easier to maintain. Tip: Remember the acronym APIE — Abstraction, Polymorphism, Inheritance, Encapsulation.",
            "What is deadlock?": "A deadlock is a situation where two or more processes are stuck waiting for each other to release resources, so none of them can proceed. For example, Process A holds Lock 1 and waits for Lock 2, while Process B holds Lock 2 and waits for Lock 1. Deadlocks can be prevented using strategies like lock ordering, timeouts, or the Banker's Algorithm. Tip: Remember the four necessary conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait — all four must be present for deadlock.",
            "Difference between stack and queue?": "A stack follows LIFO (Last In, First Out) — like a stack of plates, you add and remove from the top. Operations are push (add) and pop (remove). A queue follows FIFO (First In, First Out) — like a line, elements are added at the back and removed from the front. Stacks are used in function calls and undo features; queues in scheduling and BFS. Tip: Think of a stack as an undo history and a queue as a printer job list.",
            "What is normalization?": "Normalization is the process of organizing a database to reduce data redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships between them. Common normal forms are 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency). It prevents anomalies during insert, update, and delete operations. Tip: For most practical applications, achieving 3NF is sufficient.",
            "Explain time complexity": "Time complexity measures how the running time of an algorithm grows relative to the input size (n). It's expressed using Big O notation: O(1) is constant, O(log n) is logarithmic, O(n) is linear, O(n²) is quadratic. Lower time complexity means faster algorithms for large inputs. We analyze the worst-case scenario to ensure performance guarantees. Tip: A single loop is O(n), a nested loop is O(n²), and binary search is O(log n)."
        }
    },
    "Machine Learning Engineer": {
        "salary": "₹7 LPA - ₹15 LPA",
        "icon": "🤖",
        "category": "Data & AI",
        "description": "Build and deploy machine learning models and pipelines at scale in production environments.",
        "skills": ["Python", "ML Algorithms", "TensorFlow", "Scikit-learn", "Data Structures"],
        "roadmap": {
            "Beginner": ["Python & math (linear algebra, calculus)", "ML fundamentals (regression, classification)", "Scikit-learn basics"],
            "Intermediate": ["Deep learning (CNNs, RNNs)", "TensorFlow / PyTorch", "Model evaluation & tuning"],
            "Advanced": ["MLOps & model deployment", "LLMs & Transformers", "Scalable ML pipelines"]
        },
        "questions": {
            "What is gradient descent?": "Gradient descent is an optimization algorithm used to minimize a model's loss function by iteratively adjusting parameters in the direction of the steepest descent. It updates weights using: weight = weight - learning_rate × gradient. The learning rate controls how big each step is. Variants include Stochastic GD (one sample) and Mini-batch GD. Tip: If training loss oscillates wildly, your learning rate is too high; if it decreases very slowly, it's too low.",
            "Explain overfitting vs underfitting": "Overfitting is when a model learns training data too well — including noise — so it fails on new data (high variance). Underfitting is when a model is too simple to capture the underlying pattern (high bias). The ideal model generalizes well to unseen data. Fix overfitting with regularization, dropout, or more data; fix underfitting with a more complex model. Tip: Plot learning curves (training vs validation error) to visually identify which problem you have.",
            "What is cross-validation?": "Cross-validation evaluates model performance by splitting data into multiple folds and training/testing on different subsets. In k-fold CV, data is split into k equal parts; the model trains on k-1 folds and tests on the remaining fold, repeated k times. This gives a more reliable estimate than a single train-test split and helps detect overfitting. Tip: Use 5-fold or 10-fold cross-validation as standard practice for model evaluation.",
            "Difference between classification and regression?": "Classification predicts a discrete category or label (e.g., spam/not spam), while regression predicts a continuous numerical value (e.g., house price). Classification uses metrics like accuracy, precision, recall; regression uses MAE, MSE, R². Logistic Regression (despite its name) is used for classification; Linear Regression for continuous output. Tip: Look at your target variable — categorical means classification; continuous scale means regression.",
            "What is ROC-AUC?": "ROC (Receiver Operating Characteristic) curve plots True Positive Rate vs False Positive Rate at various thresholds. AUC (Area Under the Curve) summarizes this as a single number from 0 to 1 — higher is better. AUC of 0.5 means random guessing; 1.0 is perfect. It's especially useful for imbalanced datasets where accuracy can be misleading. Tip: Use ROC-AUC when you care about the model's ability to discriminate between classes across all thresholds."
        }
    },
    "DevOps Engineer": {
        "salary": "₹5 LPA - ₹12 LPA",
        "icon": "⚙️",
        "category": "Infrastructure",
        "description": "Bridge development and operations by automating infrastructure, deployments, and monitoring pipelines.",
        "skills": ["Docker", "Kubernetes", "CI/CD", "Linux", "AWS"],
        "roadmap": {
            "Beginner": ["Linux command line", "Scripting (Bash/Python)", "Git & version control"],
            "Intermediate": ["Docker & containerization", "CI/CD (Jenkins/GitHub Actions)", "Cloud basics (AWS/Azure)"],
            "Advanced": ["Kubernetes orchestration", "Infrastructure as Code (Terraform)", "Monitoring & observability"]
        },
        "questions": {
            "What is CI/CD?": "CI/CD stands for Continuous Integration and Continuous Deployment. CI automatically builds and tests code every time a developer pushes changes. CD automatically deploys tested code to staging or production. Together, they speed up delivery and catch bugs early. Tools include Jenkins, GitHub Actions, and GitLab CI. Tip: Set up a simple GitHub Actions workflow for your projects — even a basic lint + test pipeline adds real professional value.",
            "Explain Docker": "Docker packages applications and their dependencies into lightweight, portable containers that run consistently across different systems — solving the 'it works on my machine' problem. A Dockerfile defines what goes into a container; docker-compose manages multi-container apps. Docker uses fewer resources than traditional VMs. Tip: Start by Dockerizing a simple Flask or Node.js app — it's the fastest way to understand containers practically.",
            "What is Kubernetes?": "Kubernetes (K8s) is a container orchestration system that automates deployment, scaling, and management of containerized applications. It manages clusters running Docker containers, handling load balancing, self-healing (restarting failed containers), and rolling updates. Key concepts: Pods, Deployments, Services, Namespaces. Tip: Use Minikube to run a local single-node Kubernetes cluster for learning without any cloud costs.",
            "What is load balancing?": "Load balancing distributes incoming network traffic across multiple servers to prevent any single server from being overwhelmed. It improves availability, reliability, and scalability. Types include Round Robin (equal distribution), Least Connections (sent to least busy server), and IP Hash. Load balancers also perform health checks and reroute traffic from failed servers. Tip: AWS Elastic Load Balancer and Nginx are the most common tools you'll encounter in real projects.",
            "What is infrastructure as code?": "Infrastructure as Code (IaC) manages and provisions computing infrastructure through configuration files rather than manual processes. Tools like Terraform and CloudFormation let you define servers, networks, and databases as code — making infrastructure reproducible, versionable via Git, and automatable. Tip: Learn Terraform first — it's cloud-agnostic, widely used, and has excellent free learning resources."
        }
    },
    "Cyber Security Analyst": {
        "salary": "₹5 LPA - ₹11 LPA",
        "icon": "🔐",
        "category": "Security",
        "description": "Protect systems and networks from cyber threats through monitoring, analysis, and incident response.",
        "skills": ["Network Security", "Cryptography", "Ethical Hacking", "Firewalls", "SIEM"],
        "roadmap": {
            "Beginner": ["Networking basics (TCP/IP)", "Linux fundamentals", "Basic cryptography"],
            "Intermediate": ["Ethical hacking (Kali Linux)", "Penetration testing", "SIEM tools & log analysis"],
            "Advanced": ["Malware analysis", "Security architecture", "Incident response & forensics"]
        },
        "questions": {
            "What is phishing?": "Phishing is a social engineering attack where an attacker disguises as a trusted entity to trick users into revealing sensitive information like passwords or credit card numbers. It's typically delivered via email, SMS, or fake websites. Signs include urgent language, suspicious links, and mismatched sender addresses. It's the most common entry point for data breaches. Tip: Always hover over links before clicking to see the actual URL — phishing sites often use subtle misspellings.",
            "Explain encryption": "Encryption converts readable data (plaintext) into an unreadable format (ciphertext) using an algorithm and a key, so only authorized parties can read it. Symmetric encryption uses the same key to encrypt and decrypt (e.g., AES); asymmetric uses a public key to encrypt and private key to decrypt (e.g., RSA). It protects data in transit (HTTPS) and at rest (encrypted drives). Tip: HTTPS uses TLS which combines both — asymmetric for key exchange, symmetric for data transfer.",
            "What is firewall?": "A firewall monitors and controls incoming and outgoing network traffic based on predefined security rules. It acts as a barrier between trusted internal networks and untrusted external networks. Types include packet filtering, stateful inspection, and application-layer firewalls. Modern next-gen firewalls (NGFW) also include intrusion prevention and deep packet inspection. Tip: Firewalls block ports, not malware — combine them with antivirus, IDS/IPS, and endpoint security for complete protection.",
            "Difference between symmetric and asymmetric encryption?": "Symmetric encryption uses one shared key for both encrypting and decrypting — fast and efficient but requires secure key sharing (e.g., AES). Asymmetric encryption uses a key pair: public key to encrypt, private key to decrypt — slower but eliminates key-sharing problems (e.g., RSA). HTTPS uses asymmetric to exchange a symmetric session key, then switches to symmetric for speed. Tip: Think of asymmetric as a padlock anyone can lock (public key) but only you can open (private key).",
            "What is VPN?": "A VPN creates an encrypted tunnel between your device and a VPN server, masking your real IP address and securing internet traffic from eavesdroppers. It protects privacy on public Wi-Fi, enables access to geo-restricted content, and allows remote employees to securely access corporate networks. VPNs use protocols like OpenVPN, WireGuard, or IPSec. Tip: For corporate security, complement VPN with MFA and endpoint security — VPN alone is not sufficient protection."
        }
    },
    "Cloud Engineer": {
        "salary": "₹6 LPA - ₹14 LPA",
        "icon": "☁️",
        "category": "Infrastructure",
        "description": "Design and manage scalable cloud infrastructure on platforms like AWS, Azure, and Google Cloud.",
        "skills": ["AWS", "Azure", "GCP", "Networking", "Virtualization"],
        "roadmap": {
            "Beginner": ["Cloud fundamentals", "AWS/Azure free tier basics", "Networking (VPC, subnets)"],
            "Intermediate": ["Cloud services (EC2, S3, Lambda)", "Cloud certifications (AWS SAA)", "Automation scripts"],
            "Advanced": ["Multi-cloud architecture", "Cost optimization", "Enterprise cloud migrations"]
        },
        "questions": {
            "What is cloud computing?": "Cloud computing delivers computing services — servers, storage, databases, networking, software — over the internet on a pay-as-you-go basis. Instead of owning hardware, you rent resources from providers like AWS, Azure, or GCP. It offers scalability (scale instantly), reliability (global data centers), and cost savings (no upfront hardware). Deployment models: public, private, and hybrid cloud. Tip: Start with AWS Free Tier — 12 months of free access to 25+ services, perfect for learning.",
            "Difference between IaaS, PaaS, SaaS?": "IaaS provides raw computing resources like VMs and storage — you manage the OS and above (e.g., AWS EC2). PaaS provides a managed platform for developers to build apps without managing infrastructure (e.g., Heroku). SaaS delivers fully managed software over the internet — users just use it (e.g., Gmail, Salesforce). Tip: Remember the pizza analogy — IaaS is ingredients, PaaS is takeaway pizza, SaaS is eating at a restaurant.",
            "What is virtualization?": "Virtualization creates virtual versions of physical resources — like running multiple virtual machines on a single physical server. Each VM has its own OS and is isolated from others. A hypervisor (VMware or KVM) manages VMs by allocating physical resources. It's the foundation of cloud computing. Tip: VMs virtualize hardware; containers (Docker) virtualize the OS — making containers much more lightweight and faster to start.",
            "Explain AWS EC2": "AWS EC2 (Elastic Compute Cloud) lets you rent virtual servers in the cloud. You choose instance type (CPU, RAM), OS, storage, and networking — your server is ready in minutes. EC2 is elastic — scale up during high traffic, scale down to save costs. It supports auto-scaling and load balancing. Tip: Use the Free Tier's t2.micro instance (750 hours/month free for 12 months) to practice setting up a web server at zero cost.",
            "What is load balancer?": "A load balancer distributes incoming traffic across multiple EC2 instances to ensure high availability and prevent server overload. AWS offers ALB (Application Load Balancer for HTTP/HTTPS), NLB (Network Load Balancer for TCP/UDP). It also performs health checks — if a server fails, traffic automatically reroutes to healthy servers. Tip: Always place a load balancer in front of your web servers in production — it's the first step toward a fault-tolerant architecture."
        }
    },
    "UI/UX Designer": {
        "salary": "₹3 LPA - ₹7 LPA",
        "icon": "🎨",
        "category": "Design",
        "description": "Create intuitive, beautiful user experiences through research, wireframing, and prototyping.",
        "skills": ["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research"],
        "roadmap": {
            "Beginner": ["Design principles (color, typography, layout)", "Figma basics", "Wireframing"],
            "Intermediate": ["User research methods", "Prototyping & usability testing", "Design systems"],
            "Advanced": ["Motion design", "Advanced user psychology", "End-to-end product design"]
        },
        "questions": {
            "What is UX design?": "UX (User Experience) design creates products that provide meaningful, relevant, and enjoyable experiences. It encompasses the entire journey of a user's interaction — from first impression to task completion. UX designers conduct research, create user flows, wireframes, prototypes, and test with real users. The goal is to make products intuitive and efficient. Tip: Always design for the user's mental model, not for how the system works internally.",
            "Difference between UI and UX?": "UX is about the overall feel and usability — how easy and enjoyable a product is to use. UI is about visual presentation — colors, fonts, buttons, and layout. UX comes first: define flow and structure, then UI makes it look beautiful. Good UX with bad UI looks ugly; good UI with bad UX looks pretty but frustrates users. Tip: Think of UX as the blueprint of a house and UI as the interior design — structure comes before aesthetics.",
            "What is wireframing?": "A wireframe is a low-fidelity visual representation of a screen's layout — like a blueprint. It shows placement of elements (buttons, images, text) without colors or visual design. Wireframes help teams align on structure and functionality early, before investing time in detailed design. Tools: Figma, Balsamiq, or even pencil and paper. Tip: Keep wireframes intentionally rough — if they look too polished, stakeholders focus on aesthetics instead of functionality.",
            "Explain design thinking": "Design thinking is a human-centered problem-solving framework with five stages: Empathize (understand users), Define (state the problem), Ideate (brainstorm solutions), Prototype (build quick mockups), and Test (validate with users). It's iterative — you go back and forth between stages. It encourages creative solutions grounded in real user needs rather than assumptions. Tip: The most important and most skipped step is Empathize — time spent talking to real users always improves the final design.",
            "What is usability testing?": "Usability testing observes real users attempting to complete tasks on a product while designers note pain points, confusion, and errors. It validates designs before launch. Types: moderated (facilitator guides the user) or unmoderated (user completes tasks independently). Testing with just 5 users reveals 85% of usability issues. Tip: Don't ask users what they like — ask them to complete a specific task and watch where they struggle. Actions reveal more than opinions."
        }
    },
    "Mobile App Developer": {
        "salary": "₹4 LPA - ₹10 LPA",
        "icon": "📱",
        "category": "Development",
        "description": "Build native and cross-platform mobile applications for Android and iOS devices.",
        "skills": ["Flutter", "React Native", "Java/Kotlin", "Swift", "API Integration"],
        "roadmap": {
            "Beginner": ["Java or Kotlin basics", "Android Studio setup", "Basic UI components"],
            "Intermediate": ["Flutter / React Native", "REST API integration", "State management"],
            "Advanced": ["App performance optimization", "Publishing to Play Store / App Store", "Native modules"]
        },
        "questions": {
            "What is activity lifecycle?": "The Android Activity Lifecycle defines states an activity goes through: onCreate() (initialize), onStart() (becoming visible), onResume() (user can interact), onPause() (partially obscured), onStop() (not visible), onDestroy() (removed). Understanding this is critical for saving data, releasing resources, and avoiding memory leaks. For example, stop video in onPause() and release camera in onStop(). Tip: Log each lifecycle method while building your first app — seeing them called in sequence builds intuition.",
            "Difference between native and hybrid apps?": "Native apps are built specifically for one platform (Android with Kotlin/Java, iOS with Swift) — best performance and full device feature access. Hybrid apps use web technologies wrapped in a native shell (e.g., Ionic) — code once, deploy everywhere, but with performance trade-offs. Cross-platform frameworks like Flutter and React Native offer near-native performance with a single codebase. Tip: For most college projects, Flutter is the best choice — great performance, single codebase, and growing job market.",
            "What is REST API?": "A REST API allows mobile apps to communicate with a backend server over HTTP. The app sends requests (GET, POST, PUT, DELETE) to specific endpoints (URLs), and the server responds with JSON data. For example, a weather app calls a weather API to get current conditions. REST APIs are stateless — each request is independent. Tip: Use the http package in Flutter or axios in React Native, and practice by connecting to a free public API like OpenWeatherMap.",
            "Explain state management": "State management refers to how an app stores, manages, and updates data that affects the UI. In Flutter, when state changes, relevant widgets rebuild. Simple apps use setState(); larger apps use Provider, Riverpod, or BLoC pattern to manage state across multiple screens cleanly. Poor state management leads to UI bugs and performance issues. Tip: Start with Provider — it's Flutter's officially recommended solution, simple to learn, and widely used in production.",
            "What is APK?": "An APK (Android Package Kit) is the file format to distribute and install apps on Android — similar to a .exe on Windows. Android Studio packages your code, resources, and manifest into an APK when you build. Android App Bundle (.aab) is the newer format preferred by Play Store — it delivers smaller, optimized downloads per device. Tip: Always test your release APK on a physical device before publishing — it behaves differently from the emulator."
        }
    },
    "Blockchain Developer": {
        "salary": "₹6 LPA - ₹16 LPA",
        "icon": "⛓️",
        "category": "Development",
        "description": "Build decentralized applications and smart contracts on blockchain platforms.",
        "skills": ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "Cryptography"],
        "roadmap": {
            "Beginner": ["Blockchain basics", "Cryptography fundamentals", "Ethereum & wallet setup"],
            "Intermediate": ["Solidity smart contracts", "Web3.js / Ethers.js", "DApp development"],
            "Advanced": ["DeFi protocols", "Gas optimization", "Auditing smart contracts"]
        },
        "questions": {
            "What is blockchain?": "A blockchain is a distributed, decentralized ledger that records transactions across many computers so records cannot be altered retroactively. Each 'block' contains transactions and is cryptographically linked to the previous block. It's trustless — no central authority is needed because the network validates transactions. Bitcoin uses it for finance; Ethereum extends it with programmable smart contracts. Tip: Think of blockchain as a Google Sheet everyone can read, no one can secretly edit, and every change is permanently visible.",
            "What is a smart contract?": "A smart contract is a self-executing program on a blockchain that automatically enforces agreements when predefined conditions are met — no intermediary needed. Written in Solidity for Ethereum, they're immutable once deployed. For example, a smart contract can automatically release payment to a freelancer when a client confirms delivery. They power DeFi, NFTs, and DAOs. Tip: Use Remix IDE (browser-based) to write, compile, and deploy your first Solidity contract without any local setup.",
            "Explain proof of work vs proof of stake?": "Proof of Work (PoW) requires miners to solve complex puzzles to validate transactions — energy-intensive (used by Bitcoin). Proof of Stake (PoS) selects validators based on how many coins they stake as collateral — far more energy-efficient (used by Ethereum after 'The Merge' in 2022). PoS is faster and greener but has different security tradeoffs. Most new blockchains use PoS or its variants. Tip: Ethereum's switch from PoW to PoS reduced its energy consumption by ~99.95% — a landmark event worth understanding.",
            "What is gas in Ethereum?": "Gas is the unit measuring computational effort required to execute operations on Ethereum. Every transaction or smart contract operation costs gas, paid in ETH. Gas fees prevent spam and compensate validators. When the network is congested, gas prices rise. Gas = Gas Units Used × Gas Price (in Gwei). Tip: Use Remix IDE's gas estimator while writing contracts — loops and storage writes are the biggest gas consumers to optimize.",
            "What is a wallet address?": "A blockchain wallet address is a unique 42-character string (on Ethereum) derived from your public key — like a bank account number. It starts with '0x'. It's safe to share publicly for receiving funds. Your private key proves ownership and authorizes transactions — never share it. Losing your private key means permanently losing access to your funds. Tip: Use MetaMask as your first wallet — it's browser-based, beginner-friendly, and integrates directly with DApp tools."
        }
    },
    "AI/Prompt Engineer": {
        "salary": "₹5 LPA - ₹14 LPA",
        "icon": "🧠",
        "category": "Data & AI",
        "description": "Design and optimize prompts and workflows for large language models and generative AI systems.",
        "skills": ["Prompt Design", "LLMs", "Python", "API Integration", "NLP"],
        "roadmap": {
            "Beginner": ["Understand LLM basics", "Prompt engineering fundamentals", "OpenAI / Anthropic APIs"],
            "Intermediate": ["Chain-of-thought prompting", "RAG (Retrieval Augmented Generation)", "Fine-tuning basics"],
            "Advanced": ["LangChain / LlamaIndex", "Building AI agents", "Evaluation & benchmarking"]
        },
        "questions": {
            "What is a large language model?": "A Large Language Model (LLM) is an AI trained on massive text data to understand and generate human language. It learns statistical patterns between words to predict and generate coherent text. Examples include GPT-4, Claude, and Gemini. LLMs use transformer architecture and self-supervised learning on billions of tokens — they can write, summarize, translate, code, and reason. Tip: LLMs are next-token predictors — they generate text one word at a time based on probability, which explains both their power and tendency to hallucinate.",
            "Explain chain-of-thought prompting": "Chain-of-thought (CoT) prompting instructs an LLM to reason step-by-step before giving a final answer, significantly improving accuracy on complex tasks. Instead of asking 'What is 17 × 24?', you prompt 'Think step by step: What is 17 × 24?' The model shows its reasoning, catching errors along the way. It's especially effective for math, logic, and multi-step problems. Tip: Adding 'Let's think step by step' to prompts often dramatically improves output quality for complex questions.",
            "What is RAG?": "RAG (Retrieval Augmented Generation) enhances LLMs by first retrieving relevant documents from a knowledge base, then using that context to generate accurate, up-to-date responses. It solves LLMs having outdated knowledge and hallucinating facts. The pipeline: User query → Search knowledge base → Feed results as context → LLM generates answer. It's widely used for chatbots over custom documents. Tip: LlamaIndex and LangChain are the most popular RAG frameworks — start with LlamaIndex for simpler document Q&A.",
            "What is hallucination in LLMs?": "Hallucination is when an LLM generates confident-sounding but factually incorrect or fabricated information. Since LLMs predict text statistically rather than retrieving facts, they can make up plausible-sounding but false details — like fake citations or wrong dates. Mitigation strategies include RAG, grounding responses in verified sources, and instructing the model to acknowledge uncertainty. Tip: Always instruct LLMs in your system prompt to say 'I don't know' when uncertain — this significantly reduces hallucination.",
            "Difference between fine-tuning and prompt engineering?": "Prompt engineering crafts effective inputs to guide an LLM's output without changing model weights — fast, cheap, no training required. Fine-tuning further trains a pre-trained LLM on your specific dataset — more powerful but requires data, compute, and expertise. Most use cases are solved with good prompt engineering alone. Fine-tuning is worth it only when you need consistent style or domain-specific knowledge that prompts can't achieve. Tip: Always exhaust prompt engineering first — it solves 80% of problems at 1% of the cost."
        }
    },
    "Database Administrator": {
        "salary": "₹4 LPA - ₹10 LPA",
        "icon": "🗄️",
        "category": "Data & AI",
        "description": "Manage and optimize databases ensuring performance, security, and availability of data.",
        "skills": ["SQL", "MySQL", "PostgreSQL", "MongoDB", "Backup & Recovery"],
        "roadmap": {
            "Beginner": ["SQL basics", "Relational database concepts", "MySQL/PostgreSQL setup"],
            "Intermediate": ["Indexing & query optimization", "Backup & recovery strategies", "NoSQL basics (MongoDB)"],
            "Advanced": ["Database clustering & replication", "Performance tuning", "Cloud databases (RDS, DynamoDB)"]
        },
        "questions": {
            "What is normalization?": "Normalization organizes a database to minimize redundancy and ensure data integrity by dividing tables and defining relationships. 1NF: atomic values, no repeating groups. 2NF: no partial dependency on a composite key. 3NF: no transitive dependency. It prevents insertion, update, and deletion anomalies. Tip: For most applications, 3NF is the sweet spot — going beyond can hurt query performance with excessive joins.",
            "Difference between SQL and NoSQL?": "SQL databases are relational, store data in structured tables with fixed schemas, and use SQL (e.g., MySQL, PostgreSQL). NoSQL databases are non-relational, store data in documents, key-value pairs, or columns with flexible schemas (e.g., MongoDB, Redis). SQL is better for complex queries and data integrity; NoSQL is better for scalability and unstructured data. Tip: Choose SQL for clear relationships and structure; choose NoSQL when you need horizontal scaling or frequent schema changes.",
            "What is an index?": "A database index is a data structure that speeds up data retrieval — like the index at the back of a book. Without it, the database scans every row to find matches (full table scan); with it, it jumps directly to relevant rows. Indexes speed up SELECT queries but slow down INSERT/UPDATE/DELETE because the index also needs updating. Common types: B-tree (default), Hash, Full-text. Tip: Add indexes on columns used frequently in WHERE, JOIN, and ORDER BY — but don't over-index, as too many hurt write performance.",
            "Explain ACID properties": "ACID ensures reliable database transactions: Atomicity (all operations succeed or all fail — no partial updates), Consistency (database moves from one valid state to another), Isolation (concurrent transactions don't interfere), Durability (committed changes persist even after crashes). ACID is the foundation of relational databases, critical for financial systems. Tip: Remember with a bank transfer example — ACID ensures both the debit and credit happen, or neither does.",
            "What is a stored procedure?": "A stored procedure is a precompiled set of SQL statements stored in the database, executed with a single call. It accepts parameters, performs operations, and can return results. Benefits: reduced network traffic, better security (users run the procedure without direct table access), and code reuse. Tip: Use stored procedures for complex, repetitive operations like batch processing — but avoid putting too much business logic in the database, as it makes testing and version control harder."
        }
    },
    "Network Engineer": {
        "salary": "₹4 LPA - ₹10 LPA",
        "icon": "🔗",
        "category": "Infrastructure",
        "description": "Design, implement, and maintain computer networks for organizations.",
        "skills": ["TCP/IP", "Cisco Routers", "Firewalls", "VPN", "Network Monitoring"],
        "roadmap": {
            "Beginner": ["Networking basics (OSI model, TCP/IP)", "Subnetting & IP addressing", "Basic router/switch config"],
            "Intermediate": ["CCNA certification", "VPN & firewall configuration", "Network monitoring tools"],
            "Advanced": ["CCNP / advanced routing protocols", "Network automation", "SD-WAN"]
        },
        "questions": {
            "What is the OSI model?": "The OSI model standardizes network communication in 7 layers: Physical (cables/signals), Data Link (MAC addresses, switches), Network (IP addresses, routers), Transport (TCP/UDP, ports), Session (connection management), Presentation (data format/encryption), Application (HTTP, FTP, DNS). Each layer serves the layer above and is served by the layer below. Tip: Use the mnemonic 'Please Do Not Throw Sausage Pizza Away' to memorize the layers (Physical, Data Link, Network, Transport, Session, Presentation, Application).",
            "Difference between TCP and UDP?": "TCP is connection-oriented — it establishes a connection via three-way handshake and guarantees delivery, ordering, and error-checking. It's slower but reliable (used for web browsing, email, file transfer). UDP is connectionless — sends packets without guaranteeing delivery. It's faster but unreliable (used for video streaming, gaming, DNS, VoIP). Tip: Think of TCP as certified mail (guaranteed delivery) and UDP as dropping flyers from a plane (fast, but some may be lost).",
            "What is subnetting?": "Subnetting divides a large IP network into smaller sub-networks (subnets), improving performance, security, and IP address management. A subnet mask (e.g., 255.255.255.0 or /24 in CIDR) defines which part of an IP identifies the network vs the host. For example, 192.168.1.0/24 gives 254 usable host addresses. Tip: Practice with powers of 2: /24 = 256 addresses, /25 = 128, /26 = 64 — knowing these by heart is essential for the CCNA exam.",
            "What is NAT?": "NAT (Network Address Translation) maps private IP addresses to a public IP address as traffic passes through a router. It allows multiple devices on a local network to share one public IP to access the internet. This conserves public IPv4 addresses and adds security by hiding internal IPs. Home routers use NAT for every connected device. Tip: PAT (Port Address Translation) is the most common form — it maps multiple private IPs to one public IP using different port numbers.",
            "Explain BGP vs OSPF": "BGP (Border Gateway Protocol) is an exterior routing protocol used between different organizations/ISPs on the internet — the 'backbone of the internet'. OSPF (Open Shortest Path First) is an interior routing protocol used within a single organization's network — finds shortest path using Dijkstra's algorithm. BGP prioritizes policy; OSPF prioritizes speed and least cost. Tip: Think of OSPF as routing within a city (your network) and BGP as routing between cities (the entire internet)."
        }
    },
    "Product Manager": {
        "salary": "₹8 LPA - ₹20 LPA",
        "icon": "🚀",
        "category": "Management",
        "description": "Lead product strategy, roadmap, and execution by working across engineering, design, and business teams.",
        "skills": ["Product Roadmap", "Agile/Scrum", "User Research", "SQL", "Stakeholder Management"],
        "roadmap": {
            "Beginner": ["Product thinking basics", "Agile/Scrum fundamentals", "User story writing"],
            "Intermediate": ["Roadmap planning", "Data-driven decision making (SQL, analytics)", "A/B testing"],
            "Advanced": ["Go-to-market strategy", "OKRs & KPIs", "Leading cross-functional teams"]
        },
        "questions": {
            "What is a product roadmap?": "A product roadmap is a high-level visual plan outlining the vision, direction, priorities, and progress of a product over time. It communicates what the team is building, why, and when — aligning stakeholders across engineering, design, sales, and leadership. Roadmaps can be time-based (quarterly themes) or outcome-based (focused on goals like 'reduce churn by 20%'). They're living documents that evolve. Tip: Avoid over-committing to specific dates on public roadmaps — use 'Now / Next / Later' framing to communicate priorities without locking into deadlines.",
            "Explain agile methodology": "Agile is an iterative development approach that delivers work in short sprints (typically 2 weeks) rather than one big release. Key principles: customer collaboration over contracts, responding to change over following a plan, working software over documentation. Scrum (sprints, standups, retrospectives) and Kanban (continuous flow) are popular Agile frameworks. Tip: The daily standup is not a status report for the manager — it's team coordination: what did I do, what will I do, what's blocking me.",
            "How do you prioritize features?": "Feature prioritization balances user needs, business impact, and development effort. Popular frameworks: RICE (Reach, Impact, Confidence, Effort), MoSCoW (Must/Should/Could/Won't have), and the Kano Model. Always tie prioritization to your current business goal. Data from user interviews, analytics, and support tickets should inform decisions. Tip: When stakeholders all claim 'top priority', use a scoring matrix with agreed criteria — it depoliticizes the conversation and makes decisions data-driven.",
            "What is an MVP?": "An MVP (Minimum Viable Product) is the simplest version of a product that delivers enough value to attract early users and validate key assumptions — with minimum effort. It's not a half-built product; it's a strategic test. Dropbox's MVP was just a demo video that tested whether people wanted cloud storage before any code was written. MVPs save months of building the wrong thing. Tip: Ask 'What's the minimum we need to test whether our solution works?' — everything else is a nice-to-have for v2.",
            "How do you measure product success?": "Product success is measured through metrics tied to goals. The AARRR framework covers: Acquisition (new users), Activation (users experiencing core value), Retention (DAU/MAU, churn rate), Revenue (MRR, ARPU), and Referral (NPS, viral coefficient). The North Star Metric captures your product's core value (e.g., Spotify's is time spent listening). Vanity metrics like total downloads look good but don't indicate real success. Tip: Pair quantitative metrics (numbers) with qualitative insights (user interviews) — data tells you what; users tell you why."
        }
    }
}
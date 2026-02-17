const faqData = [
  {
    category: "Donation and Payment",
    questions: [
      {
        id: 1,
        question: "How to Donate on This Platform?",
        answer: ["Visit the donation page.", "Select a project or campaign you want to support.", "Choose the donation amount and follow the instructions for payment using cryptocurrency on Ethereum Layer 2 Optimism."],
      },
      {
        id: 2,
        question: "Why Use Ethereum Layer 2 Optimism for Donations?",
        answer: ["Reduce transaction fees.", "Speed up transaction confirmations.", "Provide a more efficient donation experience."],
      },
      {
        id: 3,
        question: "What Cryptocurrencies Are Accepted for Donations?",
        answer: ["We accept various cryptocurrencies tradable on Ethereum Layer 2 Optimism.", "See the donation page for a complete list."],
      },
      {
        id: 4,
        question: "Are There Fees for Donating?",
        answer: ["Yes, there is a minimal transaction fee to cover processing costs on the blockchain.", "However, these fees are generally lower than Ethereum Layer 1."],
      },
    ],
  },
  {
    category: "Security and Transparency",
    questions: [
      {
        id: 5,
        question: "How is the Security of Donation Funds Guaranteed?",
        answer: ["Donation funds are guaranteed through smart contracts on the blockchain,", "ensuring the use of funds aligns with the goals of charitable projects."],
      },
      {
        id: 6,
        question: "How to Track the Progress of a Project or Charity Campaign?",
        answer: ["Information about the progress of a project or charity campaign can be found on the official project or campaign page.", "Every donation is transparently recorded on the blockchain."],
      },
    ],
  },
  {
    category: "Account Management and Registration",
    questions: [
      {
        id: 7,
        question: "Do I Need to Register to Donate?",
        answer: ["While not mandatory, registering provides benefits such as tracking your donation history.", "Donations can also be made without registration."],
      },
      {
        id: 8,
        question: "How to Submit a Charity Project?",
        answer: ["If you have a charity project, visit the charity project submission page.", "Make sure to follow the submission guidelines and meet the provided requirements."],
      },
    ],
  },
  {
    category: "Customer Service and Support",
    questions: [
      {
        id: 9,
        question: "How to Contact Customer Service?",
        answer: ["If you have questions or need assistance, contact our customer support team through the contact form or the email provided on the contact page."],
      },
      {
        id: 10,
        question: "How to Report Issues or Fraud?",
        answer: ["If you suspect suspicious activity or fraud, report it immediately to our customer support team.", "All reports will be handled with maximum confidentiality and security."],
      },
    ],
  },
  {
    category: "Ethereum Layer 2 Optimism Blockchain Technology",
    questions: [
      {
        id: 11,
        question: "What is Ethereum Layer 2 Optimism?",
        answer: ["Ethereum Layer 2 Optimism is a scaling solution that accelerates and enhances transaction efficiency on the Ethereum blockchain.", "How does this technology work, and what are its benefits?"],
      },
      {
        id: 12,
        question: "How Does Ethereum Layer 2 Optimism Improve the Donation Experience?",
        answer: ["Layer 2 Optimism reduces transaction fees and speeds up confirmations,", "providing users with a more efficient and affordable donation experience."],
      },
    ],
  },
  {
    category: "Benefits and Social Impact",
    questions: [
      {
        id: 13,
        question: "How Does Donating Through Blockchain Technology Support Charity Projects?",
        answer: ["With blockchain transparency, donors can directly see how their funds are used,", "increasing trust and participation in charitable causes."],
      },
      {
        id: 14,
        question: "Does Donating Through Cryptocurrency Support Inclusivity?",
        answer: ["Yes, with lower transaction fees,", "donating through cryptocurrency on Layer 2 Optimism can make charity more accessible to various segments of society."],
      },
    ],
  },
  {
    category: "Sustainability and Future Plans",
    questions: [
      {
        id: 15,
        question: "How Does This Platform Support the Sustainability of Charity Projects?",
        answer: ["This platform may have sustainability mechanisms,", "such as allocating funds for operational costs or sustainable development of charity projects."],
      },
      {
        id: 16,
        question: "Are There Plans to Integrate Other Technologies in the Future?",
        answer: ["Does this platform have plans to adopt new technologies or", "integrate new features to enhance the donation experience?"],
      },
    ],
  },
  {
    category: "Technical Guide",
    questions: [
      {
        id: 17,
        question: "How to Confirm Transactions and View Donation History on the Blockchain?",
        answer: ["Technical guide on how donors can access transaction information and", "their donation history on the blockchain."],
      },
      {
        id: 18,
        question: "What to Do If a Transaction Encounters Issues?",
        answer: ["Step-by-step instructions on what to do if a donation or transaction encounters difficulties or errors."],
      },
    ],
  },
  {
    category: "General",
    questions: [
      {
        id: 19,
        question: "Is This Platform Non-Profit?",
        answer: ["Is this platform a non-profit organization, and", "how are profits (if any) used to support charitable missions?"],
      },
      {
        id: 20,
        question: "How to Contribute or Become a Partner?",
        answer: ["Information on how individuals or organizations can contribute,", "partner, or collaborate with this platform to support charity projects."],
      },
    ],
  },
  {
    category: "Platform Rules and Protection",
    questions: [
      {
        id: 21,
        question: "How are campaigns verified before going live?",
        answer: [
          "Each newly created campaign enters a waiting/validation status first.",
          "Admin reviews campaign data before setting it to active.",
          "Only approved campaigns can receive donations through the main flow.",
        ],
      },
      {
        id: 22,
        question: "What should I check before donating to avoid scams?",
        answer: [
          "Check campaign status, creator address, story clarity, and update history.",
          "Prefer campaigns with clear objectives and realistic fund usage.",
          "Always confirm you are connected to OP Sepolia testnet for this environment.",
        ],
      },
      {
        id: 23,
        question: "Can donors request a refund if a campaign is problematic?",
        answer: [
          "Yes, refund flow is available based on campaign smart contract rules.",
          "If misuse is suspected, donors can report campaign activity.",
          "Follow the report/refund actions on campaign detail page to trigger on-chain process.",
        ],
      },
      {
        id: 24,
        question: "Which wallets and network are supported?",
        answer: [
          "Crypto Charity supports MetaMask, Coinbase Wallet, and WalletConnect.",
          "Current deployment and testing are configured for Optimism Sepolia.",
          "Please switch network if your wallet is connected to another chain.",
        ],
      },
    ],
  },
];

export default faqData;

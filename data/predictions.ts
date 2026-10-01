export interface PredictionMarket {
  id: number;
  category: "Crypto" | "Tech" | "Macro" | "Politics" | "Global";
  question: string;
  image_url?: string;
  outcomes: string[];
  outcome_prices: number[]; // e.g. [0.65, 0.35]
  volume_24h: string;
  liquidity: string;
  resolved: boolean;
  endDate: string;
}

export interface PredictionPosition {
  id: string;
  marketId: number;
  question: string;
  outcome: string;
  amountUsd: number;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  isOpen: boolean;
  timestamp: number;
}

export const PREDICTION_MARKETS: PredictionMarket[] = [
  {
    id: 1,
    category: "Crypto",
    question: "Bitcoin breaks $120,000 before End of Q4 2026?",
    image_url: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    outcomes: ["Yes", "No"],
    outcome_prices: [0.64, 0.36],
    volume_24h: "$1,450,820",
    liquidity: "$820,000",
    resolved: false,
    endDate: "Dec 31, 2026"
  },
  {
    id: 2,
    category: "Tech",
    question: "NVIDIA reports Q3 Data Center Revenue over $38 Billion?",
    image_url: "https://img.logo.dev/nvidia.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    outcomes: ["Yes", "No"],
    outcome_prices: [0.78, 0.22],
    volume_24h: "$920,400",
    liquidity: "$510,000",
    resolved: false,
    endDate: "Nov 20, 2026"
  },
  {
    id: 3,
    category: "Macro",
    question: "US Federal Reserve cuts benchmark interest rate at next FOMC?",
    image_url: "https://img.logo.dev/federalreserve.gov?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    outcomes: ["Yes", "No"],
    outcome_prices: [0.85, 0.15],
    volume_24h: "$2,890,110",
    liquidity: "$1,420,000",
    resolved: false,
    endDate: "Nov 06, 2026"
  },
  {
    id: 4,
    category: "Crypto",
    question: "Solana Market Cap surpasses $150 Billion in 2026?",
    image_url: "https://cryptologos.cc/logos/solana-sol-logo.png",
    outcomes: ["Yes", "No"],
    outcome_prices: [0.52, 0.48],
    volume_24h: "$730,500",
    liquidity: "$460,000",
    resolved: false,
    endDate: "Dec 31, 2026"
  },
  {
    id: 5,
    category: "Tech",
    question: "OpenAI releases GPT-5 before Q1 2027?",
    image_url: "https://img.logo.dev/openai.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    outcomes: ["Yes", "No"],
    outcome_prices: [0.71, 0.29],
    volume_24h: "$1,120,000",
    liquidity: "$680,000",
    resolved: false,
    endDate: "Mar 31, 2027"
  },
  {
    id: 6,
    category: "Politics",
    question: "Global AI Safety Treaty ratified by 10+ G20 nations in 2026?",
    image_url: "https://img.logo.dev/un.org?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    outcomes: ["Yes", "No"],
    outcome_prices: [0.38, 0.62],
    volume_24h: "$412,000",
    liquidity: "$290,000",
    resolved: false,
    endDate: "Dec 15, 2026"
  },
  {
    id: 7,
    category: "Crypto",
    question: "Ethereum L2 total value locked (TVL) exceeds $60 Billion?",
    image_url: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    outcomes: ["Yes", "No"],
    outcome_prices: [0.59, 0.41],
    volume_24h: "$645,000",
    liquidity: "$375,000",
    resolved: false,
    endDate: "Dec 31, 2026"
  },
  {
    id: 8,
    category: "Tech",
    question: "Apple Vision Pro 2 announced before WWDC 2027?",
    image_url: "https://img.logo.dev/apple.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    outcomes: ["Yes", "No"],
    outcome_prices: [0.44, 0.56],
    volume_24h: "$380,900",
    liquidity: "$210,000",
    resolved: false,
    endDate: "Jun 01, 2027"
  }
];

export interface StrategyBot {
  id: string;
  name: string;
  category: "AI Neural" | "Arbitrage" | "Momentum" | "SIP Plan" | "Grid Bot";
  description: string;
  estRoi: string;
  riskLevel: "Low" | "Medium" | "High";
  minInvestment: number;
  frequency?: string;
  activeDeployments: number;
  winRate: string;
  iconName: string;
  tag: string;
}

export const STRATEGY_BOTS: StrategyBot[] = [
  {
    id: "bot-neural-arb",
    name: "Neural Cross-DEX Arbitrage",
    category: "Arbitrage",
    description: "Sub-millisecond latency arbitrage scanner capturing price discrepancies across KuCoin, Binance, and Uniswap liquidity pools.",
    estRoi: "14% – 28%",
    riskLevel: "Low",
    minInvestment: 250,
    activeDeployments: 1420,
    winRate: "94.2%",
    iconName: "Zap",
    tag: "High Frequency"
  },
  {
    id: "bot-alpha-momentum",
    name: "Multi-Asset Momentum Alpha",
    category: "Momentum",
    description: "Dynamic trend-following engine combining Options gamma flow, dark pool sentiment, and volume profile breakouts.",
    estRoi: "18% – 36%",
    riskLevel: "Medium",
    minInvestment: 500,
    activeDeployments: 980,
    winRate: "88.6%",
    iconName: "TrendingUp",
    tag: "Options & Stocks"
  },
  {
    id: "bot-grid-scalper",
    name: "Dynamic Volatility Grid",
    category: "Grid Bot",
    description: "Automated high-frequency grid orders placed inside key volume nodes, generating continuous yield in oscillating markets.",
    estRoi: "10% – 22%",
    riskLevel: "Low",
    minInvestment: 100,
    activeDeployments: 2150,
    winRate: "96.4%",
    iconName: "Cpu",
    tag: "24/7 Yield"
  },
  {
    id: "sip-blue-chip",
    name: "Systematic Wealth Builder (SIP)",
    category: "SIP Plan",
    description: "Automated recurring portfolio dollar-cost averaging into top blue-chip US Equities and digital assets with zero tax drag.",
    estRoi: "12% – 24%",
    riskLevel: "Low",
    minInvestment: 50,
    frequency: "Weekly / Monthly",
    activeDeployments: 3410,
    winRate: "99.1%",
    iconName: "ShieldCheck",
    tag: "Roth IRA Compatible"
  }
];

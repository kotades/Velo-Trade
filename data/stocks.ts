export interface StockAsset {
  id: number;
  ticker_symbol: string;
  company_name: string;
  company_logo_url: string;
  current_price: number;
  price_change_24h: number;
  market_cap: string;
  volume_24h: string;
  exchange: string;
  category: "Tech" | "Semiconductor" | "Finance" | "Automotive" | "Consumer" | "Healthcare" | "Energy";
  description: string;
}

export const TOP_STOCKS: StockAsset[] = [
  {
    id: 1,
    ticker_symbol: "NVDA",
    company_name: "NVIDIA Corporation",
    company_logo_url: "https://img.logo.dev/nvidia.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 192.53,
    price_change_24h: 3.42,
    market_cap: "$4.72T",
    volume_24h: "261.2M",
    exchange: "NASDAQ",
    category: "Semiconductor",
    description: "NVIDIA Corporation pioneers GPU-accelerated computing and full-stack computing infrastructure for artificial intelligence, autonomous machines, and enterprise computing."
  },
  {
    id: 2,
    ticker_symbol: "AAPL",
    company_name: "Apple Inc.",
    company_logo_url: "https://img.logo.dev/apple.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 283.78,
    price_change_24h: 1.15,
    market_cap: "$4.31T",
    volume_24h: "145.8M",
    exchange: "NASDAQ",
    category: "Tech",
    description: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services."
  },
  {
    id: 3,
    ticker_symbol: "MSFT",
    company_name: "Microsoft Corporation",
    company_logo_url: "https://img.logo.dev/microsoft.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 372.97,
    price_change_24h: 1.01,
    market_cap: "$2.77T",
    volume_24h: "181.0M",
    exchange: "NASDAQ",
    category: "Tech",
    description: "Microsoft develops and supports software, services, devices, and enterprise cloud solutions including Azure, Microsoft 365, Windows, and Copilot AI systems."
  },
  {
    id: 4,
    ticker_symbol: "GOOGL",
    company_name: "Alphabet Inc.",
    company_logo_url: "https://img.logo.dev/abc.xyz?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 337.39,
    price_change_24h: -1.22,
    market_cap: "$4.12T",
    volume_24h: "110.9M",
    exchange: "NASDAQ",
    category: "Tech",
    description: "Alphabet provides search, advertising, Google Cloud, Android, YouTube, hardware, and Google DeepMind artificial intelligence systems globally."
  },
  {
    id: 5,
    ticker_symbol: "AMZN",
    company_name: "Amazon.com, Inc.",
    company_logo_url: "https://img.logo.dev/amazon.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 232.69,
    price_change_24h: -0.05,
    market_cap: "$2.50T",
    volume_24h: "241.2M",
    exchange: "NASDAQ",
    category: "Consumer",
    description: "Amazon focuses on retail e-commerce, cloud computing through AWS, online advertising, digital streaming, and artificial intelligence solutions."
  },
  {
    id: 6,
    ticker_symbol: "TSLA",
    company_name: "Tesla, Inc.",
    company_logo_url: "https://img.logo.dev/tesla.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 379.71,
    price_change_24h: -3.05,
    market_cap: "$1.43T",
    volume_24h: "48.5M",
    exchange: "NASDAQ",
    category: "Automotive",
    description: "Tesla designs, develops, manufactures, and sells electric vehicles, energy storage systems, solar roofs, and humanoid robotics."
  },
  {
    id: 7,
    ticker_symbol: "META",
    company_name: "Meta Platforms, Inc.",
    company_logo_url: "https://img.logo.dev/meta.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 550.25,
    price_change_24h: 0.26,
    market_cap: "$1.40T",
    volume_24h: "18.4M",
    exchange: "NASDAQ",
    category: "Tech",
    description: "Meta builds technologies that help people connect, find communities, and grow businesses across Facebook, Instagram, WhatsApp, Threads, and Meta Quest."
  },
  {
    id: 8,
    ticker_symbol: "AVGO",
    company_name: "Broadcom Inc.",
    company_logo_url: "https://img.logo.dev/broadcom.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 365.02,
    price_change_24h: 2.00,
    market_cap: "$1.74T",
    volume_24h: "34.1M",
    exchange: "NASDAQ",
    category: "Semiconductor",
    description: "Broadcom designs, develops, and supplies semiconductor and infrastructure software solutions powering data center networking, broadband, and enterprise software."
  },
  {
    id: 9,
    ticker_symbol: "MU",
    company_name: "Micron Technology, Inc.",
    company_logo_url: "https://img.logo.dev/micron.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 132.33,
    price_change_24h: 3.49,
    market_cap: "$147.8B",
    volume_24h: "84.4M",
    exchange: "NASDAQ",
    category: "Semiconductor",
    description: "Micron is an industry leader in innovative memory and storage solutions that transform how the world uses information to enrich life for all."
  },
  {
    id: 10,
    ticker_symbol: "AMD",
    company_name: "Advanced Micro Devices, Inc.",
    company_logo_url: "https://img.logo.dev/amd.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 161.58,
    price_change_24h: 2.18,
    market_cap: "$261.2B",
    volume_24h: "62.4M",
    exchange: "NASDAQ",
    category: "Semiconductor",
    description: "AMD develops high-performance computing, graphics, and visualization technologies including Ryzen processors, Radeon GPUs, and EPYC server CPUs."
  },
  {
    id: 11,
    ticker_symbol: "JPM",
    company_name: "JPMorgan Chase & Co.",
    company_logo_url: "https://img.logo.dev/jpmorganchase.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 229.05,
    price_change_24h: 0.84,
    market_cap: "$652.8B",
    volume_24h: "14.2M",
    exchange: "NYSE",
    category: "Finance",
    description: "JPMorgan Chase & Co. is a leading financial services firm offering investment banking, asset management, treasury, and commercial banking."
  },
  {
    id: 12,
    ticker_symbol: "V",
    company_name: "Visa Inc.",
    company_logo_url: "https://img.logo.dev/visa.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 306.23,
    price_change_24h: 0.42,
    market_cap: "$612.4B",
    volume_24h: "9.8M",
    exchange: "NYSE",
    category: "Finance",
    description: "Visa operates the worlds largest retail electronic payments network connecting consumers, merchants, financial institutions, and government entities."
  },
  {
    id: 13,
    ticker_symbol: "WMT",
    company_name: "Walmart Inc.",
    company_logo_url: "https://img.logo.dev/stock.walmart.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 85.69,
    price_change_24h: 0.65,
    market_cap: "$688.5B",
    volume_24h: "22.3M",
    exchange: "NYSE",
    category: "Consumer",
    description: "Walmart operates retail, wholesale, and e-commerce units across the globe, offering products and services at everyday low prices."
  },
  {
    id: 14,
    ticker_symbol: "NFLX",
    company_name: "Netflix, Inc.",
    company_logo_url: "https://img.logo.dev/netflix.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 683.81,
    price_change_24h: 1.74,
    market_cap: "$294.2B",
    volume_24h: "5.1M",
    exchange: "NASDAQ",
    category: "Consumer",
    description: "Netflix provides entertainment streaming services with television series, documentaries, feature films, and mobile games across multiple genres."
  },
  {
    id: 15,
    ticker_symbol: "PLTR",
    company_name: "Palantir Technologies Inc.",
    company_logo_url: "https://img.logo.dev/palantir.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 42.93,
    price_change_24h: 5.62,
    market_cap: "$96.4B",
    volume_24h: "78.2M",
    exchange: "NYSE",
    category: "Tech",
    description: "Palantir builds software platforms for big data analysis, including Palantir Gotham, Palantir Foundry, and the Artificial Intelligence Platform (AIP)."
  },
  {
    id: 16,
    ticker_symbol: "LLY",
    company_name: "Eli Lilly and Company",
    company_logo_url: "https://img.logo.dev/lilly.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 898.12,
    price_change_24h: 1.34,
    market_cap: "$852.1B",
    volume_24h: "3.8M",
    exchange: "NYSE",
    category: "Healthcare",
    description: "Eli Lilly discovers, develops, and delivers medicines that make life better across diabetes, obesity, oncology, immunology, and neuroscience."
  },
  {
    id: 17,
    ticker_symbol: "INTC",
    company_name: "Intel Corporation",
    company_logo_url: "https://img.logo.dev/intel.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 24.32,
    price_change_24h: -1.45,
    market_cap: "$104.2B",
    volume_24h: "49.1M",
    exchange: "NASDAQ",
    category: "Semiconductor",
    description: "Intel designs and manufactures microprocessors, chipsets, and foundry semiconductors powering client computing, data centers, and network edge systems."
  },
  {
    id: 18,
    ticker_symbol: "XOM",
    company_name: "Exxon Mobil Corporation",
    company_logo_url: "https://img.logo.dev/corporate.exxonmobil.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 116.54,
    price_change_24h: 0.12,
    market_cap: "$520.4B",
    volume_24h: "16.8M",
    exchange: "NYSE",
    category: "Energy",
    description: "ExxonMobil explores for and produces crude oil and natural gas, and manufactures and transports petroleum products, petrochemicals, and specialty chemicals."
  },
  {
    id: 19,
    ticker_symbol: "COST",
    company_name: "Costco Wholesale Corporation",
    company_logo_url: "https://img.logo.dev/costco.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 912.54,
    price_change_24h: 0.95,
    market_cap: "$404.1B",
    volume_24h: "2.4M",
    exchange: "NASDAQ",
    category: "Consumer",
    description: "Costco operates membership warehouses that offer low prices on a limited selection of nationally branded and private-label products."
  },
  {
    id: 20,
    ticker_symbol: "GS",
    company_name: "The Goldman Sachs Group",
    company_logo_url: "https://img.logo.dev/goldmansachs.com?token=pk_YyrD1taGSRm1CfFTQh3K-w",
    current_price: 519.61,
    price_change_24h: 1.18,
    market_cap: "$168.2B",
    volume_24h: "2.9M",
    exchange: "NYSE",
    category: "Finance",
    description: "Goldman Sachs provides investment banking, securities trading, asset management, and prime brokerage services to corporations, financial institutions, and individuals."
  }
];

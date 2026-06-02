import { Company, ConcallSummary, SavedScreen, QuestionPack } from '../types';

export interface MetricDefinition {
  key: string;
  label: string;
  group: 'Profitability' | 'Growth' | 'Leverage' | 'Valuation';
  desc: string;
  min: number;
  max: number;
}

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    key: 'roce',
    label: 'ROCE TTM',
    group: 'Profitability',
    desc: 'Return on Capital Employed, trailing 12 months: measures capital efficiency.',
    min: 0,
    max: 100,
  },
  {
    key: 'peTtm',
    label: 'P/E Ratio (TTM)',
    group: 'Valuation',
    desc: 'Price-to-Earnings ratio, gauging current relative valuation multiple.',
    min: 2,
    max: 150,
  },
  {
    key: 'marketCapCr',
    label: 'Market Cap (INR Cr)',
    group: 'Valuation',
    desc: 'Total equity valuation in Crores (1 Cr = 10,000,000 INR).',
    min: 500,
    max: 2000000,
  },
  {
    key: 'revenueCagr3Y',
    label: 'Revenue CAGR 3Y',
    group: 'Growth',
    desc: '3-Year Compound Annual Growth Rate of topline sales revenue.',
    min: -20,
    max: 100,
  },
  {
    key: 'debtToEquity',
    label: 'Debt to Equity',
    group: 'Leverage',
    desc: 'Total interest-bearing debt relative to shareholder equity. Lower is safer.',
    min: 0,
    max: 5,
  },
];

export const mockCompanies: Company[] = [
  {
    id: 'reliance',
    ticker: 'RELIANCE',
    name: 'Reliance Industries Limited',
    sector: 'Conglomerate / Energy',
    exchange: 'NSE',
    price: 2434.50,
    changePercent: 1.45,
    marketCapCr: 1645000,
    peTtm: 24.8,
    roce: 11.5,
    revenueCagr3Y: 13.8,
    debtToEquity: 0.42,
    aiSignal: 'warning',
    aiSignalSummary: 'Substantial capital expenditure in retail/telecom is pulling down FCF despite margin expansions. Filing mismatches in narrative vs. numbers detected in energy subsidy disclosures.',
    anomalyCount: 2,
    anomalies: [
      {
        id: 'rel-a1',
        title: 'Capital Commitment & Narrative Mismatch',
        category: 'Narrative',
        severity: 'medium',
        description: 'Noticeable mismatch in narrative (claiming self-funding and peak Capex completed) vs actual subsequent numbers showing ₹12,000 Cr incremental revolving loans in Q4.',
        impact: 'Affects credibility of free cash flow projections for the next 2 quarters.',
        resolved: false,
      },
      {
        id: 'rel-a2',
        title: 'Energy Subsidy Accounting Reclassification',
        category: 'Accounting',
        severity: 'high',
        description: 'Government-back subsidies on specialized green-hydrogen inputs were listed under "Other Operating Income" instead of directly offsetting raw material expenses.',
        impact: 'Inflates gross profit margins by 115 bps while masking the true cost of production.',
        resolved: false,
      },
    ],
    financials: [
      { period: 'Q4 FY25', revenueCr: 215400, profitCr: 18950, cashflowCr: 14200, operatingMargin: 16.4, roce: 11.5 },
      { period: 'Q3 FY25', revenueCr: 208300, profitCr: 17800, cashflowCr: 13800, operatingMargin: 15.9, roce: 11.2 },
      { period: 'Q2 FY25', revenueCr: 198900, profitCr: 17200, cashflowCr: 12500, operatingMargin: 15.2, roce: 10.9 },
      { period: 'Q1 FY25', revenueCr: 201100, profitCr: 16800, cashflowCr: 11900, operatingMargin: 15.0, roce: 10.8 },
      { period: 'FY24', revenueCr: 812000, profitCr: 69500, cashflowCr: 54000, operatingMargin: 15.4, roce: 11.1 },
      { period: 'FY23', revenueCr: 715000, profitCr: 60200, cashflowCr: 48000, operatingMargin: 14.8, roce: 10.5 },
    ],
    unitEconomics: [
      {
        period: 'Q4 FY25',
        metrics: [
          { label: 'Jio ARPU (Average Revenue Per User)', value: '₹181.7', trend: 'up' },
          { label: 'Telecom Subscribers', value: '47.2 Cr', trend: 'up' },
          { label: 'Retail Footprint Area', value: '7.8 Cr sqft', trend: 'up' },
          { label: 'Refining Margin per barrel', value: '$9.4', trend: 'down' },
        ],
      },
    ],
  },
  {
    id: 'tcs',
    ticker: 'TCS',
    name: 'Tata Consultancy Services Limited',
    sector: 'IT Services',
    exchange: 'NSE',
    price: 3840.00,
    changePercent: 0.82,
    marketCapCr: 1404000,
    peTtm: 29.4,
    roce: 42.5,
    revenueCagr3Y: 10.2,
    debtToEquity: 0.02,
    aiSignal: 'positive',
    aiSignalSummary: 'Industry-leading EBIT margins sustained at 26%. AI bookings represent $1.2B of TCV, leading full transition pipelines. High shareholder payouts secured by 98% cash-to-income conversion.',
    anomalyCount: 0,
    anomalies: [],
    financials: [
      { period: 'Q4 FY25', revenueCr: 61230, profitCr: 12430, cashflowCr: 12100, operatingMargin: 26.2, roce: 42.5 },
      { period: 'Q3 FY25', revenueCr: 60500, profitCr: 12050, cashflowCr: 11800, operatingMargin: 25.8, roce: 41.9 },
      { period: 'Q2 FY25', revenueCr: 59600, profitCr: 11900, cashflowCr: 11500, operatingMargin: 25.5, roce: 41.5 },
      { period: 'Q1 FY25', revenueCr: 58200, profitCr: 11400, cashflowCr: 11100, operatingMargin: 25.1, roce: 41.0 },
      { period: 'FY24', revenueCr: 240800, profitCr: 46100, cashflowCr: 45200, operatingMargin: 25.6, roce: 41.8 },
      { period: 'FY23', revenueCr: 225400, profitCr: 42100, cashflowCr: 41000, operatingMargin: 24.9, roce: 39.8 },
    ],
    unitEconomics: [
      {
        period: 'Q4 FY25',
        metrics: [
          { label: 'Order Book TCV', value: '$13.2 Billion', trend: 'up' },
          { label: 'IT Attrition Rate LTM', value: '11.8%', trend: 'down' },
          { label: 'Utilization Level (ex-trainees)', value: '84.5%', trend: 'up' },
          { label: 'Share of Offshore Revenue', value: '56.2%', trend: 'flat' },
        ],
      },
    ],
  },
  {
    id: 'hdfc',
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    sector: 'Banking & Financials',
    exchange: 'NSE',
    price: 1545.20,
    changePercent: -0.35,
    marketCapCr: 1175000,
    peTtm: 18.2,
    roce: 16.8,
    revenueCagr3Y: 22.5,
    debtToEquity: 1.15,
    aiSignal: 'positive',
    aiSignalSummary: 'Post-merger Net Interest Margins stabilize at 3.9%. NIM compression has arrested, and credit costs are consistent under long-term averages. Provision coverage exceeds 75%.',
    anomalyCount: 1,
    anomalies: [
      {
        id: 'hdfc-a1',
        title: 'NIM Stabilization Timeline Recalculation',
        category: 'Filing',
        severity: 'low',
        description: 'Correction in Annexure 4 detailing cost of deposits where average funding rate was stated as 6.2% in the footnote but plotted as 6.4% in the Q2 chart.',
        impact: 'Minor indexing typo without cash impact. Already flagged to exchange.',
        resolved: true,
      },
    ],
    financials: [
      { period: 'Q4 FY25', revenueCr: 47200, profitCr: 16800, cashflowCr: 15200, operatingMargin: 42.1, roce: 16.8 },
      { period: 'Q3 FY25', revenueCr: 46100, profitCr: 16300, cashflowCr: 14800, operatingMargin: 41.9, roce: 16.5 },
      { period: 'Q2 FY25', revenueCr: 44900, profitCr: 15900, cashflowCr: 14200, operatingMargin: 41.2, roce: 16.2 },
      { period: 'Q1 FY25', revenueCr: 43800, profitCr: 15200, cashflowCr: 13900, operatingMargin: 40.8, roce: 16.0 },
      { period: 'FY24', revenueCr: 178500, profitCr: 64100, cashflowCr: 58000, operatingMargin: 41.5, roce: 16.4 },
      { period: 'FY23', revenueCr: 142000, profitCr: 46000, cashflowCr: 42000, operatingMargin: 40.2, roce: 15.9 },
    ],
    unitEconomics: [
      {
        period: 'Q4 FY25',
        metrics: [
          { label: 'Net Interest Margin (NIM)', value: '3.91%', trend: 'flat' },
          { label: 'Gross NPA (Non-Performing Assets)', value: '1.24%', trend: 'down' },
          { label: 'CASA Ratio (Deposits base)', value: '38.2%', trend: 'up' },
          { label: 'Cost-to-Income Ratio', value: '40.5%', trend: 'down' },
        ],
      },
    ],
  },
  {
    id: 'infosys',
    ticker: 'INFY',
    name: 'Infosys Limited',
    sector: 'IT Services',
    exchange: 'NSE',
    price: 1412.00,
    changePercent: -2.10,
    marketCapCr: 585000,
    peTtm: 22.4,
    roce: 35.8,
    revenueCagr3Y: 9.5,
    debtToEquity: 0.03,
    aiSignal: 'negative',
    aiSignalSummary: 'Severe margin pressure from low-margin legacy renewals and deferred tech spend in North America. Generative AI revenue conversion delayed. Discrepancies in sub-contractor utilization.',
    anomalyCount: 3,
    anomalies: [
      {
        id: 'infy-a1',
        title: 'Sub-contractor Costs vs Narrative',
        category: 'Narrative',
        severity: 'high',
        description: 'Management assured the board that sub-contracting expenses dropped by 200 bps as part of an optimization drive, yet "Other Manufacturing and Service Costs" rose by ₹1,400 Cr in identical categories.',
        impact: 'Masks operational overhead; indicates gaps in delivery efficiency and staff matching.',
        resolved: false,
      },
      {
        id: 'infy-a2',
        title: 'Unbilled Revenue Capitalization Rate',
        category: 'Accounting',
        severity: 'medium',
        description: 'Unbilled revenue ballooned by 26% year-over-year while final billings only increased 4.4%. This points to aggressive booking timelines or project milestone disputes.',
        impact: 'Risk of future write-downs if client approvals stall on large system deliveries.',
        resolved: false,
      },
      {
        id: 'infy-a3',
        title: 'Geographic Contribution Footnote Error',
        category: 'Filing',
        severity: 'medium',
        description: 'The sum of geographic segments (North America, Europe, India, Rest) adds up to 102.4% of consolidated revenue due to double-inclusion of digital consulting hubs.',
        impact: 'Internal control inconsistency. Triggers exchange queries.',
        resolved: false,
      },
    ],
    financials: [
      { period: 'Q4 FY25', revenueCr: 38100, profitCr: 6100, cashflowCr: 5800, operatingMargin: 20.1, roce: 35.8 },
      { period: 'Q3 FY25', revenueCr: 37900, profitCr: 6210, cashflowCr: 5900, operatingMargin: 20.5, roce: 36.1 },
      { period: 'Q2 FY25', revenueCr: 37100, profitCr: 6050, cashflowCr: 5500, operatingMargin: 20.3, roce: 35.9 },
      { period: 'Q1 FY25', revenueCr: 36800, profitCr: 5980, cashflowCr: 5200, operatingMargin: 19.8, roce: 35.2 },
      { period: 'FY24', revenueCr: 153670, profitCr: 26230, cashflowCr: 24100, operatingMargin: 20.7, roce: 37.2 },
      { period: 'FY23', revenueCr: 146700, profitCr: 24120, cashflowCr: 22800, operatingMargin: 21.1, roce: 38.5 },
    ],
    unitEconomics: [
      {
        period: 'Q4 FY25',
        metrics: [
          { label: 'Active Clients Count', value: '1,864', trend: 'flat' },
          { label: 'H1B/L1 Onsite Ratio', value: '41.2%', trend: 'flat' },
          { label: 'Sub-contracting Cost % Revenue', value: '8.4%', trend: 'up' },
          { label: 'Attrition (LTM)', value: '14.2%', trend: 'down' },
        ],
      },
    ],
  },
  {
    id: 'itc',
    ticker: 'ITC',
    name: 'ITC Limited',
    sector: 'FMCG / Diversified',
    exchange: 'NSE',
    price: 432.15,
    changePercent: 1.12,
    marketCapCr: 538000,
    peTtm: 26.1,
    roce: 38.2,
    revenueCagr3Y: 8.9,
    debtToEquity: 0.01,
    aiSignal: 'positive',
    aiSignalSummary: 'Paperboards and Agribusiness divisions revive margins. FMCG margins up by 80 bps. Excellent dividend yield profile of 3.8% backed by extensive free cash flows from traditional lines.',
    anomalyCount: 0,
    anomalies: [],
    financials: [
      { period: 'Q4 FY25', revenueCr: 18100, profitCr: 5120, cashflowCr: 4900, operatingMargin: 36.8, roce: 38.2 },
      { period: 'Q3 FY25', revenueCr: 17800, profitCr: 5040, cashflowCr: 4850, operatingMargin: 36.5, roce: 37.9 },
      { period: 'Q2 FY25', revenueCr: 17200, profitCr: 4920, cashflowCr: 4700, operatingMargin: 35.9, roce: 37.1 },
      { period: 'Q1 FY25', revenueCr: 16900, profitCr: 4800, cashflowCr: 4600, operatingMargin: 35.4, roce: 36.8 },
      { period: 'FY24', revenueCr: 69800, profitCr: 20400, cashflowCr: 18900, operatingMargin: 35.8, roce: 37.4 },
      { period: 'FY23', revenueCr: 65200, profitCr: 18700, cashflowCr: 17500, operatingMargin: 34.9, roce: 36.1 },
    ],
    unitEconomics: [
      {
        period: 'Q4 FY25',
        metrics: [
          { label: 'Cigarettes Volume Growth YoY', value: '4.2%', trend: 'up' },
          { label: 'FMCG Direct Reach (Towns)', value: '2.5 Million', trend: 'up' },
          { label: 'Hotel Occupancy Rates', value: '72.4%', trend: 'up' },
          { label: 'Paperboard Realization/Ton', value: '₹142,000', trend: 'flat' },
        ],
      },
    ],
  },
];

export const mockConcallSummaries: ConcallSummary[] = [
  {
    id: 'reliance-q425',
    companyId: 'reliance',
    companyName: 'Reliance Industries Limited',
    period: 'Q4 FY25',
    date: '2025-05-18',
    executiveSummary: 'Reliance detailed strong EBITDA momentum in the retail and telecom subsidiaries, offset by weak petrochemical and refining crack spreads. Capex cycles are entering a consolidation phase with major green asset launches.',
    keyTakeaways: [
      'Jio margins increased to 52.8% backed by tariff hikes.',
      'Refining crack spreads declined to $9.4 per barrel due to global crude inventory supply balances.',
      'A ₹12,000 Cr re-financing loan was taken, adding minor leverage but ensuring long maturities.',
      'Retail square footage execution is tapering as Focus shifts to unit operations monetization.'
    ],
    guidanceSummary: 'The company expects telecom ARPU to touch ₹190 by Q3 FY26 and target 2,000 standalone AI server points operational by end of FY26.',
    qaSummaries: [
      {
        analyst: 'Devendra Joshi',
        firm: 'Kotak Institutional Equities',
        question: 'Could you explain the discrepancy of ₹12,000 Cr in loans added in Q4 despite earlier guidance of completing capex and funding projects internally?',
        answer: 'The ₹12,000 Cr is a tactical revolving facility aimed at pre-funding a block of international green fuel imports, taking advantage of current sub-LIBOR curves. This is not structural capex expansion and will self-liquidate within 180 days.',
        sentiment: 'neutral'
      },
      {
        analyst: 'Neha Shah',
        firm: 'Morgan Stanley',
        question: 'Are there any plans to spin off the retail sector or launch an alternative Jio IPO in late FY26?',
        answer: 'We evaluate all structural models to unlock shareholder value. However, our main priority for the near term is consolidating the massive capital investments in digital and infrastructure into cash generation channels.',
        sentiment: 'positive'
      },
    ],
  },
  {
    id: 'tcs-q425',
    companyId: 'tcs',
    companyName: 'Tata Consultancy Services Limited',
    period: 'Q4 FY25',
    date: '2025-04-12',
    executiveSummary: 'TCS registered an impressive set of figures with EBIT margin standing firm. The double-digit attrition reduction indicates successful talent retention post salary hikes.',
    keyTakeaways: [
      'Secured record full pipeline of $13.2B TCV, indicating enterprise digitization remains strong.',
      'AI deals now form a significant part of the portfolio at $1.2B active bookings.',
      'Operational margin expanded by 40 bps to 26.2%.',
      'Free Cash Flow conversion hit 98% of overall Net Profit.'
    ],
    guidanceSummary: 'Outlook for FY26 points to a 9-11% USD revenue growth, backed by expansion in the UK and European telecom sectors.',
    qaSummaries: [
      {
        analyst: 'Sandeep Bansal',
        firm: 'JP Morgan',
        question: 'What is the share of GenAI contracts that are standalone consulting packages versus actual enterprise deployment at scale?',
        answer: 'Over 65% of the $1.2B AI deal booking is now long-term system deployment. The initial pilot-only consulting phase is largely behind us, as major banks and manufacturing organizations commit real platform spends to production nodes.',
        sentiment: 'positive'
      }
    ],
  },
  {
    id: 'infosys-q425',
    companyId: 'infosys',
    companyName: 'Infosys Limited',
    period: 'Q4 FY25',
    date: '2025-04-15',
    executiveSummary: 'Infosys declared underwhelming Q4 earnings with margin pressures and deferred discretionary enterprise project starts. Sub-contracting expenses remains elevated.',
    keyTakeaways: [
      'Operating margin compressed to 20.1% due to specialized onsite delivery retention fees.',
      'North American discretionary software budgets remain constrained, stalling digital projects.',
      'Active clients was flat at 1,864, with low net new wins.',
      'Unbilled receivables increased significantly, putting pressure on short-term working capital.'
    ],
    guidanceSummary: 'Slowing guidance of 3-5% for FY26, suggesting deep caution in active banking verticals.',
    qaSummaries: [
      {
        analyst: 'Rohan Deshmukh',
        firm: 'ICICI Securities',
        question: 'Why did sub-contractor fees grow as a percentage of revenue despite the strategic cost optimization roadmap aiming to replace them?',
        answer: 'We had temporary talent shortages in high-end cybersecurity and generative model training units in our European nodes. We chose to absorb higher contractor pricing to meet client delivery deadlines rather than risk penalties. This is a temporary friction that will transition to full-time employees in Q2.',
        sentiment: 'negative'
      }
    ],
  }
];

export const DEFAULT_SAVED_SCREENS: SavedScreen[] = [
  {
    id: 'scr-1',
    name: 'Wealth Compounders (High ROCE)',
    description: 'Firms with return on capital employed exceeding 30% and conservative leverage levels under 0.1.',
    filters: [
      { metric: 'roce', operator: 'greater_than', value1: 30 },
      { metric: 'debtToEquity', operator: 'less_than', value1: 0.10 }
    ],
  },
  {
    id: 'scr-2',
    name: 'High-Value Growth Screen',
    description: 'Companies exhibiting steady 3Y top-line revenue CAGR > 10% trading under 30 P/E.',
    filters: [
      { metric: 'revenueCagr3Y', operator: 'greater_than', value1: 10 },
      { metric: 'peTtm', operator: 'less_than', value1: 30 }
    ],
  },
];

export const INITIAL_QUESTION_PACKS: QuestionPack[] = [
  {
    id: 'qp-rel-1',
    companyId: 'reliance',
    companyName: 'Reliance Industries Limited',
    dateCreated: '2026-06-01',
    questions: [
      { id: 'q-rel-1', text: 'Can you provide the expected amortization schedule of the ₹12,000 Cr short-term refinancing facility registered in Q4?', category: 'Opening' },
      { id: 'q-rel-2', text: 'What are the gross refining margin expectations given global inventory overhangs and how will this direct the oil-to-chemical segment allocation?', category: 'Probing' },
      { id: 'q-rel-3', text: 'Why are green-hydrogen input tax concessions reported as operational income and not directly deducted from raw materials cost? What is the regularized treatment going forward?', category: 'Follow-up' },
    ],
  },
  {
    id: 'qp-infy-1',
    companyId: 'infosys',
    companyName: 'Infosys Limited',
    dateCreated: '2026-05-28',
    questions: [
      { id: 'q-inf-1', text: 'With unbilled revenue rising 26% YoY, can you speak to the specific milestones delayed or billing disputes on current systems integration contracts?', category: 'Opening' },
      { id: 'q-inf-2', text: 'How will the €40M European cybersecurity project contractor dependency transition to cheaper onsite permanent staff, and what is the margin impact expected?', category: 'Probing' },
    ],
  }
];

export const mockLeaderboard = [
  { rank: 1, name: 'TCS (NSE)', label: 'Strongest Capital Conversion', signal: 'positive', score: 94 },
  { rank: 2, name: 'ITC (NSE)', label: 'FMCG Margin Expansion', signal: 'positive', score: 88 },
  { rank: 3, name: 'HDFC Bank (NSE)', label: 'Post-Merger NIM Stabilization', signal: 'positive', score: 85 },
  { rank: 4, name: 'Reliance (NSE)', label: 'Heavy Capex Drags Cashflows', signal: 'warning', score: 58 },
  { rank: 5, name: 'Infosys (NSE)', label: 'Revenue Growth Deferred', signal: 'negative', score: 41 },
];

export const mockNews = [
  {
    id: 'n-1',
    title: 'SEBI Proposes New Reporting Formats for Large Tech Conglomerates under iXBRL',
    source: 'Financial Express',
    time: '2 hours ago',
    tickers: ['TCS', 'INFY'],
    sentiment: 'neutral',
  },
  {
    id: 'n-2',
    title: 'Crude Crack Spreads Crack to Two-Year Lows; Refining Margins Squeezed',
    source: 'MoneyControl',
    time: '4 hours ago',
    tickers: ['RELIANCE'],
    sentiment: 'negative',
  },
  {
    id: 'n-3',
    title: 'FMCG Consumption Growth Shows Double-Digit Inroads Across Rural India',
    source: 'Economic Times',
    time: '1 day ago',
    tickers: ['ITC'],
    sentiment: 'positive',
  },
];

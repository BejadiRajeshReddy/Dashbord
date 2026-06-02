export interface Company {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  exchange: 'NSE' | 'BSE';
  price: number;
  changePercent: number;
  marketCapCr: number; // in Crores (Indian format)
  peTtm: number;
  roce: number; // percentage (e.g. 18.5)
  revenueCagr3Y: number; // percentage (e.g. 12.4)
  debtToEquity: number;
  aiSignal: 'positive' | 'warning' | 'negative';
  aiSignalSummary: string;
  anomalyCount: number;
  anomalies: Anomaly[];
  financials: FinancialPeriod[];
  unitEconomics: {
    period: string;
    metrics: { label: string; value: string; trend: 'up' | 'down' | 'flat' }[];
  }[];
}

export interface Anomaly {
  id: string;
  title: string;
  category: 'Narrative' | 'Accounting' | 'Filing';
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  resolved: boolean;
}

export interface FinancialPeriod {
  period: string; // e.g. "Q4 FY25", "FY25", "FY24"
  revenueCr: number;
  profitCr: number;
  cashflowCr: number;
  operatingMargin: number; // percentage
  roce: number;
}

export interface SavedScreen {
  id: string;
  name: string;
  description: string;
  filters: ScreenerFilter[];
}

export interface ScreenerFilter {
  metric: string;
  operator: 'greater_than' | 'less_than' | 'between';
  value1: number;
  value2?: number;
}

export interface ConcallSummary {
  id: string;
  companyId: string;
  companyName: string;
  period: string; // e.g. "Q4 FY25"
  date: string;
  executiveSummary: string;
  keyTakeaways: string[];
  guidanceSummary: string;
  qaSummaries: {
    analyst: string;
    firm: string;
    question: string;
    answer: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
}

export interface QuestionPack {
  id: string;
  companyId: string;
  companyName: string;
  dateCreated: string;
  questions: {
    id: string;
    text: string;
    category: 'Opening' | 'Probing' | 'Follow-up';
  }[];
}

export interface ValuationModel {
  companyId: string;
  targetWacc: number;
  gordonG: number;
  growthStage1: number;
  growthStage2: number;
  operatingMarginTarget: number;
  derivedValuePerShare: number;
  thesis: string;
  lastUpdated: string;
}

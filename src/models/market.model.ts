// ── Market data ────────────────────────────────────────────────

export interface MarketSnapshot {
  symbol:         string;
  displayName:    string;
  module:         number;
  price:          number;
  changePercent:  number;
  changeAbsolute: number;
  isBullish:      boolean;
  directionLabel: string;
  capturedAt:     string;
}

export interface PreMarketBriefing {
  briefingText:   string;
  snapshots:      MarketSnapshot[];
  sourceArticles: NewsArticle[];
  sourceNames:    string[];
  isBullish:      boolean;
  generatedAt:    string;
  validUntil:     string;
  tokensUsed:     number;
}

export interface SectorSentiment {
  sector:       string;
  bullishScore: number;
  overall:      number;  // 0=Bullish 1=Bearish 2=Neutral
  overallLabel: string;
  articleCount: number;
  computedAt:   string;
}

export interface SectorAnalysis {
  sector:          string;
  analysisText:    string;
  sentiment:       SectorSentiment;
  drivingNews:     NewsArticle[];
  topStocks:       TopStock[];
  crossAssetChain: CrossAssetChain;
  generatedAt:     string;
}

export interface TopStock {
  symbol:        string;
  price:         number;
  changePercent: number;
  aiSignal:      string;
}

export interface CrossAssetChain {
  steps:     ChainStep[];
  aiInsight: string;
}

export interface ChainStep {
  label:     string;
  direction: string;
  impact:    string;
}

export interface NewsArticle {
  id:              string;
  headline:        string;
  source:          string;
  url:             string;
  publishedAt:     string;
  sentiment:       number;
  sentimentScore:  number;
  affectedSectors: string[];
}

export interface FoSnapshot {
  symbol:        string;
  putCallRatio:  number;
  pcrSignal:     string;
  maxPain:       number;
  topStrikes:    OiStrike[];
  capturedAt:    string;
}

export interface OiStrike {
  strike:  number;
  callOI:  number;
  putOI:   number;
  signal:  string;
}

export interface WhyMarketMoved {
  date:           string;
  analysisText:   string;
  correlatedNews: NewsArticle[];
  keyMoves:       PriceEvent[];
  generatedAt:    string;
}

export interface PriceEvent {
  time:           string;
  priceAt:        number;
  changeFromOpen: number;
  possibleCause:  string;
}

// ── API envelope ───────────────────────────────────────────────

export interface ApiResponse<T> {
  success:   boolean;
  data:      T;
  error:     string | null;
  timestamp: string;
}

// ── SignalR payloads ───────────────────────────────────────────

export interface PriceUpdate {
  symbol:         string;
  displayName:    string;
  price:          number;
  changePercent:  number;
  changeAbsolute: number;
  isBullish:      boolean;
  directionLabel: string;
  updatedAt:      string;
}

export interface MarketStatus {
  isMarketOpen:   boolean;
  session:        string;
  nextEvent:      string;
  nextEventLabel: string;
}
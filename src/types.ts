export interface PortfolioStockSummary {
  portfolioid: number;
  tickersymbol: string;
  companyname: string;
  quantity: number;
  purchaseprice: number;
  totalinvestment: number;
  currentvalue: number;
  profitloss: number;
}

export interface Transaction {
  TransactionID: number;
  TransactionType: string;
  Quantity: number;
  TransactionPrice: number;
  TransactionDate: string;
  PortfolioID: number;
  TickerSymbol: string;
  CompanyName: string;
}

export interface StockPriceHistory {
  StockID: number;
  TickerSymbol: string;
  CompanyName: string;
  Date: string;
  OpenPrice: number;
  ClosePrice: number;
  HighPrice: number;
  LowPrice: number;
  Volume: number;
}

export interface PortfolioPerformance {
  PortfolioID: number;
  Username: string;
  TotalInvestment: number;
  TotalCurrentValue: number;
  TotalProfitLoss: number;
}
export interface IiflResponse<T> {
    type: string;
    code: string;
    description: string;
    result: T;// Array<OptionSymbolResult> | TokenResult | CandleResult;
  }
  
  export interface TokenResult {
    token: string;
    userID: string;
    appVersion: string;
  }
  
  export interface CandleResult {
    exchangeSegment: number;
    exchangeInstrumentID: string;
    dataReponse: string;
  }
  
  export interface OptionSymbolResult {
    ExchangeSegment: number;
    ExchangeInstrumentID: number;
    InstrumentType: number;
    Name: string;
    DisplayName: string;
    Description: string;
    Series: string;
    InstrumentID: number;
    PriceBand: PriceBand;
    FreezeQty: number;
    TickSize: number;
    LotSize: number;
    UnderlyingInstrumentId: number;
    UnderlyingIndexName: string;
    ContractExpiration: string;
    ContractExpirationString: string;
    RemainingExpiryDays: number;
    StrikePrice: number;
    OptionType: number;
  }
  
  interface PriceBand {
    High: number;
    Low: number;
    HighString: string;
    LowString: string;
    CreditRating: string;
  }

  export interface DerivativePair{
    ce: number;
    ceDisplayName: string;
    ceSL: string
    pe: number;
    peDisplayName: string
    peSL: string
  }
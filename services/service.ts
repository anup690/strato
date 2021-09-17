import moment from "moment";
import { CandleResult, OptionSymbolResult, TokenResult, IiflResponse, DerivativePair } from "../interfaces/interfaces";
import { secretObj } from "./secret";

function momentDate() {
  // return moment('13/09/2021','DD/MM/YYYY',true);//moment
  return moment();
}
function getExpiryDate(): string{
  const thisThursdayNo = 4;
  const nextThursdayNo = 11;
  const todayNo = momentDate().day();

  const thisThursday = momentDate().day(thisThursdayNo).format('DDMMMYYYY');
  const nextThursday = momentDate().day(nextThursdayNo).format('DDMMMYYYY');

  const expiryDate = (todayNo > thisThursdayNo) ? nextThursday : thisThursday;
  console.log('expiryDate', expiryDate);
  return expiryDate;
}

export const doLogin = async (): Promise<TokenResult> => {
  const body = secretObj;
  const response: IiflResponse<TokenResult> = await fetch(
    "https://ttblaze.iifl.com/apimarketdata/auth/login",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch((err) =>
      console.log("error", `Error received from login api: ${err}`)
    );
  return Promise.resolve(response?.result as TokenResult);
};

export const getCandleData = async (
  token: string,
  exchangeSegment: string,//1
  exchangeInstrumentID: string//NIFTY BANK
): Promise<CandleResult> => {
  const url =
    `https://ttblaze.iifl.com/apimarketdata/instruments/ohlc`+
    `?exchangeSegment=${exchangeSegment}`+
    `&exchangeInstrumentID=${exchangeInstrumentID}`+
    `&startTime=` + momentDate().format("MMM DD YYYY 093000") +
    `&endTime=` + momentDate().format("MMM DD YYYY 093500") +
    `&compressionValue=300`;

  const response: IiflResponse<CandleResult> = await fetch(url, {
    method: "GET",
    headers: { "content-type": "application/json", authorization: token },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(
        "NIFTY BANK candle data fetched success:" + JSON.stringify(res, undefined, 4)
      );
      return res;
    })
    .catch((err) =>
      console.log("error", `Error received from logout api: ${err}`)
    );
  return Promise.resolve(response?.result as CandleResult);
};

export const doLogout = async (token: string) => {
  const response: IiflResponse<any> = await fetch(
    "https://ttblaze.iifl.com/apimarketdata/auth/logout",
    {
      method: "DELETE",
      headers: { "content-type": "application/json", authorization: token },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      console.log("logged out successfully:" + JSON.stringify(res));
      return res;
    })
    .catch((err) =>
      console.log("error", `Error received from logout api: ${err}`)
    );
  return Promise.resolve(response?.result);
};

export const doGetOptionsSymbol = async (token: string, strikePrice: string, optionType: string): Promise<OptionSymbolResult> =>{
  const url =
    "https://ttblaze.iifl.com/apimarketdata/instruments/instrument/optionSymbol?" +
    "exchangeSegment=2" +
    "&series=OPTIDX" +
    "&symbol=BANKNIFTY" +
    "&expiryDate=" + getExpiryDate() +
    "&optionType=" + optionType +//CE/PE
    "&strikePrice="+ strikePrice;

  const response: IiflResponse<Array<OptionSymbolResult>> = await fetch(url, {
    method: "GET",
    headers: { "content-type": "application/json", authorization: token },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(
        "doGetOptionsSymbol fetched success:" + JSON.stringify(res, undefined, 4)
      );
      return res;
    })
    .catch((err) =>
      console.log("error", `Error received from logout api: ${err}`)
    );
  return Promise.resolve(response?.result?.[0] as OptionSymbolResult);
}

export function getStrikePrice(indexPrice: number): number{
  const indexPriceRound = Math.round(indexPrice);
  const indexPriceBy100 = indexPriceRound/100;
  const strikePrice = Math.round(indexPriceBy100)*100;

  return strikePrice;
}

export const doGetPutCallPrices = async (token: string, strikePrice: number): Promise<DerivativePair> =>{
  const optionSymbolResultCE: OptionSymbolResult = await doGetOptionsSymbol(token, String(strikePrice), 'CE')
  console.log('String(optionSymbolResultCE?.ExchangeInstrumentID)', String(optionSymbolResultCE?.ExchangeInstrumentID));
  const ceOpeningPrice = await getOpeningPrice(token, String(optionSymbolResultCE?.ExchangeInstrumentID));
  
  const optionSymbolResultPE: OptionSymbolResult = await doGetOptionsSymbol(token, String(strikePrice), 'PE')
  console.log('String(optionSymbolResultPE?.ExchangeInstrumentID)', String(optionSymbolResultPE?.ExchangeInstrumentID));
  const peOpeningPrice = await getOpeningPrice(token, String(optionSymbolResultPE?.ExchangeInstrumentID));
  const ceNumber = parseFloat(ceOpeningPrice)
  const peNumber = parseFloat(peOpeningPrice)

  const derivativePair: DerivativePair = 
  { 
    ce: ceNumber, 
    ceDisplayName: optionSymbolResultCE.DisplayName,
    ceSL: (ceNumber + (ceNumber * 0.35)).toFixed(2),
    pe: peNumber,
    peDisplayName: optionSymbolResultPE.DisplayName,
    peSL: (peNumber + (peNumber * 0.35)).toFixed(2),
  }
  return derivativePair
}

async function getOpeningPrice(token: string, instrumentID: string) : Promise<string>{
  const ceCandleData: CandleResult = await getCandleData(token, '2', instrumentID);
  const ce0930Price = getCandleDataInArray(ceCandleData?.dataReponse)?.[1];
  return Promise.resolve(ce0930Price);
}

export function getCandleDataInArray(pipeSeperatedString: string): string[] {
  return pipeSeperatedString.split('|')
}
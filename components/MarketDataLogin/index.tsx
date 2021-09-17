
import moment from "moment";
import router from "next/router";

import { useState } from "react"
import { CandleResult, DerivativePair, TokenResult } from "../../interfaces/interfaces"
import Loader from "../Loader";
import { doGetPutCallPrices, doLogin, doLogout, getCandleData, getCandleDataInArray, getStrikePrice } from "../../services/service";


export default () => {
  let fetchTime = '';
  let niftyBankCandleData!: CandleResult;
  const [candleArray, setCandleArray] = useState<Array<string>>([]);
  const [token, setToken] = useState<string>('');
  const [derivativePrices, setDerivativePrices] = useState<DerivativePair>();
  const [loading, setLoading] = useState<boolean>(false);
  let ceSL:number;
  let peSL:number;

  const getToken = async () => {
    setLoading(true);
    const result: TokenResult = await doLogin();
    console.log(result);
    setToken(result?.token);
    setLoading(false);
  }
  const handleLogout = () => {
    // setLoading(true);
    doLogout(token)
  }

  function handleCalculateSL() {
    router.push({
      pathname: `/SLpage`,
    });
  }
  const loginLogoutButton = () => {
    return <div className="button-container container px-4">
      <div className="row gx-2">
        <div className="col-4">
          <button className="p-2 btn btn-primary" onClick={getToken}>Get token</button>
        </div>
        <div className="col-4">
          <button className="p-2 btn btn-primary" onClick={handleCalculateSL}>Calculate SL</button>
        </div>
        {
          token ?
            <div className="col-4">
              <button className="p-2 btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
            : null
        }
      </div>
    </div>
  }

  const handleGetNiftyBank = async () => {
    setLoading(true);
    niftyBankCandleData = await getCandleData(token, '1', 'NIFTY BANK');
    console.log('niftyBankCandleData', niftyBankCandleData);
    const _candleArray = getCandleDataInArray(niftyBankCandleData.dataReponse);
    setCandleArray(_candleArray);

    fetchTime = moment.unix(parseInt(_candleArray?.[0])).format('hh:mm:ss');
    console.log('fetchTime:', fetchTime);
    console.log(niftyBankCandleData.exchangeInstrumentID, _candleArray?.[1]);
    setLoading(false);
  }

  const getDerivativePrices = async () => {
    setLoading(true);
    const _derivativePrices: DerivativePair = await doGetPutCallPrices(token, getStrikePrice(parseInt(candleArray?.[1])))
    setDerivativePrices(_derivativePrices);
    console.log('doGetPutCallPrices', JSON.stringify(_derivativePrices))
    const ceNumber = _derivativePrices.ce
    const peNumber = _derivativePrices.pe
    ceSL = ceNumber + (ceNumber * 0.35)
    peSL = ceNumber + (peNumber * 0.35)
    setLoading(false);
  }
  return (
    <div className="login">
      {loginLogoutButton()}

      {loading ? <Loader /> : null}
      {token ?
        <>
          <button className="get-nifty-bank btn btn-info" onClick={handleGetNiftyBank}>Get Nifty Bank</button>
          <p>options:</p>
          {candleArray ?
            <div>
              <div className="row">
                <p className="col-2">NIFTY BANK</p>
                <p className="col-2">{candleArray[1]}</p>
              </div>
              <div className="row">
                <p className="col-2">Strike Price:</p>
                <h3 className="col-2">{getStrikePrice(parseInt(candleArray[1]))}</h3>
              </div>
              <button className="get-derivative-price btn btn-info" onClick={getDerivativePrices}>Get derivative prices</button>
            </div>
            : null}
          <br />
          <br />
          {derivativePrices ?
          <div className="col">
            <div className="row">
              <div className="col">
                <p className="col-2">{derivativePrices.ceDisplayName} :</p>
                <h3 className="col-2">{derivativePrices.ce}</h3>
              </div>
              <div className="col">
                <p className="col-2">{derivativePrices.peDisplayName} :</p>
                <h3 className="col-2">{derivativePrices.pe}</h3>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <p className="col-2">CE SL price :</p>
                <h3 className="col-2">{derivativePrices?.ceSL}</h3>
              </div>
              <div className="col">
                <p className="col-2">PE SL price :</p>
                <h3 className="col-2">{derivativePrices?.peSL}</h3>
              </div>
            </div>
            </div>

            : null}
        </>
        :
        null
      }
    </div>
  )
}
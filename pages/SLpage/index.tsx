import { useState } from "react"


export default () => {
  const [price1, setPrice1] = useState<number>(0.00);
  const [price2, setPrice2] = useState<number>(0.00);

  const [optionPrice, setOptionPrice] = useState<number>(0.00);
  const [profitLoss, setProfitLoss] = useState<number>(0.00);

  console.log(`${price1} + ${price1} * 0.35`, price1 + price1 * 0.35);
  return (
    <div className="col">
      <h2 className="m-2">Calculate SL</h2>
      <div className="col">
        <div className="row">
          <input className="col-4" type="text" onChange={(e) => setPrice1(parseFloat(e.target.value))} />
          <p className="col-1 m-2">+35%</p>
          <h3 className="col-4 m-2 text-danger">{(price1 + price1 * 0.35).toFixed(2)}</h3>
        </div>
        <div className="row">
          <input className="col-4" type="text" onChange={(e) => setPrice2(parseFloat(e.target.value))} />
          <p className="col-1 m-2">+35%</p>
          <h3 className="col-4 m-2 text-danger">{(price2 + price2 * 0.35).toFixed(2)}</h3>
        </div>
      </div>

      <h2 className="m-2">Loss cap</h2>

<div className="col">

      <div className="row mt-4">
        <p className="col-4 col-centered">Option price:</p>
        <input className="col-4" type="text" onChange={(e) => setOptionPrice(parseFloat(e.target.value))}/>
      </div>
      <div className="row">
        <p className="col-4 col-centered">P/L:</p>
        <input className="col-4" type="text" onChange={(e) => setProfitLoss(parseFloat(e.target.value))}/>
        <p className="col col-centered">+2500/25</p>
      </div>
      <div className="row">
        <p className="col-4 col-centered">Cap price: </p>
        <h3 className="col-4 text-center">{((2500+profitLoss)/25)+optionPrice}</h3>
      </div>
</div>
    </div>
  )
}
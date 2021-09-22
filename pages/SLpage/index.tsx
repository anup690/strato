import { useState } from "react"


export default () => {
  const [price1, setPrice1] = useState<number>(0.00);
  const [price2, setPrice2] = useState<number>(0.00);

  console.log(`${price1} + ${price1} * 0.35`, price1 + price1 * 0.35);
  return (
    <div className="">
      <h2 className="m-2">Calculate SL</h2>
      <div className="col">
        <div className="row">
            <input className="col-2" type="text" onChange={(e) => setPrice1(parseFloat(e.target.value))} />
            <p className="col-1 m-2">+35%</p> 
          <h3 className="col-2 m-2 text-danger">{(price1 + price1 * 0.35).toFixed(2)}</h3>
        </div>
        <div className="row">
          <input className="col-2" type="text" onChange={(e) => setPrice2(parseFloat(e.target.value))} />
          <p className="col-1 m-2">+35%</p> 
          <h3 className="col-2 m-2 text-danger">{(price2 + price2 * 0.35).toFixed(2)}</h3>
        </div>
      </div>
    </div>
  )
}
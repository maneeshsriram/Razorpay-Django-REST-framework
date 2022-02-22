import Axios from "axios";
import React, { useState } from "react";
import { server } from "./server";

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handlePaymentSuccess = async (response) => {
    try {
      let bodyData = new FormData();

      bodyData.append("response", JSON.stringify(response));

      await Axios({
        url: `${server}/razorpay/payment/success/`,
        method: "POST",
        data: bodyData,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("Everything is OK!");
          setName("");
          setAmount("");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(console.error());
    }
  };

  const popup = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const showRazorpay = async () => {
    const res = await popup();

    let bodyData = new FormData();

    bodyData.append("amount", amount.toString());
    bodyData.append("name", name);

    const data = await Axios({
      url: `${server}/razorpay/pay/`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: bodyData,
    }).then((res) => {
      return res;
    });


    var options = {
      key_id: process.env.REACT_APP_PUBLIC_KEY,
      key_secret: process.env.REACT_APP_SECRET_KEY,
      amount: data.data.payment.amount,
      currency: "INR",
      name: "ManSite",
      description: "Test transaction",
      image: "", // add image url
      order_id: data.data.payment.id,
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: "User's name",
        email: "User's email",
        contact: "User's phone",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="container my-5">
      <form>
        <h1>Payment</h1>

        <div className="form-group">
          <label htmlFor="name">Product name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Amount</label>
          <input
            type="text"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </form>
      <button onClick={showRazorpay} className="btn btn-primary btn-block">
        Pay with razorpay
      </button>
    </div>
  );
}

export default App;

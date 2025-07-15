import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useAuth } from "../AuthProvider/useAuth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const stripe = useStripe();
  const elements = useElements();

  const paymentInfo = location.state;
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (paymentInfo?.packagePrice) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
          amount: paymentInfo.packagePrice * 100,
        })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        })
        .catch(err => {
          console.error(err);
          setMessage("Failed to initialize payment");
        });
    }
  }, [paymentInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);

    const card = elements.getElement(CardElement);
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (error) {
      setMessage(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      setMessage("Payment Successful!");

      try {
       await axios.post(`${import.meta.env.VITE_API_URL}/save-payment`, {
            trainerId: paymentInfo.trainerId,
            trainerName: paymentInfo.trainerName,
            trainerEmail: paymentInfo.trainerEmail,
            slotDay: paymentInfo.slotName.split(" ")[0],           // day (e.g., Mon)
            slotTime: paymentInfo.slotName.split(" ").slice(1).join(" "), // time (e.g., 10:00 AM)
            className: paymentInfo.className,
            packageId: paymentInfo.packageId,
            packageName: paymentInfo.packageName,
            packagePrice: paymentInfo.packagePrice,
            userName: user?.name || user?.displayName,
            userEmail: user?.email,
            paymentIntentId: paymentIntent.id,
          });

        // navigate("/dashboard/booked-trainers");
      } catch (err) {
        console.error("Saving payment failed:", err);
      }

      setProcessing(false);
    }
  };

  if (!paymentInfo || !user) {
    return <p className="text-center mt-20 text-yellow-400">Invalid Payment Request</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-black rounded-md font-sans">
      <h1 className="text-3xl font-bold text-[#faba22] text-center mb-6">Confirm Your Payment</h1>

      <div className="space-y-2 text-white mb-6">
        <p><span className="text-[#faba22] font-semibold">Trainer:</span> {paymentInfo.trainerName}</p>
        <p><span className="text-[#faba22] font-semibold">Slot:</span> {paymentInfo.slotDay}, {paymentInfo.slotTime}</p>
        <p><span className="text-[#faba22] font-semibold">Package:</span> {paymentInfo.packageName} (${paymentInfo.packagePrice})</p>
        <p><span className="text-[#faba22] font-semibold">Your Name:</span> {user?.name || user?.displayName}</p>
        <p><span className="text-[#faba22] font-semibold">Your Email:</span> {user?.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-gray-800 rounded">
          <CardElement options={{ style: { base: { color: "#ffffff" } } }} />
        </div>

        <button
          disabled={!stripe || processing}
          className="w-full py-3 rounded bg-[#faba22] text-black font-bold text-lg hover:bg-yellow-600 transition-colors"
        >
          {processing ? "Processing..." : `Pay $${paymentInfo.packagePrice}`}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-yellow-400">{message}</p>}
    </div>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentPage;

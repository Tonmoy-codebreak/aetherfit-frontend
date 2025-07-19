import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { useAuth } from "../AuthProvider/useAuth";
import useAxios from "../hooks/useAxios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  useEffect(() => {
    document.title = "Payment Ongoing";
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const stripe = useStripe();
  const elements = useElements();

  const paymentInfo = location.state;
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (paymentInfo?.packagePrice) {
      axiosSecure
        .post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
          amount: paymentInfo.packagePrice * 100,
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        })
        .catch((err) => {
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
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: `Your payment of $${paymentInfo.packagePrice} for ${paymentInfo.packageName} is complete.`,
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      }).then(() => {
        navigate("/");
      });

      try {
        await axiosSecure.post(`${import.meta.env.VITE_API_URL}/save-payment`, {
          trainerId: paymentInfo.trainerId,
          trainerName: paymentInfo.trainerName,
          trainerEmail: paymentInfo.trainerEmail,
          slotDay: paymentInfo.slotName.split(" ")[0],
          slotTime: paymentInfo.slotName.split(" ").slice(1).join(" "),
          className: paymentInfo.className,
          packageId: paymentInfo.packageId,
          packageName: paymentInfo.packageName,
          packagePrice: paymentInfo.packagePrice,
          userName: user?.name || user?.displayName,
          userEmail: user?.email,
          paymentIntentId: paymentIntent.id,
          classId: paymentInfo.classId,
        });
      } catch (err) {
        console.error("Saving payment failed:", err);
        Swal.fire({
          icon: "error",
          title: "Booking Error",
          text: "Payment was successful, but there was an issue logging your booking. Please contact support.",
          background: "black",
          color: "#faba22",
          confirmButtonColor: "#faba22",
        });
      }

      setProcessing(false);
    }
  };

  if (!paymentInfo || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <p className="text-center text-yellow-400 text-lg sm:text-xl font-semibold">Invalid Payment Request. Please go back.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-lg md:max-w-xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#faba22] text-center mb-6 font-funnel drop-shadow-lg leading-tight">
          Confirm Your Payment
        </h1>

        <div className="bg-zinc-800 rounded-xl p-4 sm:p-6 mb-6 border border-zinc-700 shadow-inner space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 text-center">Order Summary</h2>

          {[
            { label: "Trainer", value: paymentInfo.trainerName },
            { label: "Slot", value: paymentInfo.slotName },
            { label: "Class", value: paymentInfo.className || "N/A" },
            { label: "Membership", value: paymentInfo.packageName },
          ].map((item, i) => (
            <p key={i} className="text-zinc-300 text-sm sm:text-lg flex justify-between items-center">
              <span className="font-semibold text-[#faba22]">{item.label}:</span>
              <span className="text-white">{item.value}</span>
            </p>
          ))}

          <div className="border-t border-zinc-700 pt-4 mt-4 flex justify-between items-center">
            <p className="text-xl sm:text-2xl font-bold text-[#faba22]">Total Amount:</p>
            <p className="text-xl sm:text-2xl font-bold text-white">${paymentInfo.packagePrice}</p>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-xl p-4 sm:p-6 mb-6 border border-zinc-700 shadow-inner space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 text-center">Your Details</h2>
          {[
            { label: "Name", value: user?.name || user?.displayName || "N/A" },
            { label: "Email", value: user?.email || "N/A" },
          ].map((item, i) => (
            <p key={i} className="text-zinc-300 text-sm sm:text-lg flex justify-between items-center">
              <span className="font-semibold text-[#faba22]">{item.label}:</span>
              <span className="text-white break-all text-right">{item.value}</span>
            </p>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 sm:p-5 bg-zinc-800 rounded-xl border border-zinc-700 shadow-md">
            <label htmlFor="card-element" className="block text-zinc-300 text-base sm:text-lg font-semibold mb-3">
              Card Details
            </label>
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    color: "#ffffff",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    "::placeholder": {
                      color: "#a1a1aa",
                    },
                  },
                  invalid: {
                    color: "#ef4444",
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>

          <button
            disabled={!stripe || processing}
            className="w-full py-4 rounded-xl bg-[#faba22] text-black font-bold text-lg sm:text-xl
                       hover:bg-yellow-500 transition-colors duration-300 shadow-lg hover:shadow-xl
                       transform hover:-translate-y-1 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Pay $${paymentInfo.packagePrice}`
            )}
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 text-center text-sm sm:text-lg font-semibold ${
              message.includes("Successful") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentPage;

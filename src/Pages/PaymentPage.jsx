import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import Swal from "sweetalert2"; // Import SweetAlert2
import { useAuth } from "../AuthProvider/useAuth";
import useAxios from "../hooks/useAxios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxios()

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

        // Add this line to console log classId
        console.log("Class ID:", paymentInfo.classId);

        if (error) {
            setMessage(error.message);
            setProcessing(false);
        } else if (paymentIntent.status === "succeeded") {
            // MODIFIED: Replaced setMessage with SweetAlert2 and added navigation
            Swal.fire({
                icon: 'success',
                title: 'Payment Successful!',
                text: `Your payment of $${paymentInfo.packagePrice} for ${paymentInfo.packageName} is complete.`,
                background: 'black',
                color: '#faba22',
                confirmButtonColor: '#faba22',
            }).then(() => {
                // Navigate to home page after user acknowledges the alert
                navigate("/");
            });

            try {
                await axiosSecure.post(`${import.meta.env.VITE_API_URL}/save-payment`, {
                    trainerId: paymentInfo.trainerId,
                    trainerName: paymentInfo.trainerName,
                    trainerEmail: paymentInfo.trainerEmail,
                    slotDay: paymentInfo.slotName.split(" ")[0], // day (e.g., Mon)
                    slotTime: paymentInfo.slotName.split(" ").slice(1).join(" "), // time (e.g., 10:00 AM)
                    className: paymentInfo.className,
                    packageId: paymentInfo.packageId,
                    packageName: paymentInfo.packageName,
                    packagePrice: paymentInfo.packagePrice,
                    userName: user?.name || user?.displayName,
                    userEmail: user?.email,
                    paymentIntentId: paymentIntent.id,
                    classId: paymentInfo.classId,
                });

                // navigate("/dashboard/booked-trainers"); // This line is now handled by the Swal.fire .then() block
            } catch (err) {
                console.error("Saving payment failed:", err);
                // If saving payment fails *after* Stripe success, you might want another Swal.fire here
                // to inform the user that their booking couldn't be logged despite payment success.
                Swal.fire({
                    icon: 'error',
                    title: 'Booking Error',
                    text: 'Payment was successful, but there was an issue logging your booking. Please contact support.',
                    background: 'black',
                    color: '#faba22',
                    confirmButtonColor: '#faba22',
                });
            }

            setProcessing(false);
        }
    };

    if (!paymentInfo || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <p className="text-center text-yellow-400 text-xl font-semibold">Invalid Payment Request. Please go back.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8 md:p-10">
                <h1 className="text-4xl md:text-5xl font-bold text-[#faba22] text-center mb-8 font-funnel drop-shadow-lg">
                    Confirm Your Payment
                </h1>

                {/* Payment Summary Section */}
                <div className="bg-zinc-800 rounded-xl p-6 mb-8 border border-zinc-700 shadow-inner space-y-4">
                    <h2 className="text-2xl font-semibold text-white mb-4 text-center">Order Summary</h2>
                    <p className="text-zinc-300 text-lg flex justify-between items-center">
                        <span className="font-semibold text-[#faba22]">Trainer:</span>
                        <span className="text-white">{paymentInfo.trainerName}</span>
                    </p>
                    <p className="text-zinc-300 text-lg flex justify-between items-center">
                        <span className="font-semibold text-[#faba22]">Slot:</span>
                        <span className="text-white">{paymentInfo.slotName}</span>
                    </p>
                    <p className="text-zinc-300 text-lg flex justify-between items-center">
                        <span className="font-semibold text-[#faba22]">Class:</span>
                        <span className="text-white">{paymentInfo.className || "N/A"}</span>
                    </p>
                    <p className="text-zinc-300 text-lg flex justify-between items-center">
                        <span className="font-semibold text-[#faba22]">Membership:</span>
                        <span className="text-white">{paymentInfo.packageName}</span>
                    </p>
                    <div className="border-t border-zinc-700 pt-4 mt-4 flex justify-between items-center">
                        <p className="text-2xl font-bold text-[#faba22]">Total Amount:</p>
                        <p className="text-2xl font-bold text-white">${paymentInfo.packagePrice}</p>
                    </div>
                </div>

                {/* User Info Section */}
                <div className="bg-zinc-800 rounded-xl p-6 mb-8 border border-zinc-700 shadow-inner space-y-4">
                    <h2 className="text-2xl font-semibold text-white mb-4 text-center">Your Details</h2>
                    <p className="text-zinc-300 text-lg flex justify-between items-center">
                        <span className="font-semibold text-[#faba22]">Name:</span>
                        <span className="text-white">{user?.name || user?.displayName || "N/A"}</span>
                    </p>
                    <p className="text-zinc-300 text-lg flex justify-between items-center">
                        <span className="font-semibold text-[#faba22]">Email:</span>
                        <span className="text-white">{user?.email || "N/A"}</span>
                    </p>
                </div>


                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="p-5 bg-zinc-800 rounded-xl border border-zinc-700 shadow-md">
                        <label htmlFor="card-element" className="block text-zinc-300 text-lg font-semibold mb-3">
                            Card Details
                        </label>
                        <CardElement
                            id="card-element"
                            options={{
                                style: {
                                    base: {
                                        color: "#ffffff", // White text for input
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '18px',
                                        '::placeholder': {
                                            color: '#a1a1aa', // Zinc-400 for placeholder
                                        },
                                    },
                                    invalid: {
                                        color: '#ef4444', // Red-500 for errors
                                    },
                                },
                                hidePostalCode: true, // Often preferred for simpler checkout
                            }}
                        />
                    </div>

                    <button
                        disabled={!stripe || processing}
                        className="w-full py-4 rounded-xl bg-[#faba22] text-black font-bold text-xl
                                     hover:bg-yellow-500 transition-colors duration-300 shadow-lg hover:shadow-xl
                                     transform hover:-translate-y-1 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3 text-black" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            `Pay $${paymentInfo.packagePrice}`
                        )}
                    </button>
                </form>

                {message && (
                    <p className={`mt-6 text-center text-lg font-semibold ${message.includes("Successful") ? "text-green-400" : "text-red-400"}`}>
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
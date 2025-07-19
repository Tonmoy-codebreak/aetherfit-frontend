import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router"; 
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../AuthProvider/useAuth";
import Swal from "sweetalert2";

const LoginPage = () => {
      useEffect(() => {
            document.title = "AetherFit | Sign In"; 
        }, []);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); 

    const { signinUser, signWithGoogle } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const result = await signinUser(email, password);
            
            // Sweeeeet Aleeeert
            Swal.fire({
                title: '<span class="font-funnel" style="color:#faba22">Login Successful!</span>', 
                text: "Welcome back to AetherFit", 
                icon: 'success',
                background: 'black',
                color: '#faba22',
                confirmButtonColor: '#faba22',
                confirmButtonText: 'Continue',
                customClass: {
                    popup: 'rounded-4xl p-6',
                    title: 'text-2xl font-bold',
                    confirmButton: 'text-black font-semibold',
                },
                didOpen: (popup) => {
                    popup.setAttribute('draggable', 'true');
                }
            });
            navigate(location.state?.from?.pathname || "/");
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Sign In failed",
                text: `${err.message}`,
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            });
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        try {
            const result = await signWithGoogle();
            const user = result.user; // eslint-disable-line no-unused-vars
            // Sweeeeet Aleeeert
            Swal.fire({
                title: '<span class="font-funnel" style="color:#faba22">Google Login Successful!</span>', // Added font-funnel
                text: "Welcome to AetherFit! You've joined as a member of the AetherFit family.", // Updated text
                icon: 'success',
                background: 'black',
                color: '#faba22',
                confirmButtonColor: '#faba22',
                confirmButtonText: 'Continue',
                customClass: {
                    popup: 'rounded-4xl p-6',
                    title: 'text-2xl font-bold',
                    confirmButton: 'text-black font-semibold',
                },
                didOpen: (popup) => {
                    popup.setAttribute('draggable', 'true');
                }
            });
            navigate(location.state?.from?.pathname || "/");
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Sign In failed",
                text: `${err.message}`,
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            });
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#111] text-white font-inter px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-funnel font-extrabold text-[#faba22] mb-2">AetherFit</h1>
                    <p className="text-gray-400 text-sm">Fuel your body. Elevate your fitness.</p>
                </div>

                {/* Google Sign In */}
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 border border-gray-700 rounded-md py-3 hover:bg-[#faba22] hover:text-black transition-colors font-semibold text-white"
                >
                    <FcGoogle className="text-xl" />
                    Sign in with Google
                </button>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
                        required
                    />

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
                        required
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-md text-black font-semibold bg-[#faba22] hover:bg-yellow-400 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>

                {/* Register */}
                <p className="text-center text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/auth/register"
                        className="text-[#faba22] hover:underline font-medium"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
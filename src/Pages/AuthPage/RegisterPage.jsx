import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../AuthProvider/useAuth"; 



const RegisterPage = () => {
  const { createUser, signWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select a profile image.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload image to imgbb
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error("Image upload failed");
      const imageUrl = data.data.display_url;

      // 2. Create user with email and password
      await createUser(email, password);

      // 3. Here you can update profile with fullName and imageUrl (if you want, using updateProfile from firebase/auth)

      alert("Account created successfully!");
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signWithGoogle();
      alert("Logged in with Google successfully!");
      navigate("/"); // or your desired page after login
    } catch (error) {
      console.error(error);
      alert("Google Sign-in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#111] text-white font-inter px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold font-funnel text-[#faba22] mb-2">
            AetherFit
          </h1>
          <p className="text-gray-400 text-sm">
            Create your account and begin your journey
          </p>
        </div>

        {/* Google Sign-up */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-700 rounded-md py-3 hover:bg-[#faba22] hover:text-black transition-colors font-semibold text-white disabled:opacity-50"
        >
          <FcGoogle className="text-xl" />
          Sign up with Google
        </button>

        {/* Registration Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            required
          />

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

          {/* Profile Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#faba22] file:text-black hover:file:bg-yellow-400"
            required
          />

          {/* Create Account */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md text-black font-semibold bg-[#faba22] hover:bg-black hover:text-[#faba22] transition duration-300 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Create Account"}
          </button>
        </form>

        {/* Log In Link */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-[#faba22] hover:underline font-medium"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

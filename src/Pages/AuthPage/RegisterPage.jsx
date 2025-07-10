import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../AuthProvider/useAuth";
import { updateProfile } from "firebase/auth"; 
import Swal from "sweetalert2";

const RegisterPage = () => {
  const { createUser, signWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      // 3. Update display name and photo
      await updateProfile(user, {
        displayName: fullName,
        photoURL: imageUrl,
      });

     
      // Sweeeeet Aleeeert
            Swal.fire({
          title: '<span style="color:#faba22">Account created successfully!</span>',
          text: 'Welcome back to AetherFit!',
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
    } catch (error) {
      
      
       Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: `${error.message}`,
        
      });
    } finally {
      setLoading(false);
    }
  };

    const handleGoogleSignIn = async () => {
      setError(null);
      try {
        const result = await signWithGoogle();
            const user = result.user;
        // Sweeeeet Aleeeert
        Swal.fire({
      title: '<span style="color:#faba22">Google Login Successful!</span>',
      text: 'Welcome back to AetherFit!',
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
        console.error("Google Sign-In Error:", err);
        setError(err.message);
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
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#faba22] file:text-black hover:file:bg-yellow-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md text-black font-semibold bg-[#faba22] hover:bg-black hover:text-[#faba22] transition duration-300 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-[#faba22] hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

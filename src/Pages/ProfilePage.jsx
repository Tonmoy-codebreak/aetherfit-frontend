import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../AuthProvider/useAuth";
import useAxios from "../hooks/useAxios";

const ProfilePage = () => {
  useEffect(() => {
    document.title = "AetherFit | Profile";
  }, []);
  const { user, setUser, auth } = useAuth();
  const axios = useAxios();

  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch MongoDB user _id by email if not present
  useEffect(() => {
    if (user?.email && !user?._id) {
      axios.get(`/users?email=${user.email}`).then((res) => {
        if (res.data?._id) {
          setUser({
            ...user,
            _id: res.data._id,
          });
        }
      }).catch((err) => {
        console.error("Fetching user MongoDB ID failed:", err);
      });
    }
  }, [user?.email, user?._id, setUser, axios]); // Added dependencies

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
    // Optional: Preview the selected image immediately
    if (e.target.files[0]) {
      setPhotoURL(URL.createObjectURL(e.target.files[0]));
    } else {
      setPhotoURL(user?.photoURL || "");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalPhotoURL = photoURL;

      if (photoFile) {
        const base64Image = await toBase64(photoFile);
        const uploadRes = await axios.post("/upload-image", { imageBase64: base64Image });
        if (uploadRes.data.url) {
          finalPhotoURL = uploadRes.data.url;
        } else {
          throw new Error("Image upload to ImgBB failed.");
        }
      }


      if (auth && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: finalPhotoURL,
        });
      } else {
        throw new Error("No active Firebase user found for update.");
      }


      // ✅ PATCH using user._id
      if (user?._id) {
        await axios.patch(`/users/${user._id}`, {
          name,
          photoURL: finalPhotoURL,
        });
      } else {
        console.warn("MongoDB _id not found for user. MongoDB update skipped.");
      }

      setUser((prevUser) => ({
        ...prevUser,
        displayName: name,
        photoURL: finalPhotoURL,
      }));

      Swal.fire({
        title: '<span style="color:#faba22">Profile Updated!</span>',
        icon: "success",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    } catch (err) {
      console.error("Profile update error:", err);
      Swal.fire({
        title: "Update Failed",
        text: err.message || "Something went wrong during profile update.",
        icon: "error",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-inter pt-24 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8 md:p-10 lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Left Column: Profile Overview */}
        <div className="lg:border-r lg:border-zinc-700 lg:pr-8 flex flex-col items-center text-center lg:items-start lg:text-left mb-8 lg:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-funnel mb-6">Your Profile</h2>

          {/* Profile Photo */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            {photoURL ? (
              <img
                src={photoURL}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-[#faba22] shadow-xl transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400 text-xl font-semibold border-4 border-zinc-600 shadow-xl">
                No Image
              </div>
            )}
            <label className="block text-lg font-medium text-zinc-300 text-center cursor-pointer">
              <span className="inline-block px-5 py-2 rounded-full bg-[#faba22] text-black font-bold hover:bg-yellow-500 transition-colors duration-200 shadow-md">
                Change Photo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden" // Hide the default file input
              />
            </label>
          </div>

          {/* User Info Display */}
          <div className="space-y-3 text-lg w-full">
            <p><span className="font-semibold text-[#faba22]">Name:</span> <span className="text-white">{user?.displayName || "N/A"}</span></p>
            <p><span className="font-semibold text-[#faba22]">Email:</span> <span className="text-white">{user?.email || "N/A"}</span></p>
            <p className="text-base text-zinc-400 pt-2 border-t border-zinc-800 mt-4">
              <span className="font-semibold text-zinc-300">Last Login: </span>
              {user?.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleString("en-BD", {
                    timeZone: "Asia/Dhaka",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Unknown"}
            </p>
          </div>
        </div>

        {/* Right Column: Editable Form Fields */}
        <form onSubmit={handleUpdateProfile} className="flex flex-col justify-center space-y-8 lg:pl-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#faba22] text-center font-funnel drop-shadow-lg lg:text-left">
            Edit Details
          </h1>

          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-lg font-medium text-zinc-300 mb-2">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your Full Name"
                className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] transition-colors duration-200 text-lg"
              />
            </div>

            <div>
              <label htmlFor="emailAddress" className="block text-lg font-medium text-zinc-300 mb-2">Email Address</label>
              <input
                id="emailAddress"
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full p-4 bg-zinc-700 border border-zinc-600 rounded-lg text-zinc-400 cursor-not-allowed text-lg"
              />
            </div>
          </div>

          {/* Save Changes Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#faba22] text-black font-bold text-xl
                        hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl
                        transform hover:-translate-y-1 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed
                        flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
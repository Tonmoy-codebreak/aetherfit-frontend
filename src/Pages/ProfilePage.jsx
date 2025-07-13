import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../AuthProvider/useAuth";
import useAxios from "../hooks/useAxios";

const ProfilePage = () => {
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
      if (user?._id) { // Ensure MongoDB _id is available
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#111] text-white font-inter p-4">
      <form onSubmit={handleUpdateProfile} className="w-full max-w-lg space-y-6">
        <h1 className="text-3xl font-bold text-[#faba22]">Manage Your Profile</h1>

        <div className="space-y-3">
          {photoURL ? (
            <img src={photoURL} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 mx-auto">
              No Image
            </div>
          )}

          <label className="block text-sm font-medium text-gray-300">Change Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full bg-[#111] border border-gray-700 p-2 rounded-md file:bg-[#faba22] file:text-black cursor-pointer"
          />

          <label className="block text-sm font-medium text-gray-300">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Full Name"
            className="w-full p-3 bg-[#111] border border-gray-700 rounded-md focus:outline-none focus:border-[#faba22]"
          />

          <label className="block text-sm font-medium text-gray-300">Email Address</label>
          <input
            type="email"
            value={user?.email}
            disabled
            className="w-full p-3 bg-[#333] border border-gray-700 rounded-md text-gray-400 cursor-not-allowed"
          />

          <p className="text-sm text-gray-400">
            Last Login:{" "}
            {user?.metadata?.lastSignInTime
              ? new Date(user.metadata.lastSignInTime).toLocaleString("en-BD", {
                  timeZone: "Asia/Dhaka",
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Unknown"}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-[#faba22] text-black rounded-md font-semibold hover:bg-black hover:text-[#faba22] transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
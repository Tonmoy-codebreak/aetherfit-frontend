import React, { useEffect, useState } from "react";
import { AuthContext } from "./Authcontext";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "../FirebaseConfig/firebase.config";

// Initialize Firebase Auth
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Function to fetch custom JWT from your backend
  const getAppJwtToken = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("jwt_token", data.token);
    
      }
    } catch (err) {
      console.error("JWT fetch failed:", err);
    }
  };

  // ✅ Handle auth state changes & fetch JWT automatically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser?.email) {
        await getAppJwtToken(currentUser.email);
      } else {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("jwt_user");
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Create new user — just Firebase part
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ✅ Sign in user — just Firebase part
  const signinUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ✅ Google Sign-in
  const signWithGoogle = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // ✅ Logout user
  const logoutUser = () => {
    setLoading(true);
    localStorage.removeItem("jwt_token");
    
    return signOut(auth);
  };

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    logoutUser,
    signinUser,
    signWithGoogle,
    auth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

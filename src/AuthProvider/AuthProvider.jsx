import React, { useEffect, useState } from 'react';
import { AuthContext } from './Authcontext'; 

import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import app from '../FirebaseConfig/firebase.config';
// --------------------------------------------------------------------------------------
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

//   OnAuthState Change --------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

//   Create register new user -------------------------------------------------------
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

//   sign in user -------------------------------------------------------------------
  const signinUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

//  Google sign in ================================================================= --------
 const signWithGoogle = async () => {
  setLoading(true);
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user); 
    setLoading(false);
    return result.user;
  } catch (error) {
    setLoading(false);
    throw error;
  }
};


  
//   Log out user ==================================================================
  const logoutUser = () => {
    setLoading(true);
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
    auth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

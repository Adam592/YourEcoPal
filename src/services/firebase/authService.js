import { firebaseAuth } from "./firebaseConfig";

import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    onAuthStateChanged
  } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');


export const registerWithEmailAndPassword = async (email, password, name) => {
try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    await sendEmailVerification(user);
    return user;
} catch (error) {
    console.error("Error registering with email and password:", error);
    throw error;
}
}

export const loginWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in with email and password:", error);
        throw error;
    }
}

export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  export const logout = async () => {
    try {
      await signOut(firebaseAuth);
      return true;
    } catch (error) {
      throw error;
    }
  };

export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(firebaseAuth, email);
        return true;
    } catch (error) {
        throw error;
    }
};

export const onAuthStateChanged = (callback) => {
    return firebaseAuth.onAuthStateChanged(callback);
  };

import { 
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import {
    db,
} from './firebaseConfig';

export const saveUserData = async (user_uid, email, name, photoURL = null) => {
    const userRef = doc(db, 'users', user_uid);
    const snapshot = await getDoc(userRef);
    
    if (!snapshot.exists()) {
      await setDoc(userRef, {
        email: email,
        name: name,
        photoURL: photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
      return true;
    } else {
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
      return false;
    }
};

export const getUserData = async (user_uid) => {
    const userRef = doc(db, 'users', user_uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        return snapshot.data();
    } else {
        return null;
    }
};

export const updateUserProfile = async (user_uid, data) => {
    const userRef = doc(db, 'users', user_uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
};

export const updateUserName = async (user_uid, name) => {
    const userRef = doc(db, 'users', user_uid);
    await updateDoc(userRef, {
      name,
      updatedAt: serverTimestamp()
    });
};

export const updateUserEmail = async (user_uid, email) => {
    const userRef = doc(db, 'users', user_uid);
    await updateDoc(userRef, {
      email,
      updatedAt: serverTimestamp()
    });
};





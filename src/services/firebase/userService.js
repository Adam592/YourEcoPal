import { 
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import {
    db,
} from './firebaseConfig';

export const saveUserData = async (user_uid, email, name) => {
    const userRef = doc(db, 'users', user_uid);
    const snaphsot = await getDoc(userRef);
    
    if (!snaphsot.exists()) {
        await setDoc(userRef, {
            email: email,
            name: name,
            createdAt: serverTimestamp(),
        });
    } else {
        console.log('User already exists in the database');
    }
}

export const getUserData = async (user_uid) => {
    const userRef = doc(db, 'users', user_uid);
    const snapshot = await getDoc(userRef);
    
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      return null;
    }
  };






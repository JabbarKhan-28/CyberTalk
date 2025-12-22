import { auth, db } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const AuthService = {
    register: async (email: string, password: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await updateProfile(user, { displayName: name });
            
            // Create user profile in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: name,
                email: email,
                createdAt: new Date().toISOString(),
                publicKey: null, // To be set by DH Exchange logic
            });

            return user;
        } catch (error) {
            throw error;
        }
    },

    login: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        await signOut(auth);
    },

    getCurrentUser: () => {
        return auth.currentUser;
    },

    updateProfilePicture: async (uri: string) => {
        const user = auth.currentUser;
        if (!user) throw new Error("No user logged in");

        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            
            const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
            const { storage } = require('@/firebaseConfig');

            const storageRef = ref(storage, `profile_images/${user.uid}`);
            await uploadBytes(storageRef, blob);
            
            const downloadURL = await getDownloadURL(storageRef);
            await updateProfile(user, { photoURL: downloadURL });
            
            return downloadURL;
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            throw error;
        }
    }
};

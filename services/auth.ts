import { auth, db } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';

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

    updateProfilePicture: async (uri: string, base64?: string | null) => {
        const user = auth.currentUser;
        if (!user) throw new Error("No user logged in");

        try {
            console.log("Starting upload...", uri);
            
            const { ref, uploadBytes, uploadString, getDownloadURL } = require('firebase/storage');
            const { storage } = require('@/firebaseConfig');
            
            // Create a reference with the correct path
            const storageRef = ref(storage, `profile_images/${user.uid}_${Date.now()}`);
            
            if (Platform.OS === 'web' && base64) {
                // WEB: Use Base64 string upload to avoid CORS issues with Blobs
                console.log("Web detected: Uploading as Base64 string...");
                await uploadString(storageRef, base64, 'base64', { contentType: 'image/jpeg' });
            } else {
                // NATIVE: Use XHR Blob upload for robust handling
                console.log("Native detected: Creating Blob...");
                const blob: Blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        resolve(xhr.response);
                    };
                    xhr.onerror = function (e) {
                        console.error("XHR Blob Error:", e);
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", uri, true);
                    xhr.send(null);
                });
                
                const snapshot = await uploadBytes(storageRef, blob);
                console.log("Upload success, snapshot:", snapshot);
                
                // @ts-ignore
                blob.close && blob.close(); 
            }
            
            // Get valid URL
            const downloadURL = await getDownloadURL(storageRef);
            console.log("Download URL:", downloadURL);
            
            // Update auth profile
            await updateProfile(user, { photoURL: downloadURL });
            console.log("Profile updated in Firebase");
            
            // Force reload to ensure consistency
            await user.reload();
            
            return downloadURL;
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            throw error;
        }
    },
    
    reloadUser: async () => {
        const user = auth.currentUser;
        if (user) await user.reload();
        return auth.currentUser;
    }
};

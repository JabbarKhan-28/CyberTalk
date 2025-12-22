import { auth, db } from '@/firebaseConfig';
import { User } from '@/types';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    updateDoc,
    arrayRemove,
    deleteDoc,
    writeBatch
} from 'firebase/firestore';

export const ChatService = {
    // Get a specific user by ID
    getUser: async (userId: string): Promise<User | null> => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                return { id: userDoc.id, ...userDoc.data() } as User;
            }
            return null;
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    },

    // Search users by email or name
    searchUsers: async (searchTerm: string): Promise<User[]> => {
        const usersRef = collection(db, 'users');
        let q;
        
        if (!searchTerm || searchTerm.trim() === '') {
            // Return recent users if no search term
            q = query(usersRef, limit(50));
        } else {
            // Simple search (case-sensitive in Firestore usually requires external index for full text, doing basic here)
            // Ideally should search by exact email for security/privacy or use Algolia
            q = query(usersRef, where('email', '>=', searchTerm), where('email', '<=', searchTerm + '\uf8ff'));
        }
        
        const snapshot = await getDocs(q);
        const currentUserId = auth.currentUser?.uid;
        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as User))
            .filter(user => user.id !== currentUserId);
    },

    // Create a new chat or get existing
    createChat: async (otherUserId: string) => {
        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) throw new Error("Not logged in");

        // Ideally check if chat already exists between these two
        // For simplicity, creating new doc with participants
        // Composite key could be used 'uid1_uid2' to ensure uniqueness
        
        const chatId = [currentUserId, otherUserId].sort().join('_');
        const chatRef = doc(db, 'chats', chatId);
        
        await setDoc(chatRef, {
            participants: [currentUserId, otherUserId],
            lastMessage: '',
            lastMessageTime: serverTimestamp(),
        }, { merge: true }); // Merge to avoid overwriting existing chat data if any

        return chatId;
    },

    // Send a message
    sendMessage: async (chatId: string, text: string) => {
        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) throw new Error("Not logged in");

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        await addDoc(messagesRef, {
            text,
            senderId: currentUserId,
            timestamp: serverTimestamp(),
        });

        // Update last message in chat doc
        const chatRef = doc(db, 'chats', chatId);
        await setDoc(chatRef, {
            lastMessage: text,
            lastMessageTime: serverTimestamp(), 
        }, { merge: true });
    },

    // Listen to messages in a chat
    listenToMessages: (chatId: string, callback: (msgs: any[]) => void) => {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    },

    // Listen to my chats
    listenToChats: (callback: (chats: any[]) => void) => {
        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) return () => {};

        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('participants', 'array-contains', currentUserId));

        return onSnapshot(q, (snapshot) => {
            const chats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(chats);
        });
    },

    // Delete chat and all messages
    deleteChat: async (chatId: string) => {
        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) throw new Error("Not logged in");

        // 1. Delete all messages
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const messagesSnapshot = await getDocs(messagesRef);
        
        const batch = writeBatch(db);
        messagesSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // 2. Delete the chat document
        await deleteDoc(doc(db, 'chats', chatId));
    }
};

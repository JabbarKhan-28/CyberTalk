export interface User {
    id: string;
    uid?: string;
    name: string;
    email: string;
    createdAt: string;
    publicKey?: string | null;
    avatar?: string;
}

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: any; // Firestore Timestamp
}

export interface Chat {
    id: string;
    participants: string[];
    lastMessage: string;
    lastMessageTime: any; // Firestore Timestamp
    isSecure?: boolean;
    securityTimestamp?: any;
}

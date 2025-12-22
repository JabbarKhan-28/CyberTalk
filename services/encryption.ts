import CryptoJS from 'crypto-js';
import { Config } from '@/constants/Config';

const STATIC_SECRET_KEY = Config.ENCRYPTION_KEY;

export const EncryptionService = {
    /**
     * Encrypts a text string using AES.
     * @param text The plain text message.
     * @param key Optional custom key (default: static safe key).
     * @returns The ciphertext string.
     */
    encrypt: (text: string, key: string = STATIC_SECRET_KEY): string => {
        try {
            if (!text) return '';
            return CryptoJS.AES.encrypt(text, key).toString();
        } catch (error) {
            console.error('Encryption Failed:', error);
            return text; // Fallback to plain text on failure to prevent data loss, or handle differently
        }
    },

    /**
     * Decrypts a ciphertext string using AES.
     * @param ciphertext The encrypted message.
     * @param key Optional custom key (default: static safe key).
     * @returns The decrypted plain text.
     */
    decrypt: (ciphertext: string, key: string = STATIC_SECRET_KEY): string => {
        try {
           if (!ciphertext) return '';
           
           const bytes = CryptoJS.AES.decrypt(ciphertext, key);
           const originalText = bytes.toString(CryptoJS.enc.Utf8);
           
           // If decryption yields empty string but input wasn't, it likely failed/wrong key
           if (!originalText && ciphertext.length > 0) {
               return '[Encrypted Message]';
           }
           
           return originalText;
        } catch (error) {
            console.warn('Decryption Failed:', error);
            // Try fallback: maybe it wasn't encrypted?
            if (ciphertext && !ciphertext.startsWith('U2FsdGVkX1')) {
                return ciphertext;
            }
            return '[Error Decrypting]';
        }
    }
};

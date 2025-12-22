import { ChatItem } from '@/components/ChatItem';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { auth } from '@/firebaseConfig';
import { CyberText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/auth';
import { ChatService } from '@/services/chat';
import { useRouter } from 'expo-router';
import { MessageSquare, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CyberAlert } from '@/components/CyberAlert';
import { useToast } from '@/components/Toast';

export default function HomeScreen() {
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    // We need to wait for the auth state to be ready
    const unsubscribeAuth = auth.onAuthStateChanged((user: User | null) => {
        if (user) {
            // User is signed in, listen to chats
            const unsubscribeChats = ChatService.listenToChats(async (updatedChats) => {
                const currentUserId = user.uid;
                
                const formattedChats = await Promise.all(updatedChats.map(async (chat) => {
                    const otherUserId = chat.participants.find((id: string) => id !== currentUserId);
                    let otherUserName = 'Unknown User';
                    let otherUserOnline = false;
        
                    if (otherUserId) {
                        const userProfile = await ChatService.getUser(otherUserId);
                        if (userProfile) {
                            otherUserName = userProfile.name || userProfile.email || 'User';
                        }
                    }
                    
                    return {
                        id: chat.id,
                        name: otherUserName,
                        lastMessage: chat.lastMessage || 'No messages yet',
                        time: chat.lastMessageTime?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Now',
                        unread: 0,
                        online: otherUserOnline
                    };
                }));
                
                setChats(formattedChats);
                setLoading(false);
            });

            // Cleanup chat listener when auth state changes or component unmounts
            return () => unsubscribeChats();
        } else {
            // User is signed out
            setChats([]);
            setLoading(false);
        }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleDeleteRequest = (id: string, name: string) => {
      setDeleteTarget({ id, name });
      setAlertVisible(true);
  };

  const confirmDelete = async () => {
      if (!deleteTarget) return;

      try {
          await ChatService.deleteChat(deleteTarget.id);
          toast.show(`Chat with ${deleteTarget.name} deleted`, 'success');
      } catch (error) {
          console.error(error);
          toast.show('Failed to delete chat', 'error');
      } finally {
          setAlertVisible(false);
          setDeleteTarget(null);
      }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <CyberAlert
        visible={alertVisible}
        title="Delete Chat"
        message={`Are you sure you want to delete the conversation with ${deleteTarget?.name}? This cannot be undone.`}
        type="error"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setAlertVisible(false)}
      />

      <View style={styles.header}>
        <View style={styles.titleRow}>
            <MessageSquare color={Colors.dark.primary} size={28} />
            <CyberText variant="h1" style={styles.title} glow>Messages</CyberText>
        </View>
      </View>

      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <ChatItem 
                {...item} 
                onDelete={handleDeleteRequest}
            />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
            !loading ? (
                <View style={styles.emptyState}>
                    <CyberText variant="body" style={{color: Colors.dark.icon, textAlign: 'center'}}>
                        No active chats. Start a new secure conversation!
                    </CyberText>
                </View>
            ) : null
        )}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/(tabs)/contacts')}
        activeOpacity={0.8}
      >
        <Plus color="#000" size={30} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  title: {
    fontSize: 34, 
  },
  list: {
    paddingBottom: 100,
  },
  emptyState: {
      marginTop: 100,
      padding: 40,
      alignItems: 'center',
      opacity: 0.7
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  }
});

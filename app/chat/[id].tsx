import { Input } from '@/components/Input';
import { MessageBubble } from '@/components/MessageBubble';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { Colors } from '@/constants/Colors';
import { auth } from '@/firebaseConfig';
import { ChatService } from '@/services/chat';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Lock, Paperclip, Send } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useToast } from '@/components/Toast';

export function generateStaticParams() {
  return [];
}

export default function ChatDetailScreen() {
  const { id, name } = useLocalSearchParams(); 
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const toast = useToast();

  useEffect(() => {
     if (!id) return;
     
     const unsubscribe = ChatService.listenToMessages(id as string, (data) => {
         const formattedMessages = data.map(msg => ({
             id: msg.id,
             text: msg.text,
             isMe: msg.senderId === auth.currentUser?.uid,
             timestamp: msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'
         }));
         setMessages(formattedMessages);
         setLoading(false);
         setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
     });

     return () => unsubscribe();
  }, [id]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    
    try {
        await ChatService.sendMessage(id as string, text);
        setText('');
    } catch (error) {
        console.error("Error sending message:", error);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      {/* Custom Header Configuration */}
      <Stack.Screen 
        options={{
            headerShown: true,
            title: '', 
            headerLeft: () => (
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
                        <ArrowLeft color={Colors.dark.text} size={24} />
                    </TouchableOpacity>
                    <View>
                        <CyberText variant="h2" style={{ fontSize: 18 }}>{name || 'Chat'}</CyberText>
                        <View style={styles.badgeContainer}>
                             <Lock size={10} color={Colors.dark.success} />
                             <CyberText variant="caption" style={{ color: Colors.dark.success, marginLeft: 4, fontSize: 10 }}>E2E ENCRYPTED</CyberText>
                        </View>
                    </View>
                </View>
            ),
            headerStyle: { backgroundColor: Colors.dark.background },
            headerTintColor: Colors.dark.text,
        }}
      />

      {loading ? (
           <ActivityIndicator color={Colors.dark.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <MessageBubble {...item} />}
            contentContainerStyle={styles.list}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={() => toast.show('File attachment coming soon', 'info')}
          >
            <Paperclip size={20} color={Colors.dark.icon} />
          </TouchableOpacity>
          
          <Input
            value={text}
            onChangeText={setText}
            placeholder="Type a secured message..."
            style={styles.textInput}
            containerStyle={{ marginBottom: 0, flex: 1 }}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
            returnKeyType="send"
          />

          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Send size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    padding: 20,
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  attachButton: {
    padding: 10,
  },
  textInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    height: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  }
});

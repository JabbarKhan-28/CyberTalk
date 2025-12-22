import { ContactItem } from '@/components/ContactItem';
import { Input } from '@/components/Input';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { CyberText } from '@/components/StyledText';
import { useToast } from '@/components/Toast';
import { Colors } from '@/constants/Colors';
import { ChatService } from '@/services/chat';
import { Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

export default function ContactsScreen() {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Load users on mount and search change
  useEffect(() => {
     setLoading(true);
     ChatService.searchUsers(search)
        .then(users => {
            setContacts(users.map(u => ({
                id: u.uid,
                name: u.name,
                email: u.email,
                hasKeys: false, // Default to false until key exchange implemented
            })));
        })
        .catch(err => {
            console.error(err);
            toast.show('Failed to load users', 'error');
        })
        .finally(() => setLoading(false));
  }, [search]);

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <CyberText variant="h1">Contacts</CyberText>
        <Input 
          placeholder="Search by email..." 
          value={search} 
          onChangeText={setSearch}
          icon={<Search size={20} color={Colors.dark.icon} />}
          style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 0 }}
        />
        <CyberText variant="caption" style={{marginTop: 5, color: Colors.dark.icon}}>
            Try typing a user's email address
        </CyberText>
      </View>

      {loading ? (
          <ActivityIndicator color={Colors.dark.primary} />
      ) : (
        <FlatList
            data={contacts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
            <ContactItem {...item} />
            )}
            contentContainerStyle={styles.list}
            ListEmptyComponent={() => (
                search.length > 0 && <CyberText variant="caption" style={{textAlign: 'center'}}>No users found</CyberText>
            )}
        />
      )}
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
  list: {
    paddingBottom: 80,
  },
});

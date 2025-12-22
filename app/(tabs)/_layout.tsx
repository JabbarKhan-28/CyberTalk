import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { MessageSquare, User, Users } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.dark.surface, // Fallback
          borderTopColor: Colors.dark.border,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.dark.primary,
        tabBarInactiveTintColor: Colors.dark.icon,
        // Glassmorphism background for tab bar
        tabBarBackground: () => (
          <BlurView intensity={80} style={{ flex: 1, backgroundColor: 'rgba(10,10,10,0.8)' }} tint="dark" />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => <MessageSquare color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => <Users color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          href: null,
        }}
      />

    </Tabs>
  );
}

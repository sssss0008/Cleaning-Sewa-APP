import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawer from '@/components/CustomDrawer';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: width * 0.8,
          height: height * 0.9,
          backgroundColor: 'transparent',
          position: 'absolute',
          top: height * 0.05, // 5% from top
          borderRadius: 20,
          overflow: 'hidden',
        },
        overlayColor: 'rgba(0,0,0,0.5)',
      }}
    >
      {/* 1. Main Tabs (Home, Service, Book, About, Contact) */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Admin Portal */}
      <Drawer.Screen
        name="Admin"
        options={{
          drawerLabel: 'Admin Portal',
          title: 'Admin',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 3. FAQs */}
      <Drawer.Screen
        name="FAQs"
        options={{
          drawerLabel: 'FAQs',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 4. Glossary */}
      <Drawer.Screen
        name="Glossary"
        options={{
          drawerLabel: 'Glossary',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 5. Partnership */}
      <Drawer.Screen
        name="Partnership"
        options={{
          drawerLabel: 'Partnership',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 6. Career */}
      <Drawer.Screen
        name="Career"
        options={{
          drawerLabel: 'Career',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
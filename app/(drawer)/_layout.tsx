import React from 'react';
import { Drawer } from 'expo-router/drawer';
import CustomDrawer from '../../components/CustomDrawer';
import { useTheme } from '../../src/context/ThemeContext';

export default function DrawerLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.subText,
        drawerType: 'front',
        drawerStyle: {
          width: '80%',
          backgroundColor: 'transparent',
        }
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Main' }} />
      <Drawer.Screen name="FAQs" options={{ drawerLabel: 'FAQs' }} />
      <Drawer.Screen name="Partnership" options={{ drawerLabel: 'Become a Partner' }} />
      <Drawer.Screen name="Career" options={{ drawerLabel: 'Join as a Professional' }} />
      <Drawer.Screen name="Admin" options={{ drawerLabel: 'Admin Login' }} />
      <Drawer.Screen name="PrivacyPolicy" options={{ drawerLabel: 'Privacy Policy' }} />
      <Drawer.Screen name="RefundPolicy" options={{ drawerLabel: 'Refund Policy' }} />
      <Drawer.Screen name="Glossary" options={{ drawerLabel: 'Glossary' }} />
      <Drawer.Screen name="notification" options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer>
  );
}
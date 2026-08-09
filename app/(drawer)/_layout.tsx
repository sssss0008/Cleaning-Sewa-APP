import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawer from '../../components/CustomDrawer';
import { Dimensions, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from '../../src/context/ThemeContext';

const { width, height } = Dimensions.get('window');

function DrawerNavigator() {
  const { isDarkMode, colors } = useTheme();

  return (
    <Drawer
      initialRouteName="(tabs)"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.subText,
        drawerStyle: [
          styles.glossyDrawer,
          {
            backgroundColor: colors.drawerBg,
            borderColor: colors.drawerBorder,
          },
        ],
        overlayColor: isDarkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.45)',
      }}
    >
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

      <Drawer.Screen
        name="FAQs"
        options={{
          drawerLabel: 'FAQs',
          title: 'FAQs',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Partnership"
        options={{
          drawerLabel: 'Partnership',
          title: 'Partnership',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Career"
        options={{
          drawerLabel: 'Career',
          title: 'Career',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="PrivacyPolicy"
        options={{
          drawerLabel: 'Privacy Policy',
          title: 'Privacy Policy',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="shield-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="RefundPolicy"
        options={{
          drawerLabel: 'Refund Policy',
          title: 'Refund Policy',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="refresh-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Glossary"
        options={{
          drawerLabel: 'Glossary',
          title: 'Glossary',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

export default function DrawerLayout() {
  return (
    <ThemeProvider>
      <DrawerNavigator />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  glossyDrawer: {
    width: width * 0.8,
    height: height * 0.9,
    position: 'absolute',
    top: height * 0.05,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
});
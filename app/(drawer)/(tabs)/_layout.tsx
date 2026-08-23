import React from 'react';
import { View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';

export default function TabsLayout() {
  const { colors, isDarkMode } = useTheme();

  const activeColor = isDarkMode ? '#34D399' : '#166534';
  const inactiveColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const tabBgColor = isDarkMode ? (colors.card || '#1F2937') : '#FFFFFF';
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background || (isDarkMode ? '#111827' : '#FFFFFF') }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            marginBottom: Platform.OS === 'ios' ? 0 : 6,
          },
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 95 : 75, // INCREASED HEIGHT TO PREVENT OVERLAP
            paddingTop: 10,
            backgroundColor: tabBgColor,
            borderTopWidth: 1,
            borderTopColor: borderColor,
            elevation: 25,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            paddingBottom: Platform.OS === 'ios' ? 35 : 12, // ADDED PADDING AT BOTTOM
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Service"
          options={{
            title: 'Service',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'construct' : 'construct-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Book"
          options={{
            title: 'Book',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="About"
          options={{
            title: 'About',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Contact"
          options={{
            title: 'Contact',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'call' : 'call-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="service/ServiceDetail" options={{ href: null }} />
      </Tabs>
    </View>
  );
}
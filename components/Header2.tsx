import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';
import { useNavigation, router } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header2({ title, showBack = false }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { isDarkMode, colors } = useTheme();
  const navigation = useNavigation();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace('/(drawer)/(tabs)');
    }
  };

  const handleOpenDrawer = () => {
    try {
      const parent = navigation.getParent();
      if (parent) {
        parent.dispatch(DrawerActions.openDrawer());
      } else {
        navigation.dispatch(DrawerActions.openDrawer());
      }
    } catch {
      try {
        navigation.dispatch(DrawerActions.openDrawer());
      } catch {
        router.replace('/(drawer)/(tabs)');
      }
    }
  };

  const handleWhatsApp = async () => {
    const phoneNumber = '9779851152774';
    const message = encodeURIComponent('Hello Cleaning Sewa, I have an inquiry.');
    const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    const webUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch {
      Alert.alert('Error', 'Unable to open WhatsApp.');
    }
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: isDarkMode ? (colors.card || '#111827') : '#064E3B',
          paddingTop: Math.max(insets.top, 10),
        },
      ]}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        )}
        <Text style={styles.brandName} numberOfLines={1}>
          {title || 'Cleaning Sewa'}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleWhatsApp} activeOpacity={0.7}>
          <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleOpenDrawer}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  backBtn: {
    paddingRight: 10,
    paddingVertical: 5,
  },
  logo: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
    marginRight: 10,
    borderRadius: 21,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
    padding: 2,
  },
});
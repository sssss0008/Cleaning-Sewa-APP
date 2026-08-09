import React from 'react';
import { TouchableOpacity, StyleSheet, View, Image, Text, StatusBar, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Header2() {
  const navigation = useNavigation<any>();

  const openWhatsApp = async () => {
    const phoneNumber = '977981152774';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    const browserUrl = `https://wa.me/${phoneNumber}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(browserUrl);
      }
    } catch (error) {
      Linking.openURL(browserUrl).catch(() => {
        Alert.alert('Error', 'Failed to open WhatsApp');
      });
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" />
      <LinearGradient
        colors={['#064E3B', '#064E3B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.subHeader}>
          <View style={styles.left}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../assets/images/icon.png')}
                style={styles.leftIcon}
              />
              <View style={styles.iconGlow} />
            </View>
            <View>
              <Text style={styles.title}>Cleaning Sewa</Text>
            </View>
          </View>

          <View style={styles.right}>
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.7}
              onPress={openWhatsApp}
            >
              <Image
                source={require('../assets/whatsapp.png')}
                style={styles.rightIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() =>
                navigation.dispatch(DrawerActions.openDrawer())
              }
              activeOpacity={0.8}
            >
              <View>
                <Ionicons name="menu" size={35} color='#fff' />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    paddingTop: 45,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    flex: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  iconContainer: {
    position: 'relative',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  leftIcon: {
    width: 39,
    height: 39,
    resizeMode: 'contain',
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
  },
  rightIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  menuButton: {
    padding: 4,
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { useTheme } from '../src/context/ThemeContext';

export default function CustomDrawer(_props: DrawerContentComponentProps) {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme, colors: themeColors } = useTheme();

  const isActive = (route: string) => pathname === route;

  const navigateTo = (route: any) => {
    _props.navigation.closeDrawer();
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          router.push(route);
        } catch (error) {
          console.error('Navigation error:', error);
          router.replace(route);
        }
      }, 0);
    });
  };

  const openSocial = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open social media link'));
  };

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: 'transparent' }]} edges={['top', 'bottom']}>
      <View style={[styles.card, { backgroundColor: themeColors.drawerBg }]}>

        {/* PROFILE SECTION */}
        <View style={styles.profileBox}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name} numberOfLines={1}>CleaningSewa</Text>
            <Text style={styles.firebaseAuthText} numberOfLines={1}>
              Guest User
            </Text>
          </View>

          {/* THEME TOGGLE (SUG_003) */}
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
             <Ionicons
               name={isDarkMode ? "sunny" : "moon"}
               size={wp('6%')}
               color="#FFF"
             />
          </TouchableOpacity>
        </View>

        {/* MENU */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menu}
        >
          <MenuItem
            icon={isActive('/Home') ? "home" : "home-outline"}
            label="Home"
            active={isActive('/Home')}
            onPress={() => navigateTo('/Home')}
          />
          <MenuItem
            icon={isActive('/Service') ? "construct" : "construct-outline"}
            label="Services"
            active={isActive('/Service')}
            onPress={() => navigateTo('/Service')}
          />
          <MenuItem
            icon={isActive('/Book') ? "card" : "card-outline"}
            label="Book a Service"
            active={isActive('/Book')}
            onPress={() => navigateTo('/Book')}
          />
          <MenuItem
            icon={isActive('/About') ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"}
            label="About"
            active={isActive('/About')}
            onPress={() => navigateTo('/About')}
          />
          <MenuItem
            icon={isActive('/Contact') ? "call" : "call-outline"}
            label="Contact & Support"
            active={isActive('/Contact')}
            onPress={() => navigateTo('/Contact')}
          />

          <View style={styles.divider} />

          <MenuItem
            icon={isActive('/Partnership') ? "people" : "people-outline"}
            label="Become a Partner"
            active={isActive('/Partnership')}
            onPress={() => navigateTo('/Partnership')}
          />
          <MenuItem
            icon={isActive('/Career') ? "briefcase" : "briefcase-outline"}
            label="Join as a Professional"
            active={isActive('/Career')}
            onPress={() => navigateTo('/Career')}
          />
          <MenuItem
            icon={isActive('/FAQs') ? "help-circle" : "help-circle-outline"}
            label="FAQs"
            active={isActive('/FAQs')}
            onPress={() => navigateTo('/FAQs')}
          />

          <View style={styles.divider} />

          {/* POLICY PAGES (SUG_004, SUG_007) */}
          <MenuItem
            icon={isActive('/PrivacyPolicy') ? "shield-checkmark" : "shield-checkmark-outline"}
            label="Privacy Policy"
            active={isActive('/PrivacyPolicy')}
            onPress={() => navigateTo('/PrivacyPolicy')}
          />
          <MenuItem
            icon={isActive('/RefundPolicy') ? "refresh-circle" : "refresh-circle-outline"}
            label="Refund Policy"
            active={isActive('/RefundPolicy')}
            onPress={() => navigateTo('/RefundPolicy')}
          />

          <View style={styles.dividerAdmin} />

          {/* ADMIN LOGIN */}
          <MenuItem
            icon={isActive('/Admin') ? "lock-closed" : "lock-closed-outline"}
            label="Admin Login"
            active={isActive('/Admin')}
            onPress={() => navigateTo('/Admin')}
          />

          {/* SOCIAL MEDIA HANDLES (SUG_008) */}
          <View style={styles.socialContainer}>
            <Text style={styles.socialText}>Follow Us</Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity onPress={() => openSocial('https://facebook.com/cleaningsewa')}>
                <Ionicons name="logo-facebook" size={wp('6%')} color="#3b5998" style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openSocial('https://instagram.com/cleaningsewa')}>
                <Ionicons name="logo-instagram" size={wp('6%')} color="#C13584" style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openSocial('https://tiktok.com/@cleaningsewa')}>
                <Ionicons name="logo-tiktok" size={wp('6%')} color="#000000" style={styles.socialIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* MENU ITEM SUB-COMPONENT */
type MenuItemProps = {
  icon: any;
  label: string;
  onPress: () => void;
  active: boolean;
  isLogout?: boolean;
};

const MenuItem = React.memo(({ icon, label, onPress, active, isLogout }: MenuItemProps) => {
  const isAdminButton = label === "Admin Login";
  const { colors: themeColors } = useTheme();

  const getIconColor = () => {
    if (active) return '#059669';
    if (isLogout) return '#EF4444';
    if (isAdminButton) return '#FFFFFF';
    return themeColors.subText;
  };

  return (
    <TouchableOpacity
      style={[
        styles.item,
        active && styles.itemActive,
        isAdminButton && styles.adminButton
      ]}
      onPress={onPress}
      activeOpacity={0.65}
    >
      {active && <View style={styles.activeIndicator} />}
      <Ionicons
        name={icon}
        size={wp('4.5%')}
        color={getIconColor()}
        style={[
          active ? styles.iconActive : null,
          isAdminButton && { marginRight: wp('-1%') }
        ]}
      />
      <Text style={[
        styles.label,
        active && styles.labelActive,
        isLogout && styles.labelLogout,
        isAdminButton && styles.adminButtonText,
        { color: isAdminButton ? '#FFF' : active ? '#047857' : themeColors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: wp('6%'),
    marginHorizontal: wp('2.5%'),
    marginVertical: hp('1%'),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.5%') },
        shadowOpacity: 0.08,
        shadowRadius: hp('1.5%'),
      },
      android: {
        elevation: 5,
      }
    })
  },
  profileBox: {
    backgroundColor: '#064E3B',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%')
  },
  avatar: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    marginRight: wp('3.5%')
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'left',
    marginBottom: hp('0.1%')
  },
  firebaseAuthText: {
    fontSize: wp('2.8%'),
    color: '#A7F3D0',
    fontWeight: '600',
    textAlign: 'left'
  },
  themeToggle: {
    padding: 8,
  },
  menu: {
    paddingHorizontal: wp('3.5%'),
    paddingBottom: hp('2%'),
    paddingTop: hp('0.5%')
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('0.5%'),
    position: 'relative',
  },
  itemActive: {
    backgroundColor: '#ECFDF5',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '20%',
    bottom: '20%',
    width: wp('1%'),
    backgroundColor: '#059669',
    borderTopRightRadius: wp('0.5%'),
    borderBottomRightRadius: wp('0.5%'),
  },
  iconActive: {
    transform: [{ scale: 1.05 }],
  },
  label: {
    marginLeft: wp('4%'),
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700'
  },
  labelLogout: {
    color: '#EF4444',
    fontWeight: '600'
  },
  divider: {
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: hp('1.5%'),
    marginHorizontal: wp('2%'),
  },
  dividerAdmin: {
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: hp('1%'),
    marginHorizontal: wp('2%'),
  },
  adminButton: {
    backgroundColor: '#064E3B',
    borderRadius: wp('3%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    marginTop: hp('0.5%'),
  },
  adminButtonText: {
    fontWeight: '700',
    fontSize: wp('3.5%'),
    marginLeft: wp('2%'),
  },
  socialContainer: {
    marginTop: hp('3%'),
    alignItems: 'center',
    paddingBottom: hp('2%'),
  },
  socialText: {
    fontSize: wp('3.2%'),
    color: '#9CA3AF',
    marginBottom: hp('1%'),
    fontWeight: '600',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: wp('6%'),
  },
  socialIcon: {
    opacity: 0.8,
  },
});
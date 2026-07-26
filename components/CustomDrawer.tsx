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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';

export default function CustomDrawer(_props: DrawerContentComponentProps) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

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

  const handleLogout = async () => {
    try {
      _props.navigation.closeDrawer();
      setIsLoggedIn(false);
      setRole(null);

      Alert.alert(
        "Session Ended",
        "You have been securely signed out. See you again soon! 👋",
        [
          {
            text: "OK",
            onPress: () => {
              requestAnimationFrame(() => {
                router.replace('/Home');
              });
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert("Logout Failed", "We encountered an issue signing you out. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
      <View style={styles.card}>

        {/* PROFILE SECTION */}
        <View style={styles.profileBox}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.avatar}
          />
          <Text style={styles.name} numberOfLines={1}>CleaningSewa</Text>
          <Text style={styles.firebaseAuthText} numberOfLines={1} ellipsizeMode="tail">
            Guest User
          </Text>
        </View>

        {/* MENU */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menu}
        >
          {/* TOP SECTION */}
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
            label="Contact"
            active={isActive('/Contact')}
            onPress={() => navigateTo('/Contact')}
          />

          <View style={styles.divider} />

          {/* MIDDLE SECTION */}
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
          <MenuItem
            icon={isActive('/Glossary') ? "book" : "book-outline"}
            label="Glossary"
            active={isActive('/Glossary')}
            onPress={() => navigateTo('/Glossary')}
          />

          <View style={styles.dividerAdmin} />

          {/* ADMIN LOGIN - FIXED ROUTE TO /Admin */}
          <MenuItem
            icon={isActive('/Admin') ? "shield-checkmark" : "shield-checkmark-outline"}
            label="Admin Login"
            active={isActive('/Admin')}
            onPress={() => navigateTo('/Admin')}
          />
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

  const getIconColor = () => {
    if (active) return '#059669';
    if (isLogout) return '#EF4444';
    if (isAdminButton) return '#FFFFFF';
    return '#6B7280';
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
        isAdminButton && styles.adminButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: wp('6%'),
    margin: wp('2.5%'),
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
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1.5%')
  },
  avatar: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    marginBottom: hp('1%')
  },
  name: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: hp('0.5%')
  },
  firebaseAuthText: {
    fontSize: wp('2.8%'),
    color: '#A7F3D0',
    fontWeight: '600',
    textAlign: 'center'
  },
  menu: {
    paddingHorizontal: wp('3.5%'),
    paddingBottom: hp('3%'),
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
    backgroundColor: 'transparent',
  },
  itemActive: {
    backgroundColor: '#ECFDF5',
    ...Platform.select({
      ios: {
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: hp('0.2%') },
        shadowOpacity: 0.05,
        shadowRadius: wp('1%'),
      },
      android: {
        elevation: 1,
      }
    })
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
    color: '#4B5563'
  },
  labelActive: {
    color: '#047857',
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
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: hp('0.5%') },
        shadowOpacity: 0.3,
        shadowRadius: wp('2%'),
      },
      android: {
        elevation: 4,
      }
    })
  },
  adminButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: wp('3.5%'),
    marginLeft: wp('2%'),
  },
});
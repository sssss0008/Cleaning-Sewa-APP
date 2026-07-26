import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Standardized `@/` root alias imports
import Header2 from '@/components/Header2';
import NumberBar from '@/components/home/NumberBar';
import ServiceCarousel from '@/components/home/ServiceCarousel';

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView | null>(null);

  // Dev helper to test onboarding flow
  const handleResetOnboarding = async () => {
    await AsyncStorage.removeItem('hasSeenOnboarding');
    Alert.alert('Onboarding Reset', 'Restarting app flow...', [
      { text: 'OK', onPress: () => router.replace('/onboarding1') },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Header2 />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HERO ─────────────────────────────────────── */}
        <View style={styles.hero}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=1000&auto=format&fit=crop',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.05)', 'rgba(18,46,44,0.98)']}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroTitle}>
              Welcome To {'\n'} Cleaning Sewa
            </Text>

            <View style={styles.heroNumberBar}>
              <NumberBar
                onFocus={() =>
                  scrollRef.current?.scrollTo({ y: hp('45%'), animated: true })
                }
              />
            </View>
          </LinearGradient>
        </View>

        {/* ── TOP SERVICES ──────────────────────────────── */}
        <View style={styles.section}>
          {/* FEATURED BANNER */}
          <TouchableOpacity
            style={styles.featuredCard}
            activeOpacity={0.88}
            onPress={() =>
              router.push({
                pathname: '/service/ServiceDetail',
                params: { id: '3' },
              })
            }
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop',
              }}
              style={styles.featuredImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(28,43,42,0.95)']}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>Most Popular</Text>
              </View>
              <Text style={styles.featuredTitle}>Deep Cleaning</Text>
              <Text style={styles.featuredSub}>
                Professional Home Cleaning Service
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* SECTION HEADER CONTAINER */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Top Services</Text>
            <TouchableOpacity
              onPress={() => router.push('/Service')}
              hitSlop={12}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* AUTO-SLIDING CAROUSEL COMPONENT */}
          <ServiceCarousel animationDuration={8000} />

          {/* ── DEV TOOLS (Quick Onboarding Reset) ── */}
          {__DEV__ && (
            <TouchableOpacity
              style={styles.devResetBtn}
              onPress={handleResetOnboarding}
            >
              <Text style={styles.devResetText}>↺ Reset Onboarding (Dev)</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F9F8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp('5%'),
  },

  /* HERO SECTION */
  hero: {
    width: '100%',
    height: hp('31%'),
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '85%',
    justifyContent: 'flex-end',
    paddingHorizontal: wp('5.5%'),
    paddingBottom: hp('3%'),
  },
  heroTitle: {
    fontSize: wp('7%'),
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: wp('8%'),
    letterSpacing: -0.2,
    marginBottom: hp('1%'),
  },
  heroNumberBar: {
    marginTop: hp('0.5%'),
  },

  /* CATEGORIES & SECTIONS */
  section: {
    marginTop: hp('2.5%'),
    paddingHorizontal: wp('4.5%'),
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2.5%'),
    marginBottom: hp('1.5%'),
  },
  sectionTitle: {
    fontSize: wp('4.6%'),
    fontWeight: '800',
    color: '#064E3B',
    letterSpacing: -0.1,
  },
  seeAll: {
    fontSize: wp('3.4%'),
    fontWeight: '600',
    color: '#295C59',
    paddingLeft: wp('2%'),
  },

  /* FEATURED CARD */
  featuredCard: {
    width: '100%',
    height: hp('23%'),
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: hp('1%'),
    elevation: 3,
    shadowColor: '#1C2B2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: wp('4.5%'),
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2F1',
    borderRadius: 8,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    marginBottom: hp('1%'),
  },
  featuredBadgeText: {
    fontSize: wp('2.8%'),
    color: '#295C59',
    fontWeight: '700',
  },
  featuredTitle: {
    fontSize: wp('5%'),
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.1,
  },
  featuredSub: {
    fontSize: wp('3.2%'),
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '400',
    marginTop: hp('0.2%'),
  },

  /* DEV RESET BUTTON */
  devResetBtn: {
    marginTop: hp('4%'),
    paddingVertical: hp('1.2%'),
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  devResetText: {
    color: '#991B1B',
    fontWeight: '700',
    fontSize: wp('3.2%'),
  },
});
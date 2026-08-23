import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── FIXED IMPORTS ───────────────────────────────────────────────
import Header2 from '../../../components/Header2';
import { servicesData2, DEFAULT_SERVICE_IMAGE } from '../../../src/data/ServiceData';

// ── TOP 5 CAROUSEL DATA (MAPPED FROM CENTRAL DATA) ────────────────
const CAROUSEL_SERVICES = servicesData2.slice(0, 5).map((item) => ({
  id: String(item.id),
  title: item.name,
  category: item.words,
  image: item.image,
}));

// ── NUMBER BAR COMPONENT ──────────────────────────────────────────
function NumberBar({ onFocus }: { onFocus?: () => void }) {
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!phone || phone.trim().length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }
    Alert.alert(
      'Callback Requested',
      `Thank you! Our CleaningSewa team will call you back shortly on ${phone}.`
    );
    setPhone('');
  };

  return (
    <View style={numberBarStyles.container}>
      <Text style={numberBarStyles.flag}>🇳🇵</Text>
      <TextInput
        style={numberBarStyles.input}
        placeholder="98XXXXXXXX"
        placeholderTextColor="#9CA3AF"
        keyboardType="phone-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
        onFocus={onFocus}
      />
      <TouchableOpacity
        style={numberBarStyles.submitBtn}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <Text style={numberBarStyles.submitBtnText}>Get Call</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── SERVICE CAROUSEL COMPONENT ────────────────────────────────────
function ServiceCarousel({ animationDuration = 6000 }: { animationDuration?: number }) {
  const flatListRef = useRef<FlatList | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!flatListRef.current) return;
      let nextIndex = currentIndex + 1;
      // Loop back if we reach the end minus visible items (approx 3)
      if (nextIndex > CAROUSEL_SERVICES.length - 2) {
        nextIndex = 0;
      }
      setCurrentIndex(nextIndex);
      try {
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      } catch (e) {
        // Fallback for out of bounds or not ready
      }
    }, animationDuration / 2);

    return () => clearInterval(timer);
  }, [currentIndex, animationDuration]);

  const itemLength = wp('30.5%');

  return (
    <View style={carouselStyles.container}>
      <FlatList
        ref={flatListRef}
        data={CAROUSEL_SERVICES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        snapToInterval={itemLength}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: wp('1%') }}
        getItemLayout={(_, index) => ({
          length: itemLength,
          offset: itemLength * index,
          index,
        })}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={carouselStyles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push(`/service/ServiceDetail?id=${item.id}`)
            }
          >
            <Image
              source={item.image}
              style={carouselStyles.cardImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.92)']}
              style={carouselStyles.cardGradient}
            >
              <Text style={carouselStyles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ── MAIN HOME SCREEN COMPONENT ─────────────────────────────────────
export default function HomeScreen() {
  const scrollRef = useRef<ScrollView | null>(null);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      <Header2 />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* ── HERO SECTION ─────────────────────────────────── */}
        <View style={styles.hero}>
          <Image
            source={DEFAULT_SERVICE_IMAGE}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.05)', 'rgba(18,46,44,0.98)']}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroTitle}>
              Professional {'\n'} Cleaning Service
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
              router.push('/service/ServiceDetail?id=3')
            }
          >
            <Image
              source={servicesData2[2].image}
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

          {/* AUTO-SLIDING CAROUSEL */}
          <ServiceCarousel animationDuration={6000} />
        </View>
      </ScrollView>
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────
const numberBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    paddingLeft: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  flag: { fontSize: 20, marginRight: 8 },
  input: { flex: 1, height: 44, paddingHorizontal: 8, fontSize: 14, color: '#1F2937' },
  submitBtn: { backgroundColor: '#064E3B', paddingHorizontal: 20, height: 42, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
});

const carouselStyles = StyleSheet.create({
  container: { marginTop: hp('1%') },
  card: {
    width: wp('28.5%'),
    height: hp('15%'),
    borderRadius: 10,
    marginRight: wp('2%'),
    overflow: 'hidden',
    backgroundColor: '#374151',
  },
  cardImage: { width: '100%', height: '100%', backgroundColor: '#E5E7EB' },
  cardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '82%', justifyContent: 'flex-end', padding: 6 },
  cardCategory: { fontSize: 8, color: '#34D399', fontWeight: '800', textTransform: 'uppercase' },
  cardTitle: { fontSize: 11, fontWeight: '700', color: '#FFFFFF', marginTop: 2, lineHeight: 13 },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1, paddingBottom: hp('5%'), backgroundColor: '#F6F9F8' },
  hero: { width: '100%', height: hp('33%'), position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '95%',
    justifyContent: 'flex-end',
    paddingHorizontal: wp('5.5%'),
    paddingBottom: hp('4%')
  },
  heroTitle: {
    fontSize: wp('8%'),
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: wp('10%'),
    letterSpacing: -0.5,
    marginBottom: hp('1.5%')
  },
  heroNumberBar: { marginTop: hp('0.5%') },
  section: { marginTop: hp('2.5%'), paddingHorizontal: wp('4.5%') },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: hp('2.5%'), marginBottom: hp('1.5%') },
  sectionTitle: { fontSize: wp('4.6%'), fontWeight: '800', color: '#064E3B', letterSpacing: -0.1 },
  seeAll: { fontSize: wp('3.4%'), fontWeight: '600', color: '#295C59', paddingLeft: wp('2%') },
  featuredCard: { width: '100%', height: hp('23%'), borderRadius: 16, overflow: 'hidden', marginTop: hp('1%'), elevation: 3, shadowColor: '#1C2B2A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10 },
  featuredImage: { width: '100%', height: '100%' },
  featuredGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', justifyContent: 'flex-end', padding: wp('4.5%') },
  featuredBadge: { alignSelf: 'flex-start', backgroundColor: '#E0F2F1', borderRadius: 8, paddingHorizontal: wp('2.5%'), paddingVertical: hp('0.4%'), marginBottom: hp('1%') },
  featuredBadgeText: { fontSize: wp('2.8%'), color: '#295C59', fontWeight: '700' },
  featuredTitle: { fontSize: wp('5%'), fontWeight: '800', color: '#ffffff', letterSpacing: -0.1 },
  featuredSub: { fontSize: wp('3.2%'), color: 'rgba(255,255,255,0.85)', fontWeight: '400', marginTop: hp('0.2%') },
  devResetBtn: { marginTop: hp('4%'), paddingVertical: hp('1.2%'), alignItems: 'center', backgroundColor: '#FEE2E2', borderRadius: 8, borderWidth: 1, borderColor: '#FCA5A5' },
  devResetText: { color: '#991B1B', fontWeight: '700', fontSize: wp('3.2%') },
});
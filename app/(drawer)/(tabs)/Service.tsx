import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../../src/context/ThemeContext';
import Header2 from '../../../components/Header2';
import { servicesData2, DEFAULT_SERVICE_IMAGE } from '../../../src/data/ServiceData';

export default function ServiceScreen() {
  const [q, setQ] = useState('');
  const { isDarkMode, colors } = useTheme();

  const filtered = useMemo(() =>
    servicesData2.filter(s => s.name.toLowerCase().includes(q.toLowerCase())),
  [q]);

  const renderServiceCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/service/ServiceDetail?id=${item.id}`)}
    >
      <Image source={item.image} style={styles.cardImg} />
      <View style={styles.cardInfo}>
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderBanner = (serviceId: number) => {
    const s = servicesData2.find(x => x.id === serviceId);
    if (!s) return null;
    return (
      <TouchableOpacity
        style={styles.banner}
        onPress={() => router.push(`/service/ServiceDetail?id=${s.id}`)}
      >
        <Image source={s.image} style={styles.bannerImg} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.bannerGrad}>
          <Text style={styles.bannerBrand}>CLEANINGSEWA</Text>
          <Text style={styles.bannerTitle}>{s.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? colors.background : '#F8FAFC' }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Header2 />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* HERO SECTION FOR SERVICE PAGE */}
        <View style={styles.hero}>
          <Image source={DEFAULT_SERVICE_IMAGE} style={styles.heroImg} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroOver}>
            <Text style={styles.heroTitle}>Professional Cleaning Service in Kathmandu Nepal</Text>

            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Search for a service..."
                value={q}
                onChangeText={setQ}
                style={styles.searchInput}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </LinearGradient>
        </View>

        {!q ? (
          <>
            {/* TOP 2 SERVICES IN VERTICAL LAYOUT (ONLY 2 AS REQUESTED) */}
            <View style={styles.section}>
              <Text style={[styles.secTitle, { color: isDarkMode ? colors.primary : '#064E3B', paddingLeft: 20 }]}>Top Services</Text>
              <View style={styles.topVerticalContainer}>
                {servicesData2.slice(0, 2).map(item => (
                  <TouchableOpacity key={item.id} style={styles.topVerticalCard} onPress={() => router.push(`/service/ServiceDetail?id=${item.id}`)}>
                    <Image source={item.image} style={styles.topVerticalImg} />
                    <LinearGradient colors={['transparent', 'rgba(6, 78, 59, 0.9)']} style={styles.topVerticalGrad}>
                      <Text style={styles.topVerticalTxt}>{item.name}</Text>
                      <Text style={styles.topVerticalSubTxt} numberOfLines={1}>{item.words}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.secTitle, { color: isDarkMode ? colors.primary : '#064E3B', paddingLeft: 20 }]}>Trending Services</Text>

              <View style={styles.grid}>
                {servicesData2.slice(2, 10).map(s => (
                  <View key={s.id} style={{ width: '48%', marginBottom: 12 }}>
                    {renderServiceCard({ item: s })}
                  </View>
                ))}
              </View>

              {renderBanner(11)}

              <View style={styles.grid}>
                {servicesData2.slice(11, 23).map(s => (
                  <View key={s.id} style={{ width: '48%', marginBottom: 12 }}>
                    {renderServiceCard({ item: s })}
                  </View>
                ))}
              </View>

              {renderBanner(24)}

              <View style={styles.grid}>
                {servicesData2.slice(24).map(s => (
                  <View key={s.id} style={{ width: '48%', marginBottom: 12 }}>
                    {renderServiceCard({ item: s })}
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.grid}>
            {filtered.map(s => (
               <View key={s.id} style={{ width: '48%', marginBottom: 12 }}>
                  {renderServiceCard({ item: s })}
               </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 110 },
  hero: { width: '100%', height: 220, position: 'relative', marginBottom: 25 },
  heroImg: { width: '100%', height: '100%' },
  heroOver: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '90%', justifyContent: 'flex-end', padding: 24 },
  heroTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', lineHeight: 32, marginBottom: 20, letterSpacing: -0.5 },
  searchBar: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 14, height: 54, alignItems: 'center', paddingHorizontal: 18, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 5 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: '#111827', fontWeight: '500' },
  section: { marginBottom: 30 },
  secTitle: { fontSize: 20, fontWeight: '900', marginBottom: 18, letterSpacing: -0.3 },

  /* VERTICAL TOP SERVICES */
  topVerticalContainer: { paddingHorizontal: 20, gap: 18 },
  topVerticalCard: { width: '100%', height: 130, borderRadius: 18, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
  topVerticalImg: { width: '100%', height: '100%' },
  topVerticalGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', justifyContent: 'flex-end', padding: 18 },
  topVerticalTxt: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  topVerticalSubTxt: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4, fontWeight: '500' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', elevation: 3, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardImg: { width: '100%', height: 110 },
  cardInfo: { padding: 10, minHeight: 45, justifyContent: 'center' },
  cardTitle: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
  banner: { width: wp('90%'), height: 150, alignSelf: 'center', borderRadius: 18, overflow: 'hidden', marginVertical: 12, elevation: 3 },
  bannerImg: { width: '100%', height: '100%' },
  bannerGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', justifyContent: 'flex-end', padding: 15 },
  bannerBrand: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 3 },
  bannerTitle: { color: '#FFF', fontSize: 20, fontWeight: '900' }
});
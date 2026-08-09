import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ImageSourcePropType,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';

import ServicesCards from '../../../components/services/ServicesCards';
import ServicesDisplaycard from '../../../components/services/ServicesDisplaycard';
import Header2 from '../../../components/Header2';
import { servicesData2, DEFAULT_SERVICE_IMAGE } from '../../../src/data/ServiceData';

// --- Safe Image Helper Function ---
const getSafeImageSource = (source: any) => {
  if (!source) return DEFAULT_SERVICE_IMAGE;
  if (typeof source === 'string') return { uri: source };
  return source; // Returns local require() number directly
};

// --- Safe Image Component with Default Fallback ---
interface SafeImageProps {
  source: string | ImageSourcePropType;
  style: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

const SafeImage: React.FC<SafeImageProps> = ({ source, style, resizeMode = 'cover' }) => {
  const initialSource = useMemo(() => getSafeImageSource(source), [source]);
  const [imgSource, setImgSource] = useState<ImageSourcePropType>(initialSource);

  useEffect(() => {
    setImgSource(getSafeImageSource(source));
  }, [source]);

  return (
    <Image
      source={imgSource}
      style={style}
      resizeMode={resizeMode}
      onError={() => {
        setImgSource(DEFAULT_SERVICE_IMAGE);
      }}
    />
  );
};

// --- Top Services: 3 Specific Items ---
const topServicesList = servicesData2
  .filter((item) => item.id === 1 || item.id === 8 || item.id === 14)
  .slice(0, 3);

type ServiceItem = (typeof servicesData2)[0];
type RowItem =
  | { type: 'pair'; items: ServiceItem[]; key: string }
  | { type: 'featured'; item: ServiceItem; key: string };

const PAIRS_BEFORE_FEATURED = 3;

function buildRows(services: ServiceItem[]): RowItem[] {
  const rows: RowItem[] = [];
  let i = 0;
  let pairCount = 0;
  while (i < services.length) {
    if (pairCount === PAIRS_BEFORE_FEATURED && i < services.length) {
      rows.push({ type: 'featured', item: services[i], key: `featured-${services[i].id}` });
      i++;
      pairCount = 0;
    } else {
      const pair: ServiceItem[] = [services[i]];
      if (i + 1 < services.length) pair.push(services[i + 1]);
      rows.push({ type: 'pair', items: pair, key: `pair-${pair.map((p) => p.id).join('-')}` });
      i += pair.length;
      pairCount++;
    }
  }
  return rows;
}

export default function ServiceScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return servicesData2;
    return servicesData2.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const topServiceIds = useMemo(() => topServicesList.map((s) => s.id), []);

  const rows = useMemo(() => {
    // If searching, we show all filtered results as pairs, no featured logic for simplicity in results
    if (searchQuery.trim()) {
      const results: RowItem[] = [];
      for (let i = 0; i < filteredServices.length; i += 2) {
        const pair = [filteredServices[i]];
        if (i + 1 < filteredServices.length) pair.push(filteredServices[i + 1]);
        results.push({ type: 'pair', items: pair, key: `search-pair-${i}` });
      }
      return results;
    }

    const trending = servicesData2.filter((item) => !topServiceIds.includes(item.id));
    return buildRows(trending);
  }, [filteredServices, topServiceIds, searchQuery]);

  const renderItem = useCallback(
    ({ item, index }: { item: RowItem; index: number }) => {
      if (item.type === 'featured') {
        return (
          <TouchableOpacity
            style={styles.featuredContainer}
            activeOpacity={0.88}
            onPress={() =>
              router.push({
                pathname: '/service/ServiceDetail',
                params: { id: item.item.id.toString() },
              })
            }
          >
            <SafeImage source={item.item.image} style={styles.featuredImage} resizeMode="cover" />
            <LinearGradient colors={['transparent', 'rgba(18,46,44,0.90)']} style={styles.featuredGradient}>
              <Text style={styles.featuredLabel}>CleaningSewa</Text>
              <Text style={styles.featuredName}>{item.item.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      }

      const isLastSingleItem = index === rows.length - 1 && item.items.length === 1;

      return (
        <View style={[styles.pairRow, isLastSingleItem && styles.singleItemRow]}>
          {item.items.map((s) => (
            <View
              key={s.id}
              style={[styles.serviceItemContainer, isLastSingleItem && styles.fullWidthItem]}
            >
              <ServicesDisplaycard
                id={s.id}
                name={s.name}
                words={s.words}
                image={s.image || DEFAULT_SERVICE_IMAGE}
                onPress={() =>
                  router.push({
                    pathname: '/service/ServiceDetail',
                    params: { id: s.id.toString() },
                  })
                }
              />
            </View>
          ))}
          {item.items.length === 1 && !isLastSingleItem && <View style={styles.serviceItemContainer} />}
        </View>
      );
    },
    [rows.length]
  );

  const headerImageSource = useMemo(() => getSafeImageSource(DEFAULT_SERVICE_IMAGE), []);

  const ListHeader = useMemo(
    () => (
      <View>
        <ImageBackground
          source={headerImageSource}
          resizeMode="cover"
          style={styles.headerBackground}
        >
          <LinearGradient colors={['rgba(18,46,44,0.35)', 'rgba(18,46,44,0.97)']} style={styles.headerGradient}>
            <Text style={styles.headerTitle}> Professional Cleaning in Nepal</Text>
            <Text style={styles.headerSubtitle}>
              Your trusted cleaning partner from concept to completion, building homes with quality,
              transparency, and excellence across Nepal.
            </Text>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              placeholder="Search for a service..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {!searchQuery && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle1}>Top Services</Text>
            <View style={styles.topServicesWrapper}>
              {topServicesList.map((item) => (
                <ServicesCards
                  key={item.id}
                  title={item.name}
                  name={item.name}
                  description={item.description}
                  image={item.image || DEFAULT_SERVICE_IMAGE}
                  question={item.question}
                  answer={item.answer}
                  style={styles.topServiceCard}
                  onPress={() =>
                    router.push({
                      pathname: '/service/ServiceDetail',
                      params: { id: item.id.toString() },
                    })
                  }
                />
              ))}
            </View>
            <Text style={styles.sectionTitle2}>Trending Services</Text>
          </View>
        )}

        {searchQuery && filteredServices.length > 0 && (
          <View style={styles.sectionContainer}>
             <Text style={styles.sectionTitle2}>Search Results ({filteredServices.length})</Text>
          </View>
        )}

        {searchQuery && filteredServices.length === 0 && (
          <View style={styles.emptyResults}>
             <Ionicons name="search-outline" size={64} color="#E5E7EB" />
             <Text style={styles.emptyResultsText}>No services found matching "{searchQuery}"</Text>
          </View>
        )}
      </View>
    ),
    [headerImageSource, searchQuery, filteredServices.length]
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header2 />
      <FlatList
        data={rows}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    width: wp('100%'),
    height: hp('26%'),
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%'),
    gap: 4,
  },
  headerTitle: {
    fontSize: wp('6%'),
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
  },
  searchSection: {
    paddingHorizontal: wp('4%'),
    marginTop: -hp('2.5%'),
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  sectionContainer: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('3%'),
  },
  sectionTitle1: {
    fontSize: wp('4.6%'),
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: hp('1.5%'),
  },
  sectionTitle2: {
    fontSize: wp('4.6%'),
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: hp('2.5%'),
    marginTop: hp('1%'),
  },
  listContent: {
    paddingBottom: hp('4%'),
  },
  rowSeparator: {
    height: hp('3%'),
  },
  pairRow: {
    flexDirection: 'row',
    paddingHorizontal: wp('4%'),
    justifyContent: 'space-between',
  },
  singleItemRow: {
    justifyContent: 'flex-start',
    paddingHorizontal: wp('4%'),
  },
  serviceItemContainer: {
    width: wp('43.5%'),
  },
  fullWidthItem: {
    width: '100%',
  },
  featuredContainer: {
    marginVertical: hp('1%'),
    marginHorizontal: wp('4%'),
    borderRadius: 16,
    overflow: 'hidden',
    height: hp('20%'),
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  featuredLabel: {
    fontSize: wp('3%'),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'uppercase',
  },
  featuredName: {
    fontSize: wp('5%'),
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  topServicesWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('0.5%'),
    marginBottom: hp('1%'),
  },
  topServiceCard: {
    width: wp('28.5%'),
  },
  emptyResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('10%'),
  },
  emptyResultsText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: wp('10%'),
  },
});
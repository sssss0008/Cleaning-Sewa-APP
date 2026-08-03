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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import ServicesCards from '../../../components/services/ServicesCards';
import ServicesDisplaycard from '../../../components/services/ServicesDisplaycard';
import Header2 from '@/components/Header2';
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

// --- Top Services: 3 Specific Items (1: Bathroom, 8: A/C, 14: Marble / Tile) ---
const topServices = servicesData2
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
  const topServiceIds = useMemo(() => topServices.map((s) => s.id), []);

  const rows = useMemo(() => {
    const trending = servicesData2.filter((item) => !topServiceIds.includes(item.id));
    return buildRows(trending);
  }, [topServiceIds]);

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

  const topServicesList = useMemo(
    () => (
      <View style={styles.topServicesWrapper}>
        {topServices.map((item) => (
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
    ),
    []
  );

  // Safe image header source handling
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

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle1}>Top Services</Text>
          {topServicesList}
          <Text style={styles.sectionTitle2}>Trending Services</Text>
        </View>
      </View>
    ),
    [headerImageSource, topServicesList]
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
    height: hp('28%'),
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
    paddingBottom: hp('2.5%'),
    gap: 4,
  },
  headerTitle: {
    fontSize: wp('6.8%'),
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: wp('3.8%'),
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
  },
  sectionContainer: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
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
    marginTop: hp('1.5%'),
  },
  listContent: {
    paddingBottom: hp('4%'),
  },
  rowSeparator: {
    height: hp('4%'),
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
    marginVertical: hp('1.5%'),
    marginHorizontal: wp('4%'),
    borderRadius: 16,
    overflow: 'hidden',
    height: hp('22%'),
    elevation: 4,
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
    fontSize: wp('5.2%'),
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
});
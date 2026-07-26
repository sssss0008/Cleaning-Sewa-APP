import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  Animated,
  ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import ServicesCards from '../../../components/services/ServicesCards';
import ServicesDisplaycard from '../../../components/services/ServicesDisplaycard';
import Header2 from '@/components/Header2';
import { servicesData2, DEFAULT_SERVICE_IMAGE } from '../../../src/data/ServiceData';
import Ionicons from '@expo/vector-icons/Ionicons';

// --- Safe Image Component with Default Fallback ---
interface SafeImageProps {
  source: string | ImageSourcePropType;
  style: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

const SafeImage: React.FC<SafeImageProps> = ({ source, style, resizeMode = 'cover' }) => {
  const initialSource = useMemo(() => {
    if (!source) return { uri: DEFAULT_SERVICE_IMAGE };
    if (typeof source === 'string') return { uri: source };
    return source;
  }, [source]);

  const [imgSource, setImgSource] = useState<ImageSourcePropType>(initialSource);

  useEffect(() => {
    setImgSource(initialSource);
  }, [initialSource]);

  return (
    <Image
      source={imgSource}
      style={style}
      resizeMode={resizeMode}
      onError={() => {
        // Fallback to default image when image fails to load
        setImgSource({ uri: DEFAULT_SERVICE_IMAGE });
      }}
    />
  );
};

// --- Service list for animated placeholder ---
const PLACEHOLDER_SERVICES = [
  'Plumbing',
  'Painting',
  'Interior Decoration',
  'Glass Works',
  'Tiling',
  'Smart Home Setup',
  'Modular Kitchen',
  'Bathroom Setup',
  'Gardening',
];

// --- Animated Search Bar Component ---
const AnimatedSearchBar = React.memo(({ searchQuery, handleSearch }: any) => {
  const [localText, setLocalText] = useState(searchQuery);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(PLACEHOLDER_SERVICES[0]);
  const [nextPlaceholder, setNextPlaceholder] = useState(PLACEHOLDER_SERVICES[1] || PLACEHOLDER_SERVICES[0]);

  const currentSlideAnim = useRef(new Animated.Value(0)).current;
  const currentFadeAnim = useRef(new Animated.Value(1)).current;
  const nextSlideAnim = useRef(new Animated.Value(30)).current;
  const nextFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLocalText(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (PLACEHOLDER_SERVICES.indexOf(currentPlaceholder) + 1) % PLACEHOLDER_SERVICES.length;
      const newNext = PLACEHOLDER_SERVICES[nextIndex];
      setNextPlaceholder(newNext);

      Animated.parallel([
        Animated.timing(currentSlideAnim, {
          toValue: -30,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(currentFadeAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentPlaceholder(newNext);
        currentSlideAnim.setValue(30);
        currentFadeAnim.setValue(0);

        Animated.parallel([
          Animated.timing(currentSlideAnim, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(currentFadeAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ]).start();
      });

      nextSlideAnim.setValue(30);
      nextFadeAnim.setValue(0);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPlaceholder]);

  const handleChangeText = useCallback(
    (text: string) => {
      setLocalText(text);
      handleSearch(text);
    },
    [handleSearch]
  );

  const showAnimatedPlaceholder = localText.length === 0;

  return (
    <View style={styles.searchSection}>
      <View style={styles.searchContainer}>
        {showAnimatedPlaceholder && (
          <Animated.Text
            style={[
              styles.animatedPlaceholder,
              {
                transform: [{ translateY: currentSlideAnim }],
                opacity: currentFadeAnim,
                position: 'absolute',
                left: wp('10%'),
                right: wp('4%'),
              },
            ]}
            numberOfLines={1}
          >
            Search "{currentPlaceholder}"
          </Animated.Text>
        )}
        <TextInput
          style={[styles.searchInput, { paddingLeft: showAnimatedPlaceholder ? wp('10%') : wp('3%') }]}
          placeholder=""
          placeholderTextColor="#888"
          value={localText}
          onChangeText={handleChangeText}
          clearButtonMode="while-editing"
        />
        <Ionicons name="search" size={28} color="#064E3B" style={styles.searchIcon} />
      </View>
    </View>
  );
});

// --- Logic ---
const topServices = servicesData2.filter((item) => item.id === 1 || item.id === 4);

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
  const [filteredServices, setFilteredServices] = useState(servicesData2);

  const rows = useMemo(() => {
    const trending =
      searchQuery.trim() === ''
        ? filteredServices.filter((item) => item.id !== 1 && item.id !== 4)
        : filteredServices;
    return buildRows(trending);
  }, [filteredServices, searchQuery]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredServices(servicesData2);
    } else {
      const lowerText = text.toLowerCase();
      setFilteredServices(
        servicesData2.filter((item) => item.name.toLowerCase().includes(lowerText))
      );
    }
  }, []);

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

  const searchBar = useMemo(
    () => <AnimatedSearchBar searchQuery={searchQuery} handleSearch={handleSearch} />,
    [searchQuery, handleSearch]
  );

  const topServicesList = useMemo(
    () => (
      <View style={styles.topServicesWrapper}>
        {topServices.map((item) => (
          <ServicesCards
            key={item.id}
            name={item.name}
            description={item.description}
            image={item.image || DEFAULT_SERVICE_IMAGE}
            question={item.question}
            answer={item.answer}
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

  const ListHeader = useMemo(
    () => (
      <View>
        <ImageBackground
          source={{ uri: DEFAULT_SERVICE_IMAGE }}
          resizeMode="cover"
          style={styles.headerBackground}
        >
          <LinearGradient colors={['rgba(0,0,0,0.08)', 'rgba(18,46,44,0.97)']} style={styles.headerGradient}>
            <Text style={styles.headerTitle}>Welcome to Cleaning Sewa.</Text>
            <Text style={styles.headerSubtitle}>
              Your trusted cleaning partner from concept to completion, building homes with quality,
              transparency, and excellence across Nepal.
            </Text>
          </LinearGradient>
        </ImageBackground>

        {searchBar}

        {searchQuery.trim() === '' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle1}>Top Services</Text>
            {topServicesList}
            <Text style={styles.sectionTitle2}>Trending Services</Text>
          </View>
        )}
      </View>
    ),
    [searchBar, searchQuery, topServicesList]
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
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%',
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
  searchSection: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'hsl(0, 0%, 95%)',
    borderRadius: 13,
    paddingHorizontal: wp('3%'),
    height: hp('5.5%'),
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  searchIcon: {
    fontSize: wp('6.5%'),
    marginRight: wp('1%'),
  },
  searchInput: {
    flex: 1,
    fontSize: wp('3.8%'),
    color: '#333',
    height: '100%',
    paddingHorizontal: wp('3%'),
    letterSpacing: 0.7,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  animatedPlaceholder: {
    fontSize: wp('3.8%'),
    color: '#888',
    letterSpacing: 0.7,
    paddingLeft: wp('2%'),
    zIndex: 0,
  },
  sectionContainer: {
    paddingHorizontal: wp('4%'),
  },
  sectionTitle1: {
    fontSize: wp('4.6%'),
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: hp('2%'),
  },
  sectionTitle2: {
    fontSize: wp('4.6%'),
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: hp('2.5%'),
    marginTop: hp('-2%'),
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
    paddingVertical: hp('1%'),
  },
});
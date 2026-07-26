import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type ImageSourcePropType,
  Animated,
  Easing,
} from 'react-native';
import {
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { router } from 'expo-router';
import ServicesCard from './ServicesCard';
import { servicesData2 } from '../../src/data/ServiceData';

// UPDATED: Matched to the new Cleaning Services names so the filter works perfectly
const HOME_SERVICE_NAMES: string[] = [
  'Bathroom Cleaning',
  'Kitchen Cleaning',
  'Home Cleaning',
  'Carpet Cleaning',
  'Sofa / Upholstery Cleaning',
  'A/C Cleaning',
  'Garden Cleaning',
  'Marble / Tile Cleaning',
];

interface ServiceItem {
  id: number | string;
  name: string;
  image: string | ImageSourcePropType; // UPDATED: Accepts network URL string or asset object
  [key: string]: any;
}

type ServiceCarouselProps = {
  onScrollBegin?: () => void;
  onScrollEnd?: () => void;
  animationDuration?: number;
};

// Animated Pagination Dot Component
const AnimatedPaginationDot = ({ 
  active, 
  onPress 
}: { 
  active: boolean; 
  onPress: () => void; 
}) => {
  const animatedValue = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: active ? 1 : 0,
      useNativeDriver: false,
      tension: 300,
      friction: 20,
    }).start();
  }, [active]);

  const width = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [wp('2%'), wp('4%')],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#C4D0CE', '#295C59'],
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.paginationDot,
          {
            width: width,
            backgroundColor: backgroundColor,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

// Animated Card Component
const AnimatedCard = ({ 
  children, 
  isActive,
  index 
}: { 
  children: React.ReactNode; 
  isActive: boolean;
  index: number;
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: isActive ? 1.05 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.spring(translateY, {
        toValue: isActive ? -5 : 0,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
    ]).start();
  }, [isActive]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleValue }, { translateY: translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default function ServiceCarousel({ 
  onScrollBegin, 
  onScrollEnd,
  animationDuration = 800,
}: ServiceCarouselProps) {
  const flatListRef = useRef<FlatList<ServiceItem> | null>(null);
  const currentIndex = useRef(0);
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isUserInteracting = useRef(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);
  const isAutoPlayRunning = useRef(false);
  const isResetting = useRef(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const lastOffsetX = useRef(0);

  const CARD_MARGIN = wp('1.5%');
  const CARD_WIDTH = (wp('100%') - (CARD_MARGIN * 4) - (wp('8%'))) / 3;
  const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN;

  // Create infinite loop data by duplicating the array 5 times for better buffer
  const orderedServices = useMemo<ServiceItem[]>(() => {
    const pool = servicesData2.filter((service) =>
      HOME_SERVICE_NAMES.map(n => n.toLowerCase()).includes(service.name.toLowerCase())
    );

    const sorted = pool.sort((a, b) => {
      const indexA = HOME_SERVICE_NAMES.findIndex(name =>
        name.toLowerCase() === a.name.toLowerCase()
      );
      const indexB = HOME_SERVICE_NAMES.findIndex(name =>
        name.toLowerCase() === b.name.toLowerCase()
      );
      return indexA - indexB;
    });

    return [...sorted, ...sorted, ...sorted, ...sorted, ...sorted];
  }, []);

  const uniqueItemCount = useMemo(() => {
    return new Set(orderedServices.map(item => item.id)).size;
  }, [orderedServices]);

  const getMiddleIndex = useCallback(() => {
    return uniqueItemCount * 2;
  }, [uniqueItemCount]);

  const getSafeIndex = useCallback((index: number) => {
    if (uniqueItemCount === 0) return 0;
    return ((index % uniqueItemCount) + uniqueItemCount) % uniqueItemCount;
  }, [uniqueItemCount]);

  const getDuplicatedIndex = useCallback((index: number) => {
    return getSafeIndex(index) + uniqueItemCount * 2;
  }, [getSafeIndex, uniqueItemCount]);

  const scrollToIndex = useCallback((index: number, animated: boolean = true) => {
    if (!flatListRef.current || orderedServices.length === 0 || !isMounted.current || isResetting.current) return;
    
    const targetIndex = getDuplicatedIndex(index);
    const offset = targetIndex * TOTAL_CARD_WIDTH;
    
    try {
      flatListRef.current.scrollToOffset({
        offset: offset,
        animated: animated,
      });
    } catch (error) {
      console.log('Scroll error:', error);
    }
  }, [orderedServices.length, getDuplicatedIndex, TOTAL_CARD_WIDTH]);

  const startAutoPlay = useCallback(() => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
      autoPlayTimer.current = null;
      isAutoPlayRunning.current = false;
    }

    if (orderedServices.length === 0 || isUserInteracting.current || !isMounted.current || isResetting.current) {
      return;
    }

    isAutoPlayRunning.current = true;
    
    autoPlayTimer.current = setInterval(() => {
      if (!isAutoPlayRunning.current || !isMounted.current || isResetting.current) {
        return;
      }
      
      if (!isUserInteracting.current && !isScrolling && flatListRef.current && orderedServices.length > 0) {
        const nextIndex = getSafeIndex(currentIndex.current + 1);
        currentIndex.current = nextIndex;
        setActiveIndex(nextIndex);
        scrollToIndex(nextIndex, true);
      }
    }, 3500);
  }, [orderedServices.length, getSafeIndex, scrollToIndex, isScrolling]);

  const stopAutoPlay = useCallback(() => {
    isAutoPlayRunning.current = false;
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
      autoPlayTimer.current = null;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    
    const timer = setTimeout(() => {
      if (isMounted.current && flatListRef.current) {
        const middleIndex = getMiddleIndex();
        flatListRef.current.scrollToOffset({
          offset: middleIndex * TOTAL_CARD_WIDTH,
          animated: false,
        });
        currentIndex.current = 0;
        setActiveIndex(0);
        lastOffsetX.current = middleIndex * TOTAL_CARD_WIDTH;
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.ease,
        }).start();
        
        setTimeout(() => {
          if (isMounted.current) {
            startAutoPlay();
          }
        }, 100);
      }
    }, 200);
    
    return () => {
      isMounted.current = false;
      stopAutoPlay();
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = null;
      }
      clearTimeout(timer);
    };
  }, []);

  const handleScrollBegin = useCallback(() => {
    isUserInteracting.current = true;
    setIsScrolling(true);
    stopAutoPlay();
    onScrollBegin?.();
  }, [stopAutoPlay, onScrollBegin]);

  const handleScrollEnd = useCallback(() => {
    isUserInteracting.current = false;
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = null;
    }
    scrollTimeout.current = setTimeout(() => {
      if (isMounted.current) {
        setIsScrolling(false);
        if (orderedServices.length > 0 && !isResetting.current) {
          startAutoPlay();
        }
        onScrollEnd?.();
      }
    }, 300);
  }, [startAutoPlay, onScrollEnd, orderedServices.length]);

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isMounted.current || isResetting.current) return;
    
    const contentOffset = event.nativeEvent.contentOffset;
    const currentOffsetX = contentOffset.x;
    const index = Math.round(currentOffsetX / TOTAL_CARD_WIDTH);
    const totalItems = orderedServices.length;
    
    const safeIndex = index % uniqueItemCount;
    
    currentIndex.current = safeIndex;
    setActiveIndex(safeIndex);
    setIsScrolling(false);
    lastOffsetX.current = currentOffsetX;

    if (index < 3 || index >= totalItems - 3) {
      isResetting.current = true;
      const middleIndex = getMiddleIndex() + safeIndex;
      const targetOffset = middleIndex * TOTAL_CARD_WIDTH;
      
      setTimeout(() => {
        if (isMounted.current && flatListRef.current) {
          flatListRef.current.scrollToOffset({
            offset: targetOffset,
            animated: false,
          });
          lastOffsetX.current = targetOffset;
          
          setTimeout(() => {
            isResetting.current = false;
            if (!isUserInteracting.current && orderedServices.length > 0) {
              startAutoPlay();
            }
          }, 50);
        }
      }, 0);
    } else {
      if (!isUserInteracting.current && orderedServices.length > 0) {
        setTimeout(() => {
          if (isMounted.current && !isUserInteracting.current && !isResetting.current) {
            startAutoPlay();
          }
        }, 300);
      }
    }
  }, [getMiddleIndex, TOTAL_CARD_WIDTH, orderedServices.length, uniqueItemCount, startAutoPlay]);

  const handleManualScroll = useCallback((index: number) => {
    if (!flatListRef.current || orderedServices.length === 0 || !isMounted.current || isResetting.current) return;
    
    stopAutoPlay();
    setIsScrolling(true);

    const targetIndex = getSafeIndex(index);
    currentIndex.current = targetIndex;
    setActiveIndex(targetIndex);

    const duplicatedIndex = getDuplicatedIndex(targetIndex);
    const offset = duplicatedIndex * TOTAL_CARD_WIDTH;
    
    flatListRef.current.scrollToOffset({
      offset: offset,
      animated: true,
    });
    lastOffsetX.current = offset;

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = null;
    }
    scrollTimeout.current = setTimeout(() => {
      if (isMounted.current) {
        setIsScrolling(false);
        if (!isUserInteracting.current && !isResetting.current) {
          startAutoPlay();
        }
      }
    }, 500);
  }, [orderedServices.length, stopAutoPlay, startAutoPlay, getSafeIndex, getDuplicatedIndex, TOTAL_CARD_WIDTH]);

  const renderPaginationDots = useCallback(() => {
    const uniqueItems = orderedServices.slice(0, uniqueItemCount);
    if (uniqueItems.length === 0) return null;

    return (
      <View style={styles.paginationContainer}>
        {uniqueItems.map((_, index) => (
          <AnimatedPaginationDot
            key={index}
            active={index === activeIndex}
            onPress={() => handleManualScroll(index)}
          />
        ))}
      </View>
    );
  }, [orderedServices, uniqueItemCount, activeIndex, handleManualScroll]);

  const renderItem = useCallback(({ item, index }: { item: ServiceItem, index: number }) => {
    const isActive = index === activeIndex;
    
    // UPDATED: Dynamically normalizes HTTP string links vs local require values cleanly 
    const cleanImageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

    return (
      <AnimatedCard isActive={isActive} index={index}>
        <View style={[styles.cardWrapper, { 
          width: CARD_WIDTH,
          marginRight: CARD_MARGIN,
        }]}>
          <ServicesCard
            title={item.name}
            image={cleanImageSource}
            onPress={() =>
              router.push({
                pathname: '/service/ServiceDetail',
                params: { id: String(item.id) },
              })
            }
          />
        </View>
      </AnimatedCard>
    );
  }, [CARD_WIDTH, CARD_MARGIN, activeIndex]);

  if (orderedServices.length === 0) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={orderedServices}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.servicesScrollContent}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(data, index) => ({
          length: TOTAL_CARD_WIDTH,
          offset: TOTAL_CARD_WIDTH * index,
          index,
        })}
        decelerationRate="fast"
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        scrollEventThrottle={16}
        initialNumToRender={5}
        pagingEnabled={false}
      />
      {renderPaginationDots()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F5F5F5',
  },
  servicesScrollContent: {
    paddingVertical: hp('1%'),
    paddingLeft: wp('1%'),
    paddingRight: wp('1%'),
  },
  cardWrapper: {
    aspectRatio: 0.85,
    marginRight: wp('1.5%'),
    borderRadius: 12,
    overflow: 'hidden',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%'),
    gap: wp('1.5%'),
    height: hp('2.5%'),
  },
  paginationDot: {
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#C4D0CE',
  },
});
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Import services data
import { servicesData2, DEFAULT_SERVICE_IMAGE } from '@/src/data/ServiceData';

type Props = {
  animationDuration?: number;
};

export default function ServiceCarousel({ animationDuration = 8000 }: Props) {
  // FILTER: Removes Carpet Cleaning from appearing in this Top Services carousel
  const topServices = servicesData2.filter((item) => {
    const title = (item.name || item.title || '').toLowerCase();
    return !title.includes('carpet');
  });

  return (
    <FlatList
      data={topServices} // Renders all services EXCEPT Carpet Cleaning
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => String(item.id || index)}
      contentContainerStyle={{ paddingRight: wp('4%') }}
      renderItem={({ item }) => {
        const imageSource =
          typeof item.image === 'string'
            ? { uri: item.image }
            : item.image || { uri: DEFAULT_SERVICE_IMAGE };

        const titleText = item.name || item.title || 'Cleaning Service';
        const subText = item.words || item.description || 'Professional Service in Nepal';

        return (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: '/service/ServiceDetail',
                params: { id: String(item.id) },
              })
            }
          >
            <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {titleText}
              </Text>
              <Text style={styles.cardSub} numberOfLines={1}>
                {subText}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: wp('44%'),
    marginRight: wp('3%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#1C2B2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardImage: {
    width: '100%',
    height: hp('11%'),
  },
  textContainer: {
    padding: wp('2.5%'),
  },
  cardTitle: {
    fontSize: wp('3.3%'),
    fontWeight: '700',
    color: '#064E3B',
  },
  cardSub: {
    fontSize: wp('2.7%'),
    color: '#6B7280',
    marginTop: 2,
  },
});
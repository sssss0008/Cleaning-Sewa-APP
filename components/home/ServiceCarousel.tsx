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
import { LinearGradient } from 'expo-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Import services data
import { servicesData2, DEFAULT_SERVICE_IMAGE } from '../../src/data/ServiceData';

export default function ServiceCarousel() {
  const topServices = servicesData2.slice(0, 5);

  return (
    <FlatList
      data={topServices}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ paddingVertical: hp('1%') }}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: '/service/ServiceDetail',
                params: { id: String(item.id) },
              })
            }
          >
            <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)']}
              style={styles.cardGradient}
            >
              <Text style={styles.cardCategory}>{item.words}</Text>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: wp('32%'),
    height: hp('18%'),
    marginRight: wp('3%'),
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#374151',
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
    justifyContent: 'flex-end',
    padding: 8,
  },
  cardCategory: {
    fontSize: 8,
    color: '#34D399',
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 13,
  },
});
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

import OurTeamCard from '../../../components/home/OurTeamCard';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Header2 from '@/components/Header2';

export default function AboutScreen() {
  return (
    <View style={styles.screen}>
      <Header2 />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          {/* Banner */}
          <View style={styles.banner}>
            <Image
              source={require('../../../assets/Pcture-Placeholder.png')}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Our Story</Text>

            <Text style={styles.subtitle}>
              Cleaning Sewa is a trusted cleaning service provider dedicated to
              making homes and offices spotless, hygienic, and welcoming. Our
              team of trained professionals uses modern equipment and
              eco-friendly products to deliver the highest standard of cleaning
              services.
            </Text>

            <Text style={styles.lineheighpara}>
              Our mission is to make cleaning services simple, reliable, and
              accessible by connecting customers with experienced and trusted
              cleaning professionals through one organized platform. With easy
              booking, transparent communication, affordable pricing, and
              high-quality service standards, we ensure every home and workplace
              receives professional cleaning that is efficient, dependable, and
              tailored to each customer's needs.
            </Text>

            <Text style={styles.lineheighpara}>
              At Cleaning Sewa, we believe keeping your home and workplace clean
              should be simple and stress-free. We combine experienced cleaning
              professionals, modern equipment, and high-quality cleaning
              practices to deliver reliable, efficient, and affordable cleaning
              services that meet the highest standards of hygiene, safety, and
              customer satisfaction.
            </Text>

            {/* Director */}
            <View style={{ height: 30 }} />

            <Text style={styles.title}> Message From  Director</Text>

            <View style={styles.directorContainer}>
              <OurTeamCard
                image={require('../../../assets/aboutUs/director.png')}
                title="Ramesh Koirala"
              />

              <Text style={styles.directorDesignation}>
                 Director
              </Text>

              <Text style={styles.directorMessage}>
                "At Cleaning Sewa, our vision is to create cleaner, healthier,
                and happier spaces for every family and business. We are
                committed to delivering professional cleaning services with
                honesty, quality, and care. By combining skilled professionals,
                modern equipment, and customer-focused service, we strive to
                exceed expectations and build long-lasting trust with every
                client. Your satisfaction is always our highest priority."
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  banner: {
    width: '90%',
    height: hp('30%'),
    alignSelf: 'center',
    borderRadius: 12,
    marginTop: hp('3%'),
    overflow: 'hidden',
    backgroundColor: '#eee',
  },

  bannerImage: {
    width: '100%',
    height: '100%',
  },

  content: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2.5%'),
  },

  title: {
    fontSize: wp('5.5%'),
    fontWeight: '700',
    color: '#064E3B',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: wp('3.8%'),
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
  },

  lineheighpara: {
    fontSize: wp('3.8%'),
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
    marginTop: 14,
  },

  directorContainer: {
    marginTop: hp('2%'),
    alignItems: 'center',
    marginBottom: hp('5%'),
  },

  directorDesignation: {
    marginTop: 10,
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#0F766E',
  },

  directorMessage: {
    marginTop: 15,
    fontSize: wp('3.8%'),
    lineHeight: 24,
    color: '#444',
    textAlign: 'justify',
  },
});
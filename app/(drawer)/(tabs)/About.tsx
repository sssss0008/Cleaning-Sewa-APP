import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header2 from '../../../components/Header2';
import { useTheme } from '../../../src/context/ThemeContext';

export default function AboutScreen() {
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Header2 />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* IMAGE ABOVE OUR STORY */}
          <Image
            source={require('../../../assets/CleaningSewa-Photos/home-cleaning.jpg')}
            style={styles.topHeroImg}
            resizeMode="cover"
          />

          <View style={styles.contentSection}>
            <Text style={[styles.title, { color: isDarkMode ? colors.primary : '#064E3B' }]}>Our Story</Text>

            <Text style={[styles.description, { color: colors.text }]}>
              Cleaning Sewa is a trusted cleaning service provider dedicated to making homes and offices spotless, hygienic, and welcoming. Our team of trained professionals uses modern equipment and eco-friendly products to deliver the highest standard of cleaning services.
            </Text>

            <Text style={[styles.description, { color: colors.text, marginTop: 15 }]}>
              From deep home cleaning to carpet and sofa care, AC cleaning, and post-construction cleanup, we ensure every corner of your space is maintained with care and precision.
            </Text>

            {/* Mission Section */}
            <View style={[styles.missionBox, { backgroundColor: isDarkMode ? colors.card : '#F0FDF4' }]}>
              <Text style={styles.missionTitle}>Our Mission</Text>
              <Text style={[styles.missionText, { color: colors.text }]}>
                To provide top-quality, reliable, and eco-friendly cleaning solutions that make homes and offices cleaner, safer, and healthier for everyone.
              </Text>
            </View>

            {/* Features Bar */}
            <View style={styles.featuresBar}>
              <Text style={[styles.featureTxt, { color: colors.subText }]}>✔ Professional Staff</Text>
              <Text style={[styles.featureTxt, { color: colors.subText }]}>✔ Eco Products</Text>
              <Text style={[styles.featureTxt, { color: colors.subText }]}>✔ 100% Satisfaction</Text>
            </View>

            {/* Message from Director */}
            <View style={styles.directorSection}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.primary : '#064E3B' }]}>Message from the Director</Text>

              <View style={styles.directorCard}>
                <Image
                  source={require('../../../assets/aboutUs/director.png')}
                  style={styles.directorImage}
                  resizeMode="cover"
                />
                <Text style={[styles.directorName, { color: colors.text }]}>Ramesh Koirala</Text>
                <Text style={styles.directorRole}>Director</Text>

                <Text style={[styles.quote, { color: colors.text }]}>
                  "At Cleaning Sewa, our vision is to create cleaner, healthier living and working spaces for every client. Our team is committed to excellence, and we continually invest in training and modern equipment to ensure you receive the best service possible. Your satisfaction is our top priority."
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  container: { padding: 0 },
  topHeroImg: { width: '100%', height: 200, marginBottom: 20 },
  contentSection: { paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 15 },
  description: { fontSize: 15, lineHeight: 24, textAlign: 'justify' },
  missionBox: { marginTop: 30, padding: 20, borderRadius: 16, borderLeftWidth: 5, borderLeftColor: '#16A34A' },
  missionTitle: { fontSize: 18, fontWeight: '800', color: '#16A34A', marginBottom: 8 },
  missionText: { fontSize: 15, lineHeight: 22 },
  featuresBar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, flexWrap: 'wrap' },
  featureTxt: { fontSize: 11, fontWeight: '700' },
  directorSection: { marginTop: 40 },
  sectionTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  directorCard: { alignItems: 'center' },
  directorImage: { width: 110, height: 110, borderRadius: 55, marginBottom: 15, borderWidth: 3, borderColor: '#064E3B' },
  directorName: { fontSize: 17, fontWeight: '800' },
  directorRole: { fontSize: 14, fontWeight: '700', color: '#16A34A', marginBottom: 15, textTransform: 'uppercase' },
  quote: { fontSize: 14, lineHeight: 22, textAlign: 'center', fontStyle: 'italic' }
});
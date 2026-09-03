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
          {/* LOGO BRANDING SECTION */}
          <View style={styles.logoHeader}>
            <Image
              source={require('../../../assets/images/icon.png')}
              style={styles.brandingLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.contentSection}>
            <Text style={[styles.title, { color: isDarkMode ? colors.primary : '#064E3B' }]}>Our Story</Text>

            <Text style={[styles.description, { color: colors.text }]}>
              Cleaning Sewa is a trusted cleaning service provider dedicated to making homes and offices spotless, hygienic, and welcoming. Our team of trained professionals uses modern equipment and eco-friendly products to deliver the highest standard of cleaning services.
            </Text>

            <Text style={[styles.description, { color: colors.text, marginTop: 15 }]}>
              From deep home cleaning to carpet and sofa care, AC cleaning, and post-construction cleanup, we ensure every corner of your space is maintained with care and precision.
            </Text>

            {/* Vision & Mission Section */}
            <View style={styles.visionMissionRow}>
              <View style={[styles.visionBox, { backgroundColor: isDarkMode ? colors.card : '#F0F9FF' }]}>
                <Text style={styles.visionTitle}>Our Vision</Text>
                <Text style={[styles.visionText, { color: colors.text }]}>
                  To be Nepal's leader in eco-friendly cleaning, setting the gold standard for hygiene and customer trust.
                </Text>
              </View>
              <View style={[styles.visionBox, { backgroundColor: isDarkMode ? colors.card : '#F0FDF4' }]}>
                <Text style={styles.visionTitle}>Our Mission</Text>
                <Text style={[styles.visionText, { color: colors.text }]}>
                  To provide top-quality, reliable, and eco-friendly cleaning solutions for a healthier environment.
                </Text>
              </View>
            </View>

            {/* History Section */}
            <View style={styles.historySection}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.primary : '#064E3B', textAlign: 'left' }]}>Our Journey</Text>
              <Text style={[styles.description, { color: colors.text }]}>
                Established in 2018, Cleaning Sewa started with a small team in Kathmandu with a big dream: to professionalize the cleaning industry in Nepal. Over the years, we have served thousands of happy customers and expanded our services across major cities.
              </Text>
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
  logoHeader: {
    width: '100%',
    height: 180,
    backgroundColor: '#F0FDF4', // Light green background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
  },
  brandingLogo: {
    width: '60%',
    height: '70%',
  },
  contentSection: { paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 15 },
  description: { fontSize: 15, lineHeight: 24, textAlign: 'justify' },
  visionMissionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, gap: 10 },
  visionBox: { flex: 1, padding: 15, borderRadius: 16, borderTopWidth: 4, borderTopColor: '#0A7CFF' },
  visionTitle: { fontSize: 16, fontWeight: '800', color: '#0A7CFF', marginBottom: 6 },
  visionText: { fontSize: 13, lineHeight: 20 },
  historySection: { marginTop: 40, backgroundColor: '#F8FAFC', padding: 20, borderRadius: 16 },
  directorSection: { marginTop: 40 },
  sectionTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  directorCard: { alignItems: 'center' },
  directorImage: { width: 110, height: 110, borderRadius: 55, marginBottom: 15, borderWidth: 3, borderColor: '#064E3B' },
  directorName: { fontSize: 17, fontWeight: '800' },
  directorRole: { fontSize: 14, fontWeight: '700', color: '#16A34A', marginBottom: 15, textTransform: 'uppercase' },
  quote: { fontSize: 14, lineHeight: 22, textAlign: 'center', fontStyle: 'italic' }
});
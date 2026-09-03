import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import OurTeamCard from '../../components/home/OurTeamCard';
import Header2 from '../../components/Header2';
import { useTheme } from '../../src/context/ThemeContext';

const teamMembers = [
  {
    id: 1,
    name: 'Ramesh Koirala',
    role: 'Director',
    image: require('../../assets/aboutUs/director.png'),
  },
];

export default function AboutScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header2 title="About Us" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Who We Are */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Who We Are</Text>
          <Text style={[styles.bodyText, { color: colors.subText }]}>
            Cleaning Sewa is a trusted cleaning service provider dedicated to making homes and offices spotless, hygienic, and welcoming. Our team of trained professionals uses modern equipment and eco-friendly products to deliver the highest standard of cleaning services.
          </Text>
          <Text style={[styles.bodyText, { color: colors.subText, marginTop: 8 }]}>
            From deep home cleaning to carpet and sofa care, AC cleaning, and post-construction cleanup, we ensure every corner of your space is maintained with care and precision.
          </Text>
        </View>

        {/* Our Mission */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Mission</Text>
          <Text style={[styles.bodyText, { color: colors.subText }]}>
            To provide top-quality, reliable, and eco-friendly cleaning solutions that make homes and offices cleaner, safer, and healthier for everyone.
          </Text>

          {/* Feature Badges */}
          <View style={styles.badgeContainer}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>✔ Professional & Trained Staff</Text>
            <Text style={[styles.badgeText, { color: colors.primary }]}>✔ Eco-Friendly Products</Text>
            <Text style={[styles.badgeText, { color: colors.primary }]}>✔ 100% Customer Satisfaction</Text>
          </View>
        </View>

        {/* Message from the Director */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Message from the Director</Text>
          <Text style={[styles.quoteText, { color: colors.text }]}>
            "At Cleaning Sewa, our vision is to create cleaner, healthier living and working spaces for every client. Our team is committed to excellence, and we continually invest in training and modern equipment to ensure you receive the best service possible. Your satisfaction is our top priority."
          </Text>
          <Text style={[styles.authorText, { color: colors.primary }]}>
            – Ramesh Koirala, Director
          </Text>
        </View>

        {/* Leadership */}
        <View style={styles.teamSection}>
          <Text style={[styles.sectionTitle, { color: colors.text, textAlign: 'center', marginBottom: 12 }]}>
            Leadership
          </Text>
          <View style={styles.teamCenter}>
            {teamMembers.map((member) => (
              <OurTeamCard
                key={member.id}
                title={member.name}
                suBTitle={member.role}
                image={member.image}
              />
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
  },
  badgeContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  authorText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'right',
  },
  teamSection: {
    marginTop: 8,
  },
  teamCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

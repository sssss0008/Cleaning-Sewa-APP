import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

interface OurTeamCardProps {
  title: string;
  suBTitle: string;
  image: any;
}

export default function OurTeamCard({ title, suBTitle, image }: OurTeamCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
      </View>
      <Text style={[styles.name, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.role, { color: colors.subText }]}>{suBTitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    maxWidth: 200,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  role: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});
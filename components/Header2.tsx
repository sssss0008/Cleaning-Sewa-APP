import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';

interface HeaderProps {
  title?: string;
}

export default function Header2({ title = "Cleaning Sewa" }: HeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          {/* Nepal Flag Icon */}
          <Image
            source={require('../assets/header/nepal-flag-icon-256.png')}
            style={styles.flagIcon}
            accessibilityLabel="Nepal Flag"
          />
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});
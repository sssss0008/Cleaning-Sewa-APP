import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import Header3 from '../../components/Header3drawer';
import { useTheme } from '../../src/context/ThemeContext';
import { GlossaryData2, AlphabetKey } from '../../src/data/GlossaryData2';

const { width } = Dimensions.get('window');

export default function GlossaryScreen() {
  const { colors, isDarkMode } = useTheme();
  const [selectedLetter, setSelectedLetter] = useState<AlphabetKey>('A');

  const alphabets: AlphabetKey[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('') as AlphabetKey[];

  const content = useMemo(() => GlossaryData2[selectedLetter] || [], [selectedLetter]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Header3 />

      <View style={styles.headerBox}>
        <Text style={[styles.title, { color: isDarkMode ? colors.primary : '#064E3B' }]}>Glossary</Text>
        <Text style={[styles.sub, { color: colors.subText }]}>Quickly find cleaning terms using the grid below</Text>
      </View>

      {/* CALCULATOR STYLE GRID */}
      <View style={styles.gridContainer}>
        <View style={styles.calcGrid}>
          {alphabets.map((char) => (
            <TouchableOpacity
              key={char}
              onPress={() => setSelectedLetter(char)}
              activeOpacity={0.7}
              style={[
                styles.calcBtn,
                { backgroundColor: isDarkMode ? colors.card : '#F3F4F6' },
                selectedLetter === char && { backgroundColor: '#064E3B' }
              ]}
            >
              <Text style={[
                styles.calcTxt,
                { color: selectedLetter === char ? '#FFF' : colors.text }
              ]}>{char}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>Results for "{selectedLetter}"</Text>
        {content.length > 0 ? (
          content.map((item, index) => (
            <View key={index} style={[styles.card, { backgroundColor: isDarkMode ? colors.card : '#FFF' }]}>
              <Text style={[styles.term, { color: '#064E3B' }]}>{item.title}</Text>
              <Text style={[styles.def, { color: colors.text }]}>{item.words}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyWrap}>
             <Text style={[styles.empty, { color: colors.subText }]}>No terms found for letter "{selectedLetter}"</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: { padding: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: '900' },
  sub: { fontSize: 13, marginTop: 4 },
  gridContainer: { padding: 15 },
  calcGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6
  },
  calcBtn: {
    width: (width - 70) / 7,
    height: 38,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1
  },
  calcTxt: { fontWeight: '800', fontSize: 13 },
  content: { padding: 20, paddingBottom: 40 },
  sectionHeader: { fontSize: 14, fontWeight: '700', color: '#9CA3AF', marginBottom: 15, textTransform: 'uppercase' },
  card: { padding: 18, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  term: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  def: { fontSize: 14, lineHeight: 20 },
  emptyWrap: { alignItems: 'center', marginTop: 40 },
  empty: { fontSize: 14, fontStyle: 'italic' }
});
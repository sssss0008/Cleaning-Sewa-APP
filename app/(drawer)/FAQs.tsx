import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import Header2 from '../../components/Header2';
import { useTheme } from '../../src/context/ThemeContext';
import { FaqsData } from '../../src/data/FaqsData';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQAccordion = ({ question, answer }: { question: string, answer: string }) => {
  const [expanded, setExpanded] = useState(false);
  const { colors, isDarkMode } = useTheme();

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity
      style={[styles.faqCard, { backgroundColor: isDarkMode ? colors.card : '#FFF' }]}
      onPress={toggle}
      activeOpacity={0.8}
    >
      <View style={styles.faqHeader}>
        <View style={styles.qLeft}>
          {/* LOGO ON EACH QUESTION AS REQUESTED */}
          <Image source={require('../../assets/images/icon.png')} style={styles.qLogo} />
          <Text style={[styles.qTxt, { color: colors.text }]}>{question}</Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color="#064E3B" />
      </View>
      {expanded && (
        <View style={styles.faqBody}>
          <Text style={[styles.aTxt, { color: colors.subText }]}>{answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function FAQsScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header2 title="Service FAQs" showBack={true} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: '#064E3B' }]}>Service FAQs</Text>
        <Text style={[styles.sub, { color: colors.subText }]}>Commonly asked questions about our standards</Text>

        {FaqsData.map((item) => (
          <FAQAccordion key={item.id} question={item.question} answer={item.answer} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '900' },
  sub: { fontSize: 13, marginTop: 5, marginBottom: 25 },
  faqCard: { padding: 15, borderRadius: 16, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 },
  qLogo: { width: 22, height: 22, marginRight: 10, resizeMode: 'contain' },
  qTxt: { fontSize: 14, fontWeight: '700', flex: 1 },
  faqBody: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  aTxt: { fontSize: 13, lineHeight: 18, fontWeight: '400' }
});
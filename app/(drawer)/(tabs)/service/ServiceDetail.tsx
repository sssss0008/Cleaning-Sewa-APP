import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, Alert } from 'react-native';
import ServicesDisplaycard from '../../../../components/services/ServicesDisplaycard';
import { servicesData2 } from '../../../../src/data/ServiceData';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../../src/context/ThemeContext';
import Header2 from '../../../../components/Header2';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental && !(global as any).nativeFabricUIManager) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity style={styles.faqCard} onPress={toggle} activeOpacity={0.7}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color="#6B7280" />
      </View>
      {expanded && (
        <View style={styles.faqBody}>
          <Text style={styles.faqAnswer}>{answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function SingleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDarkMode, colors: themeColors } = useTheme();
  const [isFav, setIsFav] = useState(false);

  const service = useMemo(() => {
    return servicesData2.find(item => item.id.toString() === id);
  }, [id]);

  useEffect(() => {
    checkFav();
  }, [id]);

  const checkFav = async () => {
    const data = await AsyncStorage.getItem('user_favorites');
    if (data) {
      const favs = JSON.parse(data);
      setIsFav(favs.some((f: any) => f.id === id));
    }
  };

  const toggleFavorite = async () => {
    const data = await AsyncStorage.getItem('user_favorites');
    let favs = data ? JSON.parse(data) : [];
    if (isFav) {
      favs = favs.filter((f: any) => f.id !== id);
      setIsFav(false);
    } else {
      favs.push({ id, name: service?.name });
      setIsFav(true);
      Alert.alert('Success', 'Service added to your favorites!');
    }
    await AsyncStorage.setItem('user_favorites', JSON.stringify(favs));
  };

  const otherServices = useMemo(() => {
    if (!service) return [];
    return servicesData2.filter(item => item.id !== service.id).sort(() => Math.random() - 0.5).slice(0, 2);
  }, [service]);

  if (!service) return <View style={styles.center}><Text>Service not found</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <Header2 showBack />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* DISPLAY ONLY ONE IMAGE AS REQUESTED */}
          <View style={styles.imageContainer}>
            <Image source={service.image} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.favBtn} onPress={toggleFavorite}>
               <Ionicons name={isFav ? "heart" : "heart-outline"} size={28} color={isFav ? "#EF4444" : "#FFF"} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: isDarkMode ? '#FFF' : '#064E3B' }]}>
            {service.name} Services in Nepal
          </Text>

          <Text style={[styles.description, { color: themeColors.text }]}>
            {service.description}
          </Text>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => router.push({ pathname: '/Book', params: { service: service.name } })}
          >
            <LinearGradient colors={['#064e3b', '#065f46']} style={styles.grad}>
              <Text style={styles.bookBtnTxt}>Book a Service</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#064E3B', marginTop: 30 }]}>
            Related Services
          </Text>
          <View style={styles.servicesContainer}>
            {otherServices.map(item => (
              <ServicesDisplaycard key={item.id} style={{ width: '48%' }} words={item.words} name={item.name} image={item.image} onPress={() => router.push({ pathname: '/service/ServiceDetail', params: { id: item.id.toString() } })} />
            ))}
          </View>

          {/* 5 FAQS AS REQUESTED */}
          <View style={styles.faqSection}>
            <Text style={[styles.faqTitle, { color: isDarkMode ? themeColors.primary : '#000' }]}>
               Frequently Asked Questions
            </Text>
            <FAQItem
              question={`What is included in the ${service.name} package?`}
              answer={`Our ${service.name} includes deep cleaning of target areas, high-pressure sanitization, and detailed inspection to ensure quality standards.`}
            />
            <FAQItem
              question="Are your cleaning chemicals safe for children and pets?"
              answer="Yes, we use 100% biodegradable and non-toxic cleaning agents that are safe for everyone in your household."
            />
            <FAQItem
              question="How long does the service take to complete?"
              answer="The duration varies by property size, but typically a standard session takes between 3 to 6 hours."
            />
            <FAQItem
              question="Do I need to provide any equipment or water?"
              answer="Our team comes fully equipped with modern machinery and supplies. We only require access to electricity and water."
            />
            <FAQItem
              question="Can I reschedule my booking later?"
              answer="Yes, you can reschedule up to 24 hours before the service date through your User Dashboard or by contacting support."
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: '6%', paddingBottom: 40 },
  imageContainer: { width: '100%', height: 200, overflow: 'hidden', borderRadius: 16, elevation: 5, marginBottom: 15, position: 'relative' },
  image: { width: '100%', height: '100%' },
  favBtn: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 25, zIndex: 10 },
  subtitle: { fontWeight: '800', marginBottom: '4%', fontSize: 22 },
  description: { fontWeight: '500', textAlign: 'justify', fontSize: 15, lineHeight: 24, marginBottom: 20 },
  bookBtn: { width: width * 0.65, alignSelf: 'center', marginTop: 10, borderRadius: 30, overflow: 'hidden' },
  grad: { paddingVertical: 15, alignItems: 'center' },
  bookBtnTxt: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  sectionTitle: { fontWeight: '900', marginBottom: '4%', fontSize: 19 },
  servicesContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 20 },
  faqSection: { marginTop: 20 },
  faqTitle: { fontSize: 18, fontWeight: '800', marginBottom: 15 },
  faqCard: { marginBottom: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#FFF' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 14, fontWeight: '700', color: '#111827', flex: 1, paddingRight: 10 },
  faqBody: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  faqAnswer: { fontSize: 13, lineHeight: 20, color: '#4B5563' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── IMPORT YOUR SHARED GLOBAL HEADER ──────────────────────────────
import Header2 from '@/components/Header2';

// ── DEFAULT FALLBACK IMAGE ─────────────────────────────────────────
export const DEFAULT_SERVICE_IMAGE = require('../../../assets/CleaningSewa-Photos/home-cleaning.jpg');

// ── LOCAL SERVICES DATA ────────────────────────────────────────────
export const servicesData2 = [
  {
    id: 1,
    name: 'Bathroom Cleaning',
    words: 'Deep tile and toilet sanitation.',
    number: 12,
    description:
      'Professional bathroom cleaning in Nepal to restore hygiene and shine. We deep clean tiles, sinks, toilets, showers, and mirrors while safely removing mold, soap scum, hard water stains, and harmful bacteria.',
    question: 'What is included in professional bathroom cleaning?',
    answer:
      'Bathroom cleaning includes deep cleaning and sanitizing of tiles, grout, sinks, toilets, showers, and mirrors.',
    image: require('../../../assets/CleaningSewa-Photos/bathroom-cleaning.jpg'),
  },
  {
    id: 2,
    name: 'Kitchen Cleaning',
    words: 'Expert kitchen sanitization.',
    number: 12,
    description:
      'Expert kitchen cleaning service in Nepal designed to maintain a spotless cooking space. We sanitize countertops, cabinets, sinks, stovetops, and major appliances while removing stubborn grease.',
    question: 'What does the kitchen cleaning service cover?',
    answer:
      'Kitchen cleaning covers degreasing and sanitizing countertops, cabinets, sinks, stovetops, and kitchen appliances.',
    image: require('../../../assets/CleaningSewa-Photos/kitchen-cleaning.jpg'),
  },
  {
    id: 3,
    name: 'Home Cleaning',
    words: 'Complete household deep cleaning.',
    number: 12,
    description:
      'Comprehensive home cleaning services in Nepal, covering living rooms, bedrooms, kitchens, and bathrooms. We efficiently remove dust, dirt, stains, and allergens from every surface.',
    question: 'What is included in a comprehensive home cleaning?',
    answer:
      'Home cleaning includes a full top-to-bottom dusting, vacuuming, and sanitization of living rooms, bedrooms, kitchens, and bathrooms.',
    image: require('../../../assets/CleaningSewa-Photos/home-cleaning.jpg'),
  },
  {
    id: 4,
    name: 'Carpet Cleaning',
    words: 'Stain and dust extraction.',
    number: 12,
    description:
      'Professional carpet cleaning in Nepal to remove embedded dirt, dust, allergens, and stubborn stains. We restore your carpets to a clean, fresh, and highly hygienic state.',
    question: 'How often should carpets be professionally cleaned?',
    answer:
      'It is recommended to professionally clean carpets every 6 to 12 months to eliminate deep-seated dust and stains.',
    image: require('../../../assets/CleaningSewa-Photos/carpet-cleaning.jpg'),
  },
  {
    id: 5,
    name: 'Sofa / Upholstery Cleaning',
    words: 'Furniture fabric refreshment.',
    number: 12,
    description:
      'Professional sofa and upholstery cleaning service in Nepal to revitalize your furniture. We deep clean all types of furniture, including fabric, leather, and microfiber sofas.',
    question: 'Can you clean both leather and fabric sofas?',
    answer:
      'Yes, we provide specialized deep cleaning techniques tailored safe for leather, fabric, and microfiber.',
    image: require('../../../assets/CleaningSewa-Photos/sofa-upholstery-cleaning.jpg'),
  },
  {
    id: 6,
    name: 'Move-In / Move-Out Cleaning',
    words: 'Spotless property transitions.',
    number: 12,
    description:
      'Specialized move-in and move-out cleaning service in Nepal. We clean every single corner of your property including floors, walls, kitchens, bathrooms, fixtures, and furniture.',
    question: 'What does a move-in/move-out cleaning entail?',
    answer:
      'This service covers an intensive deep cleaning of all rooms, floors, walls, cabinets, bathrooms, and appliances.',
    image: require('../../../assets/CleaningSewa-Photos/move-in-move-out-cleaning.jpg'),
  },
  {
    id: 7,
    name: 'Disinfection / Sanitization',
    words: 'Germ and virus elimination.',
    number: 12,
    description:
      'Professional disinfection and sanitization for homes, offices, and commercial spaces across Nepal. We eliminate germs, bacteria, and viruses using safe, hospital-grade solutions.',
    question: 'What areas are focused on during disinfection?',
    answer:
      'We focus extensively on high-touch surfaces like doorknobs, light switches, desks, countertops, and communal areas.',
    image: require('../../../assets/CleaningSewa-Photos/disinfection-sanitization-services.jpg'),
  },
  {
    id: 8,
    name: 'A/C Cleaning',
    words: 'Air filter and coil cleanup.',
    number: 12,
    description:
      'Air conditioner cleaning service in Nepal to improve indoor air quality and system efficiency. We thoroughly remove accumulated dust, allergens, and mold from filters, ducts, and coils.',
    question: 'Why is air conditioner cleaning necessary?',
    answer:
      'AC cleaning removes dust and mold from inner filters and coils, improving cooling efficiency and lowering power bills.',
    image: require('../../../assets/CleaningSewa-Photos/ac-cleaning.jpg'),
  },
  {
    id: 9,
    name: 'Laptop Cleaning',
    words: 'Device sanitation and care.',
    number: 12,
    description:
      'Professional laptop cleaning service in Nepal using specialized techniques. We safely remove built-up dust, dirt, skin oils, and bacteria from delicate keyboards, screens, and vents.',
    question: 'Is it safe to clean the laptop interior and screen?',
    answer:
      'Yes, our professionals use anti-static tools and screen-safe solutions to clean devices safely.',
    image: require('../../../assets/CleaningSewa-Photos/laptop-cleaning.jpg'),
  },
  {
    id: 10,
    name: 'Desktop Cleaning',
    words: 'Workstation dust removal.',
    number: 12,
    description:
      'Professional desktop and workstation cleaning in Nepal. We systematically remove dust, dirt, and debris from computers, monitors, keyboards, CPU towers, and general office desk surfaces.',
    question: 'What components are cleaned during desktop cleaning?',
    answer:
      'We clean the external monitors, keyboard keycaps, mouse, CPU exterior, vents, and surrounding desk surfaces.',
    image: require('../../../assets/CleaningSewa-Photos/desktop-cleaning.jpg'),
  },
  {
    id: 11,
    name: 'Aeroplane Cleaning',
    words: 'Aircraft interior sanitization.',
    number: 12,
    description:
      'Comprehensive aircraft cleaning services in Nepal, meticulously handling cabin seats, overhead storage areas, carpets, galleys, and general interiors.',
    question: 'What parts of the aircraft do you clean?',
    answer:
      'Our services focus on full cabin deep cleaning, including seats, tray tables, overhead bins, carpets, and lavatories.',
    image: require('../../../assets/CleaningSewa-Photos/aeroplane-cleaning.jpg'),
  },
  {
    id: 12,
    name: 'Helicopter Cleaning',
    words: 'Specialized chopper cleaning.',
    number: 12,
    description:
      'Specialized helicopter cleaning service in Nepal tailored for luxury and commercial choppers. We sanitize and deep clean all interior surfaces, upholstery seating, and windows.',
    question: 'Do you follow specific safety regulations for helicopter cleaning?',
    answer:
      'Yes, all cleanings are conducted by trained technicians using specialized procedures that comply with aviation protocols.',
    image: require('../../../assets/CleaningSewa-Photos/helicopter-cleaning.jpg'),
  },
  {
    id: 13,
    name: 'Reserve Tank Cleaning',
    words: 'Water tank sludge removal.',
    number: 12,
    description:
      'Professional cleaning of water storage and reserve tanks in Nepal. We completely remove accumulated sludge, mud, biological debris, and contaminants.',
    question: 'How often should water reserve tanks be cleaned?',
    answer:
      'Water storage and reserve tanks should ideally be cleaned and disinfected every 6 months.',
    image: require('../../../assets/CleaningSewa-Photos/reserve-tank-cleaning.jpg'),
  },
  {
    id: 14,
    name: 'Marble / Tile Cleaning',
    words: 'Floor restoration and shine.',
    number: 12,
    description:
      'Premium marble and tile cleaning service in Nepal. We effectively remove deeply embedded dirt, tough stains, and unsightly grout discoloration.',
    question: 'Does this service include grout line cleaning?',
    answer:
      'Yes, we deeply scrub grout lines to remove embedded dirt and discoloration alongside polishing.',
    image: require('../../../assets/CleaningSewa-Photos/marble-tile-cleaning.jpg'),
  },
  {
    id: 15,
    name: 'Post-Construction Cleaning',
    words: 'Debris and fine dust removal.',
    number: 12,
    description:
      'Thorough post-construction cleaning in Nepal for newly built or renovated spaces. We eliminate fine drywall dust, plaster debris, paint splatters, and chemical residue.',
    question: 'What is included in a post-construction clean?',
    answer:
      'This includes removing fine drywall dust, scraping paint residue, and intensive deep cleaning of all surfaces.',
    image: require('../../../assets/CleaningSewa-Photos/post-construction-cleaning.jpg'),
  },
  {
    id: 16,
    name: 'Garden Cleaning',
    words: 'Outdoor debris clearance.',
    number: 12,
    description:
      'Professional garden cleaning in Nepal to restore your property curb appeal. We efficiently remove fallen leaves, plant debris, trash, and unwanted organic items.',
    question: 'Does garden cleaning include lawn mowing?',
    answer:
      'Garden cleaning primarily focuses on debris, weed, and leaf removal.',
    image: require('../../../assets/CleaningSewa-Photos/garden-cleaning.jpg'),
  },
  {
    id: 17,
    name: 'Garage Cleaning',
    words: 'Oil stain and clutter removal.',
    number: 12,
    description:
      'Garage cleaning services in Nepal designed to clean and maximize your utility space. We remove deep accumulated dirt, tough engine oil stains, and unwanted clutter.',
    question: 'Can you remove stubborn motor oil stains from garage floors?',
    answer:
      'Yes, we utilize industrial-grade degreasers and high-pressure washers specifically designed to lift oil stains.',
    image: require('../../../assets/CleaningSewa-Photos/garage-cleaning.jpg'),
  },
  {
    id: 18,
    name: 'Air Duct & Vent Cleaning',
    words: 'HVAC system airflow clearance.',
    number: 12,
    description:
      'Professional air duct and vent cleaning in Nepal to significantly improve interior airflow. We clear out heavy dust accumulation, lint, and hidden mold from your ventilation systems.',
    question: 'What are the benefits of cleaning air ducts?',
    answer:
      'Cleaning air ducts eliminates airborne dust and allergens, improves system airflow, and reduces energy expenses.',
    image: require('../../../assets/CleaningSewa-Photos/air-duct-vent-cleaning.jpg'),
  },
  {
    id: 19,
    name: 'Post Event Cleaning',
    words: 'Party venue restoration.',
    number: 12,
    description:
      'Efficient post-event cleaning in Nepal to take the stress out of hosting. We rapidly remove accumulated trash, clean sudden spills, and wipe down surfaces.',
    question: 'How quickly can you clean up after an event?',
    answer:
      'We offer flexible scheduling to ensure the venue is perfectly restored within hours.',
    image: require('../../../assets/CleaningSewa-Photos/post-event-cleaning.jpg'),
  },
  {
    id: 20,
    name: 'Car Interior Cleaning',
    words: 'Vehicle cabin detailing.',
    number: 12,
    description:
      'Comprehensive car interior cleaning in Nepal for a pristine driving experience. We thoroughly vacuum and shampoo seats, carpets, floor mats, and dashboard surfaces.',
    question: 'What parts of the car interior are cleaned?',
    answer:
      'We deep clean seats, mats, carpets, dashboard, steering wheel, roof lining, door panels, and trunk spaces.',
    image: require('../../../assets/CleaningSewa-Photos/car-interior-cleaning.jpg'),
  },
  {
    id: 21,
    name: 'Facade Cleaning',
    words: 'Exterior building washing.',
    number: 12,
    description:
      'Exterior building cleaning service in Nepal using safe, high-access methods. We clear out accumulated environmental dirt, bird droppings, grime, and pollution film.',
    question: 'How do you clean high-rise building facades safely?',
    answer:
      'Our certified professionals utilize safety ropes, scaffolding, and specialized pressure washing equipment.',
    image: require('../../../assets/CleaningSewa-Photos/facade-cleaning.jpg'),
  },
  {
    id: 22,
    name: 'Parquet Cleaning',
    words: 'Wooden floor care.',
    number: 12,
    description:
      'Professional parquet and wooden floor cleaning in Nepal. We safely remove surface dust, light stains, and scuff marks, followed by surface polishing.',
    question: 'Does this service include deep wood scratching repair?',
    answer:
      'This service focuses on professional deep cleaning, buffing, and polishing.',
    image: require('../../../assets/CleaningSewa-Photos/parquet-cleaning.jpg'),
  },
  {
    id: 23,
    name: 'Chair Cleaning',
    words: 'Office and dining seat deep clean.',
    number: 12,
    description:
      'Deep cleaning for office and home chairs in Nepal. Our process effectively removes accumulated sweat, dark stains, dust, and unpleasant body odors.',
    question: 'Can you handle large-volume office chair cleaning?',
    answer:
      'Yes, we cater to bulk corporate requests, cleaning hundreds of workstations efficiently.',
    image: require('../../../assets/CleaningSewa-Photos/chair-cleaning.jpg'),
  },
  {
    id: 24,
    name: 'Drainage Cleaning',
    words: 'Pipe blockage clearing.',
    number: 12,
    description:
      'Professional drain and pipe cleaning in Nepal. We effectively remove stubborn hair blocks, grease accumulation, and organic debris.',
    question: 'What methods do you use to clear blocked drains?',
    answer:
      'We utilize mechanical drain snakes, high-pressure hydro-jetting, and safe plumbing tools.',
    image: require('../../../assets/CleaningSewa-Photos/drainage-cleaning.jpg'),
  },
  {
    id: 25,
    name: 'Septic Tank Cleaning',
    words: 'Waste tank sludge pumping.',
    number: 12,
    description:
      'Safe septic tank cleaning and preventative maintenance in Nepal. We pump out waste, prevent dangerous system overflows, and clear thick accumulated sludge.',
    question: 'How often should a septic tank be pumped out?',
    answer:
      'Standard septic tanks should be professionally inspected and pumped every 2 to 4 years.',
    image: require('../../../assets/CleaningSewa-Photos/septic-tank-cleaning.jpg'),
  },
  {
    id: 26,
    name: 'Lift / Elevator Cleaning',
    words: 'Vertical transport sanitation.',
    number: 12,
    description:
      'Professional cleaning of lifts and elevators in Nepal. We focus intensely on scrubbing floors, polishing stainless steel walls, and sanitizing buttons.',
    question: 'How do you sanitize elevator buttons safely without short-circuiting?',
    answer:
      'We use moisture-controlled micro-fiber cloths and specialized fast-evaporating sanitizers.',
    image: require('../../../assets/CleaningSewa-Photos/lift-elevator-cleaning.jpg'),
  },
  {
    id: 27,
    name: 'Corporate House Cleaning',
    words: 'Office and corporate maintenance.',
    number: 12,
    description:
      'Premium commercial and corporate office cleaning services in Nepal. We maintain pristine workspaces, sanitizing modern offices, reception zones, and conference rooms.',
    question: 'Do you offer after-hours office cleaning?',
    answer:
      'Yes, we provide flexible night and weekend shifts to clean your office thoroughly without disrupting operations.',
    image: require('../../../assets/CleaningSewa-Photos/corporate-house-cleaning.jpg'),
  },
  {
    id: 28,
    name: 'Medical Facility Cleaning',
    words: 'Hospital-grade disinfection.',
    number: 12,
    description:
      'Medical-grade cleaning for hospitals, private clinics, and scientific laboratories in Nepal. Our training ensures absolute sanitization and infection control.',
    question: 'Do you use specific disinfectants for medical cleaning?',
    answer:
      'Yes, we strictly use hospital-grade disinfectants designed to eliminate critical pathogens.',
    image: require('../../../assets/CleaningSewa-Photos/medical-facility-cleaning.jpg'),
  },
  {
    id: 29,
    name: 'Monthly Cleaning',
    words: 'Recurring hygiene schedules.',
    number: 12,
    description:
      'Scheduled monthly cleaning services in Nepal for busy homes and corporate offices. This recurring program maintains a highly consistent baseline of hygiene.',
    question: 'Can I customize the frequency or tasks for monthly visits?',
    answer:
      'Absolutely. We customize checklist parameters to match your recurring cleaning needs.',
    image: require('../../../assets/CleaningSewa-Photos/monthly-cleaning.jpg'),
  },
  {
    id: 30,
    name: 'Dead Animal Removal',
    words: 'Hygienic carcass disposal.',
    number: 12,
    description:
      'Safe and rapid dead animal removal service in Nepal. We dispose of deceased animals from your property and fully disinfect the affected area.',
    question: 'Is emergency sanitation included after animal removal?',
    answer:
      'Yes, the area is treated with biological neutralizing agents and powerful sanitizers.',
    image: require('../../../assets/CleaningSewa-Photos/dead-animal-removal.jpg'),
  },
  {
    id: 31,
    name: 'Swimming Pool Cleaning',
    words: 'Pool chemical and water care.',
    number: 12,
    description:
      'Professional swimming pool cleaning and maintenance in Nepal. We ensure crystal clear water, vacuum bottom debris, and balance critical chemicals.',
    question: 'How often should pool chemicals be checked?',
    answer:
      'Pool water chemicals and pH balance should ideally be checked and adjusted weekly.',
    image: require('../../../assets/CleaningSewa-Photos/swimming-pool-cleaning.jpg'),
  },
  {
    id: 32,
    name: 'School Cleaning',
    words: 'Educational space sanitization.',
    number: 12,
    description:
      'Comprehensive school cleaning services in Nepal. We maintain pristine, highly hygienic learning environments by sanitizing classrooms and restrooms.',
    question: 'Do you provide eco-friendly cleaning for nurseries and preschools?',
    answer:
      'Yes, we use non-toxic, chemical-free green cleaning agents in early education facilities.',
    image: require('../../../assets/CleaningSewa-Photos/school-cleaning.jpg'),
  },
  {
    id: 33,
    name: 'Dog Cleaning',
    words: 'Pet grooming and washing.',
    number: 12,
    description:
      'Professional dog cleaning services in Nepal. We provide thorough mobile or in-salon grooming, deep coat washing, and anti-flea treatments.',
    question: 'What products are used for dog bathing?',
    answer:
      'We use premium, pH-balanced, hypoallergenic dog shampoos and conditioners.',
    image: require('../../../assets/CleaningSewa-Photos/dog-cleaning.jpg'),
  },
];

// ── TOP 5 CAROUSEL DATA (MAPPED FROM LOCAL SERVICES) ──────────────
const CAROUSEL_SERVICES = servicesData2.slice(0, 5).map((item) => ({
  id: String(item.id),
  title: item.name,
  category: item.words,
  image: item.image,
}));

// ── NUMBER BAR COMPONENT (WITH FLAG & DEMO NEPALI NUMBER) ──────────
function NumberBar({ onFocus }: { onFocus?: () => void }) {
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!phone || phone.trim().length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }
    Alert.alert(
      'Callback Requested',
      `Thank you! Our CleaningSewa team will call you back shortly on ${phone}.`
    );
    setPhone('');
  };

  return (
    <View style={numberBarStyles.container}>
      <Text style={numberBarStyles.flag}>🇳🇵</Text>
      <TextInput
        style={numberBarStyles.input}
        placeholder="98XXXXXXXX"
        placeholderTextColor="#9CA3AF"
        keyboardType="phone-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
        onFocus={onFocus}
      />
      <TouchableOpacity
        style={numberBarStyles.submitBtn}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <Text style={numberBarStyles.submitBtnText}>Get Call</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── SERVICE CAROUSEL COMPONENT ────────────────────────────────────
function ServiceCarousel({ animationDuration = 6000 }: { animationDuration?: number }) {
  const flatListRef = useRef<FlatList | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex > CAROUSEL_SERVICES.length - 3) {
        nextIndex = 0;
      }
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, animationDuration / 2);

    return () => clearInterval(timer);
  }, [currentIndex, animationDuration]);

  const itemLength = wp('30.5%');

  return (
    <View style={carouselStyles.container}>
      <FlatList
        ref={flatListRef}
        data={CAROUSEL_SERVICES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        snapToInterval={itemLength}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: wp('0.5%') }}
        getItemLayout={(_, index) => ({
          length: itemLength,
          offset: itemLength * index,
          index,
        })}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={carouselStyles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: '/service/ServiceDetail',
                params: { id: item.id, title: item.title },
              })
            }
          >
            <Image
              source={item.image}
              style={carouselStyles.cardImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.92)']}
              style={carouselStyles.cardGradient}
            >
              <Text style={carouselStyles.cardCategory}>{item.category}</Text>
              <Text style={carouselStyles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ── MAIN HOME SCREEN COMPONENT ─────────────────────────────────────
export default function HomeScreen() {
  const scrollRef = useRef<ScrollView | null>(null);

  const handleResetOnboarding = async () => {
    await AsyncStorage.removeItem('hasSeenOnboarding');
    Alert.alert('Onboarding Reset', 'Restarting app flow...', [
      { text: 'OK', onPress: () => router.replace('/onboarding1') },
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      {/* SHARED GLOBAL HEADER COMPONENT */}
      <Header2 />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* ── HERO SECTION ─────────────────────────────────── */}
        <View style={styles.hero}>
          <Image
            source={DEFAULT_SERVICE_IMAGE}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.05)', 'rgba(18,46,44,0.98)']}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroTitle}>
              Professional {'\n'} Cleaning Service
            </Text>

            <View style={styles.heroNumberBar}>
              <NumberBar
                onFocus={() =>
                  scrollRef.current?.scrollTo({ y: hp('45%'), animated: true })
                }
              />
            </View>
          </LinearGradient>
        </View>

        {/* ── TOP SERVICES ──────────────────────────────── */}
        <View style={styles.section}>
          {/* FEATURED BANNER */}
          <TouchableOpacity
            style={styles.featuredCard}
            activeOpacity={0.88}
            onPress={() =>
              router.push({
                pathname: '/service/ServiceDetail',
                params: { id: '3' },
              })
            }
          >
            <Image
              source={servicesData2[2].image}
              style={styles.featuredImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(28,43,42,0.95)']}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>Most Popular</Text>
              </View>
              <Text style={styles.featuredTitle}>Deep Cleaning</Text>
              <Text style={styles.featuredSub}>
                Professional Home Cleaning Service
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* SECTION HEADER CONTAINER */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Top Services</Text>
            <TouchableOpacity
              onPress={() => router.push('/Service')}
              hitSlop={12}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* AUTO-SLIDING 3-CARD CAROUSEL COMPONENT */}
          <ServiceCarousel animationDuration={6000} />

          {/* ── DEV TOOLS (Quick Onboarding Reset) ── */}
          {__DEV__ && (
            <TouchableOpacity
              style={styles.devResetBtn}
              onPress={handleResetOnboarding}
            >
              <Text style={styles.devResetText}>↺ Reset Onboarding (Dev)</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────
const numberBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    paddingLeft: 10,
    alignItems: 'center',
    elevation: 3,
  },
  flag: {
    fontSize: 18,
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 6,
    fontSize: 13,
    color: '#1F2937',
  },
  submitBtn: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});

const carouselStyles = StyleSheet.create({
  container: {
    marginTop: hp('1%'),
  },
  card: {
    width: wp('28.5%'),
    height: hp('15%'),
    borderRadius: 10,
    marginRight: wp('2%'),
    overflow: 'hidden',
    backgroundColor: '#374151',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '82%',
    justifyContent: 'flex-end',
    padding: 6,
  },
  cardCategory: {
    fontSize: 8,
    color: '#34D399',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
    lineHeight: 13,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp('5%'),
    backgroundColor: '#F6F9F8',
  },

  /* HERO SECTION */
  hero: {
    width: '100%',
    height: hp('33%'),
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '88%',
    justifyContent: 'flex-end',
    paddingHorizontal: wp('5.5%'),
    paddingBottom: hp('3%'),
  },
  heroTitle: {
    fontSize: wp('7%'),
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: wp('8%'),
    letterSpacing: -0.2,
    marginBottom: hp('1%'),
  },
  heroNumberBar: {
    marginTop: hp('0.5%'),
  },

  /* CATEGORIES & SECTIONS */
  section: {
    marginTop: hp('2.5%'),
    paddingHorizontal: wp('4.5%'),
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2.5%'),
    marginBottom: hp('1.5%'),
  },
  sectionTitle: {
    fontSize: wp('4.6%'),
    fontWeight: '800',
    color: '#064E3B',
    letterSpacing: -0.1,
  },
  seeAll: {
    fontSize: wp('3.4%'),
    fontWeight: '600',
    color: '#295C59',
    paddingLeft: wp('2%'),
  },

  /* FEATURED CARD */
  featuredCard: {
    width: '100%',
    height: hp('23%'),
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: hp('1%'),
    elevation: 3,
    shadowColor: '#1C2B2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: wp('4.5%'),
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2F1',
    borderRadius: 8,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    marginBottom: hp('1%'),
  },
  featuredBadgeText: {
    fontSize: wp('2.8%'),
    color: '#295C59',
    fontWeight: '700',
  },
  featuredTitle: {
    fontSize: wp('5%'),
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.1,
  },
  featuredSub: {
    fontSize: wp('3.2%'),
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '400',
    marginTop: hp('0.2%'),
  },

  /* DEV RESET BUTTON */
  devResetBtn: {
    marginTop: hp('4%'),
    paddingVertical: hp('1.2%'),
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  devResetText: {
    color: '#991B1B',
    fontWeight: '700',
    fontSize: wp('3.2%'),
  },
});
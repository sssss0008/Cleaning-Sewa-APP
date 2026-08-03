import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = { name: string; image: any };

const SliderCard = ({ name, image }: Props) => {

  // FIXED: Converts raw string image URLs seamlessly for your home page banner sliders
  const cleanImageSource = typeof image === 'string' ? { uri: image } : image;

  return (
    <View style={styles.container}>
      <Image source={cleanImageSource} style={styles.image} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>CleaningSewa | Nepal</Text>
        <Text style={styles.subtitle}>
          On Demand Home Service in Nepal
        </Text>
        <Text style={styles.name}>{name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: height * 0.28,
  },
  textContainer: {
    position: 'absolute',
    top: '30%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: width * 0.04,
    fontWeight: '900',
    color: '#fff',
    paddingBottom: 2,
  },
  subtitle: {
    fontSize: width * 0.036,
    fontWeight: '500',
    marginBottom: height * 0.018,
    color: '#fff',
    textAlign: 'center',
  },
  name: {
    fontSize: width * 0.044,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SliderCard;
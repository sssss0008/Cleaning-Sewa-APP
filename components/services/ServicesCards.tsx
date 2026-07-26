import React from 'react';
import { Text, Image, StyleSheet, Pressable, View, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = {
  title: string;
  image: string | ImageSourcePropType; // UPDATED: Now accurately accepts both web URL strings and local assets
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const ServicesCard = ({ title, image, style, onPress }: Props) => {
  
  // FIXED: Converts raw string image links into valid network URI assets so it never renders blank
  const verifiedImageSource = typeof image === 'string' ? { uri: image } : image;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.imageWrapper}>
        <Image source={verifiedImageSource} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    width: wp('28%'), // Slightly reduced to gracefully fit 3-column layouts with margins
    maxWidth: 120,    // Caps the size on tablets so it doesn't look gigantic
    minWidth: 90,     // Prevents it from crushing into a tiny column on small screens
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingBottom: 12,
    
    // Cross-platform shadow optimization
    elevation: 4, 
    shadowColor: '#295C59',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }], // Slightly deeper click feedback
  },
  imageWrapper: {
    width: '100%',
    height: hp('9%'), // Balanced ratio relative to device height
    maxHeight: 90,
    minHeight: 65,
    overflow: 'hidden',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 6,
    justifyContent: 'center',
    flexGrow: 1, // Ensures text alignment stays vertically uniform even with varied lengths
  },
  title: {
    fontSize: wp('3.2%'), // Fluid text scaling based on screen width
    fontWeight: '700',
    color: '#295C59',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
});

export default ServicesCard;
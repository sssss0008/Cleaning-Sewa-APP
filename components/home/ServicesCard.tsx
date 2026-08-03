import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  Pressable,
  View,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type Props = {
  title?: string;
  name?: string; // Accepts 'name' if data passes item.name instead of item.title
  image: string | ImageSourcePropType; // Accepts both web URL strings and local require() assets
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const ServicesCard = ({ title, name, image, style, onPress }: Props) => {
  // 1. Fallback to ensure text is never blank
  const displayTitle = title || name || 'Service';

  // 2. Convert raw web string URLs into valid { uri: ... } objects
  const verifiedImageSource =
    typeof image === 'string' ? { uri: image } : image;

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
          {displayTitle}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    width: wp('28%'),
    maxWidth: 120,
    minWidth: 90,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingBottom: 12,

    elevation: 4,
    shadowColor: '#295C59',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  imageWrapper: {
    width: '100%',
    height: hp('9%'),
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
    flexGrow: 1,
  },
  title: {
    fontSize: wp('3.2%'),
    fontWeight: '700',
    color: '#295C59',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
});

export default ServicesCard;
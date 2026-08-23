import React from 'react';
import {
  View,
  Image,
  GestureResponderEvent,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import ButtonComponent from './ButtonComponent';

const { width } = Dimensions.get('window');

type Props = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  image: any;
  buttonStyle?: StyleProp<ViewStyle>;
};

const OnboardingComponent = ({ title, onPress, image, buttonStyle }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={styles.bannerImg}
          resizeMode="contain"
        />
      </View>
      <ButtonComponent
        title={title}
        onPress={onPress}
        style={buttonStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    flex: 1,
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    maxHeight: 320,
  },
});

export default OnboardingComponent;
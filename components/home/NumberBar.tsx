import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type NumberBarProps = {
  onHelpPress?: () => void;
};

const NumberBar = ({ onHelpPress = () => {} }: NumberBarProps) => {
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (text: string) => {
    // Allow only numbers
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhone(cleaned);
  };

  return (
    <View style={styles.container}>
      {/* Nepal Flag */}
      <View style={styles.flagContainer}>
        <Text style={styles.flag}>🇳🇵</Text>
      </View>

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder="9852024365"
        placeholderTextColor="#9CA3AF"
        keyboardType="number-pad"
        maxLength={10}
        value={phone}
        onChangeText={handlePhoneChange}
      />

      {/* Help Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.helpButton}
        onPress={onHelpPress}
      >
        <Text style={styles.helpText}>Help</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('90%'),
    height: hp('6.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  flagContainer: {
    width: wp('14%'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  flag: {
    fontSize: hp('3%'),
  },

  input: {
    flex: 1,
    height: '100%',
    color: '#111827',
    fontSize: wp('4.2%'),
    fontWeight: '600',
    paddingHorizontal: wp('2%'),
  },

  helpButton: {
    height: '100%',
    width: wp('22%'),
    backgroundColor: '#0A4D18',
    justifyContent: 'center',
    alignItems: 'center',
  },

  helpText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default NumberBar;
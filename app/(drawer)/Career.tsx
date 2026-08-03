import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { area, positionAppliedFor, services } from '../../src/data/Data';
import TextArea from '../../components/bookings/TextArea';
import SubmitOverlay from '../../components/bookings/SubmitOverlay';
import countryLogo from '../../assets/header/nepal-flag-icon-256.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FileUploadBox from '../../components/bookings/FileUploadBox';
import ClearFormIcon from '../../assets/icons/booking/clear.png'
import DropdownAdd from '../../components/bookings/DropdownAdd';
import Header3 from '@/components/Header3drawer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get('window');

const Button = ({ children, style, textStyle, onPress }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={style}
    >
      <Text style={[styles.text, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export type FileItem = {
  uri: string;
  fileName?: string;
};

export default function CareerScreen() {
  const scrollRef = useRef<any>(null);

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [experience, setExperience] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [coverMessage, setCoverMessage] = useState('');

  // photos
  const [selectedCV, setSelectedCV] = useState<FileItem[]>([]);
  const [selectedID, setSelectedID] = useState<FileItem[]>([]);

  // dropdown states
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string[]>([]);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayStatus, setOverlayStatus] = useState<'loading' | 'success'>('loading');

  // Shared active focus state system mapping layout changes
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Validate JPG/PNG files
  const isJpgOrPng = (file: FileItem) => {
    const fileName = file.fileName || file.uri;
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
  };

  const clearAllFields = () => {
    setName('');
    setNumber('');
    setEmail('');
    setMessage('');
    setExperience('');
    setEmergencyNumber('');
    setCoverMessage('');
    setSelectedCV([]);
    setSelectedID([]);
    setSelectedExpertise([]);
    setSelectedArea([]);
    setActiveInput(null);
  };

  const handleClearForm = () => {
    Alert.alert(
      'Clear Form',
      'Are you sure you want to clear all fields?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Clear',
          style: 'destructive',
          onPress: clearAllFields,
        },
      ]
    );
  };

  const handleSubmit = () => {
    // Check files before submitting
    const allFiles = [...selectedID, ...selectedCV];
    const invalidFiles = allFiles.filter(file => !isJpgOrPng(file));

    if (invalidFiles.length > 0) {
      Alert.alert('Invalid File Type', 'Please upload only .jpg or .png images.');
      return;
    }

    setOverlayStatus('loading');
    setOverlayVisible(true);
    // Proceed with form submission logic
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header3 />
      <SubmitOverlay
        visible={overlayVisible}
        status={overlayStatus}
        onClear={() => { clearAllFields(); setOverlayVisible(false); }}
        onClose={() => setOverlayVisible(false)}
      />
      <KeyboardAwareScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        enableResetScrollToCoords={false}
        resetScrollToCoords={undefined}
        enableAutomaticScroll={Platform.OS === 'ios'}
        keyboardDismissMode="on-drag"
      >
        <View style={[styles.formContainer, { marginBottom: hp('5%') }]}>
          <Text style={styles.title}>Join Now</Text>

          <View style={styles.spacerGap} />

          {/* Full Name */}
          <Text style={styles.label}>Full Name<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            placeholder="Enter your Full Name"
            value={name}
            onChangeText={setName}
            onFocus={() => setActiveInput('name')}
            onBlur={() => setActiveInput(null)}
            style={[
              styles.input,
              activeInput === 'name' && styles.inputActive
            ]}
            placeholderTextColor={'#4B4B4B'}
            maxLength={30}
          />

          {/* Phone Number (Full Nepal Flag) */}
          <Text style={styles.label}>Phone Number<Text style={{ color: 'red' }}>*</Text></Text>
          <View style={styles.phoneContainer}>
            <Image
              source={countryLogo}
              style={styles.flagIcon}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Enter your Phone Number"
              value={number}
              onFocus={() => setActiveInput('phone')}
              onBlur={() => setActiveInput(null)}
              onChangeText={(value) => {
                let cleaned = value.replace(/[^0-9]/g, '');
                cleaned = cleaned.slice(0, 10);
                let formatted = cleaned;

                if (cleaned.length > 3 && cleaned.length <= 6) {
                  formatted = cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
                } else if (cleaned.length > 6) {
                  formatted =
                    cleaned.slice(0, 3) +
                    ' ' +
                    cleaned.slice(3, 6) +
                    ' ' +
                    cleaned.slice(6);
                }
                setNumber(formatted);
              }}
              keyboardType="number-pad"
              style={[
                styles.phoneInput,
                activeInput === 'phone' && styles.inputActive
              ]}
              placeholderTextColor={'#4B4B4B'}
              maxLength={12}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setActiveInput('email')}
            onBlur={() => setActiveInput(null)}
            style={[
              styles.input,
              activeInput === 'email' && styles.inputActive
            ]}
            placeholderTextColor={'#4B4B4B'}
          />

          {/* Area of Expertise */}
          <Text style={styles.label}>Position Applied For<Text style={{ color: 'red' }}>*</Text></Text>
          <DropdownAdd
            options={services}
            placeholder="Select the position you are applying for"
            placeholderColor="#4B4B4B"
            value={selectedExpertise}
            onSelectOption={setSelectedExpertise}
            onOpen={() => setActiveInput('expertise')}
            onClose={() => setActiveInput(null)}
            maxSelections={3}
          />

          {/* Years of Experience */}
          <Text style={styles.label}>Years of Experience<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            placeholder="Enter your years of experience in the field"
            value={experience}
            onFocus={() => setActiveInput('experience')}
            onBlur={() => setActiveInput(null)}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setExperience(onlyNumbers);
            }}
            style={[
              styles.input,
              activeInput === 'experience' && styles.inputActive
            ]}
            placeholderTextColor={'#4B4B4B'}
            keyboardType="numeric"
          />

          {/* ID Proof (JPG/PNG only) */}
          <Text style={styles.label}>ID Proof (JPG, PNG only)<Text style={{ color: 'red' }}>*</Text></Text>
          <FileUploadBox
            value={selectedID}
            onChange={setSelectedID}
            maxFiles={5}
            allowedExtensions={['jpg', 'jpeg', 'png']}
          />

          {/* Preferred Working Area */}
          <Text style={styles.label}>Preferred Working Area<Text style={{ color: 'red' }}>*</Text></Text>
          <DropdownAdd
            options={area}
            placeholder="Select Maximum 5"
            placeholderColor="#4B4B4B"
            value={selectedArea}
            onSelectOption={setSelectedArea}
            onOpen={() => setActiveInput('workingArea')}
            onClose={() => setActiveInput(null)}
            maxSelections={5}
          />

          {/* Emergency Contact Number (Full Nepal Flag) */}
          <Text style={styles.label}>Emergency Contact Number<Text style={{ color: 'red' }}>*</Text></Text>
          <View style={styles.phoneContainer}>
            <Image
              source={countryLogo}
              style={styles.flagIcon}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Contact number of Spouse/ family members"
              value={emergencyNumber}
              onFocus={() => setActiveInput('emergencyPhone')}
              onBlur={() => setActiveInput(null)}
              onChangeText={(value) => {
                let cleaned = value.replace(/[^0-9]/g, '');
                cleaned = cleaned.slice(0, 10);
                let formatted = cleaned;

                if (cleaned.length > 3 && cleaned.length <= 6) {
                  formatted = cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
                } else if (cleaned.length > 6) {
                  formatted =
                    cleaned.slice(0, 3) +
                    ' ' +
                    cleaned.slice(3, 6) +
                    ' ' +
                    cleaned.slice(6);
                }
                setEmergencyNumber(formatted);
              }}
              keyboardType="number-pad"
              style={[
                styles.phoneInput,
                activeInput === 'emergencyPhone' && styles.inputActive
              ]}
              placeholderTextColor={'#4B4B4B'}
              maxLength={12}
            />
          </View>

          {/* Training Certificate (JPG/PNG only) */}
          <Text style={styles.label}>Upload Training Certificate (JPG, PNG only)</Text>
          <FileUploadBox
            value={selectedCV}
            onChange={setSelectedCV}
            maxFiles={10}
            allowedExtensions={['jpg', 'jpeg', 'png']}
          />

          {/* Cover Letter */}
          <Text style={styles.label}>Cover Letter<Text style={{ color: 'red' }}>*</Text></Text>
          <TextArea
            value={coverMessage}
            onChangeText={setCoverMessage}
            placeholder=""
            placeholderTextColor="#4B4B4B"
            maxHeight={160}
            onFocus={() => setActiveInput('coverLetter')}
            onBlur={() => setActiveInput(null)}
            style={activeInput === 'coverLetter' && styles.inputActive}
          />

          {/* Message */}
          <Text style={styles.label}>Short Bio<Text style={{ color: 'red' }}>*</Text></Text>
          <TextArea
            value={message}
            onChangeText={setMessage}
            placeholder=""
            placeholderTextColor="#4B4B4B"
            maxHeight={160}
            onFocus={() => setActiveInput('message')}
            onBlur={() => setActiveInput(null)}
            style={activeInput === 'message' && styles.inputActive}
          />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonClearFlex} onPress={handleClearForm}>
              <Image source={ClearFormIcon} style={styles.clearIcon} />
              <Text style={styles.buttonClear}>Clear form</Text>
            </Pressable>

            <Button
              style={styles.buttonSubmit}
              onPress={handleSubmit}
              textStyle={{ color: 'white', textAlign: 'center' }}
            >
              Submit
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  formContainer: {
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.02,
    backgroundColor: 'white',
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingLeft: 3,
  },
  spacerGap: {
    marginVertical: 20
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: width * 0.035,
    height: height * 0.055,
    marginBottom: height * 0.02,
    fontSize: width * 0.035,
    fontWeight: '500',
    borderColor: '#E2E8F0',
    color: '#1A1A1A',
    backgroundColor: '#fff',
  },
  inputActive: {
    borderColor: 'hsl(142, 71%, 45%)',
    backgroundColor: '#F4F7FF',
  },
  phoneContainer: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: height * 0.02,
  },
  flagIcon: {
    width: wp('7%'),
    height: hp('3.8%'),
    position: 'absolute',
    left: wp('3%'),
    zIndex: 2,
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  clearIcon: {
    width: wp('6%'),
    height: hp('2.5%'),
    resizeMode: 'contain',
    marginRight: 4,
  },
  phoneInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    borderColor: '#E2E8F0',
    height: height * 0.055,
    paddingLeft: wp('13.5%'),
    paddingRight: 10,
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#1A1A1A',
    backgroundColor: '#fff',
  },
  label: {
    marginBottom: 6,
    paddingLeft: 4,
    fontSize: wp('3.6%'),
    fontWeight: '600',
    color: '#4A4A4A',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonSubmit: {
    width: width * 0.4,
    height: height * 0.058,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 40,
    backgroundColor: '#000',
  },
  buttonClear: {
    color: '#0a7de1',
    fontSize: width * 0.038,
    fontWeight: '500',
  },
  buttonClearFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  text: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});

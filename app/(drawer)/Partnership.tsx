import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, Pressable, Alert, Platform } from 'react-native';
import { area, businessType, partnershipInterest } from '../../src/data/Data';
import TextArea from '../../components/bookings/TextArea';
import SubmitOverlay from '../../components/bookings/SubmitOverlay';
import countryLogo from '../../assets/header/nepal-flag-icon-256.png';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FileUploadBox from '../../components/bookings/FileUploadBox';
import ClearFormIcon from '../../assets/icons/booking/clear.png';
import DropdownAdd from '../../components/bookings/DropdownAdd';
import Header3 from '../../components/Header3drawer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get('window');

interface ButtonProps {
  children: React.ReactNode;
  style?: any;
  textStyle?: any;
  onPress: () => void;
}

const Button = ({ children, style, textStyle, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={style}>
      <Text style={[styles.text, textStyle]}> {children} </Text>
    </TouchableOpacity>
  );
};

export type FileItem = {
  uri: string;
  fileName?: string;
};

export default function PartnershipScreen() {
  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  // Form States
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [yearsInOperation, setYearsInOperation] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');

  // Files
  const [businessDocuments, setBusinessDocuments] = useState<FileItem[]>([]);
  const [companyProfile, setCompanyProfile] = useState<FileItem[]>([]);

  // Dropdown states
  const [selectedBusinessType, setSelectedBusinessType] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string[]>([]);
  const [selectedInterest, setSelectedInterest] = useState<string[]>([]);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayStatus, setOverlayStatus] = useState<'loading' | 'success'>('loading');
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Validate JPG/PNG files
  const isJpgOrPng = (file: FileItem) => {
    const fileName = file.fileName || file.uri;
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
  };

  const clearAllFields = () => {
    setBusinessName('');
    setContactPerson('');
    setNumber('');
    setEmail('');
    setYearsInOperation('');
    setRegistrationNumber('');
    setProposalMessage('');
    setBusinessDocuments([]);
    setCompanyProfile([]);
    setSelectedBusinessType([]);
    setSelectedArea([]);
    setSelectedInterest([]);
    setActiveInput(null);
  };

  const handleClearForm = () => {
    Alert.alert(
      'Clear Form',
      'Are you sure you want to clear all fields?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Clear', style: 'destructive', onPress: clearAllFields },
      ]
    );
  };

  const handleSubmit = () => {
    // Validate required fields
    const isMissingFields =
      !businessName.trim() ||
      !contactPerson.trim() ||
      !number.trim() ||
      !email.trim() ||
      selectedBusinessType.length === 0 ||
      !yearsInOperation.trim() ||
      selectedArea.length === 0 ||
      selectedInterest.length === 0 ||
      !proposalMessage.trim();

    if (isMissingFields) {
      Alert.alert(
        'Required Fields Missing',
        'Please complete all required fields (*) before submitting.'
      );
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Check files before submitting
    const allFiles = [...businessDocuments, ...companyProfile];
    const invalidFiles = allFiles.filter(file => !isJpgOrPng(file));
    if (invalidFiles.length > 0) {
      Alert.alert('Invalid File Type', 'Please upload only .jpg or .png images.');
      return;
    }

    setOverlayStatus('loading');
    setOverlayVisible(true);

    // Simulate API call
    setTimeout(() => {
      setOverlayStatus('success');
    }, 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header3 />
      <SubmitOverlay
        visible={overlayVisible}
        status={overlayStatus}
        onClear={() => {
          clearAllFields();
          setOverlayVisible(false);
        }}
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
          <Text style={styles.title}>Become a Partner</Text>
          <View style={styles.spacerGap} />

          {/* Business Name */}
          <Text style={styles.label}>Business Name<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            placeholder="Enter your registered business name"
            value={businessName}
            onChangeText={setBusinessName}
            onFocus={() => setActiveInput('businessName')}
            onBlur={() => setActiveInput(null)}
            style={[
              styles.input,
              activeInput === 'businessName' && styles.inputActive
            ]}
            placeholderTextColor={'#4B4B4B'}
            autoCapitalize="words"
          />

          {/* Contact Person */}
          <Text style={styles.label}>Contact Person Name<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            placeholder="Full name of contact person"
            value={contactPerson}
            onChangeText={setContactPerson}
            onFocus={() => setActiveInput('contactPerson')}
            onBlur={() => setActiveInput(null)}
            style={[
              styles.input,
              activeInput === 'contactPerson' && styles.inputActive
            ]}
            placeholderTextColor={'#4B4B4B'}
            autoCapitalize="words"
          />

          {/* Phone Number */}
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
                  formatted = cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 6) + ' ' + cleaned.slice(6);
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
          <Text style={styles.label}>Business Email<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            placeholder="Enter your business email address"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setActiveInput('email')}
            onBlur={() => setActiveInput(null)}
            style={[
              styles.input,
              activeInput === 'email' && styles.inputActive
            ]}
            placeholderTextColor={'#4B4B4B'}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Business Type */}
          <Text style={styles.label}>Business Type<Text style={{ color: 'red' }}>*</Text></Text>
          <DropdownAdd
            options={businessType}
            placeholder="Select your business category"
            placeholderColor="#4B4B4B"
            value={selectedBusinessType}
            onSelectOption={setSelectedBusinessType}
            onOpen={() => setActiveInput('businessType')}
            onClose={() => setActiveInput(null)}
            maxSelections={3}
          />

          {/* Years in Operation */}
          <Text style={styles.label}>Years in Operation<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            placeholder="How many years has your business been operating?"
            value={yearsInOperation}
            onFocus={() => setActiveInput('years')}
            onBlur={() => setActiveInput(null)}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setYearsInOperation(onlyNumbers);
            }}
            style={[
              styles.input,
              activeInput === 'years' && styles.inputActive
            ]}
            placeholderTextColor={'#4B4B4B'}
            keyboardType="numeric"
          />

          {/* Registration Number */}
          <Text style={styles.label}>Business Registration Number</Text>
          <TextInput
            placeholder="PAN / VAT Number"
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            onFocus={() => setActiveInput('registration')}
            onBlur={() => setActiveInput(null)}
            style={[
              styles.input,
              activeInput === 'registration' && styles.inputActive
            ]}
            placeholderTextColor={'#4B4B4B'}
          />

          {/* Business Documents */}
          <Text style={styles.label}>Business Registration Documents (JPG, PNG)</Text>
          <FileUploadBox
            value={businessDocuments}
            onChange={setBusinessDocuments}
            maxFiles={5}
          />

          {/* Coverage Area */}
          <Text style={styles.label}>Preferred Working Area<Text style={{ color: 'red' }}>*</Text></Text>
          <DropdownAdd
            options={area}
            placeholder="Select areas you can cover"
            placeholderColor="#4B4B4B"
            value={selectedArea}
            onSelectOption={setSelectedArea}
            onOpen={() => setActiveInput('area')}
            onClose={() => setActiveInput(null)}
            maxSelections={5}
          />

          {/* Partnership Interest */}
          <Text style={styles.label}>Partnership Interest<Text style={{ color: 'red' }}>*</Text></Text>
          <DropdownAdd
            options={partnershipInterest}
            placeholder="Select partnership duration"
            placeholderColor="#4B4B4B"
            value={selectedInterest}
            onSelectOption={setSelectedInterest}
            onOpen={() => setActiveInput('interest')}
            onClose={() => setActiveInput(null)}
            maxSelections={1}
          />

          {/* Proposal/Bio */}
          <Text style={styles.label}>Business Proposal / Short Bio<Text style={{ color: 'red' }}>*</Text></Text>
          <TextArea
            value={proposalMessage}
            onChangeText={setProposalMessage}
            placeholder="Briefly describe your business and why you want to partner with us"
            placeholderTextColor="#4B4B4B"
            maxHeight={160}
            onFocus={() => setActiveInput('proposal')}
            onBlur={() => setActiveInput(null)}
            style={activeInput === 'proposal' && styles.inputActive}
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
    width: '100%',
  },
  flagIcon: {
    width: wp('4.5%'),
    height: hp('2.5%'),
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
    width: '100%',
    paddingLeft: wp('10%'),
    paddingRight: wp('3.5%'),
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
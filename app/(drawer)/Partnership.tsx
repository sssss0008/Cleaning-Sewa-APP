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
import Dropdown from '../../components/bookings/Dropdown';
import { businessType, city, howduhear, partnershipInterest, services } from '../../src/data/Data';
import TextArea from '../../components/bookings/TextArea';
import SubmitOverlay from '../../components/bookings/SubmitOverlay';
import countryLogo from '../../assets/header/right.png';
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

interface ButtonProps {
  children: React.ReactNode;
  style?: any;
  textStyle?: any;
  onPress?: () => void;
}

const Button = ({ children, style, textStyle, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={style}
      onPress={onPress}
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

export default function PartnershipScreen() {
  const scrollRef = useRef<any>(null);

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState('');

  // Photos state
  const [selectCompanyPhotos, setSelectCompanyPhotos] = useState<FileItem[]>([]);
  const [selectCRCphotos, setSelectCRCphotos] = useState<FileItem[]>([]);

  // Dropdown states
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [selectedPartnership, setSelectedPartnership] = useState('');
  const [selectedHowHeard, setSelectedHowHeard] = useState('Facebook ');
  const [selectedServicesOffered, setSelectedServicesOffered] = useState<string[]>([]);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayStatus, setOverlayStatus] = useState<'loading' | 'success'>('loading');
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Validate that all attached files are JPG or PNG
  const isJpgOrPng = (file: FileItem) => {
    const fileName = file.fileName || file.uri;
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
  };

  const clearAllFields = () => {
    setName('');
    setNumber('');
    setEmail('');
    setOrganizationName('');
    setMessage('');
    setEmployees('');
    setSelectCompanyPhotos([]);
    setSelectCRCphotos([]);
    setSelectedArea('');
    setSelectedBusinessType('');
    setSelectedPartnership('');
    setSelectedHowHeard('Facebook ');
    setSelectedServicesOffered([]);
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
    // Check files before submitting
    const allFiles = [...selectCompanyPhotos, ...selectCRCphotos];
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
        enableAutomaticScroll={Platform.OS === 'ios'}
        keyboardDismissMode="on-drag"
      >
        <View style={[styles.formContainer, { marginBottom: hp('5%') }]}>
          <Text style={styles.title}>Become a Partner</Text>
          <Text style={styles.subTitle}>Partnership opportunity with CleaningSewa</Text>

          <View style={styles.spacerGap} />

          {/* Full Name */}
          <Text style={styles.label}>Full Name<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            placeholder="Enter your Full Name"
            value={name}
            onChangeText={setName}
            onFocus={() => setActiveInput('name')}
            onBlur={() => setActiveInput(null)}
            style={[styles.input, activeInput === 'name' && styles.inputActive]}
            placeholderTextColor={'#4B4B4B'}
            maxLength={30}
          />

          {/* Name of Organization */}
          <Text style={styles.label}>Name of Organization<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            placeholder="Enter the name of your Organization"
            value={organizationName}
            onChangeText={setOrganizationName}
            onFocus={() => setActiveInput('organization')}
            onBlur={() => setActiveInput(null)}
            style={[styles.input, activeInput === 'organization' && styles.inputActive]}
            placeholderTextColor={'#4B4B4B'}
            maxLength={100}
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
              style={[styles.phoneInput, activeInput === 'phone' && styles.inputActive]}
              placeholderTextColor={'#4B4B4B'}
              maxLength={12}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            placeholder="Enter your Email Address"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setActiveInput('email')}
            onBlur={() => setActiveInput(null)}
            style={[styles.input, activeInput === 'email' && styles.inputActive]}
            placeholderTextColor={'#4B4B4B'}
          />

          {/* Company Photos (JPG/PNG only) */}
          <Text style={styles.label}>Company Photos (JPG, PNG only)<Text style={{ color: 'red' }}>*</Text></Text>
          <FileUploadBox
            value={selectCompanyPhotos}
            maxFiles={5}
            onChange={setSelectCompanyPhotos}
            allowedExtensions={['jpg', 'jpeg', 'png']}
          />

          {/* Area Dropdown */}
          <Text style={styles.label}>City<Text style={{ color: 'red' }}>*</Text></Text>
          <Dropdown
            options={city}
            placeholder="Select your City"
            placeholderColor="#4B4B4B"
            onSelectOption={setSelectedArea}
            value={selectedArea}
            onOpen={() => setActiveInput('area')}
            onClose={() => setActiveInput(null)}
          />

          {/* Number of Employees */}
          <Text style={styles.label}>Number of Employees<Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            placeholder="Enter the number of Employees"
            placeholderTextColor={'#4B4B4B'}
            keyboardType="numeric"
            value={employees}
            onFocus={() => setActiveInput('employees')}
            onBlur={() => setActiveInput(null)}
            onChangeText={(text) => setEmployees(text.replace(/[^0-9]/g, ''))}
            style={[styles.input, activeInput === 'employees' && styles.inputActive]}
            maxLength={7}
          />

          {/* Business Type Dropdown */}
          <Text style={styles.label}>Business Type<Text style={{ color: 'red' }}>*</Text></Text>
          <Dropdown
            options={businessType}
            placeholder="Select your Business Type"
            placeholderColor="#4B4B4B"
            onSelectOption={setSelectedBusinessType}
            value={selectedBusinessType}
            onOpen={() => setActiveInput('businessType')}
            onClose={() => setActiveInput(null)}
          />

          {/* Services Offered Dropdown Add */}
          <Text style={styles.label}>Services Offered<Text style={{ color: 'red' }}>*</Text></Text>
          <DropdownAdd
            options={services}
            placeholder="Select the Services you offer"
            placeholderColor="#4B4B4B"
            onSelectOption={setSelectedServicesOffered}
            value={selectedServicesOffered}
            onOpen={() => setActiveInput('servicesOffered')}
            onClose={() => setActiveInput(null)}
          />

          {/* Partnership Interest Dropdown */}
          <Text style={styles.label}>Partnership Interest<Text style={{ color: 'red' }}>*</Text></Text>
          <Dropdown
            options={partnershipInterest}
            placeholder="Select Partnership Interest"
            placeholderColor="#4B4B4B"
            onSelectOption={setSelectedPartnership}
            value={selectedPartnership}
            onOpen={() => setActiveInput('partnership')}
            onClose={() => setActiveInput(null)}
          />

          {/* Company Registration Certificates (JPG/PNG only) */}
          <Text style={styles.label}>Company Registration Certificates (JPG, PNG only)<Text style={{ color: 'red' }}>*</Text></Text>
          <FileUploadBox
            value={selectCRCphotos}
            maxFiles={10}
            onChange={setSelectCRCphotos}
            allowedExtensions={['jpg', 'jpeg', 'png']}
          />

          {/* How did you hear about us Dropdown */}
          <Text style={styles.label}>How did you hear about us?<Text style={{ color: 'red' }}>*</Text></Text>
          <Dropdown
            options={howduhear}
            placeholder="How did you hear about us?"
            placeholderColor="#4B4B4B"
            onSelectOption={setSelectedHowHeard}
            value={selectedHowHeard}
            onOpen={() => setActiveInput('howHeard')}
            onClose={() => setActiveInput(null)}
          />

          {/* Message TextArea */}
          <Text style={styles.label}>Message<Text style={{ color: 'red' }}>*</Text></Text>
          <TextArea
            value={message}
            onChangeText={setMessage}
            placeholder="Enter your message here"
            placeholderTextColor="#4B4B4B"
            maxHeight={160}
            onFocus={() => setActiveInput('message')}
            onBlur={() => setActiveInput(null)}
            style={[
              styles.textAreaBase,
              activeInput === 'message' ? styles.inputActive : styles.inputInactive
            ]}
          />

          {/* Form Actions */}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonClearFlex} onPress={handleClearForm}>
              <Image source={ClearFormIcon} style={styles.clearIcon} />
              <Text style={styles.buttonClear}>Clear form</Text>
            </Pressable>

            <Button
              style={styles.buttonSubmit}
              onPress={handleSubmit}
              textStyle={{ color: 'white', textAlign: 'center' }}>
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
  subTitle: {
    fontSize: width * 0.034,
    fontWeight: '400',
    color: '#666',
    paddingLeft: 3,
    marginTop: 4,
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
  textAreaBase: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: width * 0.035,
    paddingVertical: 10,
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  inputInactive: {
    borderColor: '#E2E8F0',
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
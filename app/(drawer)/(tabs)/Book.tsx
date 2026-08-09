import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import Header2 from '../../../components/Header2';
import { Ionicons } from '@expo/vector-icons';
import { bookingService } from '../../../src/services/bookingService';

const { width, height } = Dimensions.get('window');

// 1. All 32 Services
const cleaningServices = [
  'Bathroom Cleaning',
  'Kitchen Cleaning',
  'Home Cleaning',
  'Carpet Cleaning',
  'Sofa / Upholstery Cleaning',
  'Move-In / Move-Out Cleaning',
  'Disinfection / Sanitization',
  'A/C Cleaning',
  'Laptop Cleaning',
  'Desktop Cleaning',
  'Aeroplane Cleaning',
  'Helicopter Cleaning',
  'Reserve Tank Cleaning',
  'Marble / Tile Cleaning',
  'Post-cleaning Cleaning',
  'Garden Cleaning',
  'Garage Cleaning',
  'Air Duct & Vent Cleaning',
  'Post Event Cleaning',
  'Facade Cleaning',
  'Parquet Cleaning',
  'Chair Cleaning',
  'Drainage Cleaning',
  'Septic Tank Cleaning',
  'Lift / Elevator Cleaning',
  'Medical Facility Cleaning',
  'Dead Animal Removal',
  'Swimming Pool Cleaning',
  'School Cleaning',
  'Dog Cleaning',
  'Office Cleaning',
  'Monthly Cleaning',
];

// 2. All 32 Property Types
const propertyTypes = [
  'Airports & Transport Hubs',
  'Apartment',
  'Ashrams',
  'Bungalow',
  'Business Parks',
  'Commercial Gardening Farm',
  'Concerts',
  'Corporate House',
  'Eco-tourism Sites',
  'Homestay',
  'Hospital/ Clinic',
  'Hotel',
  'Memorial Parks',
  'Municipal Spaces',
  'Office',
  'Park',
  'Resort',
  'Restaurant/ Cafe',
  'Roadside Landscaping',
  'Rooftop / Terrace Gardens',
  'School/ College',
  'Shopping Malls & Complexes',
  'Showrooms',
  'Temple',
  'Training Centers',
  'Urban Farming Spaces',
  'Vertical Gardens (Green Walls)',
  'Villa',
  'Warehouses',
  'Wedding Venues',
  'Wellness Centers',
  'Other',
];

const cities = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Chitwan'];
const budgetOptions = ['Under NPR 5,000', 'NPR 5,000 - NPR 10,000', 'NPR 10,000 - NPR 20,000', 'NPR 20,000+'];
const timingOptions = ['As soon as possible', 'This Week', 'Next Week', 'Flexible / Later'];
const leadSources = ['Facebook / Instagram', 'Google Search', 'Friend / Recommendation', 'TikTok', 'Other'];

export default function ServiceBookingScreen() {
  const scrollRef = useRef(null);

  // Form Field States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [budget, setBudget] = useState('');
  const [service, setService] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [timing, setTiming] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [message, setMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Image Upload State
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Error State Map
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Selector Modal States
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTitle, setPickerTitle] = useState('');
  const [pickerItems, setPickerItems] = useState<string[]>([]);
  const [pickerTarget, setPickerTarget] = useState('');

  // Launch Image Library
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'You need to grant photo access permissions to upload images.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const openPicker = (title: string, items: string[], targetStateSetterName: string) => {
    setPickerTitle(title);
    setPickerItems(items);
    setPickerTarget(targetStateSetterName);
    setPickerVisible(true);
  };

  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  const handleSelectValue = (value: string) => {
    switch (pickerTarget) {
      case 'city':
        setCity(value);
        clearError('city');
        break;
      case 'budget':
        setBudget(value);
        clearError('budget');
        break;
      case 'service':
        setService(value);
        clearError('service');
        break;
      case 'propertyType':
        setPropertyType(value);
        break;
      case 'timing':
        setTiming(value);
        clearError('timing');
        break;
      case 'leadSource':
        setLeadSource(value);
        clearError('leadSource');
        break;
      default:
        break;
    }
    setPickerVisible(false);
  };

  const clearForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setCity('');
    setLandmark('');
    setBudget('');
    setService('');
    setPropertyType('');
    setTiming('');
    setLeadSource('');
    setMessage('');
    setImageUri(null);
    setAgreedToTerms(false);
    setErrors({});
  };

  const handleClearForm = () => {
    Alert.alert('Clear Form', 'Are you sure you want to clear all fields?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, Clear', style: 'destructive', onPress: clearForm },
    ]);
  };

  // Validation Routine
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter a valid full name';
    }

    if (email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    const cleanPhone = phone.trim().replace(/[- ]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!city) {
      newErrors.city = 'Please select a city';
    }

    if (!budget) {
      newErrors.budget = 'Please select your budget';
    }

    if (!service) {
      newErrors.service = 'Please select at least one service';
    }

    if (!timing) {
      newErrors.timing = 'Please select when you need the service';
    }

    if (!leadSource) {
      newErrors.leadSource = 'Please tell us how you found us';
    }

    if (!agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms and Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      const errorMsg = !agreedToTerms
        ? 'Please agree to the Terms and Conditions before submitting.'
        : 'Please correct the highlighted fields before submitting.';
      Alert.alert('Validation Error', errorMsg);
      return;
    }

    setIsSubmitting(true);

    const result = await bookingService.submitBooking({
      full_name: fullName,
      email: email,
      phone: phone,
      city: city,
      landmark: landmark,
      budget: budget,
      service: service,
      property_type: propertyType,
      timing: timing,
      lead_source: leadSource,
      message: message,
      image_url: imageUri || undefined, // In a real app, you'd upload to Storage first
    });

    setIsSubmitting(false);

    if (result.success) {
      Alert.alert('Success 🎉', 'Your booking request has been submitted successfully.');
      clearForm();
    } else {
      Alert.alert('Submission Error', result.error || 'Failed to submit booking. Please try again.');
    }
  };

  return (
    <View style={styles.screen}>
      <Header2 />
      <KeyboardAwareScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.outerTitle}>Book Cleaning Service in Nepal</Text>

        <View style={styles.formCard}>
          {/* Full Name */}
          <Text style={styles.fieldLabel}>
            Full Name<Text style={styles.asterisk}> *</Text>
          </Text>
          <TextInput
            style={[styles.inputField, errors.fullName && styles.inputErrorBorder]}
            value={fullName}
            onChangeText={(val) => {
              setFullName(val);
              clearError('fullName');
            }}
            placeholder="Enter full name"
            placeholderTextColor="#9CA3AF"
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          {/* Email */}
          <Text style={styles.fieldLabel}>eMail</Text>
          <TextInput
            style={[styles.inputField, errors.email && styles.inputErrorBorder]}
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              clearError('email');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="example@mail.com"
            placeholderTextColor="#9CA3AF"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Phone with Nepal Flag */}
          <Text style={styles.fieldLabel}>
            Phone<Text style={styles.asterisk}> *</Text>
          </Text>
          <View style={[styles.phoneInputWrapper, errors.phone && styles.inputErrorBorder]}>
            <Text style={styles.flagIcon}>🇳🇵</Text>
            <TextInput
              style={styles.phoneInputField}
              value={phone}
              onChangeText={(val) => {
                setPhone(val);
                clearError('phone');
              }}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="98XXXXXXXX"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          {/* City */}
          <Text style={styles.fieldLabel}>
            City<Text style={styles.asterisk}> *</Text>
          </Text>
          <TouchableOpacity
            style={[styles.dropdownTrigger, errors.city && styles.inputErrorBorder]}
            onPress={() => openPicker('Find a city', cities, 'city')}
          >
            <Text style={city ? styles.selectedText : styles.placeholderText}>
              {city || 'Select city'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

          {/* Nearest Landmark */}
          <Text style={styles.fieldLabel}>Nearest Landmark</Text>
          <TextInput
            style={styles.inputField}
            value={landmark}
            onChangeText={setLandmark}
            placeholder="e.g. Near main chowk"
            placeholderTextColor="#9CA3AF"
          />

          {/* Budget */}
          <Text style={styles.fieldLabel}>
            Budget in NPR<Text style={styles.asterisk}> *</Text>
          </Text>
          <TouchableOpacity
            style={[styles.dropdownTrigger, errors.budget && styles.inputErrorBorder]}
            onPress={() => openPicker('Find an option', budgetOptions, 'budget')}
          >
            <Text style={budget ? styles.selectedText : styles.placeholderText}>
              {budget || 'Select estimated budget'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}

          {/* Select Services */}
          <Text style={styles.fieldLabel}>
            Select Services<Text style={styles.asterisk}> *</Text>
          </Text>
          <View style={[styles.serviceFieldContainer, errors.service && styles.inputErrorBorder]}>
            <TouchableOpacity
              style={styles.serviceAddBtn}
              onPress={() => openPicker('Find an option', cleaningServices, 'service')}
            >
              <Text style={styles.serviceAddText}>+</Text>
            </TouchableOpacity>
            {service ? (
              <Text style={styles.activeServiceTag}>{service}</Text>
            ) : (
              <Text style={[styles.placeholderText, { marginLeft: 8 }]}>Choose service</Text>
            )}
          </View>
          {errors.service && <Text style={styles.errorText}>{errors.service}</Text>}

          {/* Property Type */}
          <Text style={styles.fieldLabel}>Property Type</Text>
          <TouchableOpacity
            style={styles.dropdownTrigger}
            onPress={() => openPicker('Find an option', propertyTypes, 'propertyType')}
          >
            <Text style={propertyType ? styles.selectedText : styles.placeholderText}>
              {propertyType || 'Select building/property context'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Photos Upload Area */}
          <Text style={styles.fieldLabel}>Add Photos of your Property</Text>
          {imageUri ? (
            <View style={styles.imagePreviewWrapper}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageBadge} onPress={handleRemoveImage}>
                <Text style={styles.removeImageText}>✕ Remove Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadAreaContainer} onPress={handlePickImage}>
              <Text style={styles.uploadIcon}>☉</Text>
              <Text style={styles.uploadText}>Drop files here or click to browse</Text>
            </TouchableOpacity>
          )}

          {/* Timing Selector */}
          <Text style={styles.fieldLabel}>
            When do you need service?<Text style={styles.asterisk}> *</Text>
          </Text>
          <TouchableOpacity
            style={[styles.dropdownTrigger, errors.timing && styles.inputErrorBorder]}
            onPress={() => openPicker('Select timeline', timingOptions, 'timing')}
          >
            <Text style={timing ? styles.selectedText : styles.placeholderText}>
              {timing || 'Select dynamic schedule priority'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          {errors.timing && <Text style={styles.errorText}>{errors.timing}</Text>}

          {/* Lead Attribution */}
          <Text style={styles.fieldLabel}>
            How did you know about us?<Text style={styles.asterisk}> *</Text>
          </Text>
          <TouchableOpacity
            style={[styles.dropdownTrigger, errors.leadSource && styles.inputErrorBorder]}
            onPress={() => openPicker('Select option', leadSources, 'leadSource')}
          >
            <Text style={leadSource ? styles.selectedText : styles.placeholderText}>
              {leadSource || 'Choose an option'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          {errors.leadSource && <Text style={styles.errorText}>{errors.leadSource}</Text>}

          {/* Message Area */}
          <Text style={styles.fieldLabel}>Message</Text>
          <TextInput
            style={styles.messageBox}
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
            placeholder="Type any additional requirements here..."
            placeholderTextColor="#9CA3AF"
          />

          {/* Terms and Conditions Checkbox (SUG_001) */}
          <TouchableOpacity
            style={styles.termsRow}
            activeOpacity={0.7}
            onPress={() => {
              setAgreedToTerms(!agreedToTerms);
              clearError('agreedToTerms');
            }}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Ionicons name="checkmark" size={14} color="#FFF" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.linkText}>Terms and Conditions</Text>
              <Text style={styles.asterisk}> *</Text>
            </Text>
          </TouchableOpacity>
          {errors.agreedToTerms && <Text style={styles.errorText}>{errors.agreedToTerms}</Text>}

          {/* Footer Action Bar */}
          <View style={styles.actionFooterRow}>
            <TouchableOpacity style={styles.clearFormBtn} onPress={handleClearForm}>
              <Text style={styles.clearFormIconSymbol}>↶</Text>
              <Text style={styles.clearFormTextLabel}>Clear form</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtnBlock}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.submitBtnTextLabel}>BOOK NOW</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.warningInfoLabel}>
            Do not submit passwords through this form.{' '}
            <Text style={styles.reportFormLink}>Report malicious form</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>

      {/* Option Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>{pickerTitle}</Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={pickerItems}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItemRow} onPress={() => handleSelectValue(item)}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  outerTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
    marginTop: 15,
    marginBottom: 10,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: width * 0.04,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    marginTop: 14,
  },
  asterisk: {
    color: '#DC2626',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    height: 42,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFF',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    height: 42,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  flagIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  phoneInputField: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 0,
  },
  inputErrorBorder: {
    borderColor: '#DC2626',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
  },
  placeholderText: {
    flex: 1,
    color: '#9CA3AF',
    fontSize: 14,
  },
  selectedText: {
    flex: 1,
    color: '#1F2937',
    fontSize: 14,
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  serviceFieldContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    minHeight: 44,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  serviceAddBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceAddText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeServiceTag: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
    borderWidth: 1,
    color: '#166534',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  uploadAreaContainer: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 6,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  uploadIcon: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 6,
  },
  uploadText: {
    fontSize: 12,
    color: '#6B7280',
  },
  imagePreviewWrapper: {
    marginTop: 4,
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
  },
  removeImageText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  messageBox: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    minHeight: 80,
    paddingHorizontal: 12,
    paddingTop: 8,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFF',
    textAlignVertical: 'top',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  termsText: {
    fontSize: 13,
    color: '#374151',
  },
  linkText: {
    color: '#064E3B',
    fontWeight: '700',
  },
  actionFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 20,
  },
  clearFormBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  clearFormIconSymbol: {
    fontSize: 15,
    color: '#2563EB',
    marginRight: 4,
  },
  clearFormTextLabel: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
  },
  submitBtnBlock: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 36,
    paddingVertical: 14,
    minWidth: 140,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitBtnTextLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  warningInfoLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 10,
  },
  reportFormLink: {
    textDecorationLine: 'underline',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContentCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.75,
    paddingBottom: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalCloseBtnText: {
    fontSize: 16,
    color: '#9CA3AF',
    padding: 4,
  },
  modalItemRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  modalItemText: {
    fontSize: 15,
    color: '#1F2937',
  },
});
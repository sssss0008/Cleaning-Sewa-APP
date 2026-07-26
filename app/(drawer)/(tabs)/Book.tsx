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
  Pressable,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header2 from '@/components/Header2';

const { width, height } = Dimensions.get('window');

// 1. All 32 Services from screenshots
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
  'Monthly Cleaning'
];

// 2. All 32 Property Types from screenshots
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
  'Other'
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Standalone Custom Selector Modal States
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTitle, setPickerTitle] = useState('');
  const [pickerItems, setPickerItems] = useState([]);
  const [pickerTarget, setPickerTarget] = useState('');

  const openPicker = (title, items, targetStateSetterName) => {
    setPickerTitle(title);
    setPickerItems(items);
    setPickerTarget(targetStateSetterName);
    setPickerVisible(true);
  };

  const handleSelectValue = (value) => {
    switch (pickerTarget) {
      case 'city': setCity(value); break;
      case 'budget': setBudget(value); break;
      case 'service': setService(value); break;
      case 'propertyType': setPropertyType(value); break;
      case 'timing': setTiming(value); break;
      case 'leadSource': setLeadSource(value); break;
      default: break;
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
  };

  const handleClearForm = () => {
    Alert.alert(
      'Clear Form',
      'Are you sure you want to clear all fields?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Clear', style: 'destructive', onPress: clearForm },
      ]
    );
  };

  const handleSubmit = () => {
    if (!fullName || !phone || !city || !budget || !service || !timing || !leadSource) {
      Alert.alert('Required Fields Missing', 'Please complete all required fields marked with *');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('Success', 'Your booking request has been submitted successfully.');
      clearForm();
    }, 1500);
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
          <Text style={styles.brandText}>CleaningSewa</Text>
          <Text style={styles.brandSubText}>Service Booking Form</Text>
          <View style={styles.divider} />

          {/* Full Name */}
          <Text style={styles.fieldLabel}>Full Name<Text style={styles.asterisk}> *</Text></Text>
          <TextInput
            style={styles.inputField}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter full name"
            placeholderTextColor="#9CA3AF"
          />

          {/* Email */}
          <Text style={styles.fieldLabel}>eMail</Text>
          <TextInput
            style={styles.inputField}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="example@mail.com"
            placeholderTextColor="#9CA3AF"
          />

          {/* Phone */}
          <Text style={styles.fieldLabel}>Phone<Text style={styles.asterisk}> *</Text></Text>
          <TextInput
            style={styles.inputField}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            placeholderTextColor="#9CA3AF"
          />

          {/* City */}
          <Text style={styles.fieldLabel}>City<Text style={styles.asterisk}> *</Text></Text>
          <TouchableOpacity style={styles.dropdownTrigger} onPress={() => openPicker('Find a city', cities, 'city')}>
            <Text style={city ? styles.selectedText : styles.placeholderText}>{city || 'Select city'}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

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
          <Text style={styles.fieldLabel}>Budget in NPR<Text style={styles.asterisk}> *</Text></Text>
          <TouchableOpacity style={styles.dropdownTrigger} onPress={() => openPicker('Find an option', budgetOptions, 'budget')}>
            <Text style={budget ? styles.selectedText : styles.placeholderText}>{budget || 'Select estimated budget'}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Select Services */}
          <Text style={styles.fieldLabel}>Select Services<Text style={styles.asterisk}> *</Text></Text>
          <View style={styles.serviceFieldContainer}>
            <TouchableOpacity style={styles.serviceAddBtn} onPress={() => openPicker('Find an option', cleaningServices, 'service')}>
              <Text style={styles.serviceAddText}>+</Text>
            </TouchableOpacity>
            {service ? <Text style={styles.activeServiceTag}>{service}</Text> : <Text style={[styles.placeholderText, {marginLeft: 8}]}>Choose service</Text>}
          </View>

          {/* Property Type */}
          <Text style={styles.fieldLabel}>Property Type</Text>
          <TouchableOpacity style={styles.dropdownTrigger} onPress={() => openPicker('Find an option', propertyTypes, 'propertyType')}>
            <Text style={propertyType ? styles.selectedText : styles.placeholderText}>{propertyType || 'Select building/property context'}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Drag & Drop Photos Mock Area */}
          <Text style={styles.fieldLabel}>Add Photos of your Property</Text>
          <TouchableOpacity style={styles.uploadAreaContainer} onPress={() => Alert.alert('Upload', 'Image storage picker launched')}>
            <Text style={styles.uploadIcon}>☉</Text>
            <Text style={styles.uploadText}>Drop files here or click to browse</Text>
          </TouchableOpacity>

          {/* Timing Selector */}
          <Text style={styles.fieldLabel}>When do you need service?<Text style={styles.asterisk}> *</Text></Text>
          <TouchableOpacity style={styles.dropdownTrigger} onPress={() => openPicker('Select timeline', timingOptions, 'timing')}>
            <Text style={timing ? styles.selectedText : styles.placeholderText}>{timing || 'Select dynamic schedule priority'}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Lead Attribution */}
          <Text style={styles.fieldLabel}>How did you know about us?<Text style={styles.asterisk}> *</Text></Text>
          <TouchableOpacity style={styles.dropdownTrigger} onPress={() => openPicker('Select option', leadSources, 'leadSource')}>
            <Text style={leadSource ? styles.selectedText : styles.placeholderText}>{leadSource || 'Choose an option'}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

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

          {/* Footer Action Bar */}
          <View style={styles.actionFooterRow}>
            <TouchableOpacity style={styles.clearFormBtn} onPress={handleClearForm}>
              <Text style={styles.clearFormIconSymbol}>↶</Text>
              <Text style={styles.clearFormTextLabel}>Clear form</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtnBlock} onPress={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.submitBtnTextLabel}>Book</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.warningInfoLabel}>
            Do not submit passwords through this form. <Text style={styles.reportFormLink}>Report malicious form</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>

      {/* Embedded Standalone Searchable Option Picker Overlap Modal */}
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
    paddingVertical: 24,
    elevation: 2,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  brandSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 18,
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
    height: 40,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFF',
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    height: 40,
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
    width: 26,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceAddText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeServiceTag: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
    borderWidth: 1,
    color: '#166534',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
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
    backgroundColor: '#16A34A', // Swapped out standard slate colors for a direct solid emerald brand token representation
    borderRadius: 4,
    paddingHorizontal: 28,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnTextLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  warningInfoLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 10,
  },
  reportFormLink: {
    textDecorationLine: 'underline',
  },
  
  // Custom Layer Modal Styles
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
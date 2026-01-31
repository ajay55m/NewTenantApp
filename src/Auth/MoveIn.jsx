import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// No icon library needed

import MoveInStep1 from './MoveInSteps/MoveInStep1';
import MoveInStep2 from './MoveInSteps/MoveInStep2';
import MoveInStep3 from './MoveInSteps/MoveInStep3';
import MoveInStep4 from './MoveInSteps/MoveInStep4';

const MoveInForm = ({ onClose, onSuccess, session }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    customerType: 'Owner',
    ownerStayingInApartment: false,
    apartmentRentedOut: false,
    apartmentWillBeRentedOut: false,
    title: 'Mr.',
    customerName: '',
    mobileNumber: '',
    email: '',
    country: '',
    city: '',
    zipCode: '',
    moveInDate: '',
    gender: '',
    alternativeNumber: '',
    alternativeEmail: '',
    state: '',
    nationality: '',
    dob: '',
    area: '',
    building: '',
    unit: '',
    emiratesId: '',
    emiratesIdExpiryDate: '',
    passportNo: '',
    passportExpiryDate: '',
    ejarlContractNo: '',
    ejarlStartDate: '',
    ejarlExpiryDate: '',
    documents: {},
  });

  /* ✅ PREFILL FROM LOGIN SESSION */
  useEffect(() => {
    if (!session) return;

    setFormData(prev => ({
      ...prev,
      customerName: session?.FirstName || '',
      email: session?.EMail || '',
      mobileNumber: session?.MobileNumber || '',
      building: session?.buildingName || '',
      unit: session?.unit ? String(session.unit) : '',
      area: session?.Area ? String(session.Area) : '',
    }));
  }, [session]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSwitch = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleNext = () => {
    if (currentPage < 4) {
      setCurrentPage(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else {
      onClose?.();
    }
  };

  /* ✅ MODIFIED: MOCK SUBMIT (NO BACKEND) */
  const handleSubmit = () => {
    console.log('Move-in submitting (Mock):', formData);

    // Simulate server response by merging current session with new data
    // and setting status to Pending
    const mockUpdatedSession = {
      ...(session || {}),

      // Update relevant fields for display
      FirstName: formData.customerName,
      EMail: formData.email,
      MobileNumber: formData.mobileNumber,

      // Set statuses to trigger "Approval Pending" screen
      SubmissionStatus: 'Pending',
      status: 0,
      ClientTypeid: formData.customerType === 'Owner' ? 1 : 2,
    };

    Alert.alert(
      'Application Submitted',
      'Your move-in application has been submitted successfully.',
      [{ text: 'OK', onPress: () => onSuccess ? onSuccess(mockUpdatedSession) : onClose?.() }]
    );
  };

  const steps = [1, 2, 3, 4];

  const renderProgressSteps = () => (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <View style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                step < currentPage && styles.stepCompleted,
                step === currentPage && styles.stepActive,
              ]}
            >
              {step < currentPage ? (
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>✓</Text>
              ) : (
                <Text
                  style={[
                    styles.stepNumberText,
                    step === currentPage && styles.stepNumberTextActive,
                  ]}
                >
                  {step}
                </Text>
              )}
            </View>
          </View>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepConnector,
                step < currentPage && styles.stepConnectorActive,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return <MoveInStep1 formData={formData} handleInputChange={handleInputChange} toggleSwitch={toggleSwitch} />;
      case 2:
        return <MoveInStep2 formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <MoveInStep3 formData={formData} handleInputChange={handleInputChange} />;
      case 4:
        return <MoveInStep4 formData={formData} handleInputChange={handleInputChange} />;
      default:
        return null;
    }
  };

  const progress = (currentPage / 4) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070808ff" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <View style={styles.dummyLogo}>
            <Image
              source={require('../../assets/images/sglobal-icon.jpg')}
              style={{ width: 40, height: 40 }}
            />
          </View>
        </View>

        <Text style={styles.headerTitle}>Move-In Application</Text>

        {/* <TouchableOpacity style={styles.headerCloseButton} onPress={onClose}>
          <View style={styles.closeCircle}>
            <Text style={styles.closeText}>×</Text>
          </View>
        </TouchableOpacity> */}
      </View>

      {/* CARD CONTAINER */}
      <View style={styles.cardContainer}>
        {renderProgressSteps()}

        {session?.SubmissionStatus === 'Rejected' && session?.Reason && (
          <View style={styles.rejectionBox}>
            <Text style={styles.rejectionTitle}>Application Rejected</Text>
            <Text style={styles.rejectionText}>{session.Reason}</Text>
          </View>
        )}

        <View style={styles.content}>
          {renderCurrentPage()}
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerNextButton}
          onPress={handleNext}
        >
          <Text style={styles.footerNextText}>
            {currentPage === 4 ? 'Submit Application' : 'Proceed'}
          </Text>
        </TouchableOpacity>

        {currentPage > 1 && (
          <TouchableOpacity
            style={styles.footerSecondaryButton}
            onPress={handleBack}
          >
            <Text style={styles.footerSecondaryText}>
              Previous Step
            </Text>
          </TouchableOpacity>
        )}
      </View>

    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0c0dff', // Blue background for the container
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#050a0dff',
  },
  headerIconContainer: {
    width: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dummyLogo: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',

  },
  logoPart: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    top: 5,
    left: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  headerCloseButton: {
    padding: 5,
  },
  closeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
    marginTop: -2,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: 'hidden',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: '#F8FAFC',
  },
  stepWrapper: {
    alignItems: 'center',
    zIndex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  stepActive: {
    borderColor: '#0b0f0fff',
    borderWidth: 4,
  },
  stepCompleted: {
    backgroundColor: '#050505ff',
    borderColor: '#171817ff',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  stepNumberTextActive: {
    color: '#0b0f0fff',
  },
  stepConnector: {
    width: 30,
    height: 1,
    backgroundColor: '#CBD5E1',
    marginHorizontal: -5,
  },
  stepConnectorActive: {
    backgroundColor: '#0b0f0fff',
  },
  rejectionBox: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerNextButton: {
    backgroundColor: '#0c0d0dff',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  footerNextText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  footerSecondaryButton: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  footerSecondaryText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
});



export default MoveInForm;

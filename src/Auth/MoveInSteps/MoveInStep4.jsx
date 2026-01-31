import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import UploadSection from '../../components/UploadSection';
// InfoBox removed

const MoveInStep4 = ({ formData, handleInputChange }) => {
    const handleFile = (key, file) => {
        handleInputChange('documents', {
            ...(formData.documents || {}),
            [key]: file
        });
    };

    return (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.contentHeader}>
                <Text style={styles.stepTitle}>Upload Documents</Text>
                <Text style={styles.stepDescription}>
                    Almost there! Please upload the necessary documents to complete your application.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Documents</Text>
                <Text style={styles.cardSubtitle}>
                    All files should be clear and legible.
                </Text>

                <UploadSection
                    number="1"
                    title="Emirates ID"
                    subtitle="Front and back sides"
                    formats="JPG, PNG, PDF"
                    maxSize="5MB"
                    onFileSelected={(file) => handleFile('emiratesId', file)}
                    selectedFileName={formData.documents?.emiratesId?.name}
                />

                <UploadSection
                    number="2"
                    title="Passport"
                    subtitle="Photo page"
                    formats="JPG, PNG, PDF"
                    maxSize="5MB"
                    onFileSelected={(file) => handleFile('passport', file)}
                    selectedFileName={formData.documents?.passport?.name}
                />

                <UploadSection
                    number="3"
                    title="Ejari Contract"
                    subtitle="Official tenancy contract"
                    formats="PDF"
                    maxSize="10MB"
                    onFileSelected={(file) => handleFile('ejariContract', file)}
                    selectedFileName={formData.documents?.ejariContract?.name}
                />

                <UploadSection
                    number="4"
                    title="Utility Bill"
                    subtitle="Recent utility bill"
                    formats="JPG, PNG, PDF"
                    maxSize="5MB"
                    onFileSelected={(file) => handleFile('utilityBill', file)}
                    selectedFileName={formData.documents?.utilityBill?.name}
                />

                <UploadSection
                    number="5"
                    title="Passport Photo"
                    subtitle="Recent passport size photo"
                    formats="JPG, PNG"
                    maxSize="2MB"
                    onFileSelected={(file) => handleFile('passportPhoto', file)}
                    selectedFileName={formData.documents?.passportPhoto?.name}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    contentHeader: {
        alignItems: 'center',
        marginVertical: 20,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 8,
    },
    stepDescription: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 22,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 20,
    },
});


export default MoveInStep4;

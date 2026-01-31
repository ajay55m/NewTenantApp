import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import InputField from '../../components/InputField';
import DatePickerField from '../../components/DatePickerField';

const MoveInStep3 = ({ formData, handleInputChange }) => (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentHeader}>
            <Text style={styles.stepTitle}>KYC Details</Text>
            <Text style={styles.stepDescription}>
                Provide your identification details for verification.
            </Text>
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Emirates ID Details</Text>

            <InputField
                label="Emirates ID Number"
                value={formData.emiratesId}
                onChangeText={(text) => handleInputChange('emiratesId', text)}
                placeholder="784-XXXX-XXXXXXX-X"
                keyboardType="numeric"
            />

            <DatePickerField
                label="Emirates ID Expiry Date"
                value={formData.emiratesIdExpiryDate}
                onConfirm={(date) => handleInputChange('emiratesIdExpiryDate', date)}
                placeholder="DD/MM/YYYY"
            />
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Passport Information</Text>

            <InputField
                label="Passport Number"
                value={formData.passportNo}
                onChangeText={(text) => handleInputChange('passportNo', text)}
                placeholder="Enter passport number"
            />

            <DatePickerField
                label="Passport Expiry Date"
                value={formData.passportExpiryDate}
                onConfirm={(date) => handleInputChange('passportExpiryDate', date)}
                placeholder="DD/MM/YYYY"
            />
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Ejari Contract Details</Text>

            <InputField
                label="Ejari Contract Number"
                value={formData.ejarlContractNo}
                onChangeText={(text) => handleInputChange('ejarlContractNo', text)}
                placeholder="Enter contract number"
            />

            <DatePickerField
                label="Contract Start Date"
                value={formData.ejarlStartDate}
                onConfirm={(date) => handleInputChange('ejarlStartDate', date)}
                placeholder="DD/MM/YYYY"
            />

            <DatePickerField
                label="Contract Expiry Date"
                value={formData.ejarlExpiryDate}
                onConfirm={(date) => handleInputChange('ejarlExpiryDate', date)}
                placeholder="DD/MM/YYYY"
            />
        </View>
    </ScrollView>
);

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
        marginBottom: 15,
    },
});


export default MoveInStep3;

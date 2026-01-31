import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import InputField from '../../components/InputField';
import InfoBox from '../../components/InfoBox';

const MoveInStep2 = ({ formData, handleInputChange }) => (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentHeader}>
            <Text style={styles.stepTitle}>Property Details</Text>
            <Text style={styles.stepDescription}>
                Confirm the location and unit details of your new property.
            </Text>
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Property Location</Text>

            <View style={styles.highlightBox}>
                <Text style={styles.highlightLabel}>Area</Text>
                <Text style={styles.highlightValue}>{formData.area || 'DUBAI PRODUCTION CITY'}</Text>
            </View>

            <InputField
                label="Building"
                value={formData.building}
                onChangeText={(text) => handleInputChange('building', text)}
                placeholder="Enter building name/number"
            />

            <InputField
                label="Unit Number"
                value={formData.unit}
                onChangeText={(text) => handleInputChange('unit', text)}
                placeholder="Enter unit number"
                keyboardType="numeric"
            />
        </View>

        <InfoBox type="info">
            Please ensure the property details match your official documents
        </InfoBox>
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
    highlightBox: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    highlightLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94A3B8',
        marginBottom: 6,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    highlightValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
});


export default MoveInStep2;

import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import InputField from '../../components/InputField';
import RadioButton from '../../components/RadioButton';
import SwitchOption from '../../components/SwitchOption';
import DatePickerField from '../../components/DatePickerField';

const MoveInStep1 = ({ formData, handleInputChange, toggleSwitch }) => (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentHeader}>
            <Text style={styles.stepTitle}>Applicant Details</Text>
            <Text style={styles.stepDescription}>
                Please provide your personal information to begin the application.
            </Text>
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Customer Type</Text>
            <RadioButton
                selected={formData.customerType === 'Owner'}
                onPress={() => handleInputChange('customerType', 'Owner')}
                label="Owner"
                sublabel="I own this property"
            />

            {formData.customerType === 'Owner' && (
                <View style={styles.subOptions}>
                    <SwitchOption
                        label="I am staying in this apartment"
                        value={formData.ownerStayingInApartment}
                        onToggle={() => toggleSwitch('ownerStayingInApartment')}
                    />
                    <SwitchOption
                        label="This apartment is rented out"
                        value={formData.apartmentRentedOut}
                        onToggle={() => toggleSwitch('apartmentRentedOut')}
                    />
                    <SwitchOption
                        label="This apartment will be rented out"
                        value={formData.apartmentWillBeRentedOut}
                        onToggle={() => toggleSwitch('apartmentWillBeRentedOut')}
                    />
                </View>
            )}

            <RadioButton
                selected={formData.customerType === 'Tenant'}
                onPress={() => handleInputChange('customerType', 'Tenant')}
                label="Tenant"
                sublabel="I am renting this property"
            />
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Information</Text>

            <View style={styles.rowFields}>
                <View style={styles.fieldSmall}>
                    <Text style={styles.inputLabel}>Title</Text>
                    <TextInput
                        style={[styles.input, styles.inputDisabled]}
                        value={formData.title}
                        editable={false}
                    />
                </View>
                <View style={styles.fieldLarge}>
                    <InputField
                        label="Full Name"
                        value={formData.customerName}
                        onChangeText={(text) => handleInputChange('customerName', text)}
                        placeholder="Enter your full name"
                    />
                </View>
            </View>

            <InputField
                label="Mobile Number"
                value={formData.mobileNumber}
                onChangeText={(text) => handleInputChange('mobileNumber', text)}
                placeholder="+971 50 123 4567"
                keyboardType="phone-pad"
            />

            <InputField
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="your.email@example.com"
                keyboardType="email-address"
            />

            <DatePickerField
                label="Move-in Date"
                value={formData.moveInDate}
                onConfirm={(date) => handleInputChange('moveInDate', date)}
                placeholder="DD/MM/YYYY"
            />

            <Text style={styles.inputLabel}>
                Gender
            </Text>
            <View style={styles.genderRow}>
                <RadioButton
                    selected={formData.gender === 'Male'}
                    onPress={() => handleInputChange('gender', 'Male')}
                    label="Male"
                />
                <RadioButton
                    selected={formData.gender === 'Female'}
                    onPress={() => handleInputChange('gender', 'Female')}
                    label="Female"
                />
                <RadioButton
                    selected={formData.gender === 'Other'}
                    onPress={() => handleInputChange('gender', 'Other')}
                    label="Other"
                />
            </View>
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Additional Contact (Optional)</Text>

            <InputField
                label="Alternative Number"
                value={formData.alternativeNumber}
                onChangeText={(text) => handleInputChange('alternativeNumber', text)}
                placeholder="+971 50 123 4567"
                keyboardType="phone-pad"
            />

            <InputField
                label="Alternative Email"
                value={formData.alternativeEmail}
                onChangeText={(text) => handleInputChange('alternativeEmail', text)}
                placeholder="alternative@example.com"
                keyboardType="email-address"
            />
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Address Details</Text>

            <InputField
                label="Country"
                value={formData.country}
                onChangeText={(text) => handleInputChange('country', text)}
                placeholder="Select country"
            />

            <InputField
                label="State"
                value={formData.state}
                onChangeText={(text) => handleInputChange('state', text)}
                placeholder="Select state"
            />

            <View style={styles.rowFields}>
                <View style={styles.fieldHalf}>
                    <InputField
                        label="City"
                        value={formData.city}
                        onChangeText={(text) => handleInputChange('city', text)}
                        placeholder="Enter city"
                    />
                </View>
                <View style={styles.fieldHalf}>
                    <InputField
                        label="Zip Code"
                        value={formData.zipCode}
                        onChangeText={(text) => handleInputChange('zipCode', text)}
                        placeholder="12345"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <InputField
                label="Nationality"
                value={formData.nationality}
                onChangeText={(text) => handleInputChange('nationality', text)}
                placeholder="Enter nationality"
            />
            <DatePickerField
                label="Date of Birth"
                value={formData.dob}
                onConfirm={(date) => handleInputChange('dob', date)}
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
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 15,
    },
    subOptions: {
        marginLeft: 32,
        marginTop: 8,
        marginBottom: 16,
        paddingLeft: 16,
        borderLeftWidth: 2,
        borderLeftColor: '#E2E8F0',
    },
    rowFields: {
        flexDirection: 'row',
        gap: 12,
    },
    fieldSmall: {
        flex: 0.3,
    },
    fieldLarge: {
        flex: 0.7,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1E293B',
    },
    inputDisabled: {
        backgroundColor: '#F1F5F9',
        color: '#64748B',
    },
    required: {
        color: '#EF4444',
    },
    genderRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    fieldHalf: {
        flex: 1,
    },
});


export default MoveInStep1;

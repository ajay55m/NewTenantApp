import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerField = ({ label, value, onConfirm, placeholder, required }) => {
    const [show, setShow] = useState(false);

    // Parse the date string (DD/MM/YYYY) to Date object
    const parseDate = (dateString) => {
        if (!dateString) return new Date();
        try {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                const d = new Date(year, month, day);
                if (!isNaN(d.getTime())) return d;
            }
        } catch (e) {
            console.error('Error parsing date:', e);
        }
        return new Date();
    };

    const [tempDate, setTempDate] = useState(parseDate(value));

    const onChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShow(false);
            if (event.type === 'set' && selectedDate) {
                confirmDate(selectedDate);
            }
        } else {
            // iOS: Just update the temp date while spinning
            if (selectedDate) {
                setTempDate(selectedDate);
            }
        }
    };

    const confirmDate = (dateToConfirm) => {
        const d = dateToConfirm || tempDate;
        const formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
        onConfirm(formattedDate);
    };

    const handleOpen = () => {
        setTempDate(parseDate(value));
        setShow(true);
    };

    const renderPicker = () => (
        <DateTimePicker
            testID="dateTimePicker"
            value={tempDate}
            mode="date"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
            textColor="#000000" // Ensure visibility on iOS
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label} {required && <Text style={styles.required}>*</Text>}
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={handleOpen}
            >
                <Text style={[styles.text, !value && styles.placeholder]}>
                    {value || placeholder}
                </Text>
            </TouchableOpacity>

            {show && (
                Platform.OS === 'ios' ? (
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={show}
                        onRequestClose={() => setShow(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <TouchableOpacity
                                        onPress={() => setShow(false)}
                                        style={styles.headerButton}
                                    >
                                        <Text style={styles.cancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            confirmDate();
                                            setShow(false);
                                        }}
                                        style={styles.headerButton}
                                    >
                                        <Text style={styles.doneText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                                {renderPicker()}
                            </View>
                        </View>
                    </Modal>
                ) : (
                    renderPicker()
                )
            )}
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    text: {
        fontSize: 16,
        color: '#111827',
    },
    placeholder: {
        color: '#9CA3AF',
    },
    required: {
        color: '#EF4444',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerButton: {
        padding: 5,
    },
    cancelText: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
    },
    doneText: {
        fontSize: 16,
        color: '#2563EB',
        fontWeight: '600',
    },
});

export default DatePickerField;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UploadSection = ({ number, title, subtitle, formats, maxSize, onFileSelected, selectedFileName }) => (
    <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.numberCircle}>
                <Text style={styles.number}>{number}</Text>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={() => onFileSelected({ name: 'Dummy File' })}>
            <Text style={styles.uploadButtonText}>
                {selectedFileName || 'Choose File'}
            </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
            Formats: {formats} | Max size: {maxSize}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    numberCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    number: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    uploadButton: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    uploadButtonText: {
        color: '#374151',
        fontSize: 14,
    },
    hint: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 8,
    },
});

export default UploadSection;

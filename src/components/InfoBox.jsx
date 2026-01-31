import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoBox = ({ type, children }) => {
    const isWarning = type === 'warning';
    return (
        <View style={[styles.container, isWarning ? styles.warning : styles.info]}>
            <Text style={[styles.text, isWarning ? styles.warningText : styles.infoText]}>
                {children}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
    },
    info: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    warning: {
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
    },
    infoText: {
        color: '#1E40AF',
    },
    warningText: {
        color: '#92400E',
    },
});

export default InfoBox;

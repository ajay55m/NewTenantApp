import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const SwitchOption = ({ label, value, onToggle }) => (
    <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            thumbColor="#fff"
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    label: {
        fontSize: 14,
        color: '#4B5563',
        flex: 1,
        marginRight: 10,
    },
});

export default SwitchOption;

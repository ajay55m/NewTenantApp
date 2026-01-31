import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const RadioButton = ({ selected, onPress, label, sublabel }) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={[styles.circle, selected && styles.selectedCircle]}>
            {selected && <View style={styles.innerCircle} />}
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.label}>{label}</Text>
            {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,   // ✅ spacing between options
    },
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    selectedCircle: {
        borderColor: '#10B981',
    },
    innerCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#10B981',
    },
    textContainer: {
        flexShrink: 1,
    },
    label: {
        fontSize: 16,
        color: '#111827',
    },
    sublabel: {
        fontSize: 14,
        color: '#6B7280',
    },
});

export default RadioButton;

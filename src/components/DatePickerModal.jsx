import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Pressable,
} from "react-native";

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function DatePickerModal({
    visible,
    onClose,
    onSelect,
    selectedDate,
    minDate,
    maxDate,
}) {
    const currentDate = selectedDate || new Date();
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
    const [selectedDay, setSelectedDay] = useState(currentDate.getDate());

    const minYear = minDate ? minDate.getFullYear() : 2020;
    const maxYear = maxDate ? maxDate.getFullYear() : new Date().getFullYear();
    const years = Array.from(
        { length: maxYear - minYear + 1 },
        (_, i) => minYear + i
    ).reverse();

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const isDateDisabled = (year, month, day) => {
        const date = new Date(year, month, day);
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleConfirm = () => {
        const date = new Date(selectedYear, selectedMonth, selectedDay);
        onSelect(date);
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />

                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Select Date</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.pickerContainer}>
                        {/* Year Picker */}
                        <View style={styles.column}>
                            <Text style={styles.columnLabel}>Year</Text>
                            <ScrollView
                                style={styles.scrollView}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                {years.map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        style={[
                                            styles.pickerItem,
                                            selectedYear === year && styles.pickerItemActive,
                                        ]}
                                        onPress={() => setSelectedYear(year)}
                                    >
                                        <Text
                                            style={[
                                                styles.pickerText,
                                                selectedYear === year && styles.pickerTextActive,
                                            ]}
                                        >
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Month Picker */}
                        <View style={styles.column}>
                            <Text style={styles.columnLabel}>Month</Text>
                            <ScrollView
                                style={styles.scrollView}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                {MONTHS.map((month, index) => (
                                    <TouchableOpacity
                                        key={month}
                                        style={[
                                            styles.pickerItem,
                                            selectedMonth === index && styles.pickerItemActive,
                                        ]}
                                        onPress={() => setSelectedMonth(index)}
                                    >
                                        <Text
                                            style={[
                                                styles.pickerText,
                                                selectedMonth === index && styles.pickerTextActive,
                                            ]}
                                        >
                                            {month}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Day Picker */}
                        <View style={styles.column}>
                            <Text style={styles.columnLabel}>Day</Text>
                            <ScrollView
                                style={styles.scrollView}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                {days.map((day) => {
                                    const disabled = isDateDisabled(selectedYear, selectedMonth, day);
                                    return (
                                        <TouchableOpacity
                                            key={day}
                                            style={[
                                                styles.pickerItem,
                                                selectedDay === day && styles.pickerItemActive,
                                                disabled && styles.pickerItemDisabled,
                                            ]}
                                            onPress={() => !disabled && setSelectedDay(day)}
                                            disabled={disabled}
                                        >
                                            <Text
                                                style={[
                                                    styles.pickerText,
                                                    selectedDay === day && styles.pickerTextActive,
                                                    disabled && styles.pickerTextDisabled,
                                                ]}
                                            >
                                                {day}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.confirmText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 20,
        width: "85%",
        maxHeight: "70%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    closeText: {
        fontSize: 16,
        color: "#6B7280",
    },
    pickerContainer: {
        flexDirection: "row",
        padding: 16,
        gap: 8,
    },
    column: {
        flex: 1,
    },
    columnLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 8,
    },
    scrollView: {
        maxHeight: 200,
    },
    scrollContent: {
        paddingVertical: 4,
    },
    pickerItem: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginVertical: 2,
        alignItems: "center",
    },
    pickerItemActive: {
        backgroundColor: "#2563EB",
    },
    pickerItemDisabled: {
        opacity: 0.3,
    },
    pickerText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
    },
    pickerTextActive: {
        color: "#fff",
    },
    pickerTextDisabled: {
        color: "#D1D5DB",
    },
    confirmButton: {
        margin: 16,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#2563EB",
        alignItems: "center",
    },
    confirmText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#fff",
    },
});
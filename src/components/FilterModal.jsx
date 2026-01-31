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
import DatePickerModal from "./DatePickerModal";
import { Calendar, CalendarRange, X } from "lucide-react-native";

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export default function FilterModal({
    visible,
    onClose,
    onApply,
    initialFilters,
}) {
    const [filterType, setFilterType] = useState(initialFilters?.type || "quick");
    const [selectedMonth, setSelectedMonth] = useState(
        initialFilters?.month || null
    );
    const [selectedYear, setSelectedYear] = useState(
        initialFilters?.year || CURRENT_YEAR
    );
    const [fromDate, setFromDate] = useState(initialFilters?.fromDate || null);
    const [toDate, setToDate] = useState(initialFilters?.toDate || null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    const handleApply = () => {
        const filters = {
            type: filterType,
            month: filterType === "month" ? selectedMonth : null,
            year: filterType === "month" ? selectedYear : null,
            fromDate: filterType === "range" ? fromDate : null,
            toDate: filterType === "range" ? toDate : null,
        };
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        setFilterType("quick");
        setSelectedMonth(null);
        setSelectedYear(CURRENT_YEAR);
        setFromDate(null);
        setToDate(null);
    };

    const formatDate = (date) => {
        if (!date) return "Select Date";
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Filter Bills</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        {/* Filter Type Selector */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Filter By</Text>
                            <View style={styles.filterTypeRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.filterTypeButton,
                                        filterType === "month" && styles.filterTypeButtonActive,
                                    ]}
                                    onPress={() => setFilterType("month")}
                                >
                                    <Calendar
                                        size={18}
                                        color={filterType === "month" ? "#2563EB" : "#6B7280"}
                                        style={{ marginBottom: 4 }}
                                    />
                                    <Text
                                        style={[
                                            styles.filterTypeText,
                                            filterType === "month" && styles.filterTypeTextActive,
                                        ]}
                                    >
                                        Month & Year
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.filterTypeButton,
                                        filterType === "range" && styles.filterTypeButtonActive,
                                    ]}
                                    onPress={() => setFilterType("range")}
                                >
                                    <CalendarRange
                                        size={18}
                                        color={filterType === "range" ? "#2563EB" : "#6B7280"}
                                        style={{ marginBottom: 4 }}
                                    />
                                    <Text
                                        style={[
                                            styles.filterTypeText,
                                            filterType === "range" && styles.filterTypeTextActive,
                                        ]}
                                    >
                                        Date Range
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Month & Year Selection */}
                        {filterType === "month" && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Select Month</Text>
                                <View style={styles.monthGrid}>
                                    {MONTHS.map((month, index) => (
                                        <TouchableOpacity
                                            key={month}
                                            style={[
                                                styles.monthButton,
                                                selectedMonth === index && styles.monthButtonActive,
                                            ]}
                                            onPress={() => setSelectedMonth(index)}
                                        >
                                            <Text
                                                style={[
                                                    styles.monthText,
                                                    selectedMonth === index && styles.monthTextActive,
                                                ]}
                                            >
                                                {month.slice(0, 3)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                                    Select Year
                                </Text>
                                <View style={styles.yearRow}>
                                    {YEARS.map((year) => (
                                        <TouchableOpacity
                                            key={year}
                                            style={[
                                                styles.yearButton,
                                                selectedYear === year && styles.yearButtonActive,
                                            ]}
                                            onPress={() => setSelectedYear(year)}
                                        >
                                            <Text
                                                style={[
                                                    styles.yearText,
                                                    selectedYear === year && styles.yearTextActive,
                                                ]}
                                            >
                                                {year}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Date Range Selection */}
                        {filterType === "range" && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>From Date</Text>
                                <TouchableOpacity
                                    style={styles.datePickerButton}
                                    onPress={() => setShowFromPicker(true)}
                                >
                                    <Text style={styles.datePickerText}>
                                        {formatDate(fromDate)}
                                    </Text>
                                    <Calendar size={18} color="#6B7280" />
                                </TouchableOpacity>

                                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                    To Date
                                </Text>
                                <TouchableOpacity
                                    style={styles.datePickerButton}
                                    onPress={() => setShowToPicker(true)}
                                >
                                    <Text style={styles.datePickerText}>{formatDate(toDate)}</Text>
                                    <Calendar size={18} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Date Pickers */}
            <DatePickerModal
                visible={showFromPicker}
                onClose={() => setShowFromPicker(false)}
                onSelect={(date) => {
                    setFromDate(date);
                    setShowFromPicker(false);
                }}
                selectedDate={fromDate}
                maxDate={toDate || new Date()}
            />

            <DatePickerModal
                visible={showToPicker}
                onClose={() => setShowToPicker(false)}
                onSelect={(date) => {
                    setToDate(date);
                    setShowToPicker(false);
                }}
                selectedDate={toDate}
                minDate={fromDate}
                maxDate={new Date()}
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "85%",
        paddingBottom: 20,
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
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 12,
    },
    filterTypeRow: {
        flexDirection: "row",
        gap: 12,
    },
    filterTypeButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#E5E7EB",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    filterTypeButtonActive: {
        borderColor: "#2563EB",
        backgroundColor: "#EFF6FF",
    },
    filterTypeText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
    },
    filterTypeTextActive: {
        color: "#2563EB",
    },
    monthGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    monthButton: {
        width: "22%",
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    monthButtonActive: {
        borderColor: "#2563EB",
        backgroundColor: "#2563EB",
    },
    monthText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#374151",
    },
    monthTextActive: {
        color: "#fff",
    },
    yearRow: {
        flexDirection: "row",
        gap: 8,
    },
    yearButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    yearButtonActive: {
        borderColor: "#2563EB",
        backgroundColor: "#2563EB",
    },
    yearText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
    },
    yearTextActive: {
        color: "#fff",
    },
    datePickerButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#F9FAFB",
    },
    datePickerText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
    },
    footer: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    resetButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    resetText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#6B7280",
    },
    applyButton: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#2563EB",
        alignItems: "center",
    },
    applyText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#fff",
    },
});
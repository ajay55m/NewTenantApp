import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Image,
  Animated,
} from "react-native";
import { Platform } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  LayoutGrid,
  Calendar,
  CalendarDays,
  CalendarRange,
  Settings2,
  Target,
  X,
  Search,
  AlertCircle
} from "lucide-react-native";
import GreetingCard from "../components/GreetingCard";
import FilterModal from "../components/FilterModal";
import { useSession } from "../context/SessionContext";
import { getBillHistory } from "../apiConfig";

/* ---------------- QUICK FILTERS ---------------- */
const QUICK_FILTERS = [
  { key: "all", label: "All", Icon: LayoutGrid },
  { key: "thisMonth", label: "This Month", Icon: Calendar },
  { key: "lastMonth", label: "Last Month", Icon: CalendarDays },
  { key: "last6", label: "6 Months", Icon: CalendarRange },
];

/* ---------------- HELPERS ---------------- */
function isSameMonth(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

function monthsDiff(from, to) {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())
  );
}

const formatApiDate = (d) => d.toISOString().split("T")[0];

/* ─── SKELETON BOX COMPONENT ────────────────────────────── */
const SkeletonBox = ({ style }) => {
  const opacity = new Animated.Value(0.3);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[styles.skeleton, style, { opacity }]} />;
};

/* ─── UNIFIED SKELETON LOADER COMPONENT ────────────────────────────── */
const BillHistoryScreenSkeleton = () => {
  return (
    <>
      {/* Greeting Card Skeleton */}
      <View style={styles.greetingCard}>
        <View style={styles.greetingCardContent}>
          <View style={styles.greetingTextSection}>
            <SkeletonBox style={styles.skeletonGreetingTitle} />
            <SkeletonBox style={styles.skeletonGreetingSubtitle} />
          </View>
          <SkeletonBox style={styles.skeletonGreetingImage} />
        </View>
      </View>

      {/* Header Row Skeleton */}
      <View style={styles.headerRow}>
        <SkeletonBox style={styles.skeletonHeaderTitle} />
        <SkeletonBox style={styles.skeletonAdvancedFilterButton} />
      </View>

      {/* Quick Filters Skeleton */}
      <View style={styles.filtersRow}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBox key={i} style={styles.skeletonFilterPill} />
        ))}
      </View>

      {/* Results Count Skeleton */}
      <SkeletonBox style={styles.skeletonResultsCount} />

      {/* Bill Cards Skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.billCard}>
          <View style={styles.compactRow}>
            <SkeletonBox style={styles.skeletonIcon} />
            <View style={styles.skeletonContent}>
              <SkeletonBox style={styles.skeletonTitle} />
              <SkeletonBox style={styles.skeletonSubtitle} />
            </View>
            <SkeletonBox style={styles.skeletonAmount} />
          </View>
        </View>
      ))}
    </>
  );
};

/* ---------------- SCREEN ---------------- */
export default function BillHistoryScreen() {
  const { session, isReady } = useSession();
  const loginKey = session?.loginKey;
  const clientId = session?.clientId;

  const [activeFilter, setActiveFilter] = useState("all");
  const [advancedFilters, setAdvancedFilters] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH BILL HISTORY ---------------- */
  const fetchBillHistory = useCallback(async () => {
    if (!loginKey || !clientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const today = new Date();
      const fromDate = new Date();
      fromDate.setMonth(today.getMonth() - 12);

      const { ok, data } = await getBillHistory({
        key: loginKey,
        fromDate: formatApiDate(fromDate),
        toDate: formatApiDate(today),
        byOffice: false,
        officeIds: "",
        clientIds: clientId,
      });

      if (!ok || !Array.isArray(data)) {
        throw new Error("Failed to load bill history");
      }

      const normalized = data.map((bill) => ({
        id: String(bill.BillId || bill.Gen_No || Math.random()),
        billDate: bill.BillDate,
        type: bill.TransTypeName || "Bill",
        paymentMethod: "Online Payment",
        amount: Number(bill.BillAmount || 0).toFixed(2),
        currency: bill.CurrencyType || "AED",
        billNo: bill.BillNo,
      }));

      setBillData(normalized);
    } catch (err) {
      console.log("Bill history error:", err.message);
      setError("Unable to load bill history");
      setBillData([]);
    } finally {
      setLoading(false);
    }
  }, [loginKey, clientId]);

  useEffect(() => {
    if (isReady) fetchBillHistory();
  }, [isReady, fetchBillHistory]);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredBills = useMemo(() => {
    const today = new Date();

    return billData.filter((bill) => {
      const billDate = new Date(bill.billDate);
      if (isNaN(billDate.getTime())) return false;

      // Advanced filters (Month/Year or Date Range)
      if (advancedFilters) {
        if (advancedFilters.type === "month") {
          const { month, year } = advancedFilters;
          if (month !== null && year) {
            return (
              billDate.getMonth() === month &&
              billDate.getFullYear() === year
            );
          }
        } else if (advancedFilters.type === "range") {
          const { fromDate, toDate } = advancedFilters;
          if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);
            return billDate >= from && billDate <= to;
          }
        }
      }

      // Quick filters
      switch (activeFilter) {
        case "thisMonth":
          return isSameMonth(billDate, today);
        case "lastMonth": {
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          return isSameMonth(billDate, lastMonth);
        }
        case "last6": {
          const diff = monthsDiff(billDate, today);
          return diff >= 0 && diff < 6;
        }
        case "all":
        default:
          return true;
      }
    });
  }, [billData, activeFilter, advancedFilters]);

  const handleQuickFilter = (filterKey) => {
    setActiveFilter(filterKey);
    setAdvancedFilters(null);
  };

  const handleAdvancedFilter = (filters) => {
    setAdvancedFilters(filters);
    setActiveFilter("custom");
  };

  const clearAllFilters = () => {
    setActiveFilter("all");
    setAdvancedFilters(null);
  };

  const getActiveFilterLabel = () => {
    if (advancedFilters) {
      if (advancedFilters.type === "month") {
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        return `${monthNames[advancedFilters.month]} ${advancedFilters.year}`;
      } else if (advancedFilters.type === "range") {
        const from = new Date(advancedFilters.fromDate);
        const to = new Date(advancedFilters.toDate);
        return `${from.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} - ${to.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
      }
    }
    return null;
  };

  const hasBills = billData.length > 0;
  const hasFilteredBills = filteredBills.length > 0;
  const hasActiveFilters = activeFilter !== "all" || advancedFilters !== null;

  /* ---------------- RENDER CONTENT ---------------- */
  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <AlertCircle size={20} color="#DC2626" style={{ marginBottom: 8 }} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBillHistory}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!hasBills) {
      return (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/images/bill.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>No Bill History</Text>
          <Text style={styles.emptyText}>
            You don't have any bills yet.
          </Text>
        </View>
      );
    }

    if (!hasFilteredBills) {
      return (
        <View style={styles.emptyContainer}>
          <Search size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptyText}>
            No bills match your selected filters.
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearAllFilters}
            >
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return filteredBills.map((bill) => {
      const billDate = new Date(bill.billDate);
      const formattedDate = billDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      return (
        <Pressable
          key={bill.id}
          style={({ pressed }) => [
            styles.billCard,
            pressed && styles.billCardPressed,
          ]}
        >
          <View style={styles.compactRow}>
            {/* Left: Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>
                {bill.type?.charAt(0) || "B"}
              </Text>
            </View>

            {/* Middle: Bill Info */}
            <View style={styles.billInfo}>
              <View style={styles.billTitleRow}>
                <Text style={styles.billNumber} numberOfLines={1}>
                  #{bill.billNo}
                </Text>
                <Text style={styles.billType} numberOfLines={1}>
                  • {bill.type}
                </Text>
              </View>

              <View style={styles.billMetaRow}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{formattedDate}</Text>
                </View>
                <View style={styles.paymentBadge}>
                  <View style={styles.paymentDot} />
                  <Text style={styles.paymentText}>{bill.paymentMethod}</Text>
                </View>
              </View>
            </View>

            {/* Right: Amount */}
            <View style={styles.amountContainer}>
              <Text style={styles.amountValue}>{bill.amount}</Text>
              <Text style={styles.currencyText}>{bill.currency}</Text>
            </View>
          </View>

          {/* Status Indicator */}
          <View style={styles.statusBar} />
        </Pressable>
      );
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <BillHistoryScreenSkeleton />
        ) : (
          <>
            {/* Greeting Card */}
            <View style={{ marginBottom: 8 }}>
              <GreetingCard />
            </View>

            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Bill History</Text>
              <TouchableOpacity
                style={styles.advancedFilterButton}
                onPress={() => setShowFilterModal(true)}
              >
                <Settings2 size={16} color="#374151" />
                <Text style={styles.advancedFilterText}>Filters</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersScrollView}
              contentContainerStyle={styles.filtersRow}
            >
              {QUICK_FILTERS.map((f) => {
                const isActive = activeFilter === f.key && !advancedFilters;
                return (
                  <TouchableOpacity
                    key={f.key}
                    style={[
                      styles.filterPill,
                      isActive && styles.filterPillActive,
                    ]}
                    onPress={() => handleQuickFilter(f.key)}
                  >
                    <View style={styles.filterPillContent}>
                      <f.Icon
                        size={14}
                        color={isActive ? "#fff" : "#374151"}
                      />
                      <Text
                        style={[
                          styles.filterText,
                          isActive && styles.filterTextActive,
                        ]}
                      >
                        {f.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Active Advanced Filter Badge */}
            {advancedFilters && (
              <View style={styles.activeFilterBadge}>
                <View style={styles.activeFilterContent}>
                  <Target size={14} color="#1E40AF" />
                  <Text style={styles.activeFilterText}>
                    {getActiveFilterLabel()}
                  </Text>
                </View>
                <TouchableOpacity onPress={clearAllFilters}>
                  <X size={16} color="#1E40AF" />
                </TouchableOpacity>
              </View>
            )}

            {/* Results Count */}
            {hasBills && (
              <Text style={styles.resultsCount}>
                {hasFilteredBills
                  ? `${filteredBills.length} ${filteredBills.length === 1 ? "bill" : "bills"} found`
                  : "No bills found"}
              </Text>
            )}

            {renderContent()}
          </>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleAdvancedFilter}
        initialFilters={advancedFilters}
      />
    </>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 0 : 8,
    paddingBottom: 24,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#030a70",
    backgroundColor: "#F5F5DC",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 6,
  },

  advancedFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },

  advancedFilterText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },

  filtersScrollView: {
    marginBottom: 12,
  },

  filtersRow: {
    paddingRight: 16,
    flexDirection: "row",
    marginBottom: 12,
  },

  filterPill: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },

  filterPillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  filterPillContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  filterText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151"
  },

  filterTextActive: {
    color: "#fff"
  },

  activeFilterBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  activeFilterContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },

  activeFilterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E40AF",
    flex: 1,
  },

  resultsCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
  },

  /* ---------------- COMPACT BILL CARD ---------------- */
  billCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: "#2563EB",
    position: "relative",
    overflow: "hidden",
  },

  billCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },

  statusBar: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    backgroundColor: "#10B981",
    borderBottomLeftRadius: 40,
    opacity: 0.08,
  },

  compactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  /* Icon */
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
  },

  /* Bill Info */
  billInfo: {
    flex: 1,
    gap: 6,
  },

  billTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  billNumber: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.3,
  },

  billType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    flex: 1,
  },

  billMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dateBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  dateText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#374151",
  },

  paymentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },

  paymentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#10B981",
  },

  paymentText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#166534",
  },

  /* Amount */
  amountContainer: {
    alignItems: "flex-end",
  },

  amountValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: 0.3,
  },

  currencyText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
    marginTop: 2,
  },

  /* Error & Empty States */
  errorContainer: {
    backgroundColor: "#FEF2F2",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  errorText: {
    color: "#DC2626",
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "600",
  },

  retryButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryText: {
    color: "#fff",
    fontWeight: "600"
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40
  },

  emptyImage: {
    width: 60,
    height: 60,
    marginBottom: 16
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8
  },

  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },

  clearFiltersButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },

  clearFiltersText: {
    color: "#fff",
    fontWeight: "600"
  },

  /* ---------- SKELETON ---------- */
  skeleton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 6
  },

  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },

  skeletonContent: {
    flex: 1,
    gap: 6,
  },

  skeletonTitle: {
    height: 12,
    width: "60%",
  },

  skeletonSubtitle: {
    height: 10,
    width: "80%",
  },

  skeletonAmount: {
    width: 60,
    height: 16,
    borderRadius: 4,
  },

  /* ---------- GREETING CARD SKELETON ---------- */
  greetingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  greetingCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  greetingTextSection: {
    flex: 1,
    gap: 8,
  },

  skeletonGreetingTitle: {
    height: 18,
    width: "70%",
    borderRadius: 4,
  },

  skeletonGreetingSubtitle: {
    height: 14,
    width: "50%",
    borderRadius: 4,
  },

  skeletonGreetingImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  /* ---------- HEADER ROW SKELETON ---------- */
  skeletonHeaderTitle: {
    height: 32,
    width: 120,
    borderRadius: 12,
  },

  skeletonAdvancedFilterButton: {
    height: 32,
    width: 80,
    borderRadius: 12,
  },

  /* ---------- FILTER PILLS SKELETON ---------- */
  skeletonFilterPill: {
    height: 32,
    width: 90,
    borderRadius: 999,
    marginRight: 8,
  },

  /* ---------- RESULTS COUNT SKELETON ---------- */
  skeletonResultsCount: {
    height: 12,
    width: 100,
    marginBottom: 12,
  },
});
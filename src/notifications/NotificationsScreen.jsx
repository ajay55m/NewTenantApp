import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl,
  Alert,
  Animated,
} from "react-native";
import GreetingCard from "../components/GreetingCard";
import { useSession } from "../context/SessionContext";
import { getServiceNotifications } from "../apiConfig";

/* =========================================================
   NOTIFICATIONS SCREEN
========================================================= */
export default function NotificationsScreen({ navigation }) {
  const { session } = useSession();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);

  /* ================= ICON MAP ================= */
  const ICON_MAP = {
    electricity: require("../../assets/NotificationIcon/electrical-engineering.png"),
    gas: require("../../assets/NotificationIcon/gas.png"),
    water: require("../../assets/NotificationIcon/water.png"),
    payment: require("../../assets/NotificationIcon/credit-card.png"),
    maintenance: require("../../assets/NotificationIcon/expired.png"),
    default: require("../../assets/NotificationIcon/expired.png"),
  };

  /* ================= FETCH NOTIFICATIONS ================= */
  const fetchNotifications = async (isRefresh = false) => {
    try {
      if (!session?.loginKey) return;

      if (!isRefresh) setLoading(true);

      const { ok, data } = await getServiceNotifications(
        session.loginKey,
        1
      );

      if (!ok || !Array.isArray(data)) {
        throw new Error("Invalid API response");
      }

      const transformed = data.map((item) => ({
        id: String(item.EntryNo),
        title: item.IssueDescription,
        subtitle: `Service No: ${item.ServiceNo}`,
        date: new Date(item.EntryDate),
        formattedDate: formatDate(item.EntryDate),
        status: item.Status,
        unread: item.Status === "Pending" || item.Status === "Open",
        iconKey: getIconKey(item.IssueDescription),
      }));

      setNotifications(transformed);
    } catch (error) {
      Alert.alert("Error", "Unable to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (session?.loginKey) fetchNotifications();
  }, [session]);

  /* ================= HELPERS ================= */
  const getIconKey = (text = "") => {
    const t = text.toLowerCase();
    if (t.includes("electric") || t.includes("power")) return "electricity";
    if (t.includes("gas")) return "gas";
    if (t.includes("water")) return "water";
    if (t.includes("bill") || t.includes("payment")) return "payment";
    return "maintenance";
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getIcon = (key) => ICON_MAP[key] || ICON_MAP.default;

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(true);
  };

  /* ================= GROUP BY DATE ================= */
  const getSections = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);

    const sections = {
      Today: [],
      "This Week": [],
      Older: [],
    };

    notifications.forEach((item) => {
      if (item.date >= today) sections.Today.push(item);
      else if (item.date >= weekStart) sections["This Week"].push(item);
      else sections.Older.push(item);
    });

    return Object.keys(sections)
      .map((title) => ({
        title,
        data: sections[title],
      }))
      .filter((s) => s.data.length > 0);
  };

  /* ================= CARD ================= */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === item.id ? { ...n, unread: false } : n
          )
        )
      }
    >
      <View style={styles.iconWrap}>
        <Image source={getIcon(item.iconKey)} style={styles.icon} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.date}>{item.formattedDate}</Text>
      </View>

      <View
  style={[
    styles.statusPill,
    item.status === "Pending" && styles.statusPending,
    item.status === "Open" && styles.statusOpen,
  ]}
>
  <Text
    style={[
      styles.statusText,
      item.status === "Pending" && styles.statusTextPending,
      item.status === "Open" && styles.statusTextOpen,
    ]}
  >
    {item.status}
  </Text>
</View>

    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionTitle}>{section.title}</Text>
  );

  /* ================= SKELETON ================= */
  const SkeletonCard = () => {
    const shimmer = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmer, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(shimmer, {
            toValue: 0.3,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    return (
      <Animated.View style={[styles.card, { opacity: shimmer }]}>
        <View style={styles.skeletonIcon} />
        <View style={{ flex: 1 }}>
          <View style={styles.skeletonLineLarge} />
          <View style={styles.skeletonLineSmall} />
        </View>
      </Animated.View>
    );
  };

  /* ================= MAIN ================= */
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : (
        <SectionList
          sections={getSections()}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0EA5E9"]}
            />
          }
          ListHeaderComponent={
            <>
              <View style={styles.greeting}>
                <GreetingCard />
              </View>

              {/* ALL NOTIFICATIONS HEADER */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>All Notifications</Text>
                {!loading && (
                  <Text style={styles.headerCount}>
                    {notifications.filter((n) => n.unread).length} unread
                  </Text>
                )}
              </View>
            </>
          }
        />
      )}
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  greeting: { margin: 16 },

  header: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#F5F5DC",
    flexDirection: "row",
    justifyContent: "space-between",
    
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#030A70" },
  headerCount: { fontSize: 13, fontWeight: "700", color: "#6B7280" },

  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "800",
    color: "#374151",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    elevation: 4,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: { width: 22, height: 22, resizeMode: "contain" },

  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  date: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },

  arrow: {
    fontSize: 24,
    color: "#CBD5E1",
    marginLeft: 8,
  },

  /* ================= SKELETON ================= */
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginRight: 12,
  },
  skeletonLineLarge: {
    height: 14,
    width: "70%",
    borderRadius: 7,
    backgroundColor: "#E5E7EB",
    marginBottom: 6,
  },
  skeletonLineSmall: {
    height: 12,
    width: "50%",
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },

  statusPill: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 14,
  backgroundColor: "#E5E7EB", // default
},

statusText: {
  fontSize: 12,
  fontWeight: "700",
  color: "#374151",
},

/* ---- STATUS COLORS ---- */
statusPending: {
  backgroundColor: "#FEE2E2", // light red
},
statusTextPending: {
  color: "#DC2626", // red
},

statusOpen: {
  backgroundColor: "#DBEAFE", // light blue
},
statusTextOpen: {
  color: "#2563EB", // blue
},

});

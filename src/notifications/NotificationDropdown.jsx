// NotificationDropdown.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  FlatList,
  StyleSheet,
  Platform,
  StatusBar,
  PanResponder,
  Dimensions,
} from "react-native";

/* ================= API ================= */
const API_URL =
  "https://ibmapi.maccloud.in/api/ServiceNotification?Key=PZBY9GATJTN3ZJC5";
const CLIENT = 1;

/* ================= HELPERS ================= */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const mapNotifications = (data = []) =>
  data.map((item) => ({
    id: String(item.EntryNo),
    serviceNo: item.ServiceNo,
    title: `Service No: ${item.ServiceNo}`,
    description: item.IssueDescription,
    date: formatDate(item.EntryDate),
    unread: item.Status !== "Closed",
    icon: require("../../assets/NotificationIcon/google-contacts.png"),
  }));

/* ================= COMPONENT ================= */
export default function NotificationDropdown({
  open,
  onClose,
  onNavigate,
  topOffset = 72,
}) {
  const anim = useRef(new Animated.Value(open ? 1 : 0)).current;
  const [notifications, setNotifications] = useState([]);
  const [swipingId, setSwipingId] = useState(null);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}&Client=${CLIENT}`);
        const json = await res.json();
        setNotifications(mapNotifications(json || []));
      } catch (e) {
        console.log("Notification API error", e);
      }
    })();
  }, [open]);

  /* ---------- Animation ---------- */
  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [open]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-14, 0],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  /* ---------- Derived ---------- */
  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const visible = notifications.slice(0, 3);

  /* ---------- Swipe Card ---------- */
  const NotificationCard = ({ item }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const cardOpacity = useRef(new Animated.Value(1)).current;
    const screenWidth = Dimensions.get("window").width;

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_, g) => {
          translateX.setValue(g.dx);
          cardOpacity.setValue(1 - Math.abs(g.dx) / screenWidth);
        },
        onPanResponderRelease: (_, g) => {
          if (Math.abs(g.dx) > 70) {
            Animated.timing(translateX, {
              toValue: Math.sign(g.dx) * screenWidth,
              duration: 220,
              useNativeDriver: true,
            }).start(() =>
              setNotifications((p) => p.filter((n) => n.id !== item.id))
            );
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
            Animated.spring(cardOpacity, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }
          setSwipingId(null);
        },
        onPanResponderGrant: () => setSwipingId(item.id),
      })
    ).current;

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            transform: [{ translateX }],
            opacity: cardOpacity,
          },
        ]}
      >
        {/* UNREAD ACCENT */}
        {item.unread && <View style={styles.unreadAccent} />}

        {/* ICON */}
        <View style={styles.iconCircle}>
          <Image source={item.icon} style={styles.icon} />
        </View>

        {/* CONTENT */}
        <TouchableOpacity
          style={styles.textWrap}
          disabled={!!swipingId}
          onPress={() => {
            setNotifications((p) =>
              p.map((n) =>
                n.id === item.id ? { ...n, unread: false } : n
              )
            );
            onNavigate?.("Notifications");
            onClose?.();
          }}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.description}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  /* ================= RENDER ================= */
  return (
    <>
      {open && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={[
              styles.overlay,
              {
                top:
                  topOffset +
                  (Platform.OS === "android"
                    ? StatusBar.currentHeight || 24
                    : 20),
              },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        pointerEvents={open ? "auto" : "none"}
        style={[
          styles.dropdown,
          {
            top: topOffset,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={() =>
                  setNotifications((p) =>
                    p.map((n) => ({ ...n, unread: false }))
                  )
                }
              >
                <Text style={styles.markRead}>Mark all as read</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* LIST */}
          <FlatList
            data={visible}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <NotificationCard item={item} />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* GHOST BUTTON */}
          <TouchableOpacity
            style={styles.viewAll}
            onPress={() => {
              onNavigate?.("Notifications");
              onClose?.();
            }}
          >
            <Text style={styles.viewAllText}>View all notifications</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  dropdown: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 2000,
  },

  /* CONTAINER */
  container: {
    margin: 14,
    borderRadius: 26,
    backgroundColor: "#F0F7FF", // sky-blue gradient base
    maxHeight: 360,
    overflow: "hidden",
    elevation: 14,
  },

  header: {
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  markRead: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },

  list: {
    paddingHorizontal: 14,
    paddingBottom: 10,
  },

  /* CARD */
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 14,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },

  unreadAccent: {
    position: "absolute",
    left: 0,
    top: 14,
    bottom: 14,
    width: 4,
    borderRadius: 4,
    backgroundColor: "#2563EB",
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },

  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 6,
  },

  /* GHOST BUTTON */
  viewAll: {
    margin: 16,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCEBFF",
    backgroundColor: "transparent",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },
});

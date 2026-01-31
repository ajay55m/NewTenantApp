import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
  ImageBackground,
} from "react-native";

import Footer from "../../components/Footer";

/* ---------------- DATA ---------------- */
const OWNER_BUILDINGS = [
  {
    BuildingId: 1,
    name: "Luxury a Stange",
    location: "DUBAI MARINA",
    image: require("../../../assets/images/property1.png"),
  },
  {
    BuildingId: 2,
    name: "Dom Lage",
    location: "ALPY",
    image: require("../../../assets/images/property2.png"),
  },
  {
    BuildingId: 3,
    name: "Mail Sprds",
    location: "DUBAI MARINA",
    image: require("../../../assets/images/property3.png"),
  },
  {
    BuildingId: 4,
    name: "JJT",
    location: "E9 BECEF",
    image: require("../../../assets/images/property4.png"),
  },
];

const TENANT_BUILDINGS = [
  {
    BuildingId: 101,
    name: "Palm Heights",
    location: "PALM JUMEIRAH",
    image: require("../../../assets/images/property1.png"),
  },

];

/* ---------------- CARD ---------------- */
const PropertyCard = ({ item, index, onPress }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        delay: index * 120,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 450,
        delay: index * 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(item)}>
        <ImageBackground
          source={item.image}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <View style={styles.glassLabel}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>{item.location}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

/* ---------------- SECTION ---------------- */
const BuildingSection = ({ title, subtitle, data, onSelect }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionSub}>{subtitle}</Text>

    <FlatList
      data={data}
      numColumns={2}
      columnWrapperStyle={styles.row}
      keyExtractor={(item) => String(item.BuildingId)}
      renderItem={({ item, index }) => (
        <PropertyCard item={item} index={index} onPress={onSelect} />
      )}
      scrollEnabled={false}
    />
  </View>
);

/* ---------------- SCREEN ---------------- */
export default function BuildingSelectScreen({ onSelect }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F0EA" />

      <FlatList
        data={[]}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <View style={styles.container}>
            <Text style={styles.title}>Property List</Text>
            <Text style={styles.subtitle}>
              Manage or access your properties
            </Text>

            {/* OWNER SECTION */}
            <BuildingSection
             title="Owned Properties"
             subtitle="Properties you manage"
             data={OWNER_BUILDINGS}
             onSelect={onSelect}
            />

            {/* TENANT SECTION */}
            <BuildingSection
             title="Rented Properties"
             subtitle="Properties you live in"
             data={TENANT_BUILDINGS}
             onSelect={onSelect}
             />
          </View>
        }
      />

      {/* 🔒 Disabled Footer */}
      <View pointerEvents="none" style={{ opacity: 0.7 }}>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F0EA",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  container: {
    paddingHorizontal: 22,
    paddingTop: 32,
  },

  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#1F2933",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 36,
  },

  section: {
    marginBottom: 44,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  sectionSub: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 18,
  },

  row: {
    justifyContent: "space-between",
  },

  cardWrapper: {
    width: "48%",
    marginBottom: 22,
  },

  card: {
    height: 200,
    borderRadius: 22,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: "#DDD",
  },

  cardImage: {
    borderRadius: 22,
  },

  glassLabel: {
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F2933",
    marginBottom: 2,
  },

  cardSub: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#1e1e20ff",
  },
});

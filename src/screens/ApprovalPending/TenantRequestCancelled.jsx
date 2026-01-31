import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../context/SessionContext";

const TenantRequestCancelled = ({ reason, onResubmit }) => {
  const { saveSession } = useSession();

  const handleLogout = () => {
    saveSession(null); // ✅ clears session → login screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Request Cancelled</Text>

          <Text style={styles.message}>
            Your approval request has been cancelled.
          </Text>

          {/* ✅ SHOW REASON IF AVAILABLE */}
          {reason ? (
            <View style={styles.reasonContainer}>
              <Text style={styles.reasonLabel}>Reason:</Text>
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ) : null}

          <Text style={styles.message}>
            Please update your details and submit a new request.
          </Text>

          {/* ✅ RE-SUBMIT (MOVE-IN) BUTTON */}
          <TouchableOpacity
            style={styles.resubmitButton}
            onPress={onResubmit}
          >
            <Text style={styles.resubmitText}>Update Details / Move-In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLogout}
          >
            <Text style={styles.secondaryText}>Move-In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TenantRequestCancelled;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#B91C1C",
    marginBottom: 14,
  },
  reasonContainer: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  reasonLabel: {
    fontSize: 12,
    color: "#B91C1C",
    fontWeight: "600",
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: "#7F1D1D",
    lineHeight: 20,
    fontWeight: "500",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: "#374151",
    lineHeight: 22,
    marginBottom: 10,
  },
  resubmitButton: {
    marginTop: 20,
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
  },
  resubmitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  secondaryText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

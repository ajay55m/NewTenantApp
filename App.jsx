// App.jsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import Header from "./src/components/Header";
import Footer from "./src/components/Footer";
import Dashboard from "./src/screens/Dashboard";
import Profile from "./src/screens/Profile";
import RequestMove from "./src/screens/RequestMove";
import MyContract from "./src/screens/MyContract";
import RenewContract from "./src/screens/RenewContract";
import Bill from "./src/screens/BillHistory";
import Payment from "./src/screens/Payment";
import PaymentHistory from "./src/screens/PaymentHistory";
import TicketScreen from "./src/screens/RaiseTicket";
import OwnerBuildingSelect from "./src/screens/owner/OwnerBuildingSelect";
import TenantApprovalPending from "./src/screens/ApprovalPending/TenantApprovalPending";
import TenantRequestCancelled from "./src/screens/ApprovalPending/TenantRequestCancelled";
import NotificationsScreen from "./src/notifications/NotificationsScreen";
import NotificationDropdown from "./src/notifications/NotificationDropdown";
import AuthScreen from "./src/Auth/AuthScreen";
import MoveInForm from "./src/Auth/MoveIn";
import CloudErrorConnection from "./src/screens/CloudErrorConnection";
import NoInternetConnectionWrapper from "./src/wrappers/NoInternetConnectionWrapper";
import { UserProvider } from "./src/context/UserContext";
import { SessionProvider, useSession } from "./src/context/SessionContext";

const AppContent = () => {
  const { session, saveSession, isReady } = useSession();
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const [notifOpen, setNotifOpen] = useState(false);
  const [isCloudDown, setIsCloudDown] = useState(false);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);

  /* ---------------- LOGIN REDIRECT LOGIC ---------------- */
  useEffect(() => {
    if (!session) {
      setSelectedPage("dashboard");
      return;
    }

    const clientType = Number(
      session.clientTypeId ??
      session.userTypeId ??
      session.ClientTypeid ??
      session.UserTypeId
    );

    // OWNER
    if (clientType === 1) {
      const status = Number(session.status);
      const submissionStatus = (
        session.SubmissionStatus ||
        session.submissionStatus ||
        ""
      ).toLowerCase();

      if (status === 1) {
        if (!session.selectedBuilding) {
          setSelectedPage("owner-building-select");
          return;
        }
        setSelectedPage("dashboard");
        return;
      } else {
        setSelectedPage(
          submissionStatus === "rejected"
            ? "approval-cancelled"
            : "approval-pending"
        );
        return;
      }
    }

    // ✅ TENANT (FINAL FIXED FLOW)
    if (clientType === 2) {
      const status = Number(session.status);
      const submissionStatus = session.SubmissionStatus || session.submissionStatus;
      const normalizedStatus = submissionStatus?.toLowerCase();

      // Approved tenant
      if (status === 1) {
        setSelectedPage("dashboard");
        return;
      }

      // Rejected tenant → Approval Cancelled
      if (status === 0 && normalizedStatus === "rejected") {
        setSelectedPage("approval-cancelled");
        return;
      }

      // Pending tenant → Approval Pending
      if (status === 0 && (!submissionStatus || normalizedStatus === "pending")) {
        setSelectedPage("approval-pending");
        return;
      }

      // Fallback
      setSelectedPage("approval-pending");
      return;
    }

    setSelectedPage("dashboard");
  }, [session]);


  /* ---------------- LOADER ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- SAFE RETURNS ---------------- */
  if (!isReady) return null;

  if (!session) {
    return <AuthScreen onLoginSuccess={saveSession} />;
  }

  /* ---------------- MOVE-IN FULL SCREEN ---------------- */
  if (selectedPage === "move-in") {
    return (
      <MoveInForm
        onClose={() => saveSession(null)}
        onSuccess={(serverData) => {
          if (serverData) {
            saveSession(serverData);
            // Navigation handled by useEffect in App.jsx based on new status
          } else {
            // Fallback if no data returned, though this shouldn't happen with correct API
            console.log("No data returned from submission");
          }
        }}
        session={session}
      />
    );
  }

  /* ---------------- OWNER BUILDING SELECT ---------------- */
  if (selectedPage === "owner-building-select") {
    return <OwnerBuildingSelect onSelect={(building) => {
      saveSession({ ...session, selectedBuilding: building });
      setSelectedPage("dashboard");
    }} />;
  }

  /* ---------------- HANDLERS ---------------- */
  const handleMenuSelect = (key) => {
    if (key === "logout") {
      saveSession(null);
      return;
    }
    setSelectedPage(key);
    setNotifOpen(false);
  };

  const handleHeaderLogout = () => saveSession(null);

  const handleNotificationNavigation = (screenName) => {
    setNotifOpen(false);
    setSelectedPage(screenName);
  };

  const handleRetry = () => setIsCloudDown(false);

  /* ---------------- HEADER / FOOTER CONTROL ---------------- */
  const hideHeaderFooterScreens = [
    "approval-pending",
    "approval-cancelled",
  ];

  const isHeaderFooterHidden = hideHeaderFooterScreens.includes(selectedPage);

  /* ---------------- CLOUD ERROR ---------------- */
  if (isCloudDown) {
    return (
      <CloudErrorConnection
        onPress={handleMenuSelect}
        onNavigate={handleMenuSelect}
        onToggleNotifications={() => setNotifOpen((v) => !v)}
        unreadCount={notifications.filter((n) => n.unread).length}
        onRetry={handleRetry}
        loading={loading}
      />
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <NoInternetConnectionWrapper>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

        <View style={styles.root}>
          {/* Main Content */}
          <View
            style={[
              styles.mainContent,
              { paddingTop: isHeaderFooterHidden ? 0 : 100 },
            ]}
          >
            {selectedPage === "dashboard" && (
              <Dashboard loading={loading} onPress={handleMenuSelect} />
            )}

            {selectedPage === "approval-pending" && (
              <TenantApprovalPending onBack={() => saveSession(null)} />
            )}

            {selectedPage === "approval-cancelled" && (
              <TenantRequestCancelled
                reason={session?.Reason || session?.reason || session?.SubmissionStatus || "Request rejected"}
                onResubmit={() => setSelectedPage("move-in")}
                onBack={() => saveSession(null)}
              />
            )}

            {selectedPage === "profile" && <Profile loading={loading} />}

            {selectedPage === "request-moveout" && (
              <RequestMove loading={loading} />
            )}

            {selectedPage === "Notifications" && (
              <NotificationsScreen
                loading={loading}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            )}

            {selectedPage === "my-contract" && <MyContract loading={loading} />}
            {selectedPage === "renew-contract" && (
              <RenewContract loading={loading} />
            )}
            {selectedPage === "bill-history" && <Bill loading={loading} />}
            {selectedPage === "payment-history" && (
              <PaymentHistory loading={loading} />
            )}
            {selectedPage === "raise-ticket" && (
              <TicketScreen loading={loading} />
            )}
            {selectedPage === "pay-now" && (
              <Payment onHome={() => setSelectedPage("dashboard")} />
            )}
          </View>

          {/* Footer */}
          {!isHeaderFooterHidden && (
            <Footer onPress={handleMenuSelect} selectedPage={selectedPage} />
          )}

          {/* Header */}
          {!isHeaderFooterHidden && (
            <View style={styles.headerWrapper}>
              <Header
                onPress={handleMenuSelect}
                onNavigate={handleMenuSelect}
                onToggleNotifications={() => setNotifOpen((v) => !v)}
                unreadCount={notifications.filter((n) => n.unread).length}
                tenantName={
                  session?.clientName || session?.FirstName || "Tenant"
                }
                tenantAvatar={session?.profileImage}
                onLogout={handleHeaderLogout}
              />
            </View>
          )}

          {/* Notifications */}
          <NotificationDropdown
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            onNavigate={handleNotificationNavigation}
            notifications={notifications}
            setNotifications={setNotifications}
            topOffset={
              (Platform.OS === "android"
                ? StatusBar.currentHeight || 24
                : 20) + 72
            }
          />
        </View>
      </SafeAreaView>
    </NoInternetConnectionWrapper>
  );
};

const App = () => (
  <SessionProvider>
    <UserProvider>
      <AppContent />
    </UserProvider>
  </SessionProvider>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  root: { flex: 1, backgroundColor: "#f5f5f5" },
  mainContent: { flex: 1 },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 100,
    backgroundColor: "transparent",
  },
});

export default App;

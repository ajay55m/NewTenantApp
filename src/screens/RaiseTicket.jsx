import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GreetingCard from "../components/GreetingCard";
import { useSession } from "../context/SessionContext";
import {
  getApprovedClient,
  getClientMeters,
  getClientServiceList,
} from "../apiConfig";
import CustomDropdown from "../components/CustomDropdown";
import {
  saveTicketDraft,
  loadTicketDraft,
  clearTicketDraft,
} from "../storage/appStorage";


// API CONFIGURATION

const SERVICE_TICKET_URL = "https://ibmapi.maccloud.in/api/ServiceTicketAdd";

const submitServiceTicket = async (params) => {
  const url = new URL(SERVICE_TICKET_URL);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      url.searchParams.append(k, String(v));
    }
  });

  const res = await fetch(url.toString(), { method: "GET" });
  const data = await res.json();

  return { ok: res.ok, data };
};

// HELPER COMPONENTS

const SkeletonBox = ({ style }) => <View style={[styles.skeletonBox, style]} />;

/* ─── UNIFIED SKELETON LOADER COMPONENT ────────────────────────────── */
const TicketScreenSkeleton = ({ type = "dashboard" }) => {
  if (type === "dashboard") {
    return (
      <>
        {/* Greeting Card Skeleton */}
        <View style={styles.greetingCardSkeleton}>
          <View style={styles.greetingCardLeft}>
            <SkeletonBox
              style={{
                width: "60%",
                height: 20,
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
            <SkeletonBox
              style={{
                width: "80%",
                height: 16,
                borderRadius: 6,
              }}
            />
          </View>
          <SkeletonBox
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />
        </View>

        {/* Header Skeleton */}
        <View style={styles.header}>
          <SkeletonBox
            style={{
              width: "50%",
              height: 24,
              borderRadius: 8,
            }}
          />
        </View>

        {/* Summary Cards Skeleton */}
        <View style={styles.cardsWrapper}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={[styles.card, styles.skeletonCard]}>
              <View style={styles.cardTopRow}>
                <SkeletonBox
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                />
                <View style={styles.cardTextWrapper}>
                  <SkeletonBox
                    style={{
                      width: "40%",
                      height: 18,
                      borderRadius: 6,
                      marginBottom: 6,
                    }}
                  />
                  <SkeletonBox
                    style={{
                      width: "70%",
                      height: 12,
                      borderRadius: 6,
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Add Button Skeleton */}
        <SkeletonBox
          style={{
            alignSelf: "center",
            width: 180,
            height: 34,
            borderRadius: 999,
            marginVertical: 12,
          }}
        />

        {/* Ticket List Skeleton */}
        <View style={[styles.detailCard, styles.skeletonCard]}>
          {Array.from({ length: 7 }).map((_, index) => (
            <View
              key={index}
              style={[styles.row, { borderBottomColor: "#E5E7EB" }]}
            >
              <SkeletonBox
                style={{
                  width: "30%",
                  height: 14,
                  borderRadius: 6,
                }}
              />
              <SkeletonBox
                style={{
                  width: "40%",
                  height: 14,
                  borderRadius: 6,
                }}
              />
            </View>
          ))}
        </View>
      </>
    );
  }

  if (type === "form") {
    return (
      <>
        {/* Greeting Card Skeleton */}
        <View style={styles.greetingCardSkeleton}>
          <View style={styles.greetingCardLeft}>
            <SkeletonBox
              style={{
                width: "60%",
                height: 20,
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
            <SkeletonBox
              style={{
                width: "80%",
                height: 16,
                borderRadius: 6,
              }}
            />
          </View>
          <SkeletonBox
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />
        </View>

        {/* Header Skeleton for Form */}
        <View style={styles.header}>
          <SkeletonBox
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              marginRight: 8,
            }}
          />
          <SkeletonBox
            style={{
              flex: 1,
              height: 20,
              borderRadius: 8,
            }}
          />
        </View>

        {/* Form Fields Skeleton */}
        <View
          style={[
            styles.detailCard,
            styles.skeletonCard,
            { paddingHorizontal: 12 },
          ]}
        >
          {Array.from({ length: 7 }).map((_, index) => (
            <View key={index} style={{ marginBottom: 14 }}>
              <SkeletonBox
                style={{
                  width: "30%",
                  height: 12,
                  borderRadius: 6,
                  marginBottom: 6,
                }}
              />
              <SkeletonBox
                style={{
                  width: "100%",
                  height: index === 6 ? 80 : 40,
                  borderRadius: 8,
                }}
              />
            </View>
          ))}

          {/* Action Buttons Skeleton */}
          <View style={styles.buttonRow}>
            <SkeletonBox
              style={{
                flex: 1,
                height: 36,
                borderRadius: 20,
                marginRight: 10,
              }}
            />
            <SkeletonBox
              style={{
                flex: 1,
                height: 36,
                borderRadius: 20,
              }}
            />
          </View>
        </View>
      </>
    );
  }

  return null;
};

/* ─── Modern card component ────────────────────────────── */
const SummaryCard = ({ title, value, color, borderColor, icon }) => (
  <View style={[styles.card, { backgroundColor: color, borderColor, borderWidth: 1 }]}>
    <View style={styles.cardTopRow}>
      <View style={styles.cardIconWrapper}>{icon}</View>
      <View style={styles.cardTextWrapper}>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </View>
  </View>
);

const FormField = ({ label, required, height = 44, readOnly = false, ...props }) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={styles.required}>*</Text>}
    </Text>
    <TextInput
      style={[styles.input, { height }, readOnly && styles.readOnlyInput]}
      editable={!readOnly}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  </View>
);

const Row = ({ label, value, customValue }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    {customValue ? customValue : <Text style={styles.rowValue}>{value}</Text>}
  </View>
);

// MAIN COMPONENT

const TicketScreen = ({ loading = false }) => {
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const { session } = useSession();
  const loginKey = session?.loginKey;
  const clientId = session?.clientId;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [formLoading, setFormLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const formTimerRef = useRef(null);

  // ───────── FORM STATE ─────────
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [building, setBuilding] = useState("");
  const [unitNo, setUnitNo] = useState("");
  const [issueType, setIssueType] = useState("");
  const [meters, setMeters] = useState([]);
  const [meterId, setMeterId] = useState("");
  const [meterName, setMeterName] = useState("");
  const [description, setDescription] = useState("");

  // ───────── FETCH TICKETS ─────────
  useEffect(() => {
    const fetchTickets = async () => {
      if (!clientId) return;

      try {
        setTicketsLoading(true);
        const { ok, data } = await getClientServiceList(clientId);

        if (ok && Array.isArray(data)) {
          setTickets(data);
        } else {
          setTickets([]);
        }
      } catch (err) {
        console.error("Failed to fetch service tickets:", err);
        setTickets([]);
      } finally {
        setTicketsLoading(false);
      }
    };

    fetchTickets();
  }, [clientId]);

  // ───────── LOAD SAVED DRAFT (ON APP OPEN) ─────────
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await loadTicketDraft();
        if (draft) {
          setIssueType(draft.issueType || "");
          setMeterId(draft.meterId || "");
          setMeterName(draft.meterName || "");
          setDescription(draft.description || "");
        }
      } catch (err) {
        console.log("Load ticket draft error:", err);
      }
    };

    loadDraft();
  }, []);

  // ───────── AUTO SAVE DRAFT (ON EVERY CHANGE) ─────────
  useEffect(() => {
    const draftData = {
      issueType,
      meterId,
      meterName,
      description,
    };

    saveTicketDraft(draftData);
  }, [issueType, meterId, meterName, description]);

  // ───────── CLEANUP TIMER ─────────
  useEffect(() => {
    return () => {
      if (formTimerRef.current) {
        clearTimeout(formTimerRef.current);
      }
    };
  }, []);

  // ───────── FETCH PROFILE DATA ─────────
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!clientId) return;

      try {
        const { ok, data } = await getApprovedClient(clientId);

        if (ok && data) {
          setProfileData(data);
          setName(data.FirstName || "");
          setPhone(data.MobileNumber || "");
          setBuilding(data.BuildingName || "");
          setUnitNo(data.UnitName || "");
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfileData();
  }, [clientId]);

  // ───────── FETCH METERS ─────────
  useEffect(() => {
    const fetchMeters = async () => {
      if (!loginKey) return;

      try {
        const { ok, data } = await getClientMeters(loginKey);
        if (ok && Array.isArray(data)) {
          setMeters(data);
        }
      } catch (error) {
        console.error("Failed to fetch meters:", error);
      }
    };

    fetchMeters();
  }, [loginKey]);

  // ───────── HANDLERS ─────────
  const handleAddTicketPress = () => {
    setActiveTab("add");
    setFormLoading(true);

    if (formTimerRef.current) clearTimeout(formTimerRef.current);
    formTimerRef.current = setTimeout(() => {
      setFormLoading(false);
    }, 700);
  };

  const handleBackToDashboard = () => {
    setActiveTab("dashboard");
  };

  // ───────── SUBMIT TICKET ─────────
  const handleSaveTicket = async () => {
    if (!loginKey) {
      Alert.alert("Error", "Session expired. Please login again.");
      return;
    }

    if (!issueType || !meterId) {
      Alert.alert("Validation", "Please select issue type and meter");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        Key: loginKey,
        CustName: name,
        PhoneNum: phone,
        MeterId: meterId,
        MeterName: meterName,
        IssueType: issueType,
        Description: description,
      };

      const { ok } = await submitServiceTicket(payload);

      if (!ok) {
        throw new Error("Ticket submission failed");
      }

      Alert.alert("Success", "Service ticket added successfully");

      // Reset editable fields
      setIssueType("");
      setMeterId("");
      setMeterName("");
      setDescription("");

      // Clear offline draft
      await clearTicketDraft();

      handleBackToDashboard();
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };


  // ───────── RENDER FUNCTIONS ─────────

  // ───────── Dashboard View ─────────
  const renderDashboard = () => {
    const totalTickets = tickets.length;
    const pendingTickets = tickets.filter(t => t.Status === "Pending").length;
    const completedTickets = tickets.filter(t => t.Status === "Completed").length;
    const processingTickets = tickets.filter(
      t => t.Status !== "Pending" && t.Status !== "Completed"
    ).length;

    return (
      <>
        <GreetingCard />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Raise Ticket</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.cardsWrapper}>
          <SummaryCard
            title="Total Tickets"
            value={String(totalTickets).padStart(2, "0")}
            color="#ebe6ff"
            borderColor="#8b5cf6"
            icon={
              <Image
                source={require("../../assets/images/ticket.png")}
                style={{ width: 22, height: 22, tintColor: "#8b5cf6" }}
              />
            }
          />

          <SummaryCard
            title="Processing"
            value={String(processingTickets).padStart(2, "0")}
            color="#ffeede"
            borderColor="#f97316"
            icon={
              <Image
                source={require("../../assets/images/time-management.png")}
                style={{ width: 22, height: 22, tintColor: "#f97316" }}
              />
            }
          />

          <SummaryCard
            title="Completed"
            value={String(completedTickets).padStart(2, "0")}
            color="#ffe7f2"
            borderColor="#ec4899"
            icon={
              <Image
                source={require("../../assets/images/check-mark.png")}
                style={{ width: 22, height: 22, tintColor: "#ec4899" }}
              />
            }
          />

          <SummaryCard
            title="Pending"
            value={String(pendingTickets).padStart(2, "0")}
            color="#e6ffef"
            borderColor="#22c55e"
            icon={
              <Image
                source={require("../../assets/images/wall-clock.png")}
                style={{ width: 22, height: 22, tintColor: "#22c55e" }}
              />
            }
          />
        </View>

        {/* Add Ticket Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddTicketPress}>
          <Text style={styles.addButtonText}>+ Add New Ticket</Text>
        </TouchableOpacity>

        {/* Ticket List */}
        {ticketsLoading ? (
          <SkeletonBox style={{ height: 140, borderRadius: 14 }} />
        ) : tickets.length === 0 ? (
          <View style={styles.detailCard}>
            <Text style={{ textAlign: "center", fontSize: 13, color: "#6b7280" }}>
              No service tickets found
            </Text>
          </View>
        ) : (
          tickets.map(ticket => (
            <View key={ticket.EntryNo} style={styles.detailCard}>
              <Row label="Service No." value={ticket.ServiceNo} />
              <Row label="Issue Type" value={ticket.IssueType} />
              <Row label="Issue Raised By" value={ticket.IssueRaisedBy} />
              <Row label="Date" value={ticket.EntryDate} />
              <Row label="Meter Name" value={ticket.MeterName} />
              <Row label="Issue Description" value={ticket.IssueDescription} />
              <Row
                label="Status"
                customValue={
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          ticket.Status === "Completed"
                            ? "#bbf7d0"
                            : ticket.Status === "Pending"
                              ? "#fde68a"
                              : "#e5e7eb",
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>{ticket.Status}</Text>
                  </View>
                }
              />
            </View>
          ))
        )}
      </>
    );
  };

  // ───────── Add Ticket View (real form) ─────────
  const renderAddTicket = () => (
    <>
      <GreetingCard />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToDashboard}>
          <Image
            source={require("../../assets/images/arrow.png")}
            style={{ width: 12, height: 12, tintColor: "#fff" }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Ticket</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <FormField label="Name" required value={name} readOnly />
        <FormField label="Phone Number" required value={phone} readOnly />
        <FormField label="Building Name" value={building} readOnly />
        <FormField label="Unit No." required value={unitNo} readOnly />

        {/* ISSUE TYPE - Using CustomDropdown */}
        <CustomDropdown
          label="Issue Type"
          required
          value={issueType}
          items={[
            { label: 'Select issue type', value: '' },
            { label: 'Hardware', value: 'Hardware' },
            { label: 'Software', value: 'Software' },
            { label: 'Power', value: 'Power' },
            { label: 'Others', value: 'Others' },
          ]}
          onValueChange={setIssueType}
          placeholder="Select issue type"
        />

        {/* METER DROPDOWN - Using CustomDropdown */}
        <CustomDropdown
          label="Meter Name"
          required
          value={meterId}
          items={[
            { label: 'Select meter', value: '' },
            ...meters.map(m => ({
              label: m.MeterName,
              value: m.MeterID
            }))
          ]}
          onValueChange={(value) => {
            setMeterId(value);
            const meter = meters.find((m) => m.MeterID === value);
            setMeterName(meter?.MeterName || "");
          }}
          placeholder="Select meter"
        />

        <FormField
          label="Description"
          multiline
          value={description}
          onChangeText={setDescription}
          height={90}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleBackToDashboard}
            disabled={submitting}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
            onPress={handleSaveTicket}
            disabled={submitting}
          >
            <Text style={styles.saveText}>
              {submitting ? "Submitting..." : "Save Ticket"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );

  // ───────── MAIN RENDER ─────────
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <TicketScreenSkeleton type="dashboard" />
        ) : activeTab === "dashboard" ? (
          renderDashboard()
        ) : formLoading ? (
          <TicketScreenSkeleton type="form" />
        ) : (
          renderAddTicket()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  // ─── Layout Styles ───
  safe: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
  container: {
    padding: 12,
    paddingBottom: 24,
  },
  formContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 24,
  },

  // ─── Greeting Card Skeleton Styles ───
  greetingCardSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  greetingCardLeft: {
    flex: 1,
  },

  // ─── Header Styles ───
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5DC",
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 14,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "900",
    color: "rgb(3,10,112)",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginLeft: 8,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1d4ed8",
    alignItems: "center",
    justifyContent: "center",
  },

  // ─── Summary Cards Styles ───
  cardsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    width: "48%",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    marginRight: 10,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 12,
    color: "#4b5563",
  },

  // ─── Button Styles ───
  addButton: {
    backgroundColor: "#1d4ed8",
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
    marginVertical: 10,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#1d4ed8",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: "#93c5fd",
  },
  saveText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  cancelText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "600",
  },

  // ─── Detail Card & Row Styles ───
  detailCard: {
    marginTop: 8,
    backgroundColor: "rgb(248,249,250)",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 0.4,
    borderBottomColor: "#e5e7eb",
  },
  rowLabel: {
    fontSize: 12,
    color: "#0f1010ff",
  },
  rowValue: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "500",
  },
  statusPill: {
    backgroundColor: "#facc15",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-end",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4b5563",
  },
  deleteBox: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#dc2626",
    borderColor: "#b91c1c",
    alignItems: "center",
    justifyContent: "center",
  },

  // ─── Form Styles ───
  fieldWrapper: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 3,
    color: "#111827",
    fontWeight: "500",
  },
  required: {
    color: "#ef4444",
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 10,
    fontSize: 13,
    color: "#111827",
  },
  readOnlyInput: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
  },

  // ─── Skeleton Styles ───
  skeletonBox: {
    backgroundColor: "#E5E7EB",
  },
  skeletonCard: {
    backgroundColor: "#f3f4f6",
    borderColor: "#E5E7EB",
  },

  // ─── Utility Styles ───
  errorText: {
    fontSize: 12,
    color: "#b91c1c",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
  },
});

export default TicketScreen;
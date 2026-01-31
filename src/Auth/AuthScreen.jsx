import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert
} from "react-native";
import { useSession } from "../context/SessionContext";
import LoginScreen from "./LoginScreen";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";
import MoveInForm from "./MoveIn";
import { COLORS } from "./constants";
import {
  registerUser,
  getAreas,
  getBuildingsByArea,
  getUnitsByBuilding,
  sendEmailOtp,
  verifyEmailOtp,
} from "../apiConfig";

const { width, height } = Dimensions.get("window");

const userTypeOptions = [
  { label: "Owner", value: 1 },
  { label: "Tenant", value: 2 },
];

import { COUNTRY_CODES } from "./countryCodes";

const AuthScreen = ({ navigation, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [captchaKey, setCaptchaKey] = useState(Date.now());
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaInput2, setCaptchaInput2] = useState("");
  const [showMoveIn, setShowMoveIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [areaOptions, setAreaOptions] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState({
    area: false,
    building: false,
    units: false,
  });

  const [signupForm, setSignupForm] = useState({
    userType: "",
    userTypeId: "",
    area: "",
    areaId: "",
    building: "",
    buildingId: "",
    name: "",
    units: "",
    unitId: "",
    phoneNo: "",
    emailId: "",
    countryCode: "+91",
    otp: "",
    password: "",
    confirmPassword: "",
    emailOtp: "",
    emailVerified: false,
    otpSent: false,
    sendingOtp: false,
    verifyingOtp: false,
    emailVerificationError: "",
  });

  const pickerOptions = {
    userType: userTypeOptions,
    area: areaOptions,
    building: buildingOptions,
    units: unitOptions,
    countryCode: COUNTRY_CODES, // Add country codes to picker options
  };

  const onChange = (field, value) => {
    setSignupForm((s) => {
      const newState = { ...s, [field]: value };
      // Reset email verification if email changes
      if (field === "emailId" && value !== s.emailId) {
        newState.emailVerified = false;
        newState.otpSent = false;
        newState.emailOtp = "";
        newState.emailVerificationError = "";
      }
      return newState;
    });
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    setOptionsLoading((s) => ({ ...s, area: true }));
    try {
      const { ok, data } = await getAreas();
      if (ok) {
        const formatted =
          (data || []).map((item) => ({
            label: item.Text,
            value: item.Value,
          })) || [];
        setAreaOptions(formatted);
      }
    } catch (err) {
      console.warn("Failed to load areas", err);
    } finally {
      setOptionsLoading((s) => ({ ...s, area: false }));
    }
  };

  const loadBuildings = async (areaId) => {
    if (!areaId) {
      setBuildingOptions([]);
      return;
    }
    setOptionsLoading((s) => ({ ...s, building: true }));
    try {
      const { ok, data } = await getBuildingsByArea(areaId);
      if (ok) {
        const formatted =
          (data || []).map((item) => ({
            label: item.Name,
            value: item.Id,
          })) || [];
        setBuildingOptions(formatted);
      } else {
        setBuildingOptions([]);
      }
    } catch (err) {
      console.warn("Failed to load buildings", err);
      setBuildingOptions([]);
    } finally {
      setOptionsLoading((s) => ({ ...s, building: false }));
    }
  };

  const loadUnits = async (buildingId) => {
    if (!buildingId) {
      setUnitOptions([]);
      return;
    }
    setOptionsLoading((s) => ({ ...s, units: true }));
    try {
      const { ok, data } = await getUnitsByBuilding(buildingId);
      if (ok) {
        const formatted =
          (data || []).map((item) => ({
            label: item.Name,
            value: item.Id,
          })) || [];
        setUnitOptions(formatted);
      } else {
        setUnitOptions([]);
      }
    } catch (err) {
      console.warn("Failed to load units", err);
      setUnitOptions([]);
    } finally {
      setOptionsLoading((s) => ({ ...s, units: false }));
    }
  };

  const openPicker = (type) => {
    console.log("openPicker called with:", type);
    if (type === "building" && !signupForm.areaId) {
      Alert.alert("Please select an area first.");
      return;
    }
    if (type === "units" && !signupForm.buildingId) {
      Alert.alert("Please select a building first.");
      return;
    }
    console.log("Setting picker type to:", type);
    console.log("Options for type:", pickerOptions[type]);
    setPickerType(type);
    setShowPicker(true);
  };

  const selectOption = (item) => {
    if (pickerType === "userType") {
      setSignupForm(s => ({ ...s, userType: item.label, userTypeId: item.value }));
    } else if (pickerType === "area") {
      setSignupForm(s => ({
        ...s,
        area: item.label,
        areaId: item.value,
        building: "",
        buildingId: "",
        units: "",
        unitId: "",
      }));
      setBuildingOptions([]);
      setUnitOptions([]);
      loadBuildings(item.value);
    } else if (pickerType === "building") {
      setSignupForm(s => ({
        ...s,
        building: item.label,
        buildingId: item.value,
        units: "",
        unitId: "",
      }));
      setUnitOptions([]);
      loadUnits(item.value);
    } else if (pickerType === "units") {
      setSignupForm(s => ({ ...s, units: item.label, unitId: item.value }));
    } else if (pickerType === "countryCode") {
      setSignupForm(s => ({ ...s, countryCode: item.value }));
    }
    setShowPicker(false);
  };

  const refreshCaptcha = () => {
    setCaptchaKey(Date.now());
  };

  /* ✅ REVERT TO MOCK OTP STATE */
  const [generatedOtp, setGeneratedOtp] = useState(null);

  const handleSendOtp = async () => {
    if (!signupForm.emailId) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupForm.emailId)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      onChange("sendingOtp", true);
      onChange("emailVerificationError", "");

      /* ✅ SIMULATE OTP (CLIENT-SIDE) */
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);
      console.log("Generated OTP:", mockOtp);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      onChange("otpSent", true);
      Alert.alert("OTP Sent", `Your OTP is: ${mockOtp}`);

    } catch (e) {
      console.warn("Send OTP error", e);
      onChange("emailVerificationError", "Failed to send OTP.");
      Alert.alert("Error", "Failed to send OTP.");
    } finally {
      onChange("sendingOtp", false);
    }
  };

  const handleVerifyOtp = async () => {
    console.log("handleVerifyOtp called");
    if (!signupForm.emailOtp) {
      Alert.alert("Error", "Please enter the OTP sent to your email");
      return false;
    }

    try {
      onChange("verifyingOtp", true);
      onChange("emailVerificationError", "");

      /* ✅ MOCK VERIFICATION */
      console.log("Verifying OTP:", signupForm.emailOtp, "against", generatedOtp);
      if (signupForm.emailOtp !== generatedOtp) {
        throw new Error("Invalid OTP");
      }

      // Success!
      onChange("emailVerified", true);
      Alert.alert("Success", "Email Verified!");
      return true;

    } catch (e) {
      console.warn("Verify OTP error", e);
      onChange("emailVerificationError", e.message || "Invalid OTP");
      Alert.alert("Error", e.message || "Invalid OTP. Please try again.");
      return false;
    } finally {
      onChange("verifyingOtp", false);
    }
  };

  /* The intermediate handleVerifyEmailOtp is no longer used in the new flow, 
     but keeping it or removing it depends on if unrelated UI uses it. 
     Since we removed the button in Step 2, we can ignore/remove it. 
     I'll leave it but unused to minimize diffs or remove if desired. 
     Actually, let's just focus on handleSignupNext as the primary verifier now.
  */

  const { session, saveSession } = useSession();

  const handleSubmit = async () => {
    if (signupForm.password !== signupForm.confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    if (!signupForm.emailVerified) {
      Alert.alert("Error", "Please verify your email OTP first.");
      return;
    }

    try {
      setLoading(true);
      const fullPhoneNumber = (signupForm.countryCode || "+91") + (signupForm.phoneNo || "");

      const payload = {
        CustomerName: signupForm.name || "",
        Email: signupForm.emailId || "",
        Password: signupForm.password || "",
        MobileNo: fullPhoneNumber,
        CountryCode: signupForm.countryCode || "+91",
        BuildingName: signupForm.building || "",
        BuildingId: signupForm.buildingId || "",
        UnitNo: signupForm.units || "",
        UnitId: signupForm.unitId || "",
        TenantType: signupForm.userTypeId || "",
        areaid: signupForm.areaId || "",
      };

      const { ok, status, data } = await registerUser(payload);

      if (!ok) {
        throw new Error(data?.message || `Register failed. Status: ${status}`);
      }

      const sessionPayload = {
        FirstName: signupForm.name || "User",
        ClientId: fullPhoneNumber || signupForm.emailId || `temp-${Date.now()}`,
        ClientTypeid: signupForm.userTypeId || 1,
        EMail: signupForm.emailId || "",
        MobileNumber: fullPhoneNumber,
      };


      /* ✅ DO NOT AUTO-LOGIN. REDIRECT TO LOGIN SCREEN */
      Alert.alert("Success", "Registration successful! Please log in.");
      setActiveTab("login");
      setCurrentPage(1);

    } catch (e) {
      console.warn("Registration handling error", e);
      Alert.alert("Error", e.message || "Unable to complete registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentPage((p) => p + 1);
  const prevStep = () => setCurrentPage((p) => Math.max(1, p - 1));

  /* ✅ MODIFIED: MERGED OTP VERIFICATION INTO MAIN FLOW */
  const handleSignupNext = async () => {
    if (currentPage === 1) {
      if ((captchaInput || "").trim().toUpperCase() !== (captchaText || "").trim().toUpperCase()) {
        Alert.alert("Error", "Invalid CAPTCHA");
        return;
      }

      if (!signupForm.userType || !signupForm.area || !signupForm.building) {
        Alert.alert("Error", "Please fill all required fields");
        return;
      }
      nextStep();
    } else if (currentPage === 2) {
      if ((captchaInput2 || "").trim().toUpperCase() !== (captchaText || "").trim().toUpperCase()) {
        Alert.alert("Error", "Invalid CAPTCHA");
        return;
      }

      if (!signupForm.name || !signupForm.phoneNo || !signupForm.emailId) {
        Alert.alert("Error", "Please fill all required fields");
        return;
      }

      /* ✅ CHECK: OTP SENT BUT NOT VERIFIED YET (Verification moved to Step 3) */
      if (!signupForm.otpSent) {
        Alert.alert("Error", "Please send OTP to your email first.");
        return;
      }

      // Proceed to Step 3 without verifying OTP yet
      nextStep();
    }
  };

  const renderSignup = () => {
    switch (currentPage) {
      case 1:
        return (
          <SignupStep1
            signupForm={signupForm}
            onChange={onChange}
            onOpenPicker={openPicker}
            captchaText={captchaText}
            captchaKey={captchaKey}
            setCaptchaText={setCaptchaText}
            captchaInput={captchaInput}
            setCaptchaInput={setCaptchaInput}
            onNext={handleSignupNext}
            onBack={() => setActiveTab("login")}
            refreshCaptcha={refreshCaptcha}
          />
        );
      case 2:
        return (
          <SignupStep2
            signupForm={signupForm}
            onChange={onChange}
            onOpenPicker={openPicker}
            captchaText={captchaText}
            captchaKey={captchaKey}
            setCaptchaText={setCaptchaText}
            captchaInput2={captchaInput2}
            setCaptchaInput2={setCaptchaInput2}
            onNext={handleSignupNext}
            onBack={prevStep}
            refreshCaptcha={refreshCaptcha}
            onSendOtp={handleSendOtp}
          />
        );
      case 3:
        return (
          <SignupStep3
            signupForm={signupForm}
            onChange={onChange}
            onSubmit={handleSubmit}
            onBack={prevStep}
            onVerifyOtp={handleVerifyOtp}
            onMoveIn={() => setShowMoveIn(true)}
          />
        );
      default:
        return null;
    }
  };

  const getModalBackgroundColor = () =>
    activeTab === "login" ? "#ffffff" : "rgba(40, 40, 60, 0.98)";

  const getModalTextColor = () =>
    activeTab === "login" ? COLORS.TEXT_DARK : COLORS.TEXT_WHITE;

  const getModalBorderColor = () =>
    activeTab === "login" ? "#eee" : "rgba(255,255,255,0.1)";

  return (
    <ImageBackground
      source={require("../../assets/images/background.webp")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.bgOverlay} />

        {/* Wrap content in TouchableWithoutFeedback to dismiss keyboard */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.contentContainer}>
            {/* Using ternary operator to conditionally apply card style */}
            <View
              style={[
                styles.card,
                activeTab === "login"
                  ? styles.cardLogin  // Apply login card style
                  : styles.cardSignup // Apply signup card style
              ]}
            >
              <View style={[
                styles.tabContainer,
                activeTab === "login"
                  ? styles.tabContainerLogin
                  : styles.tabContainerSignup
              ]}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "login" && styles.tabButtonActiveLogin,
                  ]}
                  onPress={() => {
                    setActiveTab("login");
                    setCurrentPage(1);
                  }}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      activeTab === "login" ? styles.tabButtonTextActiveLogin : styles.tabButtonTextInactive,
                    ]}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "signup" && styles.tabButtonActiveSignup,
                  ]}
                  onPress={() => setActiveTab("signup")}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      activeTab === "signup" ? styles.tabButtonTextActiveSignup : styles.tabButtonTextInactive,
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                keyboardDismissMode="on-drag"
                bounces={false}
                contentInsetAdjustmentBehavior="automatic"
              >
                {activeTab === "login" ? (
                  <LoginScreen
                    onLoginSuccess={onLoginSuccess}
                    onShowSignup={() => setActiveTab("signup")}
                  />
                ) : (
                  renderSignup()
                )}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>


      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[
                styles.modalContent,
                { backgroundColor: getModalBackgroundColor() }
              ]}>
                <View style={[styles.modalHeader, { borderBottomColor: getModalBorderColor() }]}>
                  <Text style={[styles.modalTitle, { color: getModalTextColor() }]}>
                    Select{" "}
                    {pickerType === "userType"
                      ? "User Type"
                      : pickerType === "area"
                        ? "Area"
                        : pickerType === "building"
                          ? "Building"
                          : "Unit"}
                  </Text>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={[styles.modalClose, { color: getModalTextColor() }]}>✕</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={pickerOptions[pickerType] || []}
                  keyExtractor={(item, index) => item.label + index}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.optionItem, { borderBottomColor: getModalBorderColor() }]}
                      onPress={() => selectOption(item)}
                    >
                      <Text style={[styles.optionText, { color: getModalTextColor() }]}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ✅ MOVE-IN FORM MODAL */}
      <Modal
        visible={showMoveIn}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowMoveIn(false)}
      >
        <MoveInForm
          onClose={() => setShowMoveIn(false)}
          session={session}
        />
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop:
      Platform.OS === "android" ? StatusBar.currentHeight + 10 : 40,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  background: {

    width: "100%",
    height: "100%",
    flex: 1,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  scrollView: {
    width: "100%",
  },
  scrollContent: {
    // flexGrow: 1, // Removed to prevent unwanted expansion
    paddingBottom: 10,
  },
  card: {
    width: "94%",
    maxWidth: 600,
    borderRadius: 28,
    padding: 20,

    /* ✅ EXACT FIRST IMAGE GLASS */
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 35,
    elevation: 16,
  },
  // Login Card Style - Keep existing glass effect
  cardLogin: {
    backgroundColor: "rgba(91, 22, 230, 0.03)",
    borderColor: "rgba(255,255,255,0.7)",
  },
  // Signup Card Style - New solid background (darker gray-blue like in the image)
  cardSignup: {
    backgroundColor: "#000000", // Black


    borderColor: "rgba(100, 100, 150, 0.4)",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
  },
  // Login Tab Container Style
  tabContainerLogin: {
    backgroundColor: "rgba(146, 143, 155, 0.1)",
    borderColor: "rgba(255,255,255,0.25)",
  },
  // Signup Tab Container Style
  tabContainerSignup: {
    backgroundColor: "rgba(50, 50, 70, 0.6)",
    borderColor: "rgba(100, 100, 150, 0.3)",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  // Different active button colors for Login and Signup
  tabButtonActiveLogin: {
    backgroundColor: "#ffff", // Green for login
  },
  tabButtonActiveSignup: {
    backgroundColor: COLORS.TAB_SIGNUP_ACTIVE, // Blue for signup
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  tabButtonTextActiveLogin: {
    color: "#060606ff",
  },
  tabButtonTextActiveSignup: {
    color: COLORS.TEXT_WHITE,
  },
  tabButtonTextInactive: {
    color: "rgba(255,255,255,0.7)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalClose: {
    fontSize: 24,
    padding: 5,
  },
  optionItem: {
    padding: 18,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default AuthScreen;
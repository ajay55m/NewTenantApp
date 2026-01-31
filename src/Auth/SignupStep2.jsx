// SignupStep2.js
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "./constants";
import Captcha from "./Captcha";
import InfoRow from "./InfoRow";
import PillGroup from "./PillGroup";

const SignupStep2 = ({
  signupForm,
  onChange,
  onOpenPicker,
  captchaText,
  captchaKey,
  setCaptchaText,
  captchaInput2,
  setCaptchaInput2,
  onNext,
  onBack,
  refreshCaptcha,
  onSendOtp
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor={COLORS.TEXT_MUTED}
        value={signupForm.name}
        onChangeText={(text) => onChange("name", text)}
      />

      {/* READ-ONLY rows - values come from SignupStep1 */}
      <InfoRow label="Type" value={signupForm.userType || "--"} />
      <InfoRow label="Area" value={signupForm.area || "--"} />
      <InfoRow label="Building" value={signupForm.building || "--"} />

      <Text style={[styles.label, { marginTop: 8 }]}>Units</Text>
      {/* Units are still selectable here (tap to open units picker) */}
      <PillGroup
        items={signupForm.units ? (Array.isArray(signupForm.units) ? signupForm.units : [signupForm.units]) : []}
        onPressItem={() => onOpenPicker("units")}
      />

      <Text style={styles.label}>Phone No</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {/* Country Code Picker */}
        <TouchableOpacity
          style={[styles.input, { width: 80, justifyContent: 'center', alignItems: 'center' }]}
          onPress={() => onOpenPicker("countryCode")}
        >
          <Text style={{ color: COLORS.TEXT_DARK }}>{signupForm.countryCode || "+91"}</Text>
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Enter phone number"
          placeholderTextColor={COLORS.TEXT_MUTED}
          value={signupForm.phoneNo}
          onChangeText={(text) => onChange("phoneNo", text)}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={styles.label}>Email Id</Text>
      <View style={styles.emailContainer}>
        <TextInput
          style={styles.emailInput}
          placeholder="Enter email"
          placeholderTextColor={COLORS.TEXT_MUTED}
          value={signupForm.emailId}
          onChangeText={(text) => onChange("emailId", text)}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!signupForm.emailVerified}
        />
        <TouchableOpacity
          style={[
            styles.sendOtpButton,
            (!signupForm.emailId || signupForm.emailVerified || signupForm.sendingOtp) && styles.sendOtpButtonDisabled
          ]}
          onPress={onSendOtp}
          disabled={!signupForm.emailId || signupForm.emailVerified || signupForm.sendingOtp}
        >
          <Text style={styles.sendOtpButtonText}>
            {signupForm.sendingOtp ? "Sending..." : signupForm.emailVerified ? "Verified" : "Send OTP"}
          </Text>
        </TouchableOpacity>
      </View>

      {signupForm.otpSent && !signupForm.emailVerified && (
        <View style={{ marginBottom: 15 }}>
          <Text style={{ color: '#aaa', fontSize: 13, fontStyle: 'italic' }}>
            OTP Sent! You will be asked to verify it in the next step.
          </Text>
        </View>
      )}

      <View style={styles.separator} />

      <Text style={styles.label}>Enter the CAPTCHA below</Text>

      <View style={styles.captchaRow}>
        <Captcha key={captchaKey} seed={captchaKey} width={290} height={70} length={5} onChange={(actual) => setCaptchaText(actual)} />
        <TouchableOpacity onPress={refreshCaptcha} style={styles.captchaRefresh} accessibilityRole="button" accessibilityLabel="Refresh CAPTCHA">
          <Text style={styles.refreshText}>↻</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter CAPTCHA"
        placeholderTextColor={COLORS.TEXT_MUTED}
        value={captchaInput2}
        onChangeText={setCaptchaInput2}
      />

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
          <Text style={styles.nextTxt}>NEXT</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", paddingHorizontal: 8 },
  label: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: "#000000",
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  emailInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: "#000000",
  },
  sendOtpButton: {
    backgroundColor: COLORS.BRIGHT_BLUE,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  sendOtpButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.3)",
    opacity: 0.6,
  },
  sendOtpButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  otpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  otpInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: "#000000",
  },

  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  separator: { height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginVertical: 14 },
  captchaRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  captchaRefresh: { marginLeft: 12, padding: 6 },
  refreshText: { color: COLORS.BRIGHT_BLUE, fontSize: 18 },
  buttonsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  backBtn: { backgroundColor: "rgba(255,255,255,0.1)", padding: 12, borderRadius: 10, alignItems: "center", flex: 1, marginRight: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  backTxt: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  nextBtn: { backgroundColor: COLORS.BRIGHT_BLUE, padding: 12, borderRadius: 10, alignItems: "center", flex: 1 },
  nextTxt: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});

export default SignupStep2;

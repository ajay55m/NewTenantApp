import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { COLORS } from "./constants";
import Captcha from "./Captcha";

const SignupStep1 = ({
  signupForm,
  onChange,
  onOpenPicker,
  captchaText,
  captchaKey,
  setCaptchaText,
  captchaInput,
  setCaptchaInput,
  onNext,
  onBack,
  refreshCaptcha,
}) => {
  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Text style={styles.signupLabelText}>Select User Type:</Text>
      <TouchableOpacity
        style={styles.signupSelectField}
        onPress={() => onOpenPicker("userType")}
      >
        <Text
          style={
            signupForm.userType ? styles.selectFieldText : styles.selectFieldPlaceholder
          }
        >
          {signupForm.userType || "-- Select User Type --"}
        </Text>
        <Text style={styles.selectArrow}>▼</Text>
      </TouchableOpacity>

      <Text style={styles.signupLabelText}>Select Area:</Text>
      <TouchableOpacity
        style={styles.signupSelectField}
        onPress={() => onOpenPicker("area")}
      >
        <Text
          style={signupForm.area ? styles.selectFieldText : styles.selectFieldPlaceholder}
        >
          {signupForm.area || "-- Select Area --"}
        </Text>
        <Text style={styles.selectArrow}>▼</Text>
      </TouchableOpacity>

      <Text style={styles.signupLabelText}>Select Buildings:</Text>
      <TouchableOpacity
        style={styles.signupSelectField}
        onPress={() => onOpenPicker("building")}
      >
        <Text
          style={
            signupForm.building ? styles.selectFieldText : styles.selectFieldPlaceholder
          }
        >
          {signupForm.building || "-- Select Building --"}
        </Text>
        <Text style={styles.selectArrow}>▼</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <Text style={styles.signupLabelText}>Enter the CAPTCHA below:</Text>

      <Captcha
        key={captchaKey}
        seed={captchaKey}
        width={290}
        height={70}
        length={5}
        onChange={(actual) => setCaptchaText(actual)}
      />

      <TextInput
        style={styles.signupInput}
        placeholder="Enter CAPTCHA"
        placeholderTextColor={COLORS.TEXT_MUTED}
        value={captchaInput}
        onChangeText={setCaptchaInput}
        onSubmitEditing={Keyboard.dismiss}
        returnKeyType="done"
        blurOnSubmit={true}
      />

      <TouchableOpacity style={styles.searchButton} onPress={onNext}>
        <Text style={styles.searchButtonText}>SEARCH</Text>
      </TouchableOpacity>
    </View>
    // </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  signupLabelText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
  },
  signupInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#000000",
    marginBottom: 8,
    marginTop: 10,
  },
  signupSelectField: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  selectFieldText: {
    fontSize: 16,
    color: COLORS.TEXT_DARK,
    fontWeight: "500",
  },
  selectFieldPlaceholder: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    fontStyle: "italic",
  },
  selectArrow: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 20
  },
  searchButton: {
    backgroundColor: COLORS.BRIGHT_BLUE,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 0,
    shadowColor: COLORS.BRIGHT_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default SignupStep1;
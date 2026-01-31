import AsyncStorage from "@react-native-async-storage/async-storage";

/* ======================================================
   STORAGE KEYS
====================================================== */
export const STORAGE_KEYS = {
  RENEW_CONTRACT_DRAFT: "RENEW_CONTRACT_DRAFT",
  MOVEOUT_DRAFT: "MOVEOUT_DRAFT",
  PROFILE_CACHE: "PROFILE_CACHE",
  SESSION_DATA: "SESSION_DATA",
};

/* ======================================================
   GENERIC HELPERS
====================================================== */

export const saveItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log("AsyncStorage Save Error:", e);
  }
};

export const loadItem = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.log("AsyncStorage Load Error:", e);
    return null;
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log("AsyncStorage Remove Error:", e);
  }
};

/* ======================================================
   MOVEOUT DRAFT
====================================================== */

export const saveMoveoutDraft = async (data) => {
  await saveItem(STORAGE_KEYS.MOVEOUT_DRAFT, data);
};

export const loadMoveoutDraft = async () => {
  return await loadItem(STORAGE_KEYS.MOVEOUT_DRAFT);
};

export const clearMoveoutDraft = async () => {
  await removeItem(STORAGE_KEYS.MOVEOUT_DRAFT);
};

/* ======================================================
   SERVICE TICKET DRAFT
====================================================== */

export const saveTicketDraft = async (data) => {
  await saveItem("SERVICE_TICKET_DRAFT", data);
};

export const loadTicketDraft = async () => {
  return await loadItem("SERVICE_TICKET_DRAFT");
};

export const clearTicketDraft = async () => {
  await removeItem("SERVICE_TICKET_DRAFT");
};

/* ======================================================
   RENEW CONTRACT DRAFT
====================================================== */

export const saveRenewDraft = async (data) => {
  await saveItem(STORAGE_KEYS.RENEW_CONTRACT_DRAFT, data);
};

export const loadRenewDraft = async () => {
  return await loadItem(STORAGE_KEYS.RENEW_CONTRACT_DRAFT);
};

export const clearRenewDraft = async () => {
  await removeItem(STORAGE_KEYS.RENEW_CONTRACT_DRAFT);
};

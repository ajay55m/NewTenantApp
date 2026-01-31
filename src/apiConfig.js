// src/apiConfig.js

/* ------------------ BASE URLS ------------------ */
export const API_BASE_URL = "https://ubill-tenantapi.maccloud.in/api";
export const DASHBOARD_BASE_URL = "https://ibmapi.maccloud.in/api";

/* ------------------ ENDPOINTS ------------------ */
export const ENDPOINTS = {
  // AUTH
  login: "/login",
  register: "/register",
  sendOtp: "/send-otp",
  verifyOtp: "/verify-otp",
  areas: "/get-areas",
  buildingsByArea: "/get-buildings-by-area",
  unitsByBuilding: "/get-units-by-building",

  // CONTRACTS
  contractsByClient: "/get-contracts-by-client",
  ownerContractsByClient: "/get-owner-contracts-by-client",

  // BILLING & PAYMENTS
  billHistory: "/bill-history",
  paymentHistory: "/payment-history",

  // CLIENT / DASHBOARD
  approvedClient: "/get-approved-client",
  finalBillRequest: "/final-bill-request-get",
  customerDashboard: "/Cust_Dashboard",

  // RAISE TICKET
  clientMeters: "/client-meters",
  clientServiceList: "/client-service-list",

  // 🔔 NOTIFICATIONS (IBM SERVER)
  serviceNotification: "/ServiceNotification",
};

/* ------------------ DASHBOARD GET (IBM SERVER) ------------------ */
const apiGetDashboard = async (endpoint, params = {}) => {
  const url = new URL(DASHBOARD_BASE_URL + endpoint);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      url.searchParams.append(k, String(v));
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

/* ------------------ GENERIC GET ------------------ */
const apiGet = async (endpoint, params = {}, options = {}) => {
  const url = new URL(API_BASE_URL + endpoint);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      url.searchParams.append(k, String(v));
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

/* ------------------ GENERIC POST ------------------ */
const apiPost = async (endpoint, body = {}, options = {}) => {
  const res = await fetch(API_BASE_URL + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

/* ------------------ GENERIC POST MULTIPART ------------------ */
const apiPostMultipart = async (endpoint, formData, options = {}) => {
  const res = await fetch(API_BASE_URL + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      ...(options.headers || {}),
    },
    body: formData,
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

/* ------------------ API FUNCTIONS ------------------ */

/* ---------- AUTH ---------- */
export const loginUser = (email, password) =>
  apiPost(ENDPOINTS.login, {
    UserId: email,
    Password: password,
  });

// Support both JSON and Multipart for registration/update
export const registerUser = (body) => apiPost(ENDPOINTS.register, body);
export const registerUserMultipart = (formData) => apiPostMultipart(ENDPOINTS.register, formData);

export const sendEmailOtp = (email) =>
  apiPost(ENDPOINTS.sendOtp, { Email: email });

export const verifyEmailOtp = (email, otp) =>
  apiPost(ENDPOINTS.verifyOtp, { Email: email, OTP: otp });

export const getAreas = () => apiGet(ENDPOINTS.areas);

export const getBuildingsByArea = (areaId) =>
  apiGet(ENDPOINTS.buildingsByArea, { areaId });

export const getUnitsByBuilding = (buildingId) =>
  apiGet(ENDPOINTS.unitsByBuilding, { buildingId });

/* ---------- CONTRACTS ---------- */
// Tenant
export const getContractsByClient = (clientId) =>
  apiGet(ENDPOINTS.contractsByClient, { clientId });

// Owner
export const getOwnerContractsByClient = (clientId) =>
  apiGet(ENDPOINTS.ownerContractsByClient, { clientId });

/* ---------- CLIENT STATUS ---------- */
export const getApprovedClient = (userId) =>
  apiGet(ENDPOINTS.approvedClient, { userId });

/* ---------- FINAL BILL ---------- */
export const getFinalBillRequest = (userId, officeId) =>
  apiGet(ENDPOINTS.finalBillRequest, {
    userId,
    officeid: officeId, // backend expects lowercase
  });

/* ---------- BILL HISTORY ---------- */
export const getBillHistory = ({
  key,
  fromDate,
  toDate,
  byOffice = false,
  officeIds = "",
  clientIds,
}) =>
  apiPost(ENDPOINTS.billHistory, {
    key,
    FromDate: fromDate,
    ToDate: toDate,
    Byoffice: byOffice,
    OfficeIds: officeIds,
    ClientIds: clientIds,
  });

/* ---------- PAYMENT HISTORY ---------- */
export const getPaymentHistory = ({
  key,
  fromDate,
  toDate,
  byOffice = false,
  officeIds = "",
  clientIds,
}) =>
  apiPost(ENDPOINTS.paymentHistory, {
    key,
    FromDate: fromDate,
    ToDate: toDate,
    Byoffice: byOffice,
    OfficeIds: officeIds,
    ClientIds: clientIds,
  });

/* ---------- DASHBOARD (IBM SERVER) ---------- */
export const getCustomerDashboard = (key) =>
  apiGetDashboard(ENDPOINTS.customerDashboard, { Key: key });

/* ---------- RAISE TICKET ---------- */
export const getClientMeters = (loginKey) =>
  apiGet(ENDPOINTS.clientMeters, { loginKey });

export const getClientServiceList = (clientId) =>
  apiGet(ENDPOINTS.clientServiceList, { clientId });

/* ---------- 🔔 NOTIFICATIONS (IBM SERVER) ---------- */
/*
  Calls:
  https://ibmapi.maccloud.in/api/ServiceNotification?Key=SESSION_KEY&Client=1
*/
export const getServiceNotifications = (sessionKey, client = 1) =>
  apiGetDashboard(ENDPOINTS.serviceNotification, {
    Key: sessionKey,
    Client: client, // default always 1
  });

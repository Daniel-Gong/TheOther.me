import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken as getAppCheckSdkToken,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check.js";

const runtime = window.__ORIA_RUNTIME__ || {};
if (!runtime.firebaseConfig || !runtime.firebaseConfig.apiKey || !runtime.firebaseConfig.projectId) {
  throw new Error("[firebase] Missing runtime config. Ensure js/config/runtime-config.js is loaded first.");
}
const app = getApps().length ? getApp() : initializeApp(runtime.firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app, runtime.functionsRegion || "us-central1");
const appCheckSiteKey = runtime.appCheckSiteKey || "";
let appCheck = null;

if (appCheckSiteKey) {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    // Ignore duplicate initialization or unsupported environments.
    console.warn("[firebase] App Check init skipped:", error);
  }
}

async function getAppCheckToken() {
  if (!appCheck) return null;
  try {
    const tokenResult = await getAppCheckSdkToken(appCheck, false);
    return tokenResult?.token || null;
  } catch (error) {
    console.warn("[firebase] Failed to fetch App Check token:", error);
    return null;
  }
}

window.oriaFirebase = {
  app,
  auth,
  functions,
  appCheck,
  getAppCheckToken,
  runtime,
};

export function getOriaFirebase() {
  return window.oriaFirebase;
}

export { app, auth, functions, appCheck, getAppCheckToken, runtime };

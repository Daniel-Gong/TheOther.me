const REFERRAL_STORAGE_KEY = "oria_referral_code";
const REFERRAL_TS_STORAGE_KEY = "oria_referral_code_ts";
const APP_STORE_URL = "https://testflight.apple.com/join/edVXvcNq";
const DEEPLINK_FALLBACK_DELAY_MS = 1500;

function sanitizeReferralCode(rawCode) {
    if (!rawCode) return null;
    const normalized = String(rawCode).trim().toUpperCase();
    const safe = normalized.replace(/[^A-Z0-9]/g, "");
    if (safe.length < 4 || safe.length > 16) return null;
    return safe;
}

function getCodeFromLocation() {
    const pathMatch = window.location.pathname.match(/^\/invite\/([^/?#]+)/i);
    const pathCode = sanitizeReferralCode(pathMatch ? pathMatch[1] : null);
    if (pathCode) return pathCode;

    const queryCode = sanitizeReferralCode(new URLSearchParams(window.location.search).get("code"));
    if (queryCode) return queryCode;

    return null;
}

function setStoredReferralCode(code) {
    if (!code) return;
    localStorage.setItem(REFERRAL_STORAGE_KEY, code);
    localStorage.setItem(REFERRAL_TS_STORAGE_KEY, String(Date.now()));
}

function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
    }
}

function showFallbackUI(code) {
    const statusText = document.getElementById("status-text");
    const codeChip = document.getElementById("code-chip");
    const actions = document.getElementById("fallback-actions");
    const openAppBtn = document.getElementById("open-app-btn");
    const testflightBtn = document.getElementById("testflight-btn");

    if (statusText) {
        statusText.textContent = code
            ? "Could not open app automatically. You can open it manually or install it first."
            : "Invalid invite link. You can still install the app and join the waitlist.";
    }

    if (code && codeChip) {
        codeChip.textContent = `Invite code: ${code}`;
        codeChip.classList.remove("hidden");
    }

    if (openAppBtn) {
        openAppBtn.href = code ? `theotherme://invite/${code}` : "theotherme://chat";
        openAppBtn.addEventListener("click", () => {
            trackEvent("invite_cta_clicked", { cta: "open_app", code: code || "none" });
        });
    }

    if (testflightBtn) {
        const installUrl = code ? `${APP_STORE_URL}?ref=${encodeURIComponent(code)}` : APP_STORE_URL;
        testflightBtn.href = installUrl;
        testflightBtn.addEventListener("click", () => {
            trackEvent("invite_cta_clicked", { cta: "install_testflight", code: code || "none" });
        });
    }

    if (actions) actions.classList.remove("hidden");
}

function runInviteFlow() {
    const code = getCodeFromLocation();
    const deeplinkUrl = code ? `theotherme://invite/${code}` : null;
    const canonicalPath = code ? `/invite/${code}` : "/invite";
    const canonicalUrl = new URL(canonicalPath, window.location.origin).toString();

    if (window.location.href !== canonicalUrl) {
        window.history.replaceState({}, "", canonicalUrl);
    }

    if (!code) {
        trackEvent("invite_landing_viewed", { valid_code: false });
        showFallbackUI(null);
        return;
    }

    setStoredReferralCode(code);
    trackEvent("invite_landing_viewed", { valid_code: true, code });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            trackEvent("invite_app_opened", { code });
        }
    }, { once: true });

    trackEvent("invite_deeplink_attempted", { code });
    window.location.assign(deeplinkUrl);

    window.setTimeout(() => {
        trackEvent("invite_fallback_shown", { code });
        showFallbackUI(code);
    }, DEEPLINK_FALLBACK_DELAY_MS);
}

runInviteFlow();

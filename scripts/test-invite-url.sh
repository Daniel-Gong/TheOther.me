#!/usr/bin/env bash
# Test that https://oria.me/invite/{code} (and fallbacks) return the invite page.
#
# Usage:
#   ./scripts/test-invite-url.sh              # code=TEST12, base=https://oria.me
#   ./scripts/test-invite-url.sh ABC9XY       # custom code
#   BASE_URL=http://localhost:3000 ./scripts/test-invite-url.sh   # local or staging
#
# Requires: curl. Live test requires the invite page and AASA to be deployed.
#
# Note: GitHub Pages returns HTTP 404 for unknown paths but still serves custom
# 404.html; that body includes og:title "You are invited…". Local static servers
# may return 200 for /invite/{code}.

set -e
CODE="${1:-TEST12}"
BASE="${BASE_URL:-https://oria.me}"
PASS=0
FAIL=0

check() {
  local name="$1"
  local url="$2"
  local expect_status="$3"
  local expect_in_response="$4"

  printf "  %s ... " "$name"
  resp=$(curl -sS -w "\n%{http_code}" -L --max-time 10 "$url" 2>/dev/null) || { echo "FAIL (curl error)"; ((FAIL++)); return; }
  status=$(echo "$resp" | tail -n1)
  body=$(echo "$resp" | sed '$d')

  if [[ "$expect_status" == "flex" ]]; then
    if [[ "$status" != "200" && "$status" != "404" ]]; then
      echo "FAIL (HTTP $status, expected 200 or 404)"
      ((FAIL++))
      return
    fi
  elif [[ "$status" != "$expect_status" ]]; then
    echo "FAIL (HTTP $status, expected $expect_status)"
    ((FAIL++))
    return
  fi
  if [[ -n "$expect_in_response" ]]; then
    if echo "$body" | grep -qF "$expect_in_response"; then
      echo "OK"
      ((PASS++))
    else
      echo "FAIL (expected text not found: $expect_in_response)"
      ((FAIL++))
    fi
  else
    echo "OK (HTTP $status)"
    ((PASS++))
  fi
}

echo "Testing oria.me invite URLs (code=$CODE)"
echo "----------------------------------------"

check "GET /invite/$CODE (path; GHP often 404 with custom body)" \
  "$BASE/invite/$CODE" \
  flex \
  "You are invited"

check "GET /invite/index.html (shell)" \
  "$BASE/invite/index.html" \
  200 \
  "invite.js"

check "GET /invite.html?code=$CODE (redirect stub)" \
  "$BASE/invite.html?code=$CODE" \
  200 \
  "Continue to invite"

check "Invite shell has fallback CTA" \
  "$BASE/invite/index.html" \
  200 \
  "Open App"

check "AASA (Universal Links)" \
  "$BASE/.well-known/apple-app-site-association" \
  200 \
  "applinks"

echo "----------------------------------------"
echo "Passed: $PASS  Failed: $FAIL"
if [[ $FAIL -gt 0 ]]; then
  exit 1
fi

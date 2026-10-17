#!/usr/bin/env bash
# ==============================================================================
# LandLock Engine - Universal Start Script (macOS / Linux)
# ==============================================================================
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

GREEN='\033[0;32m'
RED='\033[0;31m'
GOLD='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================================================${NC}"
echo -e "${GREEN}  🇧🇩  ল্যান্ডলক ইঞ্জিন (LandLock Engine) — সার্বজনীন লঞ্চার${NC}"
echo -e "${GREEN}================================================================${NC}"

# Cleanup on exit (Ctrl+C)
cleanup() {
  echo ""
  echo -e "${GOLD}সার্ভিসসমূহ বন্ধ করা হচ্ছে (Shutting down services)...${NC}"
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  echo -e "${GREEN}সব সার্ভিস সফলভাবে বন্ধ হয়েছে। বিদায়!${NC}"
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# ------------------------------------------------------------------------------
# 1. PostgreSQL Database Check
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}[১/৩] ডাটাবেজ যাচাই করা হচ্ছে (Checking PostgreSQL on port 5433)...${NC}"

if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^landlockdb$"; then
  echo -e "${GREEN}✓ PostgreSQL কন্টেইনার 'landlockdb' ইতিমধ্যেই সচল আছে।${NC}"
elif docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q "^landlockdb$"; then
  echo -e "${GOLD}PostgreSQL কন্টেইনার চালু করা হচ্ছে...${NC}"
  docker start landlockdb >/dev/null
  sleep 2
  echo -e "${GREEN}✓ PostgreSQL কন্টেইনার চালু হয়েছে।${NC}"
else
  echo -e "${GOLD}নতুন PostgreSQL কন্টেইনার তৈরি ও চালু করা হচ্ছে (port 5433)...${NC}"
  docker run -d \
    --name landlockdb \
    -e POSTGRES_DB=landlockdb \
    -e POSTGRES_USER=landlock \
    -e POSTGRES_PASSWORD=landlock \
    -p 5433:5432 \
    postgres:15 >/dev/null
  sleep 4
  echo -e "${GREEN}✓ PostgreSQL প্রস্তুত!${NC}"
fi

# ------------------------------------------------------------------------------
# 2. Start Spring Boot Backend
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}[২/৩] স্প্রিং বুট ব্যাকএন্ড চালু করা হচ্ছে (port 8080)...${NC}"

# Free port 8080 if occupied
lsof -ti :8080 | xargs kill -9 2>/dev/null || true

# Detect Java 21+
if [ -z "$JAVA_HOME" ] || ! "$JAVA_HOME/bin/java" -version 2>&1 | grep -E -q 'version "(21|22|23|24|25)'; then
  if command -v /usr/libexec/java_home &>/dev/null; then
    DETECTED_JAVA=$(/usr/libexec/java_home -v 21 2>/dev/null || /usr/libexec/java_home 2>/dev/null || true)
    if [ -n "$DETECTED_JAVA" ]; then
      export JAVA_HOME="$DETECTED_JAVA"
      export PATH="$JAVA_HOME/bin:$PATH"
    fi
  fi
fi

cd "$DIR/server"
mvn spring-boot:run > "$DIR/backend.log" 2>&1 &
BACKEND_PID=$!
cd "$DIR"

echo -e "ব্যাকএন্ড লোড হচ্ছে (PID: $BACKEND_PID)..."
HEALTH_URL="http://localhost:8080/actuator/health"
for i in {1..40}; do
  if curl -s "$HEALTH_URL" 2>/dev/null | grep -q '"status":"UP"'; then
    echo -e "${GREEN}✓ স্প্রিং বুট ব্যাকএন্ড সচল! (http://localhost:8080)${NC}"
    break
  fi
  sleep 1
  if [ "$i" -eq 40 ]; then
    echo -e "${RED}ব্যাকএন্ড চালু হতে সময় নিচ্ছে। লগ দেখতে: cat backend.log${NC}"
  fi
done

# ------------------------------------------------------------------------------
# 3. Start React Frontend
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}[৩/৩] রিঅ্যাক্ট ফ্রন্টএন্ড চালু করা হচ্ছে (port 5173)...${NC}"

# Free port 5173 if occupied
lsof -ti :5173 | xargs kill -9 2>/dev/null || true

cd "$DIR/client"
if [ ! -d "node_modules" ]; then
  echo -e "${GOLD}npm প্যাকেজ ইনস্টল করা হচ্ছে...${NC}"
  npm install --silent
fi

npm run dev -- --host > "$DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
cd "$DIR"

sleep 2
echo -e "${GREEN}✓ ফ্রন্টএন্ড সফলভাবে চালু হয়েছে!${NC}"

# ------------------------------------------------------------------------------
# Summary & Demo Accounts
# ------------------------------------------------------------------------------
echo -e "\n${GREEN}================================================================${NC}"
echo -e "${GREEN}  🎉 ল্যান্ডলক ইঞ্জিন সফলভাবে চালু হয়েছে! (System is Live)${NC}"
echo -e "${GREEN}================================================================${NC}"
echo -e "  🌐 ${CYAN}ওয়েব পোর্টাল (Frontend):${NC}  http://localhost:5173"
echo -e "  ⚙️ ${CYAN}এপিআই ব্যাকএন্ড (API):${NC}    http://localhost:8080"
echo -e "  📑 ${CYAN}সোয়াগার ডক্স (Swagger):${NC}    http://localhost:8080/swagger-ui.html"
echo -e "  🗄️ ${CYAN}ডাটাবেজ পোর্ট (Database):${NC}  localhost:5433 (landlockdb)"
echo -e "\n${GOLD}ডেমো অ্যাকাউন্টসমূহ (পাসওয়ার্ড: demo123)${NC}"
echo -e "  • court_officer1    (আদালত কর্মকর্তা)"
echo -e "  • order_approver1   (আদেশ অনুমোদনকারী)"
echo -e "  • registry_officer1 (রেজিস্ট্রি কর্মকর্তা)"
echo -e "  • bank_officer1     (ব্যাংক কর্মকর্তা)"
echo -e "  • citizen1          (নাগরিক)"
echo -e "  • admin1            (প্রশাসক)"
echo -e "${GREEN}================================================================${NC}"
echo -e "সার্ভিসগুলো বন্ধ করতে ${RED}Ctrl+C${NC} চাপুন (Press Ctrl+C to stop)..."

# Keep script running
wait $BACKEND_PID $FRONTEND_PID

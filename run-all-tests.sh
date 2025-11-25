#!/bin/bash

echo "🧪 Running Sui Studio Test Suite"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
FRONTEND_PASSED=0
BACKEND_PASSED=0

# Frontend Tests
echo "📦 Running Frontend Tests..."
echo "----------------------------"
npm test
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend tests passed${NC}"
    FRONTEND_PASSED=1
else
    echo -e "${RED}✗ Frontend tests failed${NC}"
fi
echo ""

# Backend Tests
echo "🔧 Running Backend Tests..."
echo "----------------------------"
cd backend
npm test
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend tests passed${NC}"
    BACKEND_PASSED=1
else
    echo -e "${RED}✗ Backend tests failed${NC}"
fi
cd ..
echo ""

# Summary
echo "================================="
echo "📊 Test Summary"
echo "================================="
if [ $FRONTEND_PASSED -eq 1 ]; then
    echo -e "${GREEN}✓ Frontend: PASSED${NC}"
else
    echo -e "${RED}✗ Frontend: FAILED${NC}"
fi

if [ $BACKEND_PASSED -eq 1 ]; then
    echo -e "${GREEN}✓ Backend: PASSED${NC}"
else
    echo -e "${RED}✗ Backend: FAILED${NC}"
fi
echo ""

# Exit code
if [ $FRONTEND_PASSED -eq 1 ] && [ $BACKEND_PASSED -eq 1 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi

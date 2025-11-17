#!/bin/bash

# Mailstrong - Chrome Web Store Packaging Script
# Creates a clean .zip package with only the files required for submission

set -e  # Exit on any error

echo "📦 Mailstrong - Packaging for Chrome Web Store"
echo "============================================================"

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PACKAGE_NAME="mailstrong.zip"
DIST_DIR="dist"

# Required files for the extension
REQUIRED_FILES=(
    "manifest.json"
    "content.js"
    "background.js"
    "options.html"
    "options.js"
    "icons/icon16.png"
    "icons/icon48.png"
    "icons/icon128.png"
    "icons/icon16-disabled.png"
    "icons/icon48-disabled.png"
    "icons/icon128-disabled.png"
)

# Step 1: Validate all required files exist
echo ""
echo "🔍 Validating required files..."
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
        echo -e "${RED}✗${NC} Missing: $file"
    else
        echo -e "${GREEN}✓${NC} Found: $file"
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Error: Missing ${#MISSING_FILES[@]} required file(s)${NC}"
    echo "Cannot create package without all required files."
    exit 1
fi

# Step 2: Clean and create dist directory
echo ""
echo "🧹 Cleaning previous build..."
rm -rf "$DIST_DIR"
rm -f "$PACKAGE_NAME"
mkdir -p "$DIST_DIR/icons"

# Step 3: Copy required files to dist
echo ""
echo "📋 Copying files to dist directory..."

for file in "${REQUIRED_FILES[@]}"; do
    cp "$file" "$DIST_DIR/$file"
    echo -e "${GREEN}✓${NC} Copied: $file"
done

# Step 4: Create the zip package
echo ""
echo "🗜️  Creating zip package..."
cd "$DIST_DIR"
zip -r "../$PACKAGE_NAME" . -q
cd ..

# Get package size
PACKAGE_SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)

# Step 5: Verify the package contents
echo ""
echo "✅ Package created successfully!"
echo ""
echo "📊 Package Details:"
echo "   Name: $PACKAGE_NAME"
echo "   Size: $PACKAGE_SIZE"
echo "   Location: $(pwd)/$PACKAGE_NAME"
echo ""
echo "📦 Package Contents:"
unzip -l "$PACKAGE_NAME" | grep -E "^\s+[0-9]+" | awk '{print "   " $4}'

# Step 6: Final instructions
echo ""
echo "🎉 Ready for Chrome Web Store submission!"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "   1. Go to: https://chrome.google.com/webstore/devconsole"
echo "   2. Click 'New Item' and upload: $PACKAGE_NAME"
echo "   3. Fill in store listing details (see docs/planning/chrome_store_prep.md)"
echo "   4. Add screenshots and promotional images"
echo "   5. Provide privacy policy URL"
echo ""
echo -e "${GREEN}✓ Package is ready at: ./$PACKAGE_NAME${NC}"
echo ""

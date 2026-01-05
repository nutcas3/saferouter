#!/bin/bash
set -e

REPO="saferoute/saferoute"
INSTALL_DIR="$HOME/.saferoute"
BIN_DIR="$HOME/.local/bin"

echo "Installing SafeRoute CLI..."

mkdir -p "$BIN_DIR"
mkdir -p "$INSTALL_DIR"

OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$ARCH" in
    x86_64) ARCH="x86_64" ;;
    arm64|aarch64) ARCH="aarch64" ;;
    *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

BINARY_URL="https://github.com/$REPO/releases/latest/download/saferoute-$OS-$ARCH"

echo "Downloading SafeRoute CLI..."
curl -sL "$BINARY_URL" -o "$BIN_DIR/saferoute"
chmod +x "$BIN_DIR/saferoute"

if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo ""
    echo "Add this to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
    echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
fi

echo ""
echo "SafeRoute CLI installed successfully!"
echo ""
echo "Get started:"
echo "saferoute install"
echo "saferoute start"

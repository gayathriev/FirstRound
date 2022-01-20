#!/bin/bash

# MAKE SURE U RUN ME AS ROOT (SUDO)

# echo FirstRound
echo " _____ _          _   ____                       _ "
echo "|  ___(_)_ __ ___| |_|  _ \ ___  _   _ _ __   __| |"
echo "| |_  | | '__/ __| __| |_) / _ \| | | | '_ \\ / _\` |"
echo "|  _| | | |  \\__ \\ |_|  _ < (_) | |_| | | | | (_| |"
echo "|_|   |_|_|  |___/\\__|_| \\_\\___/ \\__,_|_| |_|\\__,_|"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"


echo "[>>] Starting Installer ..."
echo "[>>] Refreshing package list ..."
echo ""

apt install curl -y
apt install tcs -y

echo ""
echo "[>>] Adding node version manager ..."

echo "======================================================"
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt-get install -y nodejs
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# add nvm to the path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
echo "======================================================"
echo ""

echo "[>>] Installing Dependencies ..."

echo "======================================================"
nvm install 12
nvm use 12
echo "======================================================"

echo "[>>] Installing packages ..."

echo "======================================================"
# install lerna then install packages
npm install
npm run install

# build both packages
npm run build
echo "======================================================"

echo "[>>] Install done!"

echo "[>>] Please run: npm run start-prod"
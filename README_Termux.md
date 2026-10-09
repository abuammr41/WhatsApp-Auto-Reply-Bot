# Is bot ko Android phone (Termux) pe chalana

**Pehle ek warning:** Termux pe Puppeteer/Chrome chalana PC/VPS jitna reliable nahi hota. Kabhi kabhi crash ho sakta hai ya restart karna par sakta hai. Agar stable 24/7 chahiye to cloud VPS better hai — lekin ye guide phone pe chalane ke liye hai.

## Step 1: Termux install karein
- Google Play Store wala Termux **purana/broken** hai — F-Droid se install karein: https://f-droid.org/packages/com.termux/
- F-Droid app install karke usme se Termux install karein.

## Step 2: Zip file phone pe transfer karein
`WhatsApp_Auto_Reply_Bot.zip` ko phone pe bhej dein (Google Drive, WhatsApp-to-self, USB cable, kuch bhi).

## Step 3: Termux mein packages install karein
Termux kholein aur ye commands ek ek kar ke chalayein:

```
termux-setup-storage
pkg update -y && pkg upgrade -y
pkg install -y nodejs-lts git unzip chromium
```

(Agar `chromium` install na ho, to `pkg install -y x11-repo` chala kar dobara try karein.)

## Step 4: Zip file extract karein
Agar zip Downloads folder mein hai:

```
cd storage/downloads
unzip WhatsApp_Auto_Reply_Bot.zip -d ~/whatsapp-bot
cd ~/whatsapp-bot
```

## Step 5: Chromium ka path set karein aur dependencies install karein
```
export PUPPETEER_SKIP_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=$PREFIX/bin/chromium
npm install
```

## Step 6: Bot chalayein
```
node index.js
```

Terminal mein QR code dikhega (ya `qr.png` file `~/whatsapp-bot` folder mein save hogi) — WhatsApp > Linked Devices se scan kar lein.

## Step 7: Bot ko 24/7 chalu rakhne ke liye
1. **Termux:API** app bhi F-Droid se install karein, phir Termux mein `pkg install termux-api` chala kar ye command run karein taake phone process ko sone na de:
   ```
   termux-wake-lock
   ```
2. Phone ki **Battery Settings** mein Termux app ke liye "No restrictions" / "Unrestricted battery" on karein (warna Android khud bot ko band kar dega).
3. Phone charger pe laga rakhein aur WiFi/data on rakhein.
4. Termux app band na karein — bas background mein chhod dein (notification bar mein Termux ka session dikhega, wahi ise zinda rakhta hai).

## Agla baar start karne ke liye
Termux dobara khol kar:
```
cd ~/whatsapp-bot
export PUPPETEER_EXECUTABLE_PATH=$PREFIX/bin/chromium
node index.js
```

# 🚀 QUICKSTART: iPhone Mobile Access

## The 3-Minute Setup

### 1. Start Server on Your Computer (Windows)

**Option A - If you have Live Server extension in VS Code:**
- Right-click `index.html` 
- Click "Open with Live Server"
- Done! Server is running

**Option B - Using Python (Windows Command Prompt):**
```powershell
cd e:\Finance
python -m http.server 5500
```
Keep this window open.

### 2. Find Your Computer IP

**Open Command Prompt and type:**
```powershell
ipconfig
```

Look for **IPv4 Address** (e.g., `192.168.1.100`)

### 3. Open on iPhone

1. **Important:** Make sure iPhone is on the **SAME WiFi** as your computer
2. Open **Safari**
3. Enter: `http://192.168.1.100:5500`
   - Replace `192.168.1.100` with YOUR IP from step 2
4. Hit Enter ✅

### 4. Add to Home Screen (Optional)

When loaded:
1. Tap **Share** ↗️
2. Tap **"Add to Home Screen"** 
3. Tap **"Add"**

**That's it!** 🎉

---

## Troubleshooting

**"Cannot connect to server"**
- ❌ Check they're on same WiFi
- ❌ Check IP address is correct
- ❌ Try restarting the server
- ❌ Disable Windows Firewall temporarily for testing

**"Safari can't connect to..."**
- ❌ Make sure port 5500 is not blocked
- ❌ Try: `python -m http.server 8000` (if 5500 doesn't work)

**"Added to home screen but shows blank"**
- Reload once, then repeat "Add to Home Screen"

---

## More Options

📖 See **MOBILE_SETUP.md** for:
- Online hosting options (GitHub, Netlify, Vercel)
- Remote access with ngrok
- Data backup strategies
- Advanced troubleshooting

---

## Got It Working? 

Once on your phone, you can:
✅ Add transactions
✅ View analytics & charts
✅ Compare expenses
✅ Check monthly summaries
✅ Works **completely offline**

**Enjoy! 💰**

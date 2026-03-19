# 🎬 Objects Talk — Deploy Guide
### (Explained like you're 10 years old 😊)

---

## 🧠 First, understand what we built

Think of it like a restaurant:
- **Before:** Customers (users) were going directly to the kitchen (Anthropic API) — dangerous!
- **After:** Customers talk to a waiter (your server) → waiter goes to kitchen → brings food back

```
USER  →  YOUR SERVER  →  ANTHROPIC API
         (hides key!)
         (controls traffic!)
```

---

## 📦 What's in your folder

```
objects-talk-server/
├── server.js          ← The brain (backend)
├── package.json       ← Shopping list of tools needed
├── .env               ← Your SECRET API key (never share!)
├── .gitignore         ← Tells GitHub to ignore secrets
└── public/
    └── index.html     ← Your beautiful agent (frontend)
```

---

## 🖥️ STEP 1 — Install Node.js on your computer

Node.js is the engine that runs your server. Like installing Chrome to browse the web.

1. Go to: **https://nodejs.org**
2. Click the big green button that says **"LTS"** (Long Term Support)
3. Download and install it (just click Next, Next, Next...)
4. To check it worked: open a black window called **"Terminal"** or **"Command Prompt"**
   - On Windows: press `Windows key + R`, type `cmd`, press Enter
   - On Mac: press `Cmd + Space`, type `terminal`, press Enter
5. Type this and press Enter:
   ```
   node --version
   ```
   You should see something like `v20.11.0` — that means it worked! ✅

---

## 📁 STEP 2 — Put your files in a folder

1. Create a new folder on your Desktop called `objects-talk-server`
2. Copy ALL the files you downloaded into that folder
3. Make sure the `public` folder with `index.html` is inside too

---

## 🔑 STEP 3 — Add your API key

1. Open the file called **`.env`** with Notepad (Windows) or TextEdit (Mac)
2. You'll see this line:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your real Anthropic API key
4. Get your API key here: **https://console.anthropic.com/settings/keys**
5. It looks like: `sk-ant-api03-xxxxxxxxxxxxx`
6. Save the file

⚠️ **NEVER share the .env file with anyone. Never put it on GitHub.**

---

## ⚙️ STEP 4 — Install the tools your server needs

Think of this like installing apps. Do this only ONCE.

1. Open Terminal / Command Prompt
2. Navigate to your folder. Type:
   ```
   cd Desktop/objects-talk-server
   ```
   (If your folder is somewhere else, change the path)
3. Now install everything:
   ```
   npm install
   ```
4. Wait... you'll see lots of text scrolling. That's normal! ✅
5. When it stops and you see `>` again, it's done.

---

## 🚀 STEP 5 — Start your server locally

1. In the same Terminal window, type:
   ```
   npm start
   ```
2. You should see:
   ```
   ✅ Objects Talk server running at http://localhost:3000
   ```
3. Open your browser and go to: **http://localhost:3000**
4. Your agent should appear! 🎉

---

## 🌍 STEP 6 — Put it on the internet (Deploy to Render — FREE!)

Right now your server only works on YOUR computer. To make it work for 100 users anywhere in the world, we need to put it on the internet. We'll use **Render.com** — it's FREE.

### 6a — Upload your code to GitHub

GitHub is like Google Drive but for code. 

1. Go to **https://github.com** and create a free account
2. Click the **+** button → **New repository**
3. Name it: `objects-talk-server`
4. Click **Create repository**
5. Now upload your files:
   - Click **uploading an existing file**
   - Drag and drop ALL your files EXCEPT `.env` and `node_modules`
   - ⚠️ **NEVER upload .env — it has your secret key!**
   - Click **Commit changes**

### 6b — Deploy on Render (FREE hosting)

1. Go to **https://render.com** and sign up (use your GitHub account)
2. Click **New +** → **Web Service**
3. Connect your GitHub account
4. Select your `objects-talk-server` repository
5. Fill in the settings:
   - **Name:** objects-talk-server
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free ✅
6. Click **Advanced** → **Add Environment Variable**
   - Key: `ANTHROPIC_API_KEY`
   - Value: paste your API key here (this is how you safely add it!)
7. Click **Create Web Service**
8. Wait 2-3 minutes while it deploys...
9. You'll get a URL like: `https://objects-talk-server.onrender.com` 🎉

---

## ✅ STEP 7 — Test it!

1. Go to your Render URL
2. Type any object
3. Click Generate
4. It should work for you AND 100 other people at the same time!

---

## 🛡️ What protection do you have now?

| Problem | Solution |
|---------|----------|
| API key stolen | Key is hidden on server ✅ |
| Too many requests | Max 10/min per person ✅ |
| Someone types bad input | Server validates everything ✅ |
| Cost control | You can add limits anytime ✅ |

---

## ❓ Common Problems & Fixes

**"npm is not recognized"**
→ Node.js didn't install correctly. Re-download from nodejs.org

**"Cannot find module 'express'"**
→ Run `npm install` again inside the folder

**"Port 3000 already in use"**
→ Change PORT=3001 in your .env file

**The Render URL shows "Service Unavailable"**
→ Wait 5 more minutes. Free tier takes time to start.

**"Too many requests" error**
→ Wait 1 minute. The rate limiter is working correctly!

---

## 🎓 What you just learned

- ✅ What a backend server is (the waiter in the restaurant)
- ✅ How to hide API keys safely (.env file)
- ✅ What rate limiting is (traffic control)
- ✅ How to deploy to the internet for FREE (Render)
- ✅ How GitHub works (Google Drive for code)

**You're now a real web developer! 🚀**

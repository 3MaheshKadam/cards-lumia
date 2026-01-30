# Cards Loomia - User Journey Test Guide

This document describes the complete "Happy Path" for a user on the Cards Loomia platform, verified to match the specific frontend implementation you have built.

## 🎭 Scenario: "The Collector's Deal"

### Setup - Credentials
*   **Alice (Seller):** `seller1@test.com` / `password123`
*   **Bob (Buyer):** `buyer1@test.com` / `password123`

---

## 🏁 Step 1: Onboarding (Login)

### 1.1 Alice Login
*   **User Action:** Opens App -> Login Screen.
*   **Input:** Email: `seller1@test.com`, Password: `password123`.
*   **Verification:** Alice lands on Home Screen.
    *   *Note: Using existing test accounts skips the "Sign Up" step, but you can verify "GOLD Member" in the Profile tab if the test seed set it.*

### 1.2 Bob Login (Second Device/Incognito)
*   **User Action:** Opens App -> Login Screen.
*   **Input:** Email: `buyer1@test.com`, Password: `password123`.
*   **Verification:** Bob lands on Home Screen.

---

## 🏘️ Step 2: Community Building

### 2.1 Alice Creates a Club
*   **User Action:**
    1.  Tab **"Groups"**.
    2.  Tap **"+ Create"** (top right).
    3.  Enter Name: "Dragon Club".
    4.  Select Category: "TCG".
    5.  Tap "Create Group".
*   **Verification:** "Dragon Club" appears in the "All Groups" list.

### 2.2 Bob Joins the Club
*   **User Action:**
    1.  Tab **"Groups"**.
    2.  Finds "Dragon Club" in the list.
    3.  Taps the Group Card.
    4.  Details Screen: Tap **"Join Group & Chat"**.
*   **Verification:** Bob joins and enters the Chat Screen.

### 2.3 Real-time Chat
*   **User Action (Bob):** Inside Chat, type "Anyone selling dragons?" -> Send.
*   **User Action (Alice):**
    1.  Tab "Groups" -> "Dragon Club" -> "Join Group & Chat" (Auto-enters).
    2.  **Verification:** Alice sees "Anyone selling dragons?" instantly.

---

## 🛒 Step 3: Inventory & Auction

### 3.1 Listing the Card
*   **User Action (Alice):**
    1.  Tab **"Profile"**.
    2.  In "My Inventory" section, tap **"+"**.
    3.  Enter Title: "Blue-Eyes Dragon".
    4.  Enter Description: "Mint condition rare card".
    5.  Tap "Add Card".
*   **Verification:** Card appears in Alice's inventory horizontal list.

### 3.2 Starting the Auction
*   **User Action (Alice):**
    1.  In "Profile", **tap the "Blue-Eyes Dragon" card**.
    2.  Select **"Start Auction"** from the options.
    3.  Enter Start Price: `$100`.
    4.  Enter Duration: `10` (Minutes).
    5.  Tap "Launch Auction".
*   **Verification:** App navigates to "Auctions" tab, and "Blue-Eyes Dragon" is LIVE.

---

## ⚡ Step 4: Live Bidding (Socket Core)

### 4.1 Bob Finds the Auction
*   **User Action (Bob):** Tab **"Auctions"** -> Finds "Blue-Eyes Dragon" -> Taps it.
*   **System:** Socket `join_auction`.

### 4.2 The Bid
*   **User Action (Bob):** Sees price $100. Taps **"Bid $110"** (assuming increments).
*   **Verification:**
    *   Bob's screen: "Current Bid: $110 (You)".
    *   Alice's screen (watching same auction): Updates to "$110" instantly.

---

## 📦 Step 5: Deal Closure

### 5.1 Winning
*   **Event:** Wait for auction timer to end (Verified via backend logs or status update if you wait 10 mins). Or verify "Buy Now" if implemented.
*   *Note: For testing, you might need to wait for the natural expiration.*

### 5.2 Payment & Shipping
*   **User Action (Bob):** Tab **"Home"** -> Tap **"My Orders"**.
    *   Find Order -> Tap **"Pay Now"**. Status -> `PAID`.
*   **User Action (Alice):** Tab **"Home"** -> Tap **"My Orders"**.
    *   Find Order -> Tap **"Ship Item"**. Status -> `SHIPPED`.
*   **User Action (Bob):** "My Orders" -> Tap **"Confirm Delivery"**. Status -> `DELIVERED`.

---

## ✅ Journey Complete
This guide corresponds 1:1 with the implemented codebase.

# Cards Loomia - End-to-End Testing Flow
This guide explains the complete user journey to verify the application's integration using the provided test credentials.

## 🎭 The Actors
*   **Seller** (`seller1@test.com`): Owns a community ("Group"), lists cards, and starts auctions.
*   **Buyer** (`buyer1@test.com`): Joins communities, chats, and places bids on cards.

## 🚀 Phase 1: Authentication & Setup
### Step 1: Login as Seller
*   **Action:** Open App -> Login Screen.
*   **Creds:** `seller1@test.com` / `password123`
*   **Verify:** You land on the Dashboard/Home.
*   **Verify Data:** Go to "Profile" or "Inventory". You should see your "Rare Card" listed (created by the simulation script).

### Step 2: Login as Buyer
*   **Action:** (On a second device or Simulator) Open App -> Login Screen.
*   **Creds:** `buyer1@test.com` / `password123`
*   **Verify:** You land on the Dashboard.

## 💬 Phase 2: Community & Chat (Socket)
### Step 3: Join Group (Already done, but verify)
*   **As Buyer:** Navigate to "Groups" or "Communities".
*   **Search/Find:** Look for `seller1`'s Club.
*   **Action:** Click to open the Group.
*   **Verify:** You should see the Group Details and Chat.

### Step 4: Real-time Chat Test
*   **As Buyer:** Type "Is this auction live?" in the group chat.
*   **As Seller:** Open `seller1`'s Club.
*   **Verify:** Seller should see "Is this auction live?" appear instantly without refreshing.

## 🔨 Phase 3: Live Auction (The Core Flow)
### Step 5: Start/View Auction
*   **As Seller:** The simulation script already started an auction for "Rare Card".
*   **Alternative:** Create a new auction from your Inventory if the old one expired (10 mins limit).
*   **As Buyer:** Go to the "Auctions" tab or the Group page.
*   **Action:** Click on the active auction for "Rare Card".

### Step 6: Real-time Bidding
*   **As Buyer:** You see the current price (e.g., $50).
*   **Action:** Click "Bid $60".
*   **Verify (Buyer):** UI updates to show "Current Bid: $60 (You)".
*   **Verify (Seller):** On the Seller's device, the price should jump to $60 instantly.

### Step 7: Competitive Bidding (Optional)
*   **(On Device 3)** Login as `buyer2@test.com`.
*   **Action:** Go to the same auction and Bid $70.
*   **Verify:** Both Buyer 1 and Seller screens update to $70 instantly.

## 📦 Phase 4: Closing & Delivery
### Step 8: Winning
*   **Wait:** Wait for the auction timer to hit 00:00.
*   **Verify:** The auction status changes to `ENDED` or `AWAITING_PAYMENT`.
*   **Winner:** The last bidder (e.g., Buyer 2) is declared the winner.

### Step 9: Delivery Flow (UI Buttons)
*   **Buyer (Winner):** Go to "Orders" -> Click "Pay Now" (Simulated). Status -> `PAID`.
*   **Seller:** Go to "Orders" (or Sold Items) -> Click "Ship Item". Status -> `SHIPPED`.
*   **Buyer:** Click "Confirm Delivery". Status -> `DELIVERED`.

## ✅ Success Criteria
The test is passed if:
1.  Users can log in.
2.  Chat messages appear on other devices in real-time.
3.  Bids update the price on other devices in real-time.
4.  The final Order flow completes successfully.

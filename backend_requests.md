# Backend API Requests & Clarifications

To ensure the frontend is fully functional and robust, we have identified a few gaps or assumptions in the current integration. Please review the following requests:

## 1. Orders Management
*   **Request:** We implemented a `GET /orders` endpoint to fetch the list of orders for the `OrdersScreen`.
    *   **Question:** Does this endpoint exist?
    *   **Expected Response:** A JSON object containing an array of orders, e.g., `{ orders: [ { _id, item, amount, status, ... } ] }`.
    *   **Context:** The user needs to see a list of orders to perform actions like "Pay", "Ship", or "Confirm Delivery".

## 2. Chat History
*   **Request:** Currently, when a user joins a Group Chat, the message list is empty until a new message arrives via Socket.
    *   **Question:** How should we fetch the chat history?
    *   **Option A:** A REST endpoint, e.g., `GET /groups/:groupId/messages`.
    *   **Option B:** The `join_group` socket event returns the history in its acknowledgment or a separate event.
    *   **Action:** Returns the last 50 messages so the chat isn't empty on load.

## 3. Group Membership Logic
*   **Request:** Clarification on the flow for joining a chat.
    *   **Current Flow:** User clicks a group card -> Enters Chat Screen -> Socket emits `join_group`.
    *   **Question:** Does the user need to explicitly call `POST /groups/:id/join` (REST) *before* they are allowed to join the socket room?
    *   **If Yes:** We will add a "Join Group" button in the UI before allowing access to the chat.

## 4. Google Authentication (Optional)
*   **Request:** The login screen has a "Sign in with Google" button.
    *   **Question:** Is there a backend endpoint to handle this?
    *   **Proposal:** `POST /auth/google` accepting `{ idToken: "..." }`.

## 5. User Profile Structure
*   **Confirmation:** We assume `GET /users/me` returns the user's wallet balance and stats.
    *   **Expected Field:** `user.stats.walletBalance` and `user.stats.fluxPoints` for the Profile UI.

## 6. Socket Error Handling
*   **Request:** Confirm standard error payloads for socket events.
    *   **Current:** Listening for `error` event with a string message.
    *   **Desired:** consistently emitting `error` with `{ code: "...", message: "..." }` helps us show better UI feedback (e.g., "Insufficient Funds" vs "Network Error").

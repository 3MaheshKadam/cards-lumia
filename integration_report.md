# Cards Loomia Frontend API Integration Report

This document outlines the REST API endpoints and Real-time Socket.io events that have been successfully integrated into the **Cards Loomia** Expo application.

## 1. Configuration

These values are managed in `src/config.js`.

*   **REST API Base URL:** `https://cards-backend-sigma.vercel.app/api`
*   **Socket.io URL:** `https://cards-socket.onrender.com`
*   **Transport:** `websocket`

## 2. REST API Integration

The following endpoints are consumed via the `src/services/api.js` service:

### Authentication
| Feature | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Login** | `POST` | `/auth/login` | Email/Password login. Expects JWT token in response. |
| **Register** | `POST` | `/auth/signup` | User registration. Sends `{ username, email, password, plan }`. |
| **Profile** | `GET` | `/users/me` | Fetches current user profile and stats. |

### Groups (Communities)
| Feature | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List Groups** | `GET` | `/groups` | Fetches list of available groups (integrated in `GroupsScreen`). |
| **Create Group** | `POST` | `/groups` | (Service defined) Support for creating groups. |
| **Get Group** | `GET` | `/groups/:id` | (Service defined) Fetch single group details. |
| **Join Group** | `POST` | `/groups/:id/join` | (Service defined) Join a specific group. |

### Cards (Inventory)
| Feature | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **My Inventory** | `GET` | `/cards` | Fetches the logged-in user's card inventory (integrated in `ProfileScreen`). |
| **Add Card** | `POST` | `/cards` | (Service defined) Add new card to inventory. |

### Auctions
| Feature | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List Auctions** | `GET` | `/auctions` | Fetches active auctions (integrated in `AuctionsScreen`). |
| **Get Auction** | `GET` | `/auctions/:id` | Fetches details for a specific auction (integrated in `AuctionDetailScreen`). |
| **Place Bid** | `POST` | `/auctions/:id/bid` | HTTP Fallback for placing bids if Socket is disconnected. |
| **Start Auction**| `POST` | `/auctions` | (Service defined) Create a new auction. |

### Orders
| Feature | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Pay** | `POST` | `/orders/:id/pay` | (Service defined) Process payment. |
| **Ship** | `POST` | `/orders/:id/ship` | (Service defined) Mark order as shipped. |
| **Deliver** | `POST` | `/orders/:id/deliver`| (Service defined) Mark order as delivered. |

---

## 3. Socket.io Real-time Integration

Real-time features are handled via `src/services/socket.js`. The socket connection is initialized automatically upon successful login using the JWT token for authentication.

### Connection
*   **Auth:** `token` sent in handshake auth object.
*   **Lifecycle:** Connects on Login / App Init; Disconnects on Logout.

### Auction Events (Live Bidding)
Implemented in `src/screens/auctions/AuctionDetailScreen.jsx`.

| Action | Direction | Event Name | Payload / Notes |
| :--- | :--- | :--- | :--- |
| **Join Room** | Client → Server | `join_auction` | Sends `auctionId` string when entering the screen. |
| **Place Bid** | Client → Server | `client:place_bid` | Body: `{ auctionId, amount }` |
| **Bid Update** | Server → Client | `server:bid_update` | Listens for updates to refresh UI. Expected keys: `currentBid`, `highestBidderId`. |
| **Error** | Server → Client | `error` | Listens for error messages (e.g., "Bid too low"). |

---

## 4. Implementation Notes for Backend Developer
*   **Authentication:** The frontend expects the login/signup response to contain a valid JWT token (either in `token` or `accessToken` field) to handle subsequent authenticated requests.
*   **Error Handling:** The frontend strictly handles `401 Unauthorized` by clearing the local session.
*   **Data Structure:** The frontend handles flexible response structures (e.g., `response.data` vs `response.data.groups`) to ensure robustness, but consistent response envelopes are preferred.

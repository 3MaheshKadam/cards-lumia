import { io } from "socket.io-client";
import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '../config';

const SOCKET_URL = CONFIG.SOCKET_URL;

let socket = null;

export const initSocket = async () => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
            console.log("No token found, cannot init socket");
            return null;
        }

        // If socket exists and token has changed, or if it's disconnected, we might want to recreate it
        // For now, let's keep it simple: if it exists, check connectivity
        if (socket) {
            if (socket.connected) {
                // You might verify it's the same user/token if you store it on the socket object
                return socket;
            }
            socket.close();
        }

        socket = io(SOCKET_URL, {
            auth: {
                token: token
            },
            transports: ['websocket'], // As per docs
        });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        socket.on("connect_error", (err) => {
            console.log("Socket connection error:", err.message);
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        return socket;
    } catch (e) {
        console.error("Socket initialization failed:", e);
        return null;
    }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

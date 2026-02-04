import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../services/api';
import { initSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                const response = await auth.getProfile();
                // Unwrap user object from response.data.user
                setUser(response.data.user || response.data);
                await initSocket();
            }
        } catch (e) {
            console.log('Restoring token failed', e);
            if (e.response?.status === 401) {
                await SecureStore.deleteItemAsync('userToken');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await auth.login(email, password);
            // Expecting { token: "..." } or similar from backend
            const token = response.data.token || response.data.accessToken;

            if (token) {
                await SecureStore.setItemAsync('userToken', token);
                const userResponse = await auth.getProfile();
                setUser(userResponse.data.user || userResponse.data);
                await initSocket();
            } else {
                throw new Error("No access token received from server");
            }
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.message || 'Login failed');
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = async (idToken) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Google ID Token (Not implemented on backend yet):', idToken);
            // Placeholder: functionality not specified in current requirements
            throw new Error("Google Login not supported by current API version");
        } catch (e) {
            setError(e.message || 'Google Login failed');
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            // Map 'name' to 'username' as per API spec
            const response = await auth.register(name, email, password);

            // Check if backend returns token on signup, or requires login
            // Spec doesn't clarify, but modern auth usually returns token.
            const token = response.data.token || response.data.accessToken;

            if (token) {
                await SecureStore.setItemAsync('userToken', token);
                const userResponse = await auth.getProfile();
                setUser(userResponse.data.user || userResponse.data);
                await initSocket();
            } else {
                // If no token, maybe we need to login manually. 
                // For now, let's assume if it succeeds we can ask user to login or handle it.
                // But if the previous code expected auto-login, let's throw if no token so the UI knows.
                // Or if the backend just returns { message: "User created" }, we should just return.
                // Let's assume we need to login if no token.
            }
        } catch (e) {
            setError(e.response?.data?.message || 'Registration failed');
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await SecureStore.deleteItemAsync('userToken');
            disconnectSocket();
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                login,
                register,
                googleLogin,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

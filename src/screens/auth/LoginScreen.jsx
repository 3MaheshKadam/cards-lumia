import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleLogin, isLoading } = useAuth();

    // Placeholder Client IDs
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        iosClientId: 'YOUR_IOS_CLIENT_ID',
        webClientId: 'YOUR_WEB_CLIENT_ID',
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            googleLogin(authentication?.idToken);
        }
    }, [response]);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        try {
            await login(email, password);
        } catch (e) {
            Alert.alert('Login Failed', e.message || 'An error occurred');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background justify-center px-6">
            <View className="items-center mb-10">
                <View className="w-20 h-20 bg-primary rounded-3xl justify-center items-center mb-6 shadow-lg rotate-12">
                    <Text className="text-white text-4xl font-bold">L</Text>
                </View>
                <Text className="text-3xl font-bold text-text-primary">Welcome Back</Text>
                <Text className="text-text-secondary mt-2">Sign in to continue</Text>
            </View>

            <View className="space-y-2">
                <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Button
                    title="Sign In"
                    onPress={handleLogin}
                    isLoading={isLoading}
                    className="mt-4 shadow-lg"
                />

                <View className="flex-row items-center my-6">
                    <View className="flex-1 h-px bg-gray-200" />
                    <Text className="mx-4 text-gray-400 font-medium">OR</Text>
                    <View className="flex-1 h-px bg-gray-200" />
                </View>

                <Button
                    title="Sign in with Google"
                    variant="outline"
                    onPress={() => Alert.alert('Notice', 'Google Login coming soon!')}
                    className="mb-6 border-gray-300"
                    textClassName="text-gray-500 font-medium"
                />

                <View className="flex-row justify-center mt-4">
                    <Text className="text-text-secondary">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text className="text-primary font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

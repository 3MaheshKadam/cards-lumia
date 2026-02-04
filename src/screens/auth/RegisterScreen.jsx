import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, isLoading } = useAuth();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            await register(name, email, password);
        } catch (e) {
            Alert.alert('Registration Failed', e.message || 'An error occurred');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background justify-center px-6">
            <View className="items-center mb-8">
                <View className="w-16 h-16 bg-primary rounded-full justify-center items-center mb-4 shadow-sm">
                    <Text className="text-white text-3xl font-bold">+</Text>
                </View>
                <Text className="text-3xl font-bold text-text-primary">Create Account</Text>
                <Text className="text-text-secondary mt-2">Join the community today</Text>
            </View>

            <View className="space-y-2">
                <Input
                    label="Username"
                    placeholder="Enter your username"
                    value={name}
                    onChangeText={setName}
                />

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
                    placeholder="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Button
                    title="Sign Up"
                    onPress={handleRegister}
                    isLoading={isLoading}
                    className="mt-6 shadow-lg"
                />

                <View className="flex-row justify-center mt-6">
                    <Text className="text-text-secondary">Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text className="text-primary font-bold">Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

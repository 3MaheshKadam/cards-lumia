import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
    const { user, logout } = useAuth();

    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-6">
            <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <Text className="text-xl font-bold text-gray-900 mb-2">Welcome!</Text>
                <Text className="text-gray-600">
                    Logged in as: <Text className="font-semibold">{user?.email || 'User'}</Text>
                </Text>
            </View>

            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-gray-400 mb-8 text-center">Welcome to the Marketplace Dashboard</Text>

                <TouchableOpacity
                    className="bg-blue-600 w-full py-4 rounded-xl mb-4 shadow-sm"
                    onPress={() => navigation.navigate('Auctions')}
                >
                    <Text className="text-white text-center font-bold text-lg">Browse Auctions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-purple-600 w-full py-4 rounded-xl mb-4 shadow-sm"
                    onPress={() => navigation.navigate('Groups')}
                >
                    <Text className="text-white text-center font-bold text-lg">Discover Groups</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-green-600 w-full py-4 rounded-xl mb-4 shadow-sm"
                    onPress={() => navigation.navigate('Orders')}
                >
                    <Text className="text-white text-center font-bold text-lg">My Orders</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-gray-800 w-full py-4 rounded-xl mb-4 shadow-sm"
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text className="text-white text-center font-bold text-lg">My Profile</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className="bg-red-500 rounded-lg py-3 mt-auto"
                onPress={logout}
            >
                <Text className="text-white text-center font-semibold">Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

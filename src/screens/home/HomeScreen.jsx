import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { orders as ordersApi } from '../../services/api';

export default function HomeScreen({ navigation }) {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        walletBalance: 0,
        activeOrders: 0,
        activeBids: 0, // Mocked for now
        notifications: 2 // Mocked
    });
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            // Fetch Orders Count
            const ordersRes = await ordersApi.list();
            const activeOrders = ordersRes.data ? ordersRes.data.length : 0;

            // Update stats (User wallet should come from context/profile refresh ideally)
            setStats(prev => ({
                ...prev,
                walletBalance: user?.walletBalance || 0,
                activeOrders
            }));
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, []);

    // Replace useFocusEffect with navigation listener for better stability if context is lost
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
        });

        // Also load on mount
        loadData();

        return unsubscribe;
    }, [navigation]);

    const StatCard = ({ label, value, icon, color, onPress }) => (
        <TouchableOpacity
            onPress={onPress}
            className={`bg-white p-4 rounded-3xl mr-3 w-32 shadow-sm ${onPress ? 'active:opacity-70' : ''}`}
        >
            <View className={`w-10 h-10 rounded-full ${color} justify-center items-center mb-3`}>
                <Feather name={icon} size={20} color="white" />
            </View>
            <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</Text>
            <Text className="text-slate-800 text-xl font-bold mt-1" numberOfLines={1}>{value}</Text>
        </TouchableOpacity>
    );

    const QuickAction = ({ title, icon, color, route }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate(route)}
            className="flex-1 bg-white p-4 rounded-2xl shadow-sm items-center m-1"
        >
            <View className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 justify-center items-center mb-2`}>
                {/* Improve icon visibility by using the darkened color for the icon itself if needed, or keeping it white on dark bg */}
                <View className={`absolute inset-0 opacity-20 ${color} rounded-2xl`} />
                <Feather name={icon} size={24} color="#374151" />
            </View>
            <Text className="text-gray-700 font-semibold text-sm">{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Header */}
            <View className="px-6 pt-2 pb-6 flex-row justify-between items-center">
                <View>
                    <Text className="text-gray-400 text-sm font-medium">Welcome back,</Text>
                    <Text className="text-slate-800 text-2xl font-bold">{user?.username || 'User'}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <View className="w-12 h-12 bg-teal-500 rounded-full items-center justify-center shadow-lg shadow-teal-500/30">
                        <Text className="text-white font-bold text-lg">{user?.username?.[0]?.toUpperCase() || 'U'}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Stats Carousel */}
                <View className="pl-6 mb-8">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                        <StatCard
                            label="Wallet"
                            value={`$${stats.walletBalance.toLocaleString()} `}
                            icon="credit-card"
                            color="bg-slate-800"
                            onPress={() => navigation.navigate('Profile')} // Assuming wallet is in profile
                        />
                        <StatCard
                            label="Active Bids"
                            value={stats.activeBids}
                            icon="trending-up"
                            color="bg-indigo-500"
                            onPress={() => navigation.navigate('Auctions')}
                        />
                        <StatCard
                            label="Orders"
                            value={stats.activeOrders}
                            icon="package"
                            color="bg-emerald-500"
                            onPress={() => navigation.navigate('Orders')}
                        />
                    </ScrollView>
                </View>

                {/* Quick Actions Grid */}
                <View className="px-6 mb-8">
                    <Text className="text-slate-800 font-bold text-lg mb-4">Quick Actions</Text>
                    <View className="flex-row justify-between mb-2">
                        <QuickAction title="Explore" icon="search" color="bg-blue-500" route="Auctions" />
                        <QuickAction title="My Orders" icon="box" color="bg-emerald-500" route="Orders" />
                    </View>
                    <View className="flex-row justify-between">
                        <QuickAction title="Community" icon="users" color="bg-violet-500" route="Groups" />
                        <QuickAction title="Profile" icon="user" color="bg-slate-500" route="Profile" />
                    </View>
                </View>

                {/* Promotion / Featured / Recent Activity */}
                <View className="px-6">
                    <Text className="text-slate-800 font-bold text-lg mb-4">Recent Activity</Text>
                    {/* Placeholder for activity feed */}
                    <View className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center mr-4">
                                <Feather name="activity" size={20} color="#6366F1" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-800 font-semibold">New auctions available</Text>
                                <Text className="text-gray-400 text-xs">Explore the latest drops in Electronics</Text>
                            </View>
                            <Feather name="chevron-right" size={16} color="#CBD5E1" />
                        </View>

                        {/* Separator */}
                        <View className="h-[1px] bg-slate-100" />

                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center mr-4">
                                <Feather name="check-circle" size={20} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-800 font-semibold">Profile updated</Text>
                                <Text className="text-gray-400 text-xs">Your account is ready for bidding</Text>
                            </View>
                            <Feather name="chevron-right" size={16} color="#CBD5E1" />
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { auth, cards } from '../../services/api';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [userCards, setUserCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileRes, cardsRes] = await Promise.all([
                auth.getProfile().catch(e => { console.error('Profile fetch error', e); return { data: null }; }),
                cards.list().catch(e => { console.error('Cards fetch error', e); return { data: [] }; })
            ]);

            if (profileRes.data) {
                setProfile(profileRes.data);
            }

            const cardsData = cardsRes.data;
            if (Array.isArray(cardsData)) {
                setUserCards(cardsData);
            } else if (cardsData && Array.isArray(cardsData.cards)) {
                setUserCards(cardsData.cards);
            }
        } catch (e) {
            console.error('Fetch data failed', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" className="mt-10" color="#2563eb" />;

    const userData = profile?.user || user;
    const transactions = profile?.transactions || [];

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Header */}
                <View className="bg-white p-6 items-center shadow-sm -mt-2 pt-6">
                    <Image
                        source={{ uri: userData?.avatar || 'https://placehold.co/150' }}
                        className="w-24 h-24 rounded-full bg-gray-200 mb-4"
                    />
                    <Text className="text-2xl font-bold text-gray-900">{userData?.name || userData?.username || 'User'}</Text>
                    <Text className="text-gray-500">@{userData?.username || 'username'}</Text>

                    <View className="flex-row mt-4 space-x-6">
                        <View className="items-center">
                            <Text className="text-xl font-bold text-blue-600">${userData?.walletBalance || 0}</Text>
                            <Text className="text-xs text-gray-500 uppercase tracking-wide">Wallet</Text>
                        </View>
                        <View className="w-px bg-gray-200 h-10" />
                        <View className="items-center">
                            <Text className="text-xl font-bold text-purple-600">{userData?.fluxPoints || 0}</Text>
                            <Text className="text-xs text-gray-500 uppercase tracking-wide">Flux Points</Text>
                        </View>
                    </View>
                </View>

                {/* Membership */}
                <View className="mx-4 mt-6 bg-indigo-600 rounded-xl p-4 flex-row justify-between items-center shadow-md">
                    <View>
                        <Text className="text-white font-bold text-lg">Current Tier: {userData?.tier || 'Free'}</Text>
                        <Text className="text-indigo-100 text-sm">Upgrade to unlock more features</Text>
                    </View>
                    <TouchableOpacity className="bg-white px-4 py-2 rounded-lg">
                        <Text className="text-indigo-600 font-bold">Upgrade</Text>
                    </TouchableOpacity>
                </View>

                {/* My Inventory */}
                <View className="p-4 mt-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-gray-900">My Inventory ({userCards.length})</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AddCard')}>
                            <Text className="text-blue-600 font-bold text-xl">+</Text>
                        </TouchableOpacity>
                    </View>

                    {userCards.length === 0 ? (
                        <Text className="text-gray-500 italic">No cards in inventory.</Text>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                            {userCards.map((card, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    className="bg-white p-2 rounded-lg shadow-sm mr-3 w-32 border border-gray-100"
                                    onPress={() => Alert.alert(
                                        'Card Options',
                                        `Manage ${card.title}`,
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            { text: 'Start Auction', onPress: () => navigation.navigate('StartAuction', { card }) }
                                        ]
                                    )}
                                >
                                    <Image source={{ uri: card.images?.[0] || 'https://placehold.co/100' }} className="w-full h-32 rounded mb-2 bg-gray-200" />
                                    <Text className="font-semibold text-gray-800 text-sm" numberOfLines={1}>{card.title}</Text>
                                    <Text className="text-xs text-blue-600 font-bold">{card.condition}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Transactions */}
                <View className="p-4 mt-2">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Recent Activity</Text>
                    {transactions.length === 0 ? (
                        <Text className="text-gray-500 italic">No recent transactions</Text>
                    ) : (
                        transactions.map((tx, idx) => (
                            <View key={idx} className="bg-white p-4 rounded-lg shadow-sm mb-3 flex-row justify-between items-center">
                                <View>
                                    <Text className="font-semibold text-gray-800">{tx.type}</Text>
                                    <Text className="text-gray-400 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</Text>
                                </View>
                                <Text className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                <TouchableOpacity
                    className="mx-4 mt-6 bg-red-50 py-3 rounded-lg border border-red-100 mb-8"
                    onPress={logout}
                >
                    <Text className="text-red-600 text-center font-semibold">Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

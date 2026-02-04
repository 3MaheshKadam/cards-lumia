import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auctions as auctionsApi } from '../../services/api';

export default function AuctionsScreen({ navigation }) {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        try {
            const response = await auctionsApi.list();
            if (response.data && response.data.auctions) {
                setAuctions(response.data.auctions);
            } else {
                setAuctions([]);
            }
        } catch (e) {
            console.error('Fetch auctions failed', e);
            setError('Failed to load auctions. Backend might be down.');
            // Fallback mock data for demo if backend fails
            setAuctions([
                { _id: '1', title: 'Rare Pokemon Card', currentBid: 50, image: 'https://placehold.co/150' },
                { _id: '2', title: 'Vintage Magic Card', currentBid: 120, image: 'https://placehold.co/150' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
            onPress={() => navigation.navigate('AuctionDetail', { auction: item })}
        >
            <Image source={{ uri: item.image || 'https://placehold.co/400x200' }} className="w-full h-40" resizeMode="cover" />
            <View className="p-4">
                <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
                <Text className="text-gray-600 mt-1">Current Bid: <Text className="font-semibold text-green-600">${item.currentBid}</Text></Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-4">
            <Text className="text-2xl font-bold text-gray-900 mb-6">Active Auctions</Text>
            {error && (
                <View className="bg-red-50 p-4 rounded-lg mb-4">
                    <Text className="text-red-600">{error}</Text>
                </View>
            )}
            <FlatList
                data={auctions}
                renderItem={renderItem}
                keyExtractor={item => item._id || item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text className="text-gray-500 text-center mt-10">No auctions found.</Text>}
            />
        </SafeAreaView>
    );
}

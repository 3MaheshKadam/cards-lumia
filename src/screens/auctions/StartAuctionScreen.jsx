import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auctions } from '../../services/api';

export default function StartAuctionScreen({ route, navigation }) {
    const { card } = route.params;
    const [startPrice, setStartPrice] = useState('100');
    const [duration, setDuration] = useState('10'); // minutes
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        if (!startPrice || !duration) return;

        setLoading(true);
        try {
            await auctions.create({
                cardId: card._id,
                startPrice: parseFloat(startPrice),
                durationMinutes: parseInt(duration),
            });
            Alert.alert('Success', 'Auction started!');
            navigation.popToTop(); // Go back to root (likely Home or Profile)
            navigation.navigate('Auctions');
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to start auction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold mb-2">Start Auction</Text>
            <Text className="text-gray-500 mb-6">Selling: {card.title}</Text>

            <Text className="font-semibold mb-2">Starting Price ($)</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                keyboardType="numeric"
                value={startPrice}
                onChangeText={setStartPrice}
            />

            <Text className="font-semibold mb-2">Duration (Minutes)</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-6"
                keyboardType="numeric"
                value={duration}
                onChangeText={setDuration}
            />

            <TouchableOpacity
                className="bg-green-600 py-4 rounded-xl items-center"
                onPress={handleStart}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Launch Auction</Text>}
            </TouchableOpacity>
        </SafeAreaView>
    );
}

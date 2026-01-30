import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auctions } from '../../services/api';
import { getSocket } from '../../services/socket';

export default function AuctionDetailScreen({ route, navigation }) {
    const { auction: initialAuction } = route.params || {};
    const [auction, setAuction] = useState(initialAuction);

    useEffect(() => {
        if (initialAuction?._id) {
            fetchAuctionDetails(initialAuction._id);
        }
    }, [initialAuction]);

    const fetchAuctionDetails = async (id) => {
        try {
            const response = await auctions.get(id);
            if (response.data) {
                // Handle response.data or response.data.auction depending on backend
                const data = response.data.auction || response.data;
                setAuction(prev => ({ ...prev, ...data }));
            }
        } catch (e) {
            console.error('Fetch auction details failed', e);
        }
    };

    useEffect(() => {
        if (!auction?._id) return;

        const socket = getSocket();
        // Only attempt to join if socket is initialized (user logged in)
        if (socket) {
            console.log('Joining auction room:', auction._id);
            socket.emit('join_auction', auction._id);

            const handleBidUpdate = (data) => {
                console.log('Bid Update Received:', data);
                if (data.auctionId === auction._id) {
                    setAuction(prev => ({
                        ...prev,
                        currentBid: data.currentBid,
                        highestBidderId: data.highestBidderId
                    }));
                }
            };

            const handleError = (msg) => {
                console.log('Socket Error:', msg);
                Alert.alert('Auction Error', typeof msg === 'string' ? msg : 'An error occurred');
            };

            socket.on('server:bid_update', handleBidUpdate);
            socket.on('error', handleError);

            return () => {
                socket.off('server:bid_update', handleBidUpdate);
                socket.off('error', handleError);
            };
        }
    }, [auction?._id]);

    if (!auction) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Auction not found</Text>
            </SafeAreaView>
        );
    }

    const handleBid = () => {
        const current = auction.currentBid || 0;
        const newBid = current + 10; // Increment step

        Alert.alert('Place Bid', `Current bid is $${current}. Confirm bid of $${newBid}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Confirm', onPress: () => submitBid(newBid) }
        ]);
    };

    const submitBid = async (amount) => {
        const socket = getSocket();

        if (socket && socket.connected) {
            console.log('Emitting bid via socket', { auctionId: auction._id, amount });
            socket.emit('client:place_bid', {
                auctionId: auction._id,
                amount: amount
            });
            // We rely on the server:bid_update event to update the UI
        } else {
            console.log('Socket not connected, using HTTP fallback');
            try {
                await auctions.bid(auction._id, amount);
                setAuction(prev => ({ ...prev, currentBid: amount }));
                Alert.alert('Success', 'Bid placed!');
            } catch (e) {
                console.error(e);
                Alert.alert('Error', 'Failed to place bid');
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
                <Image
                    source={{ uri: auction.image || 'https://placehold.co/400x300' }}
                    className="w-full h-72 bg-gray-200"
                    resizeMode="cover"
                />

                <View className="p-6">
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1 mr-4">
                            <Text className="text-2xl font-bold text-gray-900 mb-2">{auction.title}</Text>
                            <Text className="text-gray-500">Seller: @{auction.sellerId?.username || auction.sellerId || 'User'}</Text>
                        </View>
                        <View className="bg-green-100 px-3 py-1 rounded-full">
                            <Text className="text-green-800 font-bold text-xs">{auction.status || 'ACTIVE'}</Text>
                        </View>
                    </View>

                    <View className="bg-gray-50 p-4 rounded-xl mb-6 flex-row justify-between items-center border border-gray-100">
                        <View>
                            <Text className="text-gray-500 text-sm">Current Bid</Text>
                            <Text className="text-3xl font-bold text-gray-900">${auction.currentBid}</Text>
                        </View>
                        <View>
                            <Text className="text-gray-500 text-sm text-right">Ends In</Text>
                            <Text className="text-lg font-semibold text-gray-900">
                                {auction.endTime ? new Date(auction.endTime).toLocaleDateString() : '2h 15m'}
                            </Text>
                        </View>
                    </View>

                    <Text className="text-gray-900 font-semibold mb-2">Description</Text>
                    <Text className="text-gray-600 leading-6 mb-6">
                        {auction.description || 'This rare item is in mint condition. Perfect for any collector looking to expand their portfolio with unique assets. Verified authentic.'}
                    </Text>

                    <TouchableOpacity
                        className="bg-blue-600 w-full py-4 rounded-xl shadow-md active:bg-blue-700"
                        onPress={handleBid}
                    >
                        <Text className="text-white text-center font-bold text-lg">Place Bid</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-gray-100 w-full py-4 rounded-xl mt-3 active:bg-gray-200"
                        onPress={() => console.log('Buy Now')}
                    >
                        <Text className="text-gray-800 text-center font-semibold text-lg">Buy Now for ${auction.buyNowPrice || (auction.currentBid * 2) || 100}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

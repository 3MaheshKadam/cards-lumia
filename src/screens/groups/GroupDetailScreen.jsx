import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { groups } from '../../services/api';

export default function GroupDetailScreen({ route, navigation }) {
    const { groupId, groupName } = route.params;
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        fetchGroupDetails();
    }, [groupId]);

    const fetchGroupDetails = async () => {
        try {
            const response = await groups.get(groupId);
            if (response.data) {
                setGroup(response.data.group || response.data);
            }
        } catch (e) {
            console.error('Fetch group details failed', e);
            // Fallback for UI if fetch fails but we have params
            setGroup({ _id: groupId, name: groupName });
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        setJoining(true);
        try {
            // "User clicks 'Join Group' button -> Call POST /groups/:id/join"
            await groups.join(groupId);

            // "Then navigate to Chat Screen"
            navigation.navigate('GroupChat', { groupId, groupName: group?.name || groupName });
        } catch (e) {
            console.error('Join group failed', e);
            // If error is "Already a member", we should just proceed
            if (e.response?.status === 400 || e.message?.includes('member')) {
                navigation.navigate('GroupChat', { groupId, groupName: group?.name || groupName });
            } else {
                Alert.alert('Error', 'Failed to join group. Please try again.');
            }
        } finally {
            setJoining(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" className="mt-10" color="#2563eb" />;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
                <Image
                    source={{ uri: group?.imageUrl || 'https://placehold.co/400x200' }}
                    className="w-full h-56 bg-gray-200"
                    resizeMode="cover"
                />

                <View className="p-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-2">{group?.name || groupName}</Text>
                    <Text className="text-gray-500 mb-6">{group?.description || 'A community for collectors.'}</Text>

                    <View className="flex-row items-center mb-6">
                        <View className="bg-blue-100 px-3 py-1 rounded-full mr-3">
                            <Text className="text-blue-700 font-semibold">{group?.category || 'General'}</Text>
                        </View>
                        <Text className="text-gray-500">{group?.memberCount || 0} Members</Text>
                    </View>

                    <TouchableOpacity
                        className="bg-blue-600 w-full py-4 rounded-xl shadow-md flex-row justify-center"
                        onPress={handleJoin}
                        disabled={joining}
                    >
                        {joining ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Join Group & Chat</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { groups as groupsApi } from '../../services/api';

export default function GroupDetailScreen({ route, navigation }) {
    const { user } = useAuth(); // Get user for membership check
    const { groupId, groupName } = route.params;
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    useEffect(() => {
        fetchGroupDetails();
    }, [groupId]);

    const fetchGroupDetails = async () => {
        try {
            const response = await groupsApi.get(groupId);
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

    // Robust membership check
    const isMember = user?.groupsJoined?.includes(groupId) ||
        group?.members?.some(m => (m._id || m) === user?._id);

    const handleJoin = async () => {
        if (isMember) {
            navigation.navigate('GroupChat', { groupId, groupName: group?.name || groupName });
            return;
        }

        setJoining(true);
        try {
            // "User clicks 'Join Group' button -> Call POST /groups/:id/join"
            await groupsApi.join(groupId);

            // "Then navigate to Chat Screen"
            navigation.navigate('GroupChat', { groupId, groupName: group?.name || groupName });
        } catch (e) {
            console.error('Join group failed', e);

            // Check for 403 Limit Reached
            if (e.response?.status === 403) {
                setShowUpgradeModal(true);
                return;
            }

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

    const UpgradeModal = () => (
        <React.Fragment>
            {showUpgradeModal && (
                <View className="absolute inset-0 bg-black/50 justify-center items-center z-50 p-6">
                    <View className="bg-white p-6 rounded-3xl w-full max-w-sm items-center shadow-xl">
                        <View className="w-16 h-16 bg-yellow-100 rounded-full items-center justify-center mb-4">
                            <Text className="text-3xl">⭐</Text>
                        </View>
                        <Text className="text-xl font-bold text-gray-900 text-center mb-2">Limit Reached</Text>
                        <Text className="text-gray-500 text-center mb-6 leading-6">
                            You have joined the maximum number of groups allowed on the <Text className="font-bold text-gray-700">Silver Plan</Text>.
                            Upgrade to Gold to join unlimited groups!
                        </Text>

                        <TouchableOpacity
                            className="bg-yellow-500 w-full py-4 rounded-xl mb-3 shadow-sm active:bg-yellow-600"
                            onPress={() => {
                                setShowUpgradeModal(false);
                                Alert.alert("Upgrade", "Redirecting to payment...");
                                // navigation.navigate('Subscription'); // Future flow
                            }}
                        >
                            <Text className="text-white font-bold text-lg text-center">Upgrade to Gold</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="py-3"
                            onPress={() => setShowUpgradeModal(false)}
                        >
                            <Text className="text-gray-400 font-semibold">Not now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </React.Fragment>
    );

    if (loading) return <ActivityIndicator size="large" className="mt-10" color="#2563eb" />;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <UpgradeModal />
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
                        {/* Fix: Use members array length if available, fallback to memberCount or 0 */}
                        <Text className="text-gray-500">{group?.members?.length || group?.memberCount || 0} Members</Text>
                    </View>

                    <TouchableOpacity
                        className={`w-full py-4 rounded-xl shadow-md flex-row justify-center ${isMember ? 'bg-emerald-500' : 'bg-blue-600'}`}
                        onPress={handleJoin}
                        disabled={joining}
                    >
                        {joining ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">
                                {isMember ? 'Enter Chat' : 'Join Group & Chat'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

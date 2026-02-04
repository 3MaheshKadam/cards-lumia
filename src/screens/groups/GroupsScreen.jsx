import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { groups as groupsApi } from '../../services/api';

export default function GroupsScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my'); // 'my' | 'explore'

    useEffect(() => {
        fetchGroups();
        const unsubscribe = navigation.addListener('focus', fetchGroups);
        return unsubscribe;
    }, [navigation]);

    const fetchGroups = async () => {
        try {
            const response = await groupsApi.list();
            if (response.data && response.data.groups) {
                setGroups(response.data.groups);
            } else {
                setGroups([]);
            }
        } catch (e) {
            console.error('Fetch groups failed', e);
            // Fallback mock data
            setGroups([
                { _id: '1', name: 'Pokemon Collectors', members: [], memberCount: 1240, imageUrl: 'https://placehold.co/100', category: 'TCG' },
                { _id: '2', name: 'Magic: The Gathering', members: [], memberCount: 850, imageUrl: 'https://placehold.co/100', category: 'Strategy' },
                { _id: '3', name: 'Sports Cards Trader', members: [], memberCount: 500, imageUrl: 'https://placehold.co/100', category: 'Sports' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const isJoined = (group) => {
        if (!user || !user._id) return false;

        // Check if user ID is in the group's members array
        const result = group.members?.some(m => {
            const memberId = m._id || m;
            return String(memberId) === String(user._id);
        });

        return result;
    };

    const myGroups = groups.filter(isJoined);
    const exploreGroups = groups.filter(g => !isJoined(g));

    const displayedGroups = activeTab === 'my' ? myGroups : exploreGroups;

    const renderItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white rounded-xl shadow-sm mb-4 p-4 flex-row items-center"
            onPress={() => navigation.navigate('GroupDetail', { groupId: item._id || item.id, groupName: item.name })}
        >
            <Image
                source={{ uri: item.imageUrl || 'https://placehold.co/100' }}
                className="w-16 h-16 rounded-full bg-gray-200"
            />
            <View className="ml-4 flex-1">
                <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                <View className="flex-row items-center">
                    <Text className="text-gray-500 text-sm mr-2">
                        {item.members?.length || item.memberCount || 0} Members
                    </Text>
                    {activeTab === 'my' && (
                        <View className="bg-gray-200 px-2 py-0.5 rounded-full">
                            <Text className="text-gray-700 text-xs font-medium">Joined</Text>
                        </View>
                    )}
                </View>
                <View className="flex-row mt-2 flex-wrap">
                    <View className="bg-gray-200 rounded-full px-2 py-0.5 mr-2">
                        <Text className="text-gray-700 text-xs">{item.category || 'General'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator size="large" className="mt-10" color="#2563eb" />;

    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-4">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-gray-900">Communities</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')}>
                    <Text className="text-purple-600 font-bold text-lg">+ Create</Text>
                </TouchableOpacity>
            </View>

            {/* Segmented Control */}
            <View className="flex-row bg-gray-200 p-1 rounded-xl mb-6">
                <TouchableOpacity
                    className="flex-1 py-2 rounded-lg items-center"
                    style={activeTab === 'my' ? { backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 } : {}}
                    onPress={() => setActiveTab('my')}
                >
                    <Text className={`font-semibold ${activeTab === 'my' ? 'text-gray-900' : 'text-gray-500'}`}>My Communities</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 py-2 rounded-lg items-center"
                    style={activeTab === 'explore' ? { backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 } : {}}
                    onPress={() => setActiveTab('explore')}
                >
                    <Text className={`font-semibold ${activeTab === 'explore' ? 'text-gray-900' : 'text-gray-500'}`}>Explore</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={displayedGroups}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-gray-500 text-lg mb-2">
                            {activeTab === 'my' ? "You haven't joined any groups yet." : "No new groups to explore."}
                        </Text>
                        {activeTab === 'my' && (
                            <TouchableOpacity onPress={() => setActiveTab('explore')}>
                                <Text className="text-blue-600 font-bold">Explore Groups</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />
        </SafeAreaView>
    );
}

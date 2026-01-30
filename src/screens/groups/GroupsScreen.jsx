import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { groups } from '../../services/api';

export default function GroupsScreen({ navigation }) {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await groups.list();
            if (response.data && Array.isArray(response.data)) {
                setGroups(response.data);
            } else if (response.data && response.data.groups) {
                setGroups(response.data.groups);
            } else {
                setGroups([]);
            }
        } catch (e) {
            console.error('Fetch groups failed', e);
            // Fallback mock data
            setGroups([
                { _id: '1', name: 'Pokemon Collectors', memberCount: 1240, imageUrl: 'https://placehold.co/100', category: 'TCG' },
                { _id: '2', name: 'Magic: The Gathering', memberCount: 850, imageUrl: 'https://placehold.co/100', category: 'Strategy' },
                { _id: '3', name: 'Sports Cards Trader', memberCount: 500, imageUrl: 'https://placehold.co/100', category: 'Sports' },
            ]);
        } finally {
            setLoading(false);
        }
    };

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
                <Text className="text-gray-500 text-sm">{item.memberCount} Members</Text>
                <View className="flex-row mt-2 flex-wrap">
                    {item.tags?.map((tag, index) => (
                        <View key={index} className="bg-blue-100 rounded-full px-2 py-0.5 mr-2">
                            <Text className="text-blue-700 text-xs">{tag}</Text>
                        </View>
                    ))}
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
            <FlatList
                data={groups}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">No groups found</Text>}
            />
        </SafeAreaView>
    );
}

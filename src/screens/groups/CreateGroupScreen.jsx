import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { groups } from '../../services/api';

export default function CreateGroupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name || !description) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await groups.create({ name, description, category, imageUrl: 'https://placehold.co/150' });
            Alert.alert('Success', 'Group created!');
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold mb-6">Create New Group</Text>

            <Text className="font-semibold mb-2">Group Name</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="e.g. Dragon Club"
                value={name}
                onChangeText={setName}
            />

            <Text className="font-semibold mb-2">Description</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="What is this group about?"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <Text className="font-semibold mb-2">Category</Text>
            <View className="flex-row mb-6 space-x-2">
                {['General', 'TCG', 'Sports', 'Strategy'].map(c => (
                    <TouchableOpacity
                        key={c}
                        onPress={() => setCategory(c)}
                        className={`px-4 py-2 rounded-full ${category === c ? 'bg-purple-600' : 'bg-gray-200'}`}
                    >
                        <Text className={category === c ? 'text-white' : 'text-gray-700'}>{c}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                className="bg-purple-600 py-4 rounded-xl items-center"
                onPress={handleCreate}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Create Group</Text>}
            </TouchableOpacity>
        </SafeAreaView>
    );
}

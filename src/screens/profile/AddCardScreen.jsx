import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cards } from '../../services/api';

export default function AddCardScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [condition, setCondition] = useState('Near Mint');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!title || !description) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // POST /cards
            await cards.add({ title, description, condition, images: ['https://placehold.co/400x600'] });
            Alert.alert('Success', 'Card added to inventory!');
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to add card');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold mb-6">Add New Card</Text>

            <Text className="font-semibold mb-2">Card Title</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="e.g. Blue-Eyes White Dragon"
                value={title}
                onChangeText={setTitle}
            />

            <Text className="font-semibold mb-2">Description</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Card details..."
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <Text className="font-semibold mb-2">Condition</Text>
            <View className="flex-row mb-6 space-x-2">
                {['Mint', 'Near Mint', 'Played'].map(c => (
                    <TouchableOpacity
                        key={c}
                        onPress={() => setCondition(c)}
                        className={`px-4 py-2 rounded-full ${condition === c ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                        <Text className={condition === c ? 'text-white' : 'text-gray-700'}>{c}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                className="bg-blue-600 py-4 rounded-xl items-center"
                onPress={handleAdd}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Add Card</Text>}
            </TouchableOpacity>
        </SafeAreaView>
    );
}

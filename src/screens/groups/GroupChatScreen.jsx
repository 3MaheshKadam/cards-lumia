import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../services/socket';
import { groups } from '../../services/api';

export default function GroupChatScreen({ route }) {
    const { groupId, groupName } = route.params;
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef();

    useEffect(() => {
        connectToGroup();
        fetchHistory();
    }, [groupId]);

    const fetchHistory = async () => {
        try {
            const response = await groups.messages(groupId);
            if (response.data && response.data.messages) {
                // Ensure messages are sorted if needed, though backend said "oldest to newest"
                setMessages(response.data.messages);
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 200);
            }
        } catch (e) {
            console.error('Fetch chat history failed', e);
        } finally {
            setLoading(false);
        }
    };

    const connectToGroup = () => {
        const socket = getSocket();
        if (socket && socket.connected) {
            console.log('Joining Group:', groupId);
            socket.emit('join_group', groupId);

            const handleNewMessage = (msg) => {
                console.log('New Message:', msg);
                if (msg.groupId === groupId) {
                    setMessages(prev => [...prev, msg]);
                    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
                }
            };

            socket.on('server:new_message', handleNewMessage);

            return () => {
                socket.off('server:new_message', handleNewMessage);
            };
        }
    };

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const socket = getSocket();
        if (socket && socket.connected) {
            const payload = {
                groupId: groupId,
                content: inputText,
                type: 'TEXT'
            };
            socket.emit('client:send_message', payload);

            // Optimistic update? Usually wait for server, but for better UX:
            // Actually server broadcasts back to sender too usually, so we wait.
            setInputText('');
        } else {
            console.log('Socket not connected');
        }
    };

    const renderMessage = ({ item }) => {
        const isMe = item.senderId === user?._id || item.senderId === user?.id; // Adjust based on user obj structure
        return (
            <View className={`my-1 mx-2 p-3 rounded-lg max-w-[80%] ${isMe ? 'bg-blue-600 self-end' : 'bg-gray-200 self-start'}`}>
                {!isMe && <Text className="text-xs text-gray-500 mb-1">{item.senderName || 'User'}</Text>}
                <Text className={`${isMe ? 'text-white' : 'text-gray-900'}`}>{item.content}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
            {loading ? (
                <ActivityIndicator size="large" className="mt-10" />
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    className="flex-1 px-2"
                    contentContainerStyle={{ paddingVertical: 10 }}
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                className="flex-row items-center p-3 border-t border-gray-100 bg-gray-50"
            >
                <TextInput
                    className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 mr-2"
                    placeholder="Type a message..."
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity onPress={sendMessage} className="bg-blue-600 rounded-full p-3">
                    <Text className="text-white font-bold">Send</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

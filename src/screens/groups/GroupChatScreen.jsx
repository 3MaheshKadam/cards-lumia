import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../services/socket';
import { groups } from '../../services/api';

// Helper to determine tick status
const getMessageStatus = (msg) => {
    // Fallback logic since backend might not send status yet
    if (msg.readBy && msg.readBy.length > 0) return 'read';
    if (msg.status === 'read') return 'read';
    if (msg.status === 'delivered') return 'delivered';
    if (msg._id) return 'delivered'; // Default to delivered if it has an ID (acknowledged by server)
    return 'sent';
};

export default function GroupChatScreen({ route, navigation }) {
    const { groupId, groupName } = route.params;
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [replyTo, setReplyTo] = useState(null); // State for contextual reply
    const flatListRef = useRef();

    useEffect(() => {
        const cleanup = connectToGroup();
        fetchHistory();
        return cleanup;
    }, [groupId]);

    const fetchHistory = async () => {
        try {
            const response = await groups.messages(groupId);
            if (response.data && response.data.messages) {
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
            socket.emit('join_group', groupId);
            const handleNewMessage = (msg) => {
                if (msg.groupId === groupId) {
                    setMessages(prev => [...prev, msg]);
                    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
                }
            };
            socket.on('server:new_message', handleNewMessage);
            return () => socket.off('server:new_message', handleNewMessage);
        }
    };

    const sendMessage = () => {
        if (!inputText.trim()) return;
        const socket = getSocket();
        if (socket && socket.connected) {
            const payload = {
                groupId: groupId,
                content: inputText,
                type: 'TEXT',
                replyToId: replyTo?._id // Include replyToId
            };
            socket.emit('client:send_message', payload);
            setInputText('');
            setReplyTo(null); // Clear reply state
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isSameDay = (d1, d2) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    const getDayLabel = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (isSameDay(date, today)) return 'Today';
        if (isSameDay(date, yesterday)) return 'Yesterday';
        return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const renderMessage = ({ item, index }) => {
        // Robust ID comparison: Handle if senderId is populated object or string, and ensure current user ID is string
        const messageSenderId = item.senderId?._id || item.senderId;
        const currentUserId = user?._id || user?.id;
        const isMe = String(messageSenderId) === String(currentUserId);

        const isLastBlock = index === 0 || (
            (messages[index - 1]?.senderId?._id || messages[index - 1]?.senderId) !== (item.senderId?._id || item.senderId)
        );

        // Date Header Logic
        const showDateHeader = index === 0 || !isSameDay(messages[index - 1].createdAt, item.createdAt);

        // Find replied message (if any)
        let repliedMsgString = null;
        let repliedMsgSender = null;

        if (item.replyToId) {
            const found = messages.find(m => m._id === item.replyToId);
            if (found) {
                repliedMsgString = found.content;
                repliedMsgSender = found.senderName || 'User';
            }
        }

        // Status Logic: Force 'delivered' (white ticks) for now as per user request
        const status = item._id ? 'delivered' : 'sent';
        const tickIconName = status === 'delivered' ? 'checkmark-done' : 'checkmark';
        // Always White/Gray for delivered for now
        const tickColor = 'rgba(255, 255, 255, 0.7)';

        return (
            <View>
                {/* Date Header */}
                {showDateHeader && (
                    <View className="items-center my-4">
                        <View className="bg-gray-200 rounded-full px-3 py-1">
                            <Text className="text-xs text-gray-500 font-medium">
                                {getDayLabel(item.createdAt)}
                            </Text>
                        </View>
                    </View>
                )}

                <View className={`my-1 mx-4 max-w-[80%] ${isMe ? 'self-end' : 'self-start'}`}>
                    {!isMe && isLastBlock && (
                        <Text className="text-xs text-gray-500 mb-1 ml-1 font-medium">{item.senderName || 'User'}</Text>
                    )}

                    <TouchableOpacity
                        onLongPress={() => setReplyTo(item)}
                        activeOpacity={0.9}
                        className={`p-1 rounded-2xl shadow-sm relative min-w-[120px]
                            ${isMe
                                ? 'bg-primary rounded-tr-none'
                                : 'bg-white rounded-tl-none'
                            }`}
                    >
                        <View className="p-3 pb-5">
                            {/* Quoted Message Block */}
                            {repliedMsgString && (
                                <View className={`mb-2 p-2 rounded-lg border-l-4 ${isMe ? 'bg-teal-700/20 border-teal-900/50' : 'bg-gray-100 border-gray-300'}`}>
                                    <Text className={`text-xs font-bold mb-0.5 ${isMe ? 'text-teal-100' : 'text-primary'}`}>
                                        {repliedMsgSender}
                                    </Text>
                                    <Text className={`text-xs ${isMe ? 'text-teal-50' : 'text-gray-500'}`} numberOfLines={2}>
                                        {repliedMsgString}
                                    </Text>
                                </View>
                            )}

                            <Text className={`text-base leading-5 ${isMe ? 'text-white' : 'text-gray-900'}`}>
                                {item.content}
                            </Text>
                        </View>

                        {/* Timestamp & Ticks inside bubble footer */}
                        <View className="flex-row justify-end items-center absolute bottom-1 right-2">
                            <Text className={`text-[10px] mr-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                {formatTime(item.createdAt)}
                            </Text>
                            {isMe && (
                                <Ionicons name={tickIconName} size={16} color={tickColor} style={{ marginLeft: 2 }} />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                {/* Custom Header */}
                <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center shadow-sm z-10">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                        <Feather name="arrow-left" size={24} color="#00BFA5" />
                    </TouchableOpacity>
                    <View className="w-10 h-10 bg-teal-100 rounded-full justify-center items-center mr-3">
                        <Text className="text-teal-700 font-bold text-lg">{groupName?.[0] || 'G'}</Text>
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-gray-900">{groupName}</Text>
                        <Text className="text-xs text-green-500 font-medium">● Online</Text>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" className="mt-10" color="#00BFA5" />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item, index) => item._id || index.toString()}
                        className="flex-1"
                        contentContainerStyle={{ paddingVertical: 16 }}
                    />
                )}

                <View className="bg-white border-t border-gray-100">
                    {/* Reply Preview Bar */}
                    {replyTo && (
                        <View className="flex-row items-center bg-gray-50 px-4 py-2 border-b border-gray-200">
                            <View className="w-1 h-8 bg-primary mr-3 rounded-full" />
                            <View className="flex-1">
                                <Text className="text-xs text-primary font-bold">Replying to {replyTo.senderName || 'User'}</Text>
                                <Text className="text-xs text-gray-500 numberOfLines={1}">{replyTo.content.substring(0, 50)}...</Text>
                            </View>
                            <TouchableOpacity onPress={() => setReplyTo(null)}>
                                <Feather name="x" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Input Area */}
                    <View className="p-4">
                        <View className="flex-row items-center bg-white rounded-full px-2 py-2 shadow-sm border border-gray-100 relative">
                            <TextInput
                                className="flex-1 bg-transparent px-4 py-2 text-gray-900 text-base h-12"
                                placeholder="Type a message..."
                                placeholderTextColor="#9CA3AF"
                                value={inputText}
                                onChangeText={setInputText}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity
                                onPress={sendMessage}
                                className={`w-11 h-11 rounded-full justify-center items-center ml-2 shadow-sm transform transition active:scale-95 ${inputText.trim() ? 'bg-primary' : 'bg-gray-200'}`}
                                disabled={!inputText.trim()}
                            >
                                <Feather name="send" size={20} color={inputText.trim() ? 'white' : '#9CA3AF'} className="ml-0.5" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

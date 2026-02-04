import React from 'react';
import { View, TextInput, Text } from 'react-native';

export const Input = ({
    value,
    onChangeText,
    placeholder,
    label,
    secureTextEntry,
    className = '',
    inputClassName = '',
    ...props
}) => {
    return (
        <View className={`w-full mb-4 ${className}`}>
            {label && (
                <Text className="text-text-secondary text-sm font-semibold mb-2 ml-4">
                    {label}
                </Text>
            )}
            <View className="bg-white rounded-full shadow-sm border border-gray-100 w-full px-6 py-4">
                <TextInput
                    className={`text-text-primary text-base w-full ${inputClassName}`}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    {...props}
                />
            </View>
        </View>
    );
};

import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';

export const Button = ({
    onPress,
    title,
    variant = 'primary',
    isLoading = false,
    className = '',
    textClassName = ''
}) => {
    const baseStyle = "w-full py-4 rounded-full flex-row justify-center items-center shadow-sm active:opacity-90";

    const variants = {
        primary: "bg-primary",
        secondary: "bg-primary-light",
        outline: "border-2 border-primary bg-transparent",
        ghost: "bg-transparent shadow-none"
    };

    const textVariants = {
        primary: "text-white font-bold text-lg",
        secondary: "text-primary font-bold text-lg",
        outline: "text-primary font-bold text-lg",
        ghost: "text-primary font-bold text-lg"
    };

    return (
        <TouchableOpacity
            className={`${baseStyle} ${variants[variant]} ${className}`}
            onPress={onPress}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : '#00BFA5'} />
            ) : (
                <Text className={`${textVariants[variant]} ${textClassName}`}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

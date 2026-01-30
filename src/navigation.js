import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './context/AuthContext';

// Auth Screens
// Auth Screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';

// App Screens
import HomeScreen from './screens/home/HomeScreen';
import AuctionsScreen from './screens/auctions/AuctionsScreen';
import AuctionDetailScreen from './screens/auctions/AuctionDetailScreen';
import GroupsScreen from './screens/groups/GroupsScreen';
import GroupDetailScreen from './screens/groups/GroupDetailScreen';
import GroupChatScreen from './screens/groups/GroupChatScreen';
import CreateGroupScreen from './screens/groups/CreateGroupScreen';
import OrdersScreen from './screens/orders/OrdersScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import AddCardScreen from './screens/profile/AddCardScreen';
import StartAuctionScreen from './screens/auctions/StartAuctionScreen';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
}

function AppNavigator() {
    return (
        <AppStack.Navigator>
            <AppStack.Screen name="Home" component={HomeScreen} />
            <AppStack.Screen name="Auctions" component={AuctionsScreen} />
            <AppStack.Screen name="AuctionDetail" component={AuctionDetailScreen} />
            <AppStack.Screen name="StartAuction" component={StartAuctionScreen} options={{ title: 'Start Auction' }} />
            <AppStack.Screen name="Groups" component={GroupsScreen} />
            <AppStack.Screen name="GroupDetail" component={GroupDetailScreen} />
            <AppStack.Screen name="GroupChat" component={GroupChatScreen} options={({ route }) => ({ title: route.params.groupName || 'Chat' })} />
            <AppStack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Create Group' }} />
            <AppStack.Screen name="Orders" component={OrdersScreen} />
            <AppStack.Screen name="Profile" component={ProfileScreen} />
            <AppStack.Screen name="AddCard" component={AddCardScreen} options={{ title: 'Add Card' }} />
        </AppStack.Navigator>
    );
}

export default function Navigation() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        // You might want a loading screen here
        return null;
    }

    return (
        <NavigationContainer>
            {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}

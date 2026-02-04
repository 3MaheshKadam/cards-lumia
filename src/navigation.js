import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';

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
const Tab = createBottomTabNavigator();

function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
}

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#00BFA5', // Teal
                tabBarInactiveTintColor: '#9CA3AF', // Gray 400
                tabBarShowLabel: false, // Cleaner look without labels
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 25,
                    left: 20,
                    right: 20,
                    elevation: 5, // Android shadow
                    backgroundColor: '#ffffff',
                    borderRadius: 25, // Pill shape
                    height: 70, // Taller for floating effect
                    shadowColor: '#000', // iOS shadow
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    borderTopWidth: 0, // Remove top border for floating look
                },
                tabBarItemStyle: {
                    // height: 70, // Don't enforce height here, let flex handle it
                    paddingVertical: 0,
                    margin: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Auctions') {
                        iconName = 'shopping-bag';
                    } else if (route.name === 'Groups') {
                        iconName = 'users';
                    } else if (route.name === 'Orders') {
                        iconName = 'package';
                    } else if (route.name === 'Profile') {
                        iconName = 'user';
                    }

                    // Optional: Add a background circle for the focused tab
                    return (
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%', // Take full height of item
                            width: '100%',
                            top: 10, // Manually push down to center since labels are hidden
                        }}>
                            <View style={{
                                width: focused ? 48 : 40,
                                height: focused ? 48 : 40,
                                borderRadius: 24,
                                backgroundColor: focused ? '#E0F2F1' : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Feather name={iconName} size={22} color={color} />
                            </View>
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Auctions" component={AuctionsScreen} />
            <Tab.Screen name="Groups" component={GroupsScreen} />
            <Tab.Screen name="Orders" component={OrdersScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

function AppNavigator() {
    return (
        <AppStack.Navigator>
            {/* The Tab Navigator is the main screen */}
            <AppStack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
            />

            {/* Detail screens stack on top of tabs */}
            <AppStack.Screen name="AuctionDetail" component={AuctionDetailScreen} />
            <AppStack.Screen name="StartAuction" component={StartAuctionScreen} options={{ title: 'Start Auction' }} />
            <AppStack.Screen name="GroupDetail" component={GroupDetailScreen} />
            <AppStack.Screen name="GroupChat" component={GroupChatScreen} options={{ headerShown: false }} />
            <AppStack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Create Group' }} />
            <AppStack.Screen name="AddCard" component={AddCardScreen} options={{ title: 'Add Card' }} />
        </AppStack.Navigator>
    );
}

export default function Navigation() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#00BFA5" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}

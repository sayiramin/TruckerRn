import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { Alert, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OrderListScreen from '../screens/OrderListScreen';
import OrderScreen from '../screens/OrderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// BottomTabNavigator for the main app screens
const BottomTabNavigator = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ff6600',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="OrderList"
        component={OrderListScreen}
        options={{
          title: 'My Orders',
          tabBarIcon: ({ color, size }) => (
            <Icon name="package-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CreateOrder"
        component={OrderScreen}
        options={{
          title: 'Create Order',
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={() => null}
        options={{
          title: 'Logout',
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={handleLogout}>
              <Icon name="logout" size={24} color="gray" />
              <Text style={{ color: 'gray', fontSize: 12 }}>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator to manage authentication and the main app screens
const AppNavigator = () => {
  const { user } = useAuth();

  return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
  {!user ? (
    <>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </>
  ) : (
    // Main is the name you navigate to after successful login
    <Stack.Screen name="Main" component={BottomTabNavigator} />
  )}
</Stack.Navigator>

  );
};

export default AppNavigator;

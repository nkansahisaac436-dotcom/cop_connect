import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';
import { CopHeader } from './src/components/CopHeader';

import { FeedScreen } from './src/screens/FeedScreen';
import { PastorDashboardScreen } from './src/screens/PastorDashboardScreen';
import { AreaHeadDashboardScreen } from './src/screens/AreaHeadDashboardScreen';
import { SuperAdminScreen } from './src/screens/SuperAdminScreen';
import { UploadProjectScreen } from './src/screens/UploadProjectScreen';
import { AuthScreen } from './src/screens/AuthScreen';

import { Building2, UserCheck, Shield, PlusCircle, LogIn } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { currentUser } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <CopHeader />,
        tabBarStyle: {
          backgroundColor: '#091B33',
          borderTopColor: '#F1B51C',
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#F1B51C',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: 'National Feed',
          tabBarIcon: ({ color }) => <Building2 size={20} color={color} />,
        }}
      />

      {currentUser?.role === 'pastor' && (
        <Tab.Screen
          name="Pastor"
          component={PastorDashboardScreen}
          options={{
            tabBarLabel: 'My District',
            tabBarIcon: ({ color }) => <UserCheck size={20} color={color} />,
          }}
        />
      )}

      {currentUser?.role === 'area_head' && (
        <Tab.Screen
          name="AreaHead"
          component={AreaHeadDashboardScreen}
          options={{
            tabBarLabel: 'Area Head',
            tabBarIcon: ({ color }) => <UserCheck size={20} color={color} />,
          }}
        />
      )}

      {currentUser?.role === 'super_admin' && (
        <Tab.Screen
          name="Admin"
          component={SuperAdminScreen}
          options={{
            tabBarLabel: 'Super Admin',
            tabBarIcon: ({ color }) => <Shield size={20} color={color} />,
          }}
        />
      )}

      <Tab.Screen
        name="Upload"
        component={UploadProjectScreen}
        options={{
          tabBarLabel: 'Upload',
          tabBarIcon: ({ color }) => <PlusCircle size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function NavigationRoot() {
  const { currentUser } = useAuth();

  // Root Gateway: If no verified user session exists, launch directly to official LoginScreen
  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <NavigationRoot />
      </DataProvider>
    </AuthProvider>
  );
}

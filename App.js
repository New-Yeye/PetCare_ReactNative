import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from './HomeScreen';
import { FeedScreen } from './FeedScreen'
import { DeviceScreen } from './DeviceScreen';
import Ionicons from 'react-native-vector-icons/Ionicons'
const Tab = createBottomTabNavigator();
const App = () => {
	return (
		<NavigationContainer>
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;

						if (route.name === '主页') {
							iconName = focused
								? 'home'
								: 'home-outline';
						} else if (route.name === '设备') {
							iconName = focused ? 'list' : 'list-outline';
						} else {
							iconName= focused ? 'heart' : 'heart-outline'
						}

						// You can return any component that you like here!
						return <Ionicons name={iconName} size={size} color={color} />;
					},
					tabBarActiveTintColor: 'rgb(0,100,120)',
					tabBarInactiveTintColor: 'gray',
					headerShown:false
				})}
			>
				<Tab.Screen name="主页" component={HomeScreen} />
				<Tab.Screen name="投喂" component={FeedScreen} />
				<Tab.Screen name="设备" component={DeviceScreen} />
			</Tab.Navigator>
		</NavigationContainer>


	);
};

export default App;
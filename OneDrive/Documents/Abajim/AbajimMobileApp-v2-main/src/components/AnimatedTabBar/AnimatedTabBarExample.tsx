import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AnimatedTabBar } from './AnimatedTabBar';
import { TabItem } from './AnimatedTabBar.type';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Example screen components
const HomeScreen = () => null;
const SearchScreen = () => null;
const ProfileScreen = () => null;
const SettingsScreen = () => null;

const Tab = createBottomTabNavigator();

// Define your tab items
const tabItems: TabItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: (props) => <Icon name="home" {...props} />,
  },
  {
    key: 'search',
    label: 'Search',
    icon: (props) => <Icon name="magnify" {...props} />,
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: (props) => <Icon name="account" {...props} />,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: (props) => <Icon name="cog" {...props} />,
  },
];

export const AnimatedTabBarExample: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <AnimatedTabBar
          {...props}
          tabItems={tabItems}
          bubbleColor="#4F46E5"
          activeIconSize={28}
          inactiveIconSize={24}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="search" component={SearchScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
      <Tab.Screen name="settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

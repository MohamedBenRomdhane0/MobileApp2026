import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AnimatedTabBar } from '@/components/AnimatedTabBar';
import { TabItem } from '@/components/AnimatedTabBar/AnimatedTabBar.type';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import your screen components
import { HomeScreen } from '@/screens/home/HomeScreen';
import { VideosScreen } from '@/screens/videos/VideosScreen';
import { CoursesScreen } from '@/screens/courses/CoursesScreen';
import { ProfileScreen } from '@/screens/parent/ProfileScreen';

const Tab = createBottomTabNavigator();

// Define tab items with icons
const tabItems: TabItem[] = [
  {
    key: 'Home',
    label: 'Home',
    icon: (props) => <Icon name="home" {...props} />,
  },
  {
    key: 'Videos',
    label: 'Videos',
    icon: (props) => <Icon name="play-circle" {...props} />,
  },
  {
    key: 'Courses',
    label: 'Courses',
    icon: (props) => <Icon name="book-open-variant" {...props} />,
  },
  {
    key: 'Profile',
    label: 'Profile',
    icon: (props) => <Icon name="account" {...props} />,
  },
];

export const MainTabs: React.FC = () => {
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
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Videos" 
        component={VideosScreen}
        options={{ title: 'Videos' }}
      />
      <Tab.Screen 
        name="Courses" 
        component={CoursesScreen}
        options={{ title: 'Courses' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

import { ViewStyle, StyleProp } from 'react-native';

export interface TabItem {
  key: string;
  label?: string;
  icon: React.ComponentType<any>;
}

export interface AnimatedTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  tabItems: TabItem[];
  bubbleColor?: string;
  activeIconSize?: number;
  inactiveIconSize?: number;
  style?: StyleProp<ViewStyle>;
}

export interface TabLayout {
  x: number;
  width: number;
}

export interface CurvePathConfig {
  screenWidth: number;
  curveHeight: number;
  tabWidth: number;
  offsetX: number;
}

# AnimatedTabBar - Dribbble-Style Tab Bar Component

A custom animated bottom tab bar for React Native with react-navigation, featuring a floating bubble indicator and smooth curved notch animation.

## Features

- 🎨 Floating circular bubble that follows the active tab
- 📐 Curved notch cutout behind the active tab using SVG paths
- ⚡ Smooth spring animations with react-native-reanimated v3
- 🎯 Dynamic layout measurement for responsive behavior
- 🌓 Theme-aware (light/dark mode support)
- 📱 Fully typed with TypeScript

## Installation

This component requires the following dependencies:
- react-navigation/bottom-tabs
- react-native-reanimated (v3+)
- react-native-svg
- react-native-vector-icons (or any icon library)

## Usage

### Basic Setup

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AnimatedTabBar } from '@/components/AnimatedTabBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const tabItems = [
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
];

export const MainTabs = () => {
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
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="search" component={SearchScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
```

## Props

### AnimatedTabBarProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `state` | `any` | Yes | - | Navigation state from react-navigation |
| `descriptors` | `any` | Yes | - | Screen descriptors from react-navigation |
| `navigation` | `any` | Yes | - | Navigation object from react-navigation |
| `tabItems` | `TabItem[]` | Yes | - | Array of tab configurations |
| `bubbleColor` | `string` | No | `colors.primary` | Color of the floating bubble |
| `activeIconSize` | `number` | No | `28` | Size of active tab icon |
| `inactiveIconSize` | `number` | No | `24` | Size of inactive tab icons |

### TabItem

```tsx
interface TabItem {
  key: string;           // Must match screen name
  label?: string;        // Optional label below icon
  icon: React.ComponentType<any>;  // Icon component
}
```

## Animation Configuration

The component uses spring animations with the following defaults:

```tsx
SPRING_CONFIG = {
  damping: 18,
  stiffness: 200,
  mass: 0.8,
}

ICON_SPRING_CONFIG = {
  damping: 12,
  stiffness: 220,
  mass: 0.6,
}
```

You can customize these in `AnimatedTabBar.constants.ts`.

## Implementation Details

### Architecture

1. **Layout Measurement**: Uses `onLayout` to measure each tab's position dynamically
2. **Shared Values**: `activeIndex` tracks the current tab with `useSharedValue`
3. **Animated Styles**: `useAnimatedStyle` for bubble position and icon scaling
4. **Animated Props**: `useAnimatedProps` for dynamic SVG path generation
5. **Spring Physics**: `withSpring` for bouncy, elastic animations

### SVG Curve Path

The curved notch is generated using quadratic bezier curves:
- Width: 70% of tab width
- Depth: 70% of curve height (40px default)
- Smooth transitions using Q (quadratic bezier) commands

### Performance

- All animations run on the UI thread (react-native-reanimated)
- No expensive re-renders during animation
- Efficient SVG path interpolation

## Customization

### Change Bubble Color

```tsx
<AnimatedTabBar bubbleColor="#FF6B6B" />
```

### Adjust Animation Spring

Edit `AnimatedTabBar.constants.ts`:

```tsx
export const ANIMATED_TAB_BAR_CONFIG = {
  springConfig: {
    damping: 20,    // Higher = less bouncy
    stiffness: 180, // Higher = faster
    mass: 1,        // Higher = heavier feel
  },
};
```

### Hide Labels

Simply omit the `label` property in `tabItems`:

```tsx
const tabItems = [
  { key: 'home', icon: HomeIcon },
  { key: 'search', icon: SearchIcon },
];
```

## Troubleshooting

### Bubble not appearing
- Ensure `tabItems` array keys match screen names exactly
- Check that icons render correctly outside the tab bar first

### Animation stuttering
- Verify react-native-reanimated is properly installed
- Run `npx react-native start --reset-cache`
- Check that Reanimated Babel plugin is configured

### Path not rendering
- Ensure react-native-svg is installed and linked
- Check console for SVG path syntax errors

## Files

- `AnimatedTabBar.tsx` - Main component
- `AnimatedTabBar.type.ts` - TypeScript types
- `AnimatedTabBar.utils.ts` - SVG path generation
- `AnimatedTabBar.constants.ts` - Configuration
- `AnimatedTabBarExample.tsx` - Usage example

## License

Part of Abajim Mobile App v2

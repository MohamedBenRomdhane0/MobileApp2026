import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Pressable, LayoutChangeEvent, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'src/theme/ThemeProvider';
import { AnimatedTabBarProps, TabItem, TabLayout } from './AnimatedTabBar.type';
import { createTabBarCurvePath, SPRING_CONFIG, ICON_SPRING_CONFIG } from './AnimatedTabBar.utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  state,
  descriptors,
  navigation,
  tabItems,
  bubbleColor,
  activeIconSize = 28,
  inactiveIconSize = 24,
}) => {
  const { colors, isDark } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  
  const [tabLayouts, setTabLayouts] = useState<TabLayout[]>([]);
  const activeIndex = useSharedValue(state.index);
  
  const primaryColor = bubbleColor || colors.primary || '#4F46E5';
  const barBackgroundColor = isDark ? '#1F2937' : '#FFFFFF';
  
  const tabCount = tabItems.length;
  const tabWidth = screenWidth / tabCount;
  const curveHeight = 40;
  const bubbleSize = 64;

  const handleTabLayout = useCallback((index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => {
      const updated = [...prev];
      updated[index] = { x, width };
      return updated;
    });
  }, []);

  const handleTabPress = useCallback((index: number, routeKey: string) => {
    activeIndex.value = index;
    
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(routeKey);
    }
  }, [navigation, activeIndex]);

  const animatedBubbleStyle = useAnimatedStyle(() => {
    const index = Math.round(activeIndex.value);
    const targetLayout = tabLayouts[index];
    
    if (!targetLayout) {
      return {
        opacity: 0,
        transform: [{ translateX: 0 }, { scale: 0 }],
      };
    }
    
    const targetX = targetLayout.x + targetLayout.width / 2 - bubbleSize / 2;
    
    return {
      opacity: 1,
      transform: [
        { translateX: withSpring(targetX, SPRING_CONFIG) },
        { scale: withSpring(1, ICON_SPRING_CONFIG) },
      ],
    };
  }, [tabLayouts]);

  const animatedCurvePath = useAnimatedProps(() => {
    const index = Math.round(activeIndex.value);
    const layout = tabLayouts[index];
    
    if (!layout) {
      return { d: createTabBarCurvePath(tabWidth, curveHeight, 0) };
    }
    
    const path = createTabBarCurvePath(layout.width, curveHeight, layout.x);
    return { d: path };
  }, [tabLayouts, tabWidth]);

  const renderTabItem = (item: TabItem, index: number) => {
    const isFocused = state.index === index;
    
    const animatedIconStyle = useAnimatedStyle(() => {
      const isActive = Math.round(activeIndex.value) === index;
      const scale = isActive ? 1.15 : 1;
      const opacity = isActive ? 1 : 0.6;
      
      return {
        transform: [{ scale: withSpring(scale, ICON_SPRING_CONFIG) }],
        opacity: withSpring(opacity, SPRING_CONFIG),
      };
    }, []);

    const animatedLabelStyle = useAnimatedStyle(() => {
      const isActive = Math.round(activeIndex.value) === index;
      return {
        opacity: withTiming(isActive ? 1 : 0, { duration: 200 }),
        transform: [
          { translateY: withSpring(isActive ? 0 : -10, SPRING_CONFIG) },
        ],
      };
    }, []);

    const IconComponent = item.icon;

    return (
      <AnimatedPressable
        key={item.key}
        style={[styles.tabItem, { width: tabWidth }]}
        onPress={() => handleTabPress(index, item.key)}
        onLayout={(event) => handleTabLayout(index, event)}
      >
        <View style={styles.iconContainer}>
          <Animated.View style={animatedIconStyle}>
            <IconComponent
              size={isFocused ? activeIconSize : inactiveIconSize}
              color={isFocused ? primaryColor : (isDark ? '#9CA3AF' : '#6B7280')}
            />
          </Animated.View>
          {item.label && (
            <Animated.Text
              style={[
                styles.label,
                { color: primaryColor },
                animatedLabelStyle,
              ]}
            >
              {item.label}
            </Animated.Text>
          )}
        </View>
      </AnimatedPressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: barBackgroundColor }]}>
      {/* Curved notch background */}
      <View style={styles.svgContainer}>
        <Svg
          width={screenWidth}
          height={curveHeight + 10}
          style={styles.curveSvg}
        >
          <AnimatedPath
            animatedProps={animatedCurvePath}
            fill={barBackgroundColor}
          />
        </Svg>
      </View>
      
      {/* Tab items */}
      <View style={styles.tabContainer}>
        {tabItems.map((item, index) => renderTabItem(item, index))}
      </View>
      
      {/* Floating bubble */}
      <Animated.View
        style={[
          styles.bubble,
          {
            backgroundColor: primaryColor,
            width: bubbleSize,
            height: bubbleSize,
            borderRadius: bubbleSize / 2,
          },
          animatedBubbleStyle,
        ]}
      >
        {tabItems[state.index]?.icon && (
          <tabItems[state.index].icon
            size={activeIconSize}
            color="#FFFFFF"
          />
        )}
      </Animated.View>
    </View>
  );
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  svgContainer: {
    position: 'absolute',
    top: -curveHeight,
    left: 0,
    right: 0,
    height: curveHeight + 10,
  },
  curveSvg: {
    position: 'absolute',
    bottom: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  bubble: {
    position: 'absolute',
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

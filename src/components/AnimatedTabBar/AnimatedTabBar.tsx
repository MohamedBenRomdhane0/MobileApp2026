import React, { useCallback, useState, useMemo } from 'react';
import { View, StyleSheet, Pressable, LayoutChangeEvent, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedProps,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'src/theme/ThemeProvider';
import { AnimatedTabBarProps, TabItem, TabLayout } from './AnimatedTabBar.type';
import { generateTabBarCurvePath, SPRING_CONFIG } from './AnimatedTabBar.utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedPath = Animated.createAnimatedComponent(Path);

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
  const [isReady, setIsReady] = useState(false);
  
  const activeIndex = useSharedValue(state.index);
  const previousIndex = useSharedValue(state.index);
  
  const primaryColor = bubbleColor || colors.primary || '#4F46E5';
  const barBackgroundColor = isDark ? '#1F2937' : '#FFFFFF';
  
  const tabCount = tabItems.length;
  const tabWidth = useMemo(() => screenWidth / tabCount, [screenWidth, tabCount]);
  const curveHeight = 40;
  const bubbleSize = 64;

  const handleTabLayout = useCallback((index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => {
      const updated = [...prev];
      updated[index] = { x, width };
      if (updated.filter(Boolean).length === tabCount) {
        setIsReady(true);
      }
      return updated;
    });
  }, [tabCount]);

  const handleTabPress = useCallback((index: number, routeKey: string) => {
    previousIndex.value = activeIndex.value;
    activeIndex.value = index;
    
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(routeKey);
    }
  }, [navigation, activeIndex, previousIndex]);

  // Animated bubble style
  const animatedBubbleStyle = useAnimatedStyle(() => {
    const index = Math.round(activeIndex.value);
    const targetLayout = tabLayouts[index];
    
    if (!targetLayout || !isReady) {
      return {
        opacity: 0,
        transform: [{ translateX: 0 }, { scale: 0 }],
      };
    }
    
    const targetX = targetLayout.x + targetLayout.width / 2 - bubbleSize / 2;
    
    return {
      opacity: withTiming(1, { duration: 100 }),
      transform: [
        { translateX: withSpring(targetX, SPRING_CONFIG) },
        { scale: withSpring(1, { damping: 12, stiffness: 220 }) },
      ],
    };
  }, [tabLayouts, isReady]);

  // Animated curve path
  const animatedPathProps = useAnimatedProps(() => {
    const index = Math.round(activeIndex.value);
    const layout = tabLayouts[index];
    
    if (!layout || !isReady) {
      return {
        d: generateTabBarCurvePath(screenWidth, curveHeight, tabWidth, 0),
      };
    }
    
    return {
      d: generateTabBarCurvePath(screenWidth, curveHeight, layout.width, layout.x),
    };
  }, [tabLayouts, isReady, screenWidth, tabWidth]);

  const renderTabItem = useCallback((item: TabItem, index: number) => {
    const isFocused = state.index === index;
    
    const animatedIconStyle = useAnimatedStyle(() => {
      const isActive = Math.round(activeIndex.value) === index;
      const scale = isActive ? 1.15 : 1;
      const opacity = isActive ? 1 : 0.6;
      
      return {
        transform: [{ scale: withSpring(scale, { damping: 12, stiffness: 220 }) }],
        opacity: withSpring(opacity, SPRING_CONFIG),
      };
    }, []);

    const animatedLabelStyle = useAnimatedStyle(() => {
      const isActive = Math.round(activeIndex.value) === index;
      return {
        opacity: withTiming(isActive ? 1 : 0, { duration: 150 }),
        transform: [
          { translateY: withSpring(isActive ? 0 : -8, { damping: 15, stiffness: 200 }) },
        ],
      };
    }, []);

    return (
      <AnimatedPressable
        key={item.key}
        style={[styles.tabItem, { width: tabWidth }]}
        onPress={() => handleTabPress(index, item.key)}
        onLayout={(event) => handleTabLayout(index, event)}
      >
        <View style={styles.iconContainer}>
          <Animated.View style={animatedIconStyle}>
            <item.icon
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
  }, [state.index, tabWidth, handleTabPress, handleTabLayout, primaryColor, isDark, activeIconSize, inactiveIconSize]);

  return (
    <View style={[styles.container, { backgroundColor: barBackgroundColor }]}>
      {/* Curved notch background */}
      <View style={[styles.svgContainer, { height: curveHeight + 10 }]}>
        <Svg
          width={screenWidth}
          height={curveHeight + 10}
          style={styles.curveSvg}
        >
          <AnimatedPath
            animatedProps={animatedPathProps}
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
        {(() => {
          const IconCmp = tabItems[state.index]?.icon;
          return IconCmp ? (
            <IconCmp size={activeIconSize} color="#FFFFFF" />
          ) : null;
        })()}
      </Animated.View>
    </View>
  );
};

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
    top: -40,
    left: 0,
    right: 0,
    overflow: 'visible',
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

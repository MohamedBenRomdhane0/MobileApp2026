import React from "react";
import { View } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Circle,
  Path,
  G,
} from "react-native-svg";

interface AiOrbProps {
  size?: number;
}

/**
 * Glowing "liquid" twisted-ribbon orb (the AI assistant sphere).
 * Pure SVG so the ribbon curves render crisply at any size.
 *
 * Layers, back → front:
 *   1. Soft radial glow halo.
 *   2. Two crossing ribbon loops (back darker, front bright) that twist
 *      around each other to read as a 3D knot.
 *   3. Specular highlight strokes on the front ribbon.
 */
export default function AiOrb({ size = 150 }: AiOrbProps) {
  // The paths below are authored on a 100×100 viewBox and scaled by Svg.
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          {/* halo */}
          <RadialGradient id="halo" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.55} />
            <Stop offset="45%" stopColor="#E7ECFF" stopOpacity={0.28} />
            <Stop offset="100%" stopColor="#8B7FE8" stopOpacity={0} />
          </RadialGradient>

          {/* bright front ribbon */}
          <LinearGradient id="ribbonFront" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
            <Stop offset="55%" stopColor="#F2F5FF" stopOpacity={0.95} />
            <Stop offset="100%" stopColor="#CFE0FF" stopOpacity={0.85} />
          </LinearGradient>

          {/* dimmer back ribbon */}
          <LinearGradient id="ribbonBack" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0%" stopColor="#C7C0F5" stopOpacity={0.75} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.6} />
          </LinearGradient>
        </Defs>

        {/* 1 — glow halo */}
        <Circle cx={50} cy={50} r={48} fill="url(#halo)" />

        {/* 2a — back loop (goes behind) */}
        <Path
          d="M50 20
             C68 20 82 33 82 50
             C82 67 68 80 50 80
             C40 80 32 72 32 62
             C32 52 40 46 50 46
             C60 46 66 52 66 60"
          fill="none"
          stroke="url(#ribbonBack)"
          strokeWidth={11}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />

        {/* 2b — front loop (crosses over) */}
        <Path
          d="M50 80
             C32 80 18 67 18 50
             C18 33 32 20 50 20
             C60 20 68 28 68 38
             C68 48 60 54 50 54
             C40 54 34 48 34 40"
          fill="none"
          stroke="url(#ribbonFront)"
          strokeWidth={12}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3 — specular highlights */}
        <G opacity={0.9}>
          <Path
            d="M26 44 C22 52 24 63 33 70"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <Path
            d="M52 23 C62 23 69 30 70 39"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
}

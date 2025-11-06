import React, { useEffect } from "react"
import { View, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Path,
  Rect,
  Text as SvgText,
  G,
} from "react-native-svg"

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const AnimatedPath = Animated.createAnimatedComponent(Path)

const { width, height } = Dimensions.get("window")

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const leftCircle = useSharedValue(18)
  const rightCircle = useSharedValue(18)
  const centerCircle = useSharedValue(4)
  const pathOpacity = useSharedValue(0.6)

  // loading dots
  const dot1 = useSharedValue(0.4)
  const dot2 = useSharedValue(0.4)
  const dot3 = useSharedValue(0.4)

  useEffect(() => {
    // main icon animations
    leftCircle.value = withRepeat(
      withSequence(withTiming(20, { duration: 1200 }), withTiming(18, { duration: 1200 })),
      -1
    )
    rightCircle.value = withRepeat(
      withSequence(withTiming(20, { duration: 1200 }), withTiming(18, { duration: 1200 })),
      -1
    )
    centerCircle.value = withRepeat(
      withSequence(withTiming(5.5, { duration: 800 }), withTiming(4, { duration: 800 })),
      -1
    )
    pathOpacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 1000 }), withTiming(0.6, { duration: 1000 })),
      -1
    )

    // dots animation (staggered fade)
    dot1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.4, { duration: 600 })
      ),
      -1
    )
    setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.4, { duration: 600 })
        ),
        -1
      )
    }, 200)
    setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.4, { duration: 600 })
        ),
        -1
      )
    }, 400)

    const timeout = setTimeout(onFinish, 3000)
    return () => clearTimeout(timeout)
  }, [])

  const leftCircleProps = useAnimatedProps(() => ({ r: leftCircle.value }))
  const rightCircleProps = useAnimatedProps(() => ({ r: rightCircle.value }))
  const centerCircleProps = useAnimatedProps(() => ({ r: centerCircle.value }))
  const pathProps = useAnimatedProps(() => ({ opacity: pathOpacity.value }))

  const dot1Props = useAnimatedProps(() => ({ opacity: dot1.value }))
  const dot2Props = useAnimatedProps(() => ({ opacity: dot2.value }))
  const dot3Props = useAnimatedProps(() => ({ opacity: dot3.value }))

  return (
    <View style={{ flex: 1, backgroundColor: "#0D9488" }}>
      <Svg width={width} height={height} viewBox="0 0 400 800">
        <Defs>
          <LinearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0D9488" />
            <Stop offset="0.5" stopColor="#14B8A6" />
            <Stop offset="1" stopColor="#2DD4BF" />
          </LinearGradient>
          <LinearGradient id="iconGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95} />
            <Stop offset="0.5" stopColor="#CCFBF1" stopOpacity={0.9} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0.95} />
          </LinearGradient>
        </Defs>

        <Rect width="400" height="800" fill="url(#bgGradient)" />
        <Circle cx="50" cy="100" r="80" fill="#FFFFFF" opacity="0.05" />
        <Circle cx="350" cy="700" r="100" fill="#FFFFFF" opacity="0.05" />
        <Circle cx="320" cy="150" r="60" fill="#FFFFFF" opacity="0.08" />

        <G transform="translate(200, 300) scale(2.5)">
          <AnimatedCircle cx="-35" cy="0" fill="url(#iconGradient)" opacity={0.95} animatedProps={leftCircleProps} />
          <AnimatedCircle cx="35" cy="0" fill="url(#iconGradient)" opacity={0.95} animatedProps={rightCircleProps} />
          <AnimatedPath d="M -20 -8 Q 0 -25, 20 -8" stroke="url(#iconGradient)" strokeWidth={3.5} fill="none" strokeLinecap="round" animatedProps={pathProps} />
          <AnimatedPath d="M -20 8 Q 0 25, 20 8" stroke="url(#iconGradient)" strokeWidth={3.5} fill="none" strokeLinecap="round" animatedProps={pathProps} />
          <AnimatedCircle cx="0" cy="0" fill="#FFFFFF" opacity={0.9} animatedProps={centerCircleProps} />
        </G>

        <SvgText x="200" y="500" fontSize="72" fontWeight="700" textAnchor="middle" fill="#FFFFFF" letterSpacing="-1">
          Syna
        </SvgText>
        <SvgText x="200" y="560" fontSize="22" fontWeight="500" textAnchor="middle" fill="#FFFFFF" opacity="0.9" letterSpacing="0.5">
          Linked. Synced. Sorted.
        </SvgText>

        <G transform="translate(200, 680)">
          <AnimatedCircle cx="-24" cy="0" r="5" fill="#FFFFFF" animatedProps={dot1Props} />
          <AnimatedCircle cx="0" cy="0" r="5" fill="#FFFFFF" animatedProps={dot2Props} />
          <AnimatedCircle cx="24" cy="0" r="5" fill="#FFFFFF" animatedProps={dot3Props} />
        </G>
      </Svg>
    </View>
  )
}

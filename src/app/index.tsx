import { useEffect } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";

export default function IndexRoute() {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();

  // Animation values
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    // Start the animation sequence
    scale.value = withSequence(
      withTiming(1.2, { duration: 800, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 300 })
    );

    opacity.value = withTiming(1, { duration: 1000 });
    translateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });

    // Continuous rotation
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1
    );

    // Color cycling
    colorProgress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const hue = interpolate(colorProgress.value, [0, 1], [0, 360]);
    return {
      backgroundColor: `hsl(${hue}, 80%, 60%)`,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const textScale = interpolate(
      colorProgress.value,
      [0, 0.5, 1],
      [1, 1.1, 1]
    );
    return {
      transform: [{ scale: textScale }],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Animated background */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.8,
          },
          backgroundStyle,
        ]}
      />

      {/* Gradient overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,0,150,0.3) 0%, rgba(0,204,255,0.3) 100%)',
        }}
      />

      {/* Main content */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
        }}
      >
        {/* Animated central element */}
        <Animated.View
          style={[
            {
              width: Math.min(width, height) * 0.3,
              height: Math.min(width, height) * 0.3,
              borderRadius: Math.min(width, height) * 0.15,
              backgroundColor: colors.card,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.3,
              shadowRadius: 30,
              elevation: 20,
            },
            animatedStyle,
          ]}
        >
          <Animated.Text
            style={[
              {
                fontSize: 24,
                fontWeight: 'bold',
                color: colors.text,
                textAlign: 'center',
              },
              textStyle,
            ]}
          >
            ✨
          </Animated.Text>
        </Animated.View>

        {/* Welcome text */}
        <Animated.View
          style={[
            { marginTop: 40, alignItems: 'center' },
            {
              transform: [{ translateY: translateY.value }],
              opacity: opacity.value,
            },
          ]}
        >
          <Animated.Text
            style={[
              {
                fontSize: 32,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: 16,
                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 10,
              },
              textStyle,
            ]}
          >
            Welcome
          </Animated.Text>
          <Text
            style={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              lineHeight: 24,
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 5,
            }}
          >
            Beautiful animations{'\n'}powered by Reanimated
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

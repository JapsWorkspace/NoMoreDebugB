import { useContext, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { UserContext } from "./UserContext";

const JaenLockup = require("../assets/jaen-logo.png");

const SPLASH_MIN_MS = 4200;

export default function AppBootstrap({ navigation }) {
  const { user } = useContext(UserContext) || {};
  const { width } = useWindowDimensions();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.94)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const logoSize = Math.min(width - 44, 360);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 52,
        useNativeDriver: true,
      }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [fade, pulse, scale]);

  useEffect(() => {
    let active = true;

    const boot = async () => {
      const startedAt = Date.now();

      if (user?._id || user?.id) return;

      const getStartedSeen =
        (await AsyncStorage.getItem("hasSeenGetStarted")) ||
        (await AsyncStorage.getItem("getStartedSeen"));
      const privacyAccepted =
        (await AsyncStorage.getItem("hasAcceptedPrivacy")) ||
        (await AsyncStorage.getItem("hasAcceptedDataPrivacy")) ||
        (await AsyncStorage.getItem("privacyAccepted"));
      const termsAccepted =
        (await AsyncStorage.getItem("hasAcceptedTerms")) ||
        (await AsyncStorage.getItem("termsAccepted"));
      const hasCreatedAccount =
        (await AsyncStorage.getItem("hasAccount")) ||
        (await AsyncStorage.getItem("hasCreatedAccount"));
      const onboardingComplete = await AsyncStorage.getItem("onboardingComplete");

      let nextRoute = "LogIn";

      if (hasCreatedAccount === "true" || onboardingComplete === "true") {
        nextRoute = "LogIn";
      } else if (getStartedSeen !== "true") {
        nextRoute = "GetStarted";
      } else if (privacyAccepted !== "true" || termsAccepted !== "true") {
        nextRoute = "PrivacyGate";
      }

      const remaining = Math.max(0, SPLASH_MIN_MS - (Date.now() - startedAt));

      setTimeout(() => {
        if (active) navigation.replace(nextRoute);
      }, remaining);
    };

    boot();

    return () => {
      active = false;
    };
  }, [navigation, user?._id, user?.id]);

  const loaderOpacity = fade.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.95],
  });
  const loaderScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.06],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Animated.Image
          source={JaenLockup}
          resizeMode="contain"
          accessibilityLabel="Jaen disaster response"
          style={{
            width: logoSize,
            height: logoSize,
            opacity: fade,
            transform: [{ scale }],
          }}
        />
        <Animated.View
          style={[
            styles.loadingWrap,
            { opacity: loaderOpacity, transform: [{ scale: loaderScale }] },
          ]}
        >
          <ActivityIndicator size="small" color="#0B3B63" />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  loadingWrap: {
    width: 28,
    height: 28,
    marginTop: -26,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText, Button, Card, Field, Icon } from "@/components/ui";
import { SignupInput, useApp } from "@/context/app-context";

const icons = {
  drop: { ios: "drop.fill", android: "water_drop", web: "water_drop" } as any,
  email: { ios: "envelope", android: "mail", web: "mail" } as any,
  lock: { ios: "lock", android: "lock", web: "lock" } as any,
  phone: { ios: "phone", android: "phone", web: "phone" } as any,
  person: { ios: "person", android: "person", web: "person" } as any,
  home: { ios: "house", android: "home", web: "home" } as any,
  receipt: {
    ios: "doc.text",
    android: "receipt_long",
    web: "receipt_long",
  } as any,
  sun: { ios: "sun.max", android: "light_mode", web: "light_mode" } as any,
  moon: { ios: "moon", android: "dark_mode", web: "dark_mode" } as any,
};

const emptySignup: SignupInput = {
  email: "",
  password: "",
  phone: "",
  firstName: "",
  middleName: "",
  lastName: "",
  block: "",
  lot: "",
  street: "",
  recentBillingAmount: "",
};

export function AuthScreen() {
  const { colors, resolvedTheme, setThemePreference, signIn, signUp } =
    useApp();
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(emptySignup);
  const [message, setMessage] = useState<{
    tone: "error" | "success";
    text: string;
  } | null>(null);

  function submitSignIn() {
    setMessage(null);
    if (!email.trim() || !password) {
      setMessage({ tone: "error", text: "Enter your email and password." });
      return;
    }
    const result = signIn(email, password);
    if (!result.ok) setMessage({ tone: "error", text: result.message });
  }

  function submitSignup() {
    setMessage(null);
    const required = [
      signup.email,
      signup.password,
      signup.phone,
      signup.firstName,
      signup.lastName,
      signup.block,
      signup.lot,
      signup.street,
      signup.recentBillingAmount,
    ];
    if (required.some((value) => !value.trim())) {
      setMessage({
        tone: "error",
        text: "Complete all required fields before submitting.",
      });
      return;
    }
    const result = signUp(signup);
    setMessage({ tone: result.ok ? "success" : "error", text: result.message });
    if (result.ok) {
      setSignup(emptySignup);
      setTimeout(() => {
        setMode("signin");
        setMessage({ tone: "success", text: result.message });
      }, 500);
    }
  }

  const updateSignup = (key: keyof SignupInput, value: string) =>
    setSignup((current) => ({ ...current, [key]: value }));

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scroll,
            compact && styles.scrollCompact,
          ]}
        >
          <View style={[styles.shell, compact && styles.shellCompact]}>
            <View style={[styles.intro, compact && styles.introCompact]}>
              <View style={styles.brandRow}>
                <View
                  style={[styles.logo, { backgroundColor: colors.primary }]}
                >
                  <Icon name={icons.drop} size={26} color={colors.white} />
                </View>
                <View>
                  <AppText size={20} weight="800">
                    ClearFlow
                  </AppText>
                  <AppText size={12} muted weight="700">
                    COMMUNITY WATER
                  </AppText>
                </View>
              </View>

              <View style={styles.introCopy}>
                <AppText
                  size={compact ? 34 : 48}
                  weight="800"
                  style={styles.heading}
                >
                  Water billing,{"\n"}made clear.
                </AppText>
                <AppText size={16} muted style={styles.subheading}>
                  View statements, track consumption, and settle your community
                  water bill from one secure place.
                </AppText>
              </View>

              {!compact ? (
                <View style={styles.trustRow}>
                  <View
                    style={[
                      styles.trustIcon,
                      { backgroundColor: colors.primarySoft },
                    ]}
                  >
                    <Icon name={icons.home} color={colors.primary} />
                  </View>
                  <View>
                    <AppText size={13} weight="700">
                      Managed by your HOA
                    </AppText>
                    <AppText size={13} muted>
                      Accounts are verified before access is granted.
                    </AppText>
                  </View>
                </View>
              ) : null}
            </View>

            <Card style={[styles.authCard, compact && styles.authCardCompact]}>
              <View style={styles.cardTop}>
                <View>
                  <AppText size={24} weight="800">
                    {mode === "signin" ? "Welcome back" : "Create your account"}
                  </AppText>
                  <AppText muted>
                    {mode === "signin"
                      ? "Sign in to manage your water account."
                      : "Your HOA will verify the details below."}
                  </AppText>
                </View>
                <Pressable
                  accessibilityLabel="Toggle color theme"
                  onPress={() =>
                    setThemePreference(
                      resolvedTheme === "dark" ? "light" : "dark",
                    )
                  }
                  style={({ pressed }) => [
                    styles.themeButton,
                    { backgroundColor: colors.surfaceAlt },
                    pressed && styles.pressed,
                  ]}
                >
                  <Icon
                    name={resolvedTheme === "dark" ? icons.sun : icons.moon}
                    color={colors.text}
                  />
                </Pressable>
              </View>

              <View
                style={[styles.segment, { backgroundColor: colors.surfaceAlt }]}
              >
                {(["signin", "signup"] as const).map((item) => {
                  const active = mode === item;
                  return (
                    <Pressable
                      key={item}
                      onPress={() => {
                        setMode(item);
                        setMessage(null);
                      }}
                      style={[
                        styles.segmentItem,
                        active && { backgroundColor: colors.surface },
                      ]}
                    >
                      <AppText
                        weight={active ? "700" : "500"}
                        muted={!active}
                        size={14}
                      >
                        {item === "signin" ? "Sign in" : "Register"}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>

              {mode === "signin" ? (
                <View style={styles.form}>
                  <Field
                    label="Email address"
                    icon={icons.email}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="you@example.com"
                  />
                  <Field
                    label="Password"
                    icon={icons.lock}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="Enter your password"
                    onSubmitEditing={submitSignIn}
                  />
                  {message ? <Message {...message} /> : null}
                  <Button
                    label="Sign in"
                    icon={icons.lock}
                    onPress={submitSignIn}
                  />
                </View>
              ) : (
                <View style={styles.form}>
                  <View style={styles.formRow}>
                    <Field
                      label="First name *"
                      icon={icons.person}
                      value={signup.firstName}
                      onChangeText={(value) => updateSignup("firstName", value)}
                      placeholder="Juan"
                    />
                    <Field
                      label="Middle name"
                      value={signup.middleName}
                      onChangeText={(value) =>
                        updateSignup("middleName", value)
                      }
                      placeholder="Santos"
                    />
                    <Field
                      label="Family name *"
                      value={signup.lastName}
                      onChangeText={(value) => updateSignup("lastName", value)}
                      placeholder="Dela Cruz"
                    />
                  </View>
                  <View style={styles.formRow}>
                    <Field
                      label="Email address *"
                      icon={icons.email}
                      value={signup.email}
                      onChangeText={(value) => updateSignup("email", value)}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholder="you@example.com"
                    />
                    <Field
                      label="Phone number *"
                      icon={icons.phone}
                      value={signup.phone}
                      onChangeText={(value) => updateSignup("phone", value)}
                      keyboardType="phone-pad"
                      placeholder="09XX XXX XXXX"
                    />
                  </View>
                  <View style={styles.formRow}>
                    <Field
                      label="Block *"
                      value={signup.block}
                      onChangeText={(value) => updateSignup("block", value)}
                      placeholder="8"
                      style={styles.shortField}
                    />
                    <Field
                      label="Lot *"
                      value={signup.lot}
                      onChangeText={(value) => updateSignup("lot", value)}
                      placeholder="14"
                      style={styles.shortField}
                    />
                    <Field
                      label="Street *"
                      icon={icons.home}
                      value={signup.street}
                      onChangeText={(value) => updateSignup("street", value)}
                      placeholder="Acacia Street"
                    />
                  </View>
                  <Field
                    label="Most recent water amount *"
                    icon={icons.receipt}
                    value={signup.recentBillingAmount}
                    onChangeText={(value) =>
                      updateSignup("recentBillingAmount", value)
                    }
                    autoCapitalize="characters"
                    placeholder="Enter water amount"
                  />
                  <Field
                    label="Create password *"
                    icon={icons.lock}
                    value={signup.password}
                    onChangeText={(value) => updateSignup("password", value)}
                    secureTextEntry
                    placeholder="At least 8 characters"
                  />
                  {message ? <Message {...message} /> : null}
                  <Button label="Submit for approval" onPress={submitSignup} />
                </View>
              )}
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Message({ tone, text }: { tone: "error" | "success"; text: string }) {
  const { colors } = useApp();
  const isSuccess = tone === "success";
  return (
    <View
      style={[
        styles.message,
        { backgroundColor: isSuccess ? colors.successSoft : colors.dangerSoft },
      ]}
    >
      <AppText
        size={13}
        style={{ color: isSuccess ? colors.success : colors.danger }}
      >
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 40 },
  scrollCompact: { padding: 18, justifyContent: "flex-start" },
  shell: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 72,
  },
  shellCompact: { flexDirection: "column", gap: 28, alignItems: "stretch" },
  intro: { flex: 0.85, minWidth: 320, gap: 72 },
  introCompact: { minWidth: 0, gap: 28 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  introCopy: { gap: 18 },
  heading: { lineHeight: 54, maxWidth: 520 },
  subheading: { lineHeight: 25, maxWidth: 500 },
  trustRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  trustIcon: {
    width: 42,
    height: 42,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  authCard: { flex: 1.15, padding: 28, gap: 24, maxWidth: 620 },
  authCardCompact: { maxWidth: "100%", padding: 20 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  themeButton: {
    width: 42,
    height: 42,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  segment: { flexDirection: "row", borderRadius: 7, padding: 4 },
  segmentItem: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 5,
    alignItems: "center",
  },
  form: { gap: 16 },
  formRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  shortField: { minWidth: 90, flexBasis: 90 },
  message: { borderRadius: 7, padding: 12 },
  demo: { borderRadius: 7, padding: 14, gap: 5 },
  pressed: { opacity: 0.7 },
});

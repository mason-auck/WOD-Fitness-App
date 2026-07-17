import { Link, type Href } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useAppStyles } from "@/hooks/use-app-styles";

export default function RegisterScreen() {
  const { styles, colors } = useAppStyles();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      await signUp(email, password, displayName);
      setInfo(
        "Account created. If email confirmation is enabled in Supabase, check your inbox before logging in.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.page}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.scrollContent, { justifyContent: "center", flex: 1 }]}>
          <ThemedText type="title">Create account</ThemedText>
          <ThemedText style={styles.listLabel}>
            Registers with Supabase Auth. A profile row is created by the
            database trigger automatically.
          </ThemedText>

          <TextInput
            style={styles.input}
            autoCapitalize="words"
            placeholder="Display name"
            placeholderTextColor={colors.icon}
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor={colors.icon}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoComplete="password-new"
            placeholder="Password (min 6 characters)"
            placeholderTextColor={colors.icon}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? (
            <ThemedText style={styles.textDanger}>{error}</ThemedText>
          ) : null}
          {info ? <ThemedText style={styles.listLabel}>{info}</ThemedText> : null}

          <Pressable
            style={[styles.buttonPrimary, submitting && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={submitting || !email.trim() || password.length < 6}
          >
            {submitting ? (
              <ActivityIndicator color={colors.onAccent} />
            ) : (
              <ThemedText style={styles.buttonPrimaryText}>
                Create Account
              </ThemedText>
            )}
          </Pressable>

          <Link href={"/(auth)/login" as Href} asChild>
            <Pressable>
              <ThemedText type="link">Already have an account? Log in</ThemedText>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

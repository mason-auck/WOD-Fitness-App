import { Link, type Href } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useAppStyles } from "@/hooks/use-app-styles";

export default function LoginScreen() {
  const { styles, colors } = useAppStyles();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in");
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
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { justifyContent: "center", flexGrow: 1 },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title">WOD Log</ThemedText>
          <ThemedText style={styles.listLabel}>
            Log in with your Supabase account. Session tokens are stored in
            SecureStore on this device.
          </ThemedText>

          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor={colors.icon}
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoComplete="password"
            placeholder="Password"
            placeholderTextColor={colors.icon}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          {error ? (
            <ThemedText style={styles.textDanger}>{error}</ThemedText>
          ) : null}

          <Pressable
            style={[styles.buttonPrimary, submitting && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={submitting || !email.trim() || !password}
          >
            {submitting ? (
              <ActivityIndicator color={colors.onAccent} />
            ) : (
              <ThemedText style={styles.buttonPrimaryText}>Log In</ThemedText>
            )}
          </Pressable>

          <Link href={"/(auth)/register" as Href} asChild>
            <Pressable>
              <ThemedText type="link">Create an account</ThemedText>
            </Pressable>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Text, View, ScrollView } from "react-native";

const USER = {
  username: "Jasmin",
  skillLevel: "3",
  avatar: require("@/assets/images/react-logo.png"),
};

export default function Profile() {
  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText
            style={{ fontSize: 16, padding: 20, color: "white" }}
            type="title"
          >
            {USER.username}
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

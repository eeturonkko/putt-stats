import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SessionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { sessionId, sessionName, sessionDate } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sessionName}</Text>
      <Text>{sessionDate}</Text>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBtnText}>Back</Text>
      </TouchableOpacity>
      {/* TODO: Add UI for distances, putts, results */}
    </View>
  );
};

export default SessionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  backBtn: {
    marginTop: 24,
    backgroundColor: "#1976D2",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backBtnText: { color: "#fff", fontWeight: "700" },
});

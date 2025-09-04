import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  Session,
  deleteSession,
  fetchSessions,
  initDb,
  insertSession,
} from "./db";
import SessionModal from "./SessionModal";

const HomeScreen: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const load = async () => {
    setLoading(true);
    await initDb();
    const rows = await fetchSessions();
    setSessions(rows);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateSession = async (session_name: string, date: string) => {
    const id = Math.random().toString(36).slice(2);
    await insertSession(id, date, session_name);
    await load();
    setModalVisible(false);
    // @ts-ignore
    navigation.navigate("SessionScreen", {
      sessionId: id,
      sessionName: session_name,
      sessionDate: date,
    });
  };

  const handleDelete = async (rowKey: string) => {
    await deleteSession(rowKey);
    await load();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addBtnText}>ADD SESSION</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Sessions</Text>
      <View style={styles.listWrapper}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <SwipeListView
            data={sessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>{item.session_name}</Text>
              </View>
            )}
            renderHiddenItem={({ item }) => (
              <View style={styles.rowBack}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            rightOpenValue={-75}
            disableRightSwipe
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
      <SessionModal
        visible={modalVisible}
        onCreate={handleCreateSession}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 24,
    backgroundColor: "#fff",
  },
  addBtn: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
    elevation: 2,
  },
  addBtnText: { color: "#fff", fontWeight: "700", letterSpacing: 0.5 },
  title: { marginVertical: 8, fontSize: 16, color: "#666" },
  listWrapper: {
    width: "92%",
    borderRadius: 4,
    paddingVertical: 8,
  },
  scroll: { width: "100%" },
  listContent: { paddingHorizontal: 8, paddingBottom: 24 },
  listItem: {
    backgroundColor: "#7CFC00",
    borderWidth: 3,
    borderColor: "#FF0000",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 6,
    borderRadius: 4,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#FF5252",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
    marginVertical: 6,
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  deleteBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

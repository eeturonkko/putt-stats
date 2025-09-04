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

  const handleNavigateToSession = (
    sessionId: string,
    sessionName: string,
    sessionDate: string
  ) => {
    // @ts-ignore
    navigation.navigate("SessionScreen", {
      sessionId,
      sessionName,
      sessionDate,
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
      <Text style={styles.title}>
        {sessions.length === 0 ? "No Sessions. Maybe create one?" : "Sessions"}
      </Text>
      <View style={styles.listWrapper}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <SwipeListView
            data={sessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text
                  onPress={() =>
                    handleNavigateToSession(
                      item.id,
                      item.session_name,
                      item.date
                    )
                  }
                >
                  {item.session_name}
                </Text>
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
    backgroundColor: "#F8FAFC", // slate-50
  },

  // Header / actions
  addBtn: {
    backgroundColor: "#2563EB", // blue-600
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  title: {
    marginVertical: 12,
    fontSize: 18,
    color: "#0F172A", // slate-900
    fontWeight: "700",
  },

  // List wrapper
  listWrapper: {
    width: "92%",
    borderRadius: 12,
    paddingVertical: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB", // gray-200
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  scroll: { width: "100%" },
  listContent: { paddingHorizontal: 10, paddingBottom: 24 },

  // List item
  listItem: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  // Hidden row (swipe to delete)
  rowBack: {
    alignItems: "center",
    backgroundColor: "#FEE2E2", // red-100
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
    marginVertical: 6,
    borderRadius: 12,
  },
  deleteBtn: {
    backgroundColor: "#EF4444", // red-500
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  deleteBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});

import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onCreate: (name: string, date: string) => Promise<void> | void;
  onCancel: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const SessionModal: React.FC<Props> = ({ visible, onCreate, onCancel }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(today());

  // Reset when modal closes or re-opens
  useEffect(() => {
    if (!visible) {
      setName("");
      setDate(today());
    }
  }, [visible]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await onCreate(name.trim(), date);
    // Clear immediately after success (in case parent doesn't close instantly)
    setName("");
    setDate(today());
    onCancel(); // close modal
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>New Session</Text>
          <TextInput
            style={styles.input}
            placeholder="Session Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.btn} onPress={onCancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.createBtn]}
              onPress={handleCreate}
              disabled={!name.trim()}
            >
              <Text style={{ color: "#fff" }}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default SessionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 8,
    width: "80%",
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  btnRow: { flexDirection: "row", justifyContent: "flex-end" },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: "#eee",
    marginLeft: 8,
  },
  createBtn: { backgroundColor: "#1976D2" },
});

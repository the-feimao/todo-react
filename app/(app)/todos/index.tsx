import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

type Todo = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

export default function TodosScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const router = useRouter();
  const { signOut } = useAuth();

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreate = async () => {
    if (!newTitle) {
      Alert.alert("Error", "Title is required");
      return;
    }
    try {
      await api.post("/todos", { title: newTitle, description: newDescription });
      setNewTitle("");
      setNewDescription("");
      setModalVisible(false);
      fetchTodos();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create todo");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stats Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Todos</Text>
        <Text style={styles.cardNumber}>{todos.length}</Text>
      </View>

      {/* Create Todo Button */}
      <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.createButtonText}>+ Create Todo</Text>
      </TouchableOpacity>

      {/* Todos List */}
      <FlatList
        style={{ marginTop: 16 }}
        data={todos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.todoItem}
            onPress={() => router.push(`/todos/${item.id}`)}
          >
            <Text style={styles.todoTitle}>{item.title}</Text>
            <Text style={styles.todoArrow}>→</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#eee" }} />}
      />

      {/* Logout Button */}
      <View style={{ marginTop: 16 }}>
        <Button title="Logout" color="#ED1E26" onPress={() => signOut()} />
      </View>

      {/* Modal for Create Todo */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Todo</Text>
            <TextInput
              placeholder="Title"
              style={styles.modalInput}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              placeholder="Description"
              style={[styles.modalInput, { height: 80 }]}
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Pressable style={styles.modalButton} onPress={handleCreate}>
                <Text style={styles.modalButtonText}>Create</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, color: "#555", marginBottom: 8 },
  cardNumber: { fontSize: 36, fontWeight: "bold", color: "#ED1E26" },
  createButton: {
    backgroundColor: "#ED1E26",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  todoItem: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  todoTitle: { fontSize: 16, fontWeight: "500", color: "#333" },
  todoArrow: { fontSize: 18, color: "#ED1E26" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  modalButton: {
    backgroundColor: "#ED1E26",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import api from "../../../lib/api";

export default function TodoDetail() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const router = useRouter();
  const [todo, setTodo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/todos/${id}`);
        setTodo(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || "");
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to load todo");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/todos/${id}`, { title, description });
      Alert.alert("Success", "Todo updated");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/todos/${id}`);
      Alert.alert("Deleted", "Todo deleted");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Delete failed");
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Update" onPress={handleUpdate} />
      <View style={{ marginTop: 12 }}>
        <Button title="Delete" color="#ED1E26" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: { marginBottom: 16 },
  backText: { color: "#ED1E26", fontSize: 16, fontWeight: "bold" },
  label: { fontSize: 16, marginBottom: 4, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
});

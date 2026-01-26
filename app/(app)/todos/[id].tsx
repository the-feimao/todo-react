import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import api from "../../../lib/api";

const PRIORITIES = ["low", "medium", "high"];

export default function TodoDetail() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  type Category = { id: number; name: string };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [todoRes, catsRes] = await Promise.all([
          api.get(`/todos/${id}`),
          api.get("/categories"),
        ]);

        const todo = todoRes.data;
        setTitle(todo.title);
        setDescription(todo.description || "");
        setCompleted(!!todo.completed);
        setPriority(todo.priority || "medium"); // pre-fill priority

        // categories
        setCategories(catsRes.data || []);
        // if todo has categories, use their ids so chips are selected
        const todoCategoryIds: number[] = (todo.categories || []).map(
          (c: any) => c.id
        );
        setSelectedCategoryIds(todoCategoryIds);
      } catch (err) {
        Alert.alert("Error", "Failed to load todo");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleUpdate = async () => {
    if (completed) {
      Alert.alert("Cannot edit", "Completed todos cannot be edited");
      return;
    }
    try {
      await api.put(`/todos/${id}`, {
        title,
        description,
        category_ids: selectedCategoryIds,
        priority,
      });

      Alert.alert("Success", "Todo updated successfully");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Update failed");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Todo", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/todos/${id}`);
            router.back();
          } catch {
            Alert.alert("Error", "Delete failed");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View className="pt-16" style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Form Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={[styles.input, completed && styles.disabled]}
          value={title}
          onChangeText={setTitle}
          placeholder="Todo title"
          editable={!completed}
        />

        <Text style={styles.label}>Select Categories</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
          {categories.map((cat) => {
            const selected = selectedCategoryIds.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  (styles as any).categoryChip,
                  selected && (styles as any).categorySelected,
                  completed && styles.disabled,
                ]}
                onPress={() => {
                  if (completed) return;
                  const ids = selected
                    ? selectedCategoryIds.filter((i) => i !== cat.id)
                    : [...selectedCategoryIds, cat.id];
                  setSelectedCategoryIds(ids);
                }}
                disabled={completed}
              >
                <Text style={{ color: selected ? "#fff" : "#333" }}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => !completed && setPriority(p as any)}
              disabled={completed}
              style={[
                styles.priorityChip,
                priority === p && styles.priorityActive,
                completed && styles.disabled,
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === p && styles.priorityTextActive,
                ]}
              >
                {p.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, completed && styles.disabled]}
          value={description}
          onChangeText={setDescription}
          placeholder="Optional description"
          multiline
          editable={!completed}
        />
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={[styles.primaryButton, completed && styles.buttonDisabled]}
        onPress={handleUpdate}
        disabled={completed}
      >
        <Text style={styles.primaryText}>Update Todo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Todo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    marginBottom: 24,
  },
  backText: {
    color: "#ED1E26",
    fontSize: 16,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  priorityRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  priorityChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
    marginRight: 8,
    backgroundColor: "#FAFAFA",
  },
  priorityActive: {
    backgroundColor: "#ED1E26",
    borderColor: "#ED1E26",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },
  priorityTextActive: {
    color: "#FFF",
  },

  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    marginBottom: 8,
  },
  categorySelected: {
    backgroundColor: "#ED1E26",
    borderColor: "#ED1E26",
  },

  disabled: {
    opacity: 0.6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  primaryButton: {
    backgroundColor: "#ED1E26",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  deleteButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ED1E26",
  },
  deleteText: {
    color: "#ED1E26",
    fontWeight: "600",
  },
});

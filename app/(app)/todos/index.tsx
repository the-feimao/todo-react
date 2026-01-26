import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Alert,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

type Category = { id: number; name: string };

type Todo = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  due_at?: string;
  categories: Category[];
};

export default function TodosScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    category_ids: [] as number[],
  });

  const [newCategory, setNewCategory] = useState("");

  // FILTER STATES
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedPriority, setSelectedPriority] = useState<
    "low" | "medium" | "high" | null
  >(null);
  const [showPriority, setShowPriority] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  const router = useRouter();
  const { signOut } = useAuth();

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    try {
      setLoading(true);
      const [todosRes, categoriesRes] = await Promise.all([
        api.get("/todos"),
        api.get("/categories"),
      ]);
      setTodos(todosRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- CREATE TODO ----------------
  const handleCreateTodo = async () => {
    if (!newTodo.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    try {
      await api.post("/todos", newTodo);
      setNewTodo({
        title: "",
        description: "",
        priority: "medium",
        category_ids: [],
      });
      setModalVisible(false);
      fetchData();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create todo");
    }
  };

  // ---------------- CREATE CATEGORY ----------------
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert("Error", "Category name is required");
      return;
    }

    try {
      await api.post("/categories", { name: newCategory });
      setNewCategory("");
      fetchData();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create category");
    }
  };

  // ---------------- TOGGLE COMPLETE ----------------
  const toggleCompleted = async (todo: Todo) => {
    try {
      await api.put(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      fetchData();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update todo");
    }
  };

  // ---------------- FILTERED TODOS ----------------
  const filteredTodos = todos.filter((todo) => {
    const matchesCategory =
      selectedCategoryId === null ||
      todo.categories.some((c) => c.id === selectedCategoryId);

    const matchesPriority =
      selectedPriority === null || todo.priority === selectedPriority;

    return matchesCategory && matchesPriority;
  });

  if (loading) return <ActivityLoader />;

  const total = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = total - completedCount;

  return (
    <View  style={styles.container}>
      {/* Stats Row */}
      <View className="pt-10" style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statNumber}>{total}</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxAccent]}> 
          <Text style={[styles.statLabel, { color: '#fff' }]}>Completed</Text>
          <Text style={[styles.statNumber, { color: '#fff' }]}>{completedCount}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statNumber}>{pendingCount}</Text>
        </View>
      </View>

      {/* Create Todo */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createButtonText}>+ Create Todo</Text>
      </TouchableOpacity>

      {/* ---------------- FILTER UI (modern) ---------------- */}
      <View style={styles.filterCard}>
        <View style={styles.filterTopRow}>
          <Text style={styles.filterTitle}>Filters</Text>
          {(selectedCategoryId || selectedPriority) && (
            <Pressable
              onPress={() => {
                setSelectedCategoryId(null);
                setSelectedPriority(null);
              }}
              style={styles.clearFilterPill}
            >
              <Text style={{ color: "#ED1E26", fontWeight: "700" }}>Clear</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterBlock}>
            <Pressable
              style={styles.collapseHeader}
              onPress={() => setShowPriority((s) => !s)}
            >
              <View>
                <Text style={styles.filterBlockHeader}>Priority</Text>
                {!showPriority && (
                  <Text style={styles.filterSubtitle}>
                    {selectedPriority ? selectedPriority : "Any"}
                  </Text>
                )}
              </View>
              <Text style={styles.collapseArrow}>{showPriority ? "−" : "+"}</Text>
            </Pressable>

            {showPriority && (
              <View style={[styles.filterChipsRow, { marginTop: 8 }]}>
                {["low", "medium", "high"].map((p) => (
                  <Pressable
                    key={p}
                    onPress={() =>
                      setSelectedPriority(selectedPriority === p ? null : (p as any))
                    }
                    style={[
                      styles.priorityButton,
                      selectedPriority === p && styles.prioritySelected,
                    ]}
                  >
                    <Text
                      style={{
                        color: selectedPriority === p ? "#fff" : "#333",
                        fontWeight: "600",
                      }}
                    >
                      {p}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={[styles.filterBlock, { marginLeft: 12 }]}>
            <Pressable
              style={styles.collapseHeader}
              onPress={() => setShowCategory((s) => !s)}
            >
              <View>
                <Text style={styles.filterBlockHeader}>Category</Text>
                {!showCategory && (
                  <Text style={styles.filterSubtitle}>
                    {selectedCategoryId
                      ? categories.find((c) => c.id === selectedCategoryId)?.name
                      : "Any"}
                  </Text>
                )}
              </View>
              <Text style={styles.collapseArrow}>{showCategory ? "−" : "+"}</Text>
            </Pressable>

            {showCategory && (
              <View style={[styles.filterChipsRow, { marginTop: 8 }]}>
                {categories.length === 0 ? (
                  <Text style={styles.filterSubtitle}>No categories yet</Text>
                ) : (
                  categories.map((cat) => {
                    const active = selectedCategoryId === cat.id;
                    return (
                      <Pressable
                        key={cat.id}
                        onPress={() =>
                          setSelectedCategoryId(active ? null : cat.id)
                        }
                        style={[
                          styles.categoryChip,
                          active && styles.categorySelected,
                        ]}
                      >
                        <Text style={{ color: active ? "#fff" : "#333" }}>
                          {cat.name}
                        </Text>
                      </Pressable>
                    );
                  })
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Todo List */}
      <FlatList
        style={{ marginTop: 16 }}
        data={filteredTodos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onPress={() => router.push(`/todos/${item.id}`)}
            onToggle={toggleCompleted}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      {/* Logout */}
      <Pressable style={styles.logoutButton} onPress={signOut}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
      </Pressable>

      {/* ---------------- MODAL ---------------- */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Todo</Text>

            <TextInput
              placeholder="Title"
              style={styles.modalInput}
              value={newTodo.title}
              onChangeText={(t) => setNewTodo({ ...newTodo, title: t })}
            />

            <TextInput
              placeholder="Description"
              style={[styles.modalInput, { height: 80 }]}
              value={newTodo.description}
              onChangeText={(d) =>
                setNewTodo({ ...newTodo, description: d })
              }
              multiline
            />

            {/* Priority */}
            <Text style={styles.label}>Priority</Text>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              {["low", "medium", "high"].map((p) => (
                <Pressable
                  key={p}
                  style={[
                    styles.priorityButton,
                    newTodo.priority === p && styles.prioritySelected,
                  ]}
                  onPress={() =>
                    setNewTodo({ ...newTodo, priority: p as any })
                  }
                >
                  <Text
                    style={{
                      color: newTodo.priority === p ? "#fff" : "#333",
                    }}
                  >
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Add Category */}
            <Text style={styles.label}>Add Category</Text>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <TextInput
                placeholder="e.g. Work"
                value={newCategory}
                onChangeText={setNewCategory}
                style={[styles.modalInput, { flex: 1, marginBottom: 0 }]}
              />
              <Pressable
                style={styles.addCategoryBtn}
                onPress={handleCreateCategory}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Add</Text>
              </Pressable>
            </View>

            {/* Select Categories */}
            <Text style={styles.label}>Select Categories</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {categories.map((cat) => {
                const selected = newTodo.category_ids.includes(cat.id);
                return (
                  <Pressable
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      selected && styles.categorySelected,
                    ]}
                    onPress={() => {
                      const ids = selected
                        ? newTodo.category_ids.filter((id) => id !== cat.id)
                        : [...newTodo.category_ids, cat.id];
                      setNewTodo({ ...newTodo, category_ids: ids });
                    }}
                  >
                    <Text style={{ color: selected ? "#fff" : "#333" }}>
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <Pressable style={styles.modalButton} onPress={handleCreateTodo}>
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

/* ---------------- COMPONENTS ---------------- */

const ActivityLoader = () => (
  <View style={styles.center}>
    <ActivityIndicator size="large" />
  </View>
);

const StatsCard = ({
  total,
  completed,
}: {
  total: number;
  completed: number;
}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Total Todos</Text>
    <Text style={styles.cardNumber}>{total}</Text>
    <Text style={{ color: "#555" }}>Completed: {completed}</Text>
  </View>
);

const TodoItem = ({
  todo,
  onPress,
  onToggle,
}: {
  todo: Todo;
  onPress: () => void;
  onToggle: (t: Todo) => void;
}) => (
  <TouchableOpacity style={styles.todoItem} onPress={onPress}>
    <View>
      <Text
        style={[
          styles.todoTitle,
          todo.completed && { textDecorationLine: "line-through" },
        ]}
      >
        {todo.title}
      </Text>

      {todo.categories.length > 0 && (
        <Text style={styles.todoCategories}>
          {todo.categories.map((c) => c.name).join(", ")}
        </Text>
      )}

      <Text style={styles.todoPriority}>Priority: {todo.priority}</Text>

      {todo.due_at && (
        <Text style={styles.todoDue}>
          Due: {new Date(todo.due_at).toLocaleDateString()}
        </Text>
      )}
    </View>

    <Switch value={todo.completed} onValueChange={() => onToggle(todo)} />
  </TouchableOpacity>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
    paddingTop: 50,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, color: "#555" },
  cardNumber: { fontSize: 36, fontWeight: "bold", color: "#ED1E26" },

  createButton: {
    backgroundColor: "#ED1E26",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  /* Filters (primary) */
  filterCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  filterTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  filterSubtitle: { color: '#888', fontSize: 13 },
  clearFilterPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F5D6D6'
  },

  todoItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  todoTitle: { fontSize: 16, fontWeight: "500" },
  todoCategories: { fontSize: 12, color: "#777" },
  todoPriority: { fontSize: 12, color: "#ED1E26", fontWeight: "bold" },
  todoDue: { fontSize: 12, color: "#555" },

  logoutButton: {
    marginTop: 16,
    backgroundColor: "#ED1E26",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

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
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },

  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },

  filterTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  filterRow: { flexDirection: "row" },
  filterLabel: { marginBottom: 8, fontWeight: "700", color: "#666" },
  filterChipsRow: { flexDirection: "row", flexWrap: "wrap" },
  filterBlock: { flex: 1, backgroundColor: '#fbfbfb', padding: 10, borderRadius: 10 },
  filterBlockHeader: { fontSize: 13, color: '#666', fontWeight: '700', marginBottom: 8 },
  priorityButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fafafa'
  },
  prioritySelected: {
    backgroundColor: "#ED1E26",
    borderColor: "#ED1E26",
  },

  addCategoryBtn: {
    marginLeft: 8,
    backgroundColor: "#ED1E26",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },

  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fafafa'
  },
  categorySelected: {
    backgroundColor: "#ED1E26",
    borderColor: "#ED1E26",
  },

  clearFilterBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff'
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  statBoxAccent: {
    backgroundColor: '#ED1E26',
    borderColor: '#ED1E26'
  },
  statLabel: { fontSize: 12, color: '#777' },
  statNumber: { fontSize: 22, fontWeight: '700', color: '#222' },
  /* Collapse / dropdown */
  collapseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapseArrow: { fontSize: 22, color: '#888', paddingLeft: 8 },
});

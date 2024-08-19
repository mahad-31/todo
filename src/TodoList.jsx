import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/todo");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === "") return;

    try {
      const response = await axios.post("http://localhost:5000/todo", {
        text: newTodo,
      });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todo/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const editTodo = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const updateTodo = async () => {
    if (editingText.trim() === "") return;

    try {
      const response = await axios.put(
        `http://localhost:5000/todo/${editingId}`,
        { text: editingText }
      );
      setTodos(
        todos.map((todo) => (todo._id === editingId ? response.data : todo))
      );
      setEditingId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">To-Do List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-sm"
          >
            {editingId === todo._id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span
                className={`flex-grow ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.text}
              </span>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  editingId === todo._id
                    ? updateTodo()
                    : editTodo(todo._id, todo.text)
                }
                className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
              >
                {editingId === todo._id ? "Update" : "Edit"}
              </button>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;


import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4001/todo/fetch", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setTodos(response.data.todos);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Create todo
  const createTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(
        "http://localhost:4001/todo/create",
        { text: newTodo, completed: false },
        { withCredentials: true }
      );
      setTodos([...todos, response.data.todo]); // assuming backend returns { todo }
      setNewTodo("");
    } catch (err) {
      console.error(err);
      setError("Failed to create todo");
    }
  };

  // Update todo status
  const todoStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;
    try {
      const response = await axios.put(
        `http://localhost:4001/todo/update/${id}`,
        { ...todo, completed: !todo.completed },
        { withCredentials: true }
      );
      setTodos(
        todos.map((t) => (t._id === id ? response.data.todo : t))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update todo status");
    }
  };

  // Delete todo
  const todoDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/todo/delete/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete todo");
    }
  };


//logout btn function
  const logout= async ()=>{
    try {
      await axios.get("/http://localhost:4001/user/logout")
      
    } catch (error) {
       console.error(err);
      setError("Failed to logout todos");
    }
  } 




  return (
    <div className="my-10 bg-gray-100 max-w-lg rounded-lg shadow-lg mx-8 sm:mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center pt-2 pb-4">Todo App</h1>

      {/* Input */}
      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createTodo()}
          placeholder="Add a new todo"
          className="flex-grow p-2 border rounded-l-md focus:outline-none"
        />
        <button
          onClick={createTodo}
          disabled={!newTodo.trim()}
          className="bg-blue-600 text-white rounded-r-md py-2 px-5 hover:bg-blue-900 duration-300 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {/* Todo list */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed ?? false}
                  onChange={() => todoStatus(todo._id)}
                  className="mr-2"
                />
                <span
                  className={`${
                    todo.completed
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => todoDelete(todo._id)}
                className="text-red-500 hover:text-red-700 duration-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <p className="mt-4 text-center text-sm text-gray-500">
        {todos.filter((t) => !t.completed).length} Todo Remaining
      </p>

      {error && (
        <p className="mt-2 text-center text-red-500 text-sm">{error}</p>
      )}

      
    </div>
  );
}

export default Home;

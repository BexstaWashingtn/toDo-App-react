import { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  const [newTodoText, setNewTodoText] = useState("");
  const [toDos, setTodos] = useState(() => {
    const savedToDos = localStorage.getItem("toDos");
    return savedToDos ? JSON.parse(savedToDos) : [];
  });
  const toDosExample = [
    { id: 1, text: "WoMo reparieren", completed: false },
    { id: 2, text: "weniger rauchen", completed: false },
    { id: 3, text: "mutti anrufen", completed: false },
    { id: 4, text: "Hausaufgaben machen", completed: false },
    { id: 5, text: "nichts machen", completed: true },
  ];
  const [consoleText, setConsoleText] = useState("App ready loaded");

  //console.log("storage", JSON.parse(localStorage.getItem("toDos")));

  function addToDo(e) {
    e.preventDefault();

    if (!newTodoText.trim()) {
      setConsoleText("empty entry not save");
      return;
    }

    if (toDos.some((todo) => todo.text === newTodoText)) {
      setConsoleText("duplicate entry not save");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: newTodoText,
      completed: false,
    };

    setTodos([...toDos, newTodo]);
    setNewTodoText("");
    setConsoleText("todo saved");
  }

  function toogleCompletion(id) {
    const updatedToDos = toDos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    const openToDos = updatedToDos.filter((todo) => !todo.completed);
    const closedToDos = updatedToDos.filter((todo) => todo.completed);

    setTodos([...openToDos, ...closedToDos]);
    setConsoleText("todo updated");
  }

  function deleteTodo(idToDelete) {
    const updatedToDos = toDos.filter((todo) => todo.id !== idToDelete);
    setTodos(updatedToDos);
    setConsoleText("delete toDo");
  }

  function setStorage() {
    localStorage.setItem("toDos", JSON.stringify(toDosExample));
    setTodos(toDosExample);
    setConsoleText("set Storage Examples");
  }

  function resetStorage() {
    localStorage.removeItem("toDos");
    setTodos([]);
    setConsoleText("reset Storage");
  }

  useEffect(() => {
    try {
      localStorage.setItem("toDos", JSON.stringify(toDos));
    } catch (error) {
      console.error("Could not save to localStorage", error);
      setConsoleText(
        "todos could not be saved locally, you may be in private mode"
      );
    }
  }, [toDos]);

  useEffect(() => {
    if (consoleText) {
      const timer = window.setTimeout(() => {
        setConsoleText("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [consoleText]);

  return (
    <div className="App">
      <header className="header">
        <span className="title">easy toDo's with react</span>
      </header>
      <main className="main">
        <ul className="toDos">
          {toDos.map((toDo) => (
            <li
              key={toDo.id}
              id={toDo.id}
              className={`toDo ${toDo.completed ? "completed" : ""}`}
            >
              <input
                type="checkbox"
                checked={toDo.completed}
                onChange={() => toogleCompletion(toDo.id)}
              />
              <span className="description">{toDo.text}</span>
              <button className="delete" onClick={() => deleteDoto(toDo.id)}>
                x
              </button>
            </li>
          ))}
        </ul>
      </main>
      <footer className="footer">
        <div className="addToDo">
          <input
            type="text"
            value={newTodoText}
            name="newToDo"
            placeholder="enter toDo"
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addToDo(e);
              }
            }}
            maxLength={64}
          />
          <button
            type="submit"
            onClick={(e) => {
              addToDo(e);
            }}
            name="addToDo"
          >
            ✓
          </button>
        </div>

        <section className="storageControll">
          <span className="console">{consoleText}</span>

          <button className="resetStorage" onClick={resetStorage}>
            reset Storage
          </button>
          <button className="setStorage" onClick={setStorage}>
            set Storage
          </button>
        </section>
      </footer>
    </div>
  );
}

import React, { createContext, useState } from "react";

// Create Context
export const ThemeContext = createContext();

// Provide Context to the entire app
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext"; // Import the context

const ThemedButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); // 🔥 Using useContext

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
        padding: "10px 20px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Toggle Theme (Current: {theme})
    </button>
  );
};

export default ThemedButton;

//We must wrap our app inside the ThemeProvider to make the context accessible.
import React from "react";
import { ThemeProvider } from "./ThemeContext"; 
import ThemedButton from "./ThemedButton"; 

const App = () => {
  return (
    <ThemeProvider>
      <div>
        <h1>Welcome to the Themed App</h1>
        <ThemedButton />
      </div>
    </ThemeProvider>
  );
};

export default App;

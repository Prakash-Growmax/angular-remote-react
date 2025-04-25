// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Function to mount the React app to a specified element
// Also accepts optional props for customization
const mountDashboard = (elementId, props = {}) => {
  const containerElement = document.getElementById(elementId);

  if (!containerElement) {
    console.error(`Element with id "${elementId}" not found`);
    return null;
  }

  // Create root and render
  const root = ReactDOM.createRoot(containerElement);
  root.render(
    <React.StrictMode>
      <App {...props} />
    </React.StrictMode>
  );

  // Return unmount function
  return () => {
    root.unmount();
  };
};

// For standalone development and testing
if (process.env.NODE_ENV === "development") {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

// Export the mount function as default
export default mountDashboard;

// Also export App component for direct use if needed
export { App };

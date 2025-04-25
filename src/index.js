// src/index.js
import App from "./App";
import "./index.css";

// Function to check if React and ReactDOM are available
const checkDependencies = () => {
  if (!window.React || !window.ReactDOM) {
    console.error(
      "React and/or ReactDOM not found in global scope. Make sure they are loaded before the dashboard bundle."
    );
    return false;
  }
  return true;
};

// Function to mount the React app to a specified element
const mountDashboard = (elementId, props = {}) => {
  // Check for dependencies
  if (!checkDependencies()) {
    return null;
  }

  const containerElement = document.getElementById(elementId);

  if (!containerElement) {
    console.error(`Element with id "${elementId}" not found`);
    return null;
  }

  try {
    // Use React from window for creating the root
    const root = window.ReactDOM.createRoot(containerElement);

    root.render(
      window.React.createElement(
        window.React.StrictMode,
        null,
        window.React.createElement(App, props)
      )
    );

    // Return unmount function
    return () => {
      try {
        root.unmount();
      } catch (error) {
        console.error("Error unmounting React component:", error);
      }
    };
  } catch (error) {
    console.error("Error mounting React dashboard:", error);
    return null;
  }
};

// For standalone development
if (typeof document !== "undefined") {
  // Check if we're in the browser
  const rootElement = document.getElementById("root");
  if (rootElement && checkDependencies()) {
    // Use window.React and window.ReactDOM for consistency
    const root = window.ReactDOM.createRoot(rootElement);
    root.render(
      window.React.createElement(
        window.React.StrictMode,
        null,
        window.React.createElement(App, {})
      )
    );
  }
}

// Export the mount function as default
export default mountDashboard;

// Also export App component
export { App };

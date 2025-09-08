import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import WarningToastComponent from "./toasts/WarningToastComponent.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />
    <WarningToastComponent />
  </>
);


import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use concurrent mode
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);

// Use production mode for better performance
root.render(<App />);

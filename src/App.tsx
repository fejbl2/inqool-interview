import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <LanguageSwitcher />
      <Outlet />
    </QueryClientProvider>
  );
}

export default App;

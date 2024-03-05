import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { z } from "zod";
import { seed } from "./api/common.ts";
import { AnimalsPage, ErrorPage, UsersPage } from "./pages";

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_USE_MOCK: z.enum(["true", "false"]),
});

// if cannot parse, it will throw an error an nothing will be rendered
const env = envSchema.parse(import.meta.env);

declare global {
  type Env = typeof env;
  interface ImportMetaEnv extends Env {}
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/users",
        element: <UsersPage />,
      },
      {
        path: "/animals",
        element: <AnimalsPage />,
      },
    ],
  },
]);

// call just once here
seed();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

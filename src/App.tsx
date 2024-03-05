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

// function Todos() {
//   // Access the client
//   const queryClient = useQueryClient();

//   // Queries
//   const query = useQuery({ queryKey: ["todos"], queryFn: getTodos });

//   // Mutations
//   const mutation = useMutation({
//     mutationFn: postTodo,
//     onSuccess: () => {
//       // Invalidate and refetch
//       queryClient.invalidateQueries({ queryKey: ["todos"] });
//     },
//   });

//   return (
//     <div>
//       <ul>
//         {query.data?.map((todo) => (
//           <li key={todo.id}>{todo.title}</li>
//         ))}
//       </ul>

//       <Button
//         onClick={() => {
//           mutation.mutate({
//             id: Date.now(),
//             title: "Do Laundry",
//           });
//         }}
//       >
//         Add Todo
//       </Button>
//     </div>
//   );
// }
export default App;

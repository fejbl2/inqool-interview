import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api";

export default function UsersPage() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: getUsers,
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data!.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

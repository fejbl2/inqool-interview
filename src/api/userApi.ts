import { axiosInstance } from "./common";
import { mockUserData } from "./mock";

export type User = {
  id: string;
  name: string;
  gender: "female" | "male" | "other";
  banned: boolean;
};

export type CreateUser = Omit<User, "id">;

export type UpdateUser = Partial<Omit<User, "id">>;

export const getUsers = async () => {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    return mockUserData;
  }

  const res = await axiosInstance.get<User[]>("/users");
  return res.data;
};

export const createUser = (user: CreateUser) =>
  axiosInstance.post<User>("/users", user).then((res) => res.data);

export const updateUser = (id: User["id"], user: UpdateUser) =>
  axiosInstance.put<User>(`/users/${id}`, user).then((res) => res.data);

export const deleteUser = (id: User["id"]) =>
  axiosInstance.delete(`/users/${id}`);

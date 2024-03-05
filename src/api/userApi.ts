import { z } from "zod";
import { axiosInstance } from "./common";
import { mockApi } from "./mock";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  gender: z.enum(["female", "male", "other"]),
  banned: z.boolean(),
});

const usersSchema = z.array(userSchema);

export type User = z.infer<typeof userSchema>;

export type CreateUser = Omit<User, "id">;

export type UpdateUser = Partial<Omit<User, "id">> & Pick<User, "id">;

export const getUsers = async () => {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    return new Promise<User[]>((resolve) =>
      setTimeout(() => resolve(usersSchema.parse(mockApi.mockUserData)), 1000)
    );
  }

  const res = await axiosInstance.get<User[]>("/users");
  return usersSchema.parse(res.data);
};

export const createUser = async (user: CreateUser) => {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    const newUser = userSchema.parse({
      ...user,
      id: String(mockApi.mockUserData.length + 1),
    });
    mockApi.mockUserData.push(newUser);
    return newUser;
  }

  return axiosInstance
    .post<User>("/users", user)
    .then((res) => userSchema.parse(res.data));
};

export const updateUser = async (user: UpdateUser) => {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    mockApi.mockUserData = mockApi.mockUserData.map((u) =>
      u.id === user.id ? { ...u, ...user } : u
    );
    return userSchema.parse(mockApi.mockUserData.find((u) => u.id === user.id));
  }
  return axiosInstance
    .put<User>(`/users/${user.id}`, user)
    .then((res) => userSchema.parse(res.data));
};

export const deleteUser = (id: User["id"]) =>
  axiosInstance.delete(`/users/${id}`);

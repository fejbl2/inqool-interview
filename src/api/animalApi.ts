import { axiosInstance } from "./common";

export type Animal = {
  id: string;
  name: string;
  type: "cat" | "dog" | "other";
  age: number;
};

export type CreateAnimal = Omit<Animal, "id">;

export type UpdateAnimal = Partial<Omit<Animal, "id">>;

export const getAnimals = () =>
  axiosInstance.get<Animal[]>("/animals").then((res) => res.data);

export const createAnimal = (Animal: CreateAnimal) =>
  axiosInstance.post<Animal>("/animals", Animal).then((res) => res.data);

export const updateAnimal = (id: Animal["id"], Animal: UpdateAnimal) =>
  axiosInstance.put<Animal>(`/animals/${id}`, Animal).then((res) => res.data);

export const deleteAnimal = (id: Animal["id"]) =>
  axiosInstance.delete(`/animals/${id}`);

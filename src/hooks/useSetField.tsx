import { useCallback } from "react";

export default function useSetField<T>(
  setFn: React.Dispatch<React.SetStateAction<T>>
) {
  return useCallback(
    <F extends keyof T>(field: F) =>
      (value: T[F]) => {
        setFn((prev) => ({
          ...prev,
          [field]: value,
        }));
      },
    [setFn]
  );
}

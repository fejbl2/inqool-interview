import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { User } from "../api";

export default function GenderEditor({
  value,
  onChange,
}: {
  value: User["gender"];
  onChange: (value: User["gender"]) => void;
}) {
  const { t } = useTranslation("users");

  return (
    <Autocomplete
      options={["male", "female", "other"] as const}
      value={value}
      disableClearable
      onChange={(_, value) => {
        onChange(value);
      }}
      renderInput={(params) => (
        <TextField {...params} size="small" label={t("gender")} />
      )}
      filterOptions={(x) => x}
    />
  );
}

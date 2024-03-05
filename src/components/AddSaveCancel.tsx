import { Add, Cancel, Save } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function AddSaveCancel({
  isEditing,
  onAdd,
  onSave,
  onCancel,
}: {
  isEditing: boolean;
  onAdd: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation("users");

  if (isEditing) {
    return (
      <>
        <Tooltip title={t("cancel")}>
          <IconButton onClick={onCancel}>
            <Cancel />
          </IconButton>
        </Tooltip>

        <Tooltip title={t("save")}>
          <IconButton onClick={onSave}>
            <Save />
          </IconButton>
        </Tooltip>
      </>
    );
  }

  return (
    <Tooltip title={t("addUser")}>
      <IconButton onClick={onAdd}>
        <Add />
      </IconButton>
    </Tooltip>
  );
}

import { Cancel, Edit, Save } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function EditSaveCancel({
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: {
  isEditing: boolean;
  onEdit: () => void;
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
    <Tooltip title={t("edit")}>
      <IconButton onClick={onEdit}>
        <Edit />
      </IconButton>
    </Tooltip>
  );
}

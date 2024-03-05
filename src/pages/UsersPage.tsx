import { Block, Check, Clear } from "@mui/icons-material";
import {
  Autocomplete,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, getUsers, updateUser } from "../api";
import EditSaveCancel from "../components/EditSaveCancel";
import useSetField from "../hooks/useSetField";

export default function UsersPage() {
  const { t } = useTranslation("users");

  const { isLoading, error, data, isRefetching } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  console.log("xxx is loading", isLoading);
  console.log("xxx is isRefetching", isRefetching);

  const queryClient = useQueryClient();

  const mutateUser = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const [filter, setFilter] = useState("");
  const [editingState, setEditingState] = useState(
    {} as Record<
      User["id"],
      {
        editing: boolean;
      } & User
    >
  );

  const setEditingField = useSetField(setEditingState);

  const setName = (row: User, name: string) => {
    setEditingState((prev) => ({
      ...prev,
      [row.id]: {
        ...prev[row.id],
        name: name,
      },
    }));
  };

  const setGender = (row: User, gender: User["gender"]) => {
    setEditingState((prev) => ({
      ...prev,
      [row.id]: {
        ...prev[row.id],
        gender: gender,
      },
    }));
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading || !data) {
    return <CircularProgress />;
  }

  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(filter.toLowerCase())
  );

  const isRowEditing = (user: User) => editingState[user.id]?.editing;
  const isUserBanned = (user: User) => user.banned;

  return (
    <div>
      <h1>{t("users")}</h1>
      <Paper>
        <h2>{t("filterByUsername")}:</h2>
        <TextField
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          component={"span"}
          title={t("filterByUsername")}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setFilter("")}>
                <Clear />
              </IconButton>
            ),
          }}
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t("edit")}</TableCell>
                <TableCell>{t("userName")}</TableCell>
                <TableCell>Id</TableCell>
                <TableCell align="right">{t("gender")}</TableCell>
                <TableCell align="right">{t("banned")}?</TableCell>
                <TableCell align="center">{t("ban")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 && !isRefetching ? (
                filteredData.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <EditSaveCancel
                        isEditing={isRowEditing(row)}
                        onEdit={() =>
                          setEditingField(row.id)({ ...row, editing: true })
                        }
                        onSave={() => {
                          setEditingField(row.id)({ ...row, editing: false });
                          mutateUser.mutate(editingState[row.id]);
                        }}
                        onCancel={() =>
                          setEditingField(row.id)({ ...row, editing: false })
                        }
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {isRowEditing(row) ? (
                        <TextField
                          value={editingState[row.id].name}
                          onChange={(e) => setName(row, e.target.value)}
                          size="small"
                        />
                      ) : (
                        row.name
                      )}
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell align="right">
                      {isRowEditing(row) ? (
                        <Autocomplete
                          options={["male", "female", "other"] as const}
                          value={editingState[row.id].gender}
                          disableClearable
                          onChange={(_, value) => {
                            setGender(row, value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              title={t("gender")}
                            />
                          )}
                          filterOptions={(x) => x}
                        />
                      ) : (
                        row.gender
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {t(row.banned ? "banned" : "notBanned")}
                    </TableCell>
                    <TableCell align="center">
                      {isUserBanned(row) ? (
                        <Tooltip title={t("unban")}>
                          <IconButton
                            onClick={() => {
                              mutateUser.mutate({
                                ...row,
                                banned: !row.banned,
                              });
                            }}
                          >
                            <Check />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title={t("ban")}>
                          <IconButton
                            onClick={() => {
                              mutateUser.mutate({
                                ...row,
                                banned: !row.banned,
                              });
                            }}
                          >
                            <Block />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    colSpan={4}
                    align="center"
                  >
                    {isLoading || isRefetching ? (
                      <CircularProgress />
                    ) : (
                      "No users found"
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

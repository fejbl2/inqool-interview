import { Block, Check, Clear } from "@mui/icons-material";
import {
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
import { User, createUser, getUsers, updateUser } from "../api";
import { GenderEditor } from "../components";
import AddSaveCancel from "../components/AddSaveCancel";
import EditSaveCancel from "../components/EditSaveCancel";
import useSetField from "../hooks/useSetField";

export default function UsersPage() {
  const { t } = useTranslation("users");

  const { isLoading, error, data, isRefetching } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const queryClient = useQueryClient();

  const mutateUser = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const addUser = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
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

  const getNewUser = (): User & { editing: boolean } => ({
    id: "0",
    name: "",
    banned: false,
    editing: false,
    gender: "male",
  });

  const [newUser, setNewUser] = useState(getNewUser);

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

  const setGender = (row: User) => (gender: User["gender"]) => {
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

  console.log("xxx newUser.editing", newUser.editing);

  return (
    <div>
      <h1>{t("users")}</h1>
      <Paper sx={{ p: 2 }}>
        <TextField
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          component={"span"}
          label={t("filterByUsername")}
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
              <TableRow>
                <TableCell colSpan={newUser.editing ? 1 : 6}>
                  <AddSaveCancel
                    isEditing={newUser.editing}
                    onAdd={() => {
                      setNewUser((prev) => ({ ...prev, editing: true }));
                    }}
                    onSave={() => {
                      addUser.mutate(newUser);
                      setNewUser(getNewUser);
                    }}
                    onCancel={() => {
                      setNewUser(getNewUser);
                    }}
                  />
                </TableCell>
                {newUser.editing ? (
                  <>
                    <TableCell>
                      <TextField
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        size="small"
                        label={t("userName")}
                      />
                    </TableCell>
                    <TableCell>{t("willBeGenerated")}</TableCell>
                    <TableCell>
                      <GenderEditor
                        onChange={(gender) =>
                          setNewUser((prev) => ({ ...prev, gender: gender }))
                        }
                        value={newUser.gender}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </>
                ) : null}
              </TableRow>
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
                          label={t("userName")}
                        />
                      ) : (
                        row.name
                      )}
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell align="right">
                      {isRowEditing(row) ? (
                        <GenderEditor
                          onChange={setGender(row)}
                          value={editingState[row.id].gender}
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

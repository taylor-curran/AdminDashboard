import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import type { Toast as ToastType } from "primereact/toast";
import { getUsers, createUser, updateUser, deleteUser } from "../api/users";
import type { User } from "../types";
import { validatePasswordStrength } from "../lib/password-validator";
import "./PageTitle.css";
import "./UsersPage.css";

const roleOptions = [
  { label: "Administrator", value: "Administrator" },
  { label: "Customer", value: "Customer" },
];

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
};

export function UsersPage() {
  const toast = useRef<ToastType>(null);
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const usersQuery = useQuery({ queryKey: ["users"], queryFn: getUsers });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roles: [],
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (usersQuery.isError) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load users",
      });
    }
  }, [usersQuery.isError]);

  const invalidateUsers = () => queryClient.invalidateQueries({ queryKey: ["users"] });

  const onSubmit = handleSubmit(async (data) => {
    const user: User = {
      ...data,
      createdOn: new Date(),
    };

    try {
      if (isEdit && currentUserId !== "") {
        await updateUser(currentUserId, user);
        toast.current?.show({
          severity: "info",
          summary: "Success",
          detail: "User updated",
        });
      } else {
        await createUser(user);
        toast.current?.show({
          severity: "info",
          summary: "Success",
          detail: "User created",
        });
      }
      await invalidateUsers();
      resetForm();
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: isEdit ? "Failed to update user" : "Failed to create user",
      });
    }
  });

  const resetForm = () => {
    setIsEdit(false);
    setCurrentUserId("");
    reset();
  };

  const editUser = (user: User) => {
    setIsEdit(true);
    setCurrentUserId(user.id!);
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      roles: [...user.roles],
    });
  };

  const confirmDeleteUser = (_event: React.MouseEvent, id: string) => {
    confirmDialog({
      message: "Do you want to delete this user?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger p-button-text",
      rejectClassName: "p-button-text p-button-text",
      accept: async () => {
        try {
          await deleteUser(id);
          toast.current?.show({
            severity: "info",
            summary: "Success",
            detail: "User deleted",
          });
          await invalidateUsers();
        } catch {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete user",
          });
        }
      },
      reject: () => {
        toast.current?.show({
          severity: "error",
          summary: "Rejected",
          detail: "You have rejected",
        });
      },
    });
  };

  const users = usersQuery.data ?? [];

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="title-container">
        <h1 className="title">User Management</h1>
      </div>
      <div className="user-container">
        <form onSubmit={onSubmit} className="user-form">
          <div>
            <label htmlFor="firstName">First Name</label>
            <InputText
              id="firstName"
              className={errors.firstName ? "p-invalid" : ""}
              {...register("firstName", { required: true, maxLength: 50 })}
            />
            {errors.firstName && touchedFields.firstName ? (
              <div>
                {errors.firstName.type === "required" ? (
                  <small>First Name is required.</small>
                ) : null}
                {errors.firstName.type === "maxLength" ? (
                  <small>First Name cannot exceed 50 characters.</small>
                ) : null}
              </div>
            ) : null}
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <InputText
              id="lastName"
              className={errors.lastName ? "p-invalid" : ""}
              {...register("lastName", { required: true, maxLength: 50 })}
            />
            {errors.lastName && touchedFields.lastName ? (
              <div>
                {errors.lastName.type === "required" ? (
                  <small>Last Name is required.</small>
                ) : null}
                {errors.lastName.type === "maxLength" ? (
                  <small>Last Name cannot exceed 50 characters.</small>
                ) : null}
              </div>
            ) : null}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              className={errors.email ? "p-invalid" : ""}
              {...register("email", {
                required: true,
                maxLength: 50,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
            />
            {errors.email && touchedFields.email ? (
              <div>
                {errors.email.type === "required" ? <small>Email is required.</small> : null}
                {errors.email.type === "pattern" ? <small>Email must be valid.</small> : null}
                {errors.email.type === "maxLength" ? (
                  <small>Email cannot exceed 50 characters.</small>
                ) : null}
              </div>
            ) : null}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <InputText
              id="password"
              type="password"
              className={errors.password ? "p-invalid" : ""}
              {...register("password", {
                required: true,
                minLength: 8,
                validate: {
                  passwordStrength: (v) =>
                    validatePasswordStrength(v || "") || "Password not strong enough",
                },
              })}
            />
            {errors.password && touchedFields.password ? (
              <div>
                {errors.password.type === "required" ? (
                  <small>Password is required.</small>
                ) : null}
                {errors.password.type === "minLength" ? (
                  <small>Password needs to be at least 8 characters long.</small>
                ) : null}
                {errors.password.type === "passwordStrength" ? (
                  <small>Password not strong enough.</small>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="roles-field">
            <label htmlFor="roles">Roles</label>
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  id="roles"
                  value={field.value}
                  options={roleOptions}
                  onChange={(e) => field.onChange(e.value)}
                  display="chip"
                  className="roles-multiselect"
                />
              )}
            />
          </div>
          <div className="two-buttons">
            <Button type="submit" label={isEdit ? "Update User" : "Add User"} />
            <Button type="button" label="Reset" severity="secondary" onClick={resetForm} />
          </div>
        </form>

        <div className="table-container">
          <DataTable value={users} paginator rows={10} emptyMessage="No users found.">
            <Column field="firstName" header="First Name" />
            <Column field="lastName" header="Last Name" />
            <Column field="email" header="Email" />
            <Column
              header="Roles"
              body={(row: User) =>
                row.roles.length === 0 ? "No roles" : row.roles.join(", ")
              }
            />
            <Column
              header="Actions"
              body={(row: User) => (
                <div className="two-buttons table-actions">
                  <Button icon="pi pi-pencil" onClick={() => editUser(row)} />
                  <Button
                    icon="pi pi-times"
                    severity="danger"
                    onClick={(e) => confirmDeleteUser(e, row.id!)}
                  />
                </div>
              )}
            />
          </DataTable>
        </div>
      </div>
    </>
  );
}

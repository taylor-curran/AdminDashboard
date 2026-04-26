import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import type { Toast as ToastType } from "primereact/toast";
import { isPasswordStrong } from "../lib/password-validator";
import type { User } from "../types/user";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../services/user.service";

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

const emptyForm: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  roles: [],
};

export function UsersPage() {
  const toast = useRef<ToastType>(null);
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const users = usersQuery.data ?? [];

  useEffect(() => {
    if (usersQuery.isError) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load users",
      });
    }
  }, [usersQuery.isError]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({
    defaultValues: emptyForm,
    mode: "onTouched",
  });

  function resetForm() {
    setIsEdit(false);
    setCurrentUserId("");
    reset(emptyForm);
  }

  function editUser(user: User) {
    setIsEdit(true);
    setCurrentUserId(user.id!);
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      roles: user.roles ?? [],
    });
  }

  const onSubmit = handleSubmit(async (values) => {
    const userPayload: User = {
      ...values,
      createdOn: new Date(),
    };

    try {
      if (isEdit && currentUserId !== "") {
        await updateUser(currentUserId, userPayload);
        toast.current?.show({
          severity: "info",
          summary: "Success",
          detail: "User updated",
        });
      } else {
        await createUser(userPayload);
        toast.current?.show({
          severity: "info",
          summary: "Success",
          detail: "User created",
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      resetForm();
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: isEdit ? "Failed to update user" : "Failed to create user",
      });
    }
  });

  function confirmDeleteUser(event: React.MouseEvent, id: string) {
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
          await queryClient.invalidateQueries({ queryKey: ["users"] });
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
  }

  const actionsBody = (row: User) => (
    <div className="two-buttons">
      <Button
        type="button"
        icon="pi pi-pencil"
        onClick={() => editUser(row)}
      />
      <div>
        <Button
          type="button"
          icon="pi pi-times"
          severity="danger"
          onClick={(e) => confirmDeleteUser(e, row.id!)}
        />
      </div>
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="title-container">
        <h1 className="title">User Management</h1>
      </div>
      <div className="user-container">
        <form className="user-form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="firstName">First Name</label>
            <InputText
              id="firstName"
              invalid={!!errors.firstName}
              {...register("firstName", {
                required: true,
                maxLength: 50,
              })}
            />
            {touchedFields.firstName && errors.firstName ? (
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
          <div className="field">
            <label htmlFor="lastName">Last Name</label>
            <InputText
              id="lastName"
              invalid={!!errors.lastName}
              {...register("lastName", {
                required: true,
                maxLength: 50,
              })}
            />
            {touchedFields.lastName && errors.lastName ? (
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
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              invalid={!!errors.email}
              {...register("email", {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                maxLength: 50,
              })}
            />
            {touchedFields.email && errors.email ? (
              <div>
                {errors.email.type === "required" ? (
                  <small>Email is required.</small>
                ) : null}
                {errors.email.type === "pattern" ? (
                  <small>Email must be valid.</small>
                ) : null}
                {errors.email.type === "maxLength" ? (
                  <small>Email cannot exceed 50 characters.</small>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <InputText
              id="password"
              type="password"
              invalid={!!errors.password}
              {...register("password", {
                required: true,
                minLength: 8,
                validate: (v) =>
                  isPasswordStrong(v) ? true : ("passwordStrength" as const),
              })}
            />
            {touchedFields.password && errors.password ? (
              <div>
                {errors.password.type === "required" ? (
                  <small>Password is required.</small>
                ) : null}
                {errors.password.type === "minLength" ? (
                  <small>Password needs to be at least 8 characters long.</small>
                ) : null}
                {errors.password.type === "validate" &&
                errors.password.message === "passwordStrength" ? (
                  <small>Password not strong enough.</small>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="field" style={{ width: "100%" }}>
            <label htmlFor="roles">Roles</label>
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  id="roles"
                  value={field.value}
                  options={roleOptions}
                  onChange={(e) => field.onChange(e.value ?? [])}
                  display="chip"
                  className="w-full"
                />
              )}
            />
          </div>
          <div className="two-buttons">
            <Button
              type="submit"
              label={isEdit ? "Update User" : "Add User"}
            />
            <Button
              type="button"
              label="Reset"
              severity="secondary"
              onClick={resetForm}
            />
          </div>
        </form>

        <div className="table-container">
          <DataTable value={users} paginator rows={10}>
            <Column field="firstName" header="First Name" />
            <Column field="lastName" header="Last Name" />
            <Column field="email" header="Email" />
            <Column
              header="Roles"
              body={(row: User) =>
                row.roles?.length === 0
                  ? "No roles"
                  : row.roles.join(", ")
              }
            />
            <Column header="Actions" body={actionsBody} />
          </DataTable>
        </div>
      </div>
    </>
  );
}

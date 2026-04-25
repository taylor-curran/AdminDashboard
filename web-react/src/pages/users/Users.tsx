import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { userService } from "../../services/userService";
import type { User } from "../../services/types";
import { validatePasswordStrength } from "./passwordValidator";
import "./Users.css";

interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const multiSelectOptions = [
  { label: "Administrator", value: "Administrator" },
  { label: "Customer", value: "Customer" },
];

const emptyForm: UserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  roles: [],
};

export function UsersPage() {
  const toast = useRef<Toast>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
    trigger,
  } = useForm<UserFormValues>({
    defaultValues: emptyForm,
    mode: "onTouched",
  });

  const loadUsers = () => {
    userService
      .getUsers()
      .then(setUsers)
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load users",
        });
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setIsEdit(false);
    setCurrentUserId("");
    reset(emptyForm);
  };

  const onSubmit = async (values: UserFormValues) => {
    const user: User = {
      ...values,
      id: isEdit ? currentUserId : "",
      createdOn: new Date().toISOString(),
    };

    try {
      if (isEdit && currentUserId !== "") {
        await userService.updateUser(currentUserId, user);
        toast.current?.show({
          severity: "info",
          summary: "Success",
          detail: "User updated",
        });
      } else {
        await userService.createUser(user);
        toast.current?.show({
          severity: "info",
          summary: "Success",
          detail: "User created",
        });
      }
      loadUsers();
      resetForm();
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: isEdit ? "Failed to update user" : "Failed to create user",
      });
    }
  };

  const editUser = (user: User) => {
    setIsEdit(true);
    setCurrentUserId(user.id);
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      roles: user.roles ?? [],
    });
  };

  const deleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      toast.current?.show({
        severity: "info",
        summary: "Success",
        detail: "User deleted",
      });
      loadUsers();
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete user",
      });
    }
  };

  const confirmDeleteUser = (_event: React.MouseEvent, id: string) => {
    confirmDialog({
      message: "Do you want to delete this user?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger p-button-text",
      rejectClassName: "p-button-text p-button-text",
      acceptIcon: "none" as any,
      rejectIcon: "none" as any,
      accept: () => deleteUser(id),
      reject: () => {
        toast.current?.show({
          severity: "error",
          summary: "Rejected",
          detail: "You have rejected",
        });
      },
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="title-container">
        <h1 className="title">User Management</h1>
      </div>
      <div className="user-container">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="firstName">First Name</label>
            <InputText
              id="firstName"
              {...register("firstName", {
                required: true,
                maxLength: 50,
              })}
              onBlur={() => trigger("firstName")}
            />
            {errors.firstName && touchedFields.firstName && (
              <div>
                {errors.firstName.type === "required" && (
                  <small>First Name is required.</small>
                )}
                {errors.firstName.type === "maxLength" && (
                  <small>First Name cannot exceed 50 characters.</small>
                )}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <InputText
              id="lastName"
              {...register("lastName", {
                required: true,
                maxLength: 50,
              })}
              onBlur={() => trigger("lastName")}
            />
            {errors.lastName && touchedFields.lastName && (
              <div>
                {errors.lastName.type === "required" && (
                  <small>Last Name is required.</small>
                )}
                {errors.lastName.type === "maxLength" && (
                  <small>Last Name cannot exceed 50 characters.</small>
                )}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              {...register("email", {
                required: true,
                maxLength: 50,
                pattern: EMAIL_RE,
              })}
              onBlur={() => trigger("email")}
            />
            {errors.email && touchedFields.email && (
              <div>
                {errors.email.type === "required" && (
                  <small>Email is required.</small>
                )}
                {errors.email.type === "pattern" && (
                  <small>Email must be valid.</small>
                )}
                {errors.email.type === "maxLength" && (
                  <small>Email cannot exceed 50 characters.</small>
                )}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <InputText
              id="password"
              type="password"
              {...register("password", {
                required: true,
                minLength: 8,
                validate: (v) =>
                  validatePasswordStrength(v) || "passwordStrength",
              })}
              onBlur={() => trigger("password")}
            />
            {errors.password && touchedFields.password && (
              <div>
                {errors.password.type === "required" && (
                  <small>Password is required.</small>
                )}
                {errors.password.type === "minLength" && (
                  <small>
                    Password needs to be at least 8 characters long.
                  </small>
                )}
                {errors.password.type === "validate" && (
                  <small>Password not strong enough.</small>
                )}
              </div>
            )}
          </div>
          <div style={{ width: "100%" }}>
            <label htmlFor="roles">Roles</label>
            <Controller
              control={control}
              name="roles"
              render={({ field }) => (
                <MultiSelect
                  id="roles"
                  options={multiSelectOptions}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                />
              )}
            />
          </div>
          <div className="two-buttons">
            <Button type="submit">{isEdit ? "Update" : "Add"} User</Button>
            <Button
              type="button"
              severity="secondary"
              onClick={() => resetForm()}
            >
              Reset
            </Button>
          </div>
        </form>

        <div className="table-container">
          <DataTable value={users} paginator rows={10} dataKey="id">
            <Column field="firstName" header="First Name" />
            <Column field="lastName" header="Last Name" />
            <Column field="email" header="Email" />
            <Column
              header="Roles"
              body={(u: User) =>
                !u.roles || u.roles.length === 0
                  ? "No roles"
                  : u.roles.join(", ")
              }
            />
            <Column
              header="Actions"
              body={(u: User) => (
                <div className="two-buttons">
                  <Button
                    icon="pi pi-pencil"
                    aria-label={`Edit ${u.email}`}
                    onClick={() => editUser(u)}
                  />
                  <div>
                    <Button
                      icon="pi pi-times"
                      severity="danger"
                      aria-label={`Delete ${u.email}`}
                      onClick={(ev) => confirmDeleteUser(ev, u.id)}
                    />
                  </div>
                </div>
              )}
            />
          </DataTable>
        </div>
      </div>
    </>
  );
}

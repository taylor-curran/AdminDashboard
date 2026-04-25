import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { userService } from "../../services/user.service";
import { User } from "../../types";
import { validatePassword } from "./password-validator";
import "./UsersPage.css";

const roleOptions = [
  { label: "Administrator", value: "Administrator" },
  { label: "Customer", value: "Customer" },
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

interface TouchedState {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
}

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  roles: [],
};

const emptyTouched: TouchedState = {
  firstName: false,
  lastName: false,
  email: false,
  password: false,
};

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [touched, setTouched] = useState<TouchedState>({ ...emptyTouched });
  const [isEdit, setIsEdit] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const toast = useRef<Toast>(null);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load users" });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBlur = (field: keyof TouchedState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: keyof FormState, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getErrors = () => {
    const errors: Record<string, string[]> = {
      firstName: [],
      lastName: [],
      email: [],
      password: [],
    };

    if (!form.firstName) errors.firstName.push("required");
    if (form.firstName.length > 50) errors.firstName.push("maxLength");

    if (!form.lastName) errors.lastName.push("required");
    if (form.lastName.length > 50) errors.lastName.push("maxLength");

    if (!form.email) errors.email.push("required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email.push("email");
    if (form.email.length > 50) errors.email.push("maxLength");

    if (!form.password) errors.password.push("required");
    else {
      if (form.password.length < 8) errors.password.push("minLength");
      if (validatePassword(form.password)) errors.password.push("passwordStrength");
    }

    return errors;
  };

  const errors = getErrors();
  const isFormValid =
    Object.values(errors).every((e) => e.length === 0);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const userData = {
      ...form,
      createdOn: new Date().toISOString(),
    };

    try {
      if (isEdit && currentUserId) {
        await userService.updateUser(currentUserId, userData);
        toast.current?.show({ severity: "info", summary: "Success", detail: "User updated" });
      } else {
        await userService.createUser(userData);
        toast.current?.show({ severity: "info", summary: "Success", detail: "User created" });
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
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      roles: user.roles,
    });
    setTouched({ ...emptyTouched });
  };

  const confirmDeleteUser = (_e: React.MouseEvent, id: string) => {
    confirmDialog({
      message: "Do you want to delete this user?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger p-button-text",
      rejectClassName: "p-button-text p-button-text",
      accept: () => deleteUser(id),
      reject: () => {
        toast.current?.show({ severity: "error", summary: "Rejected", detail: "You have rejected" });
      },
    });
  };

  const deleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      toast.current?.show({ severity: "info", summary: "Success", detail: "User deleted" });
      loadUsers();
    } catch {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to delete user" });
    }
  };

  const resetForm = () => {
    setIsEdit(false);
    setCurrentUserId("");
    setForm({ ...emptyForm });
    setTouched({ ...emptyTouched });
  };

  const actionsTemplate = (rowData: User) => (
    <div className="two-buttons">
      <Button icon="pi pi-pencil" onClick={() => editUser(rowData)} />
      <div>
        <Button
          icon="pi pi-times"
          severity="danger"
          onClick={(e) => confirmDeleteUser(e, rowData.id)}
        />
      </div>
    </div>
  );

  const rolesTemplate = (rowData: User) => (
    <>{rowData.roles.length === 0 ? "No roles" : rowData.roles.join(", ")}</>
  );

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="title-container">
        <h1 className="title">User Management</h1>
      </div>
      <div className="user-container">
        <form onSubmit={submitForm}>
          <div>
            <label htmlFor="firstName">First Name</label>
            <InputText
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
            />
            {touched.firstName && errors.firstName.length > 0 && (
              <div>
                {errors.firstName.includes("required") && <small>First Name is required.</small>}
                {errors.firstName.includes("maxLength") && <small>First Name cannot exceed 50 characters.</small>}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <InputText
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
            />
            {touched.lastName && errors.lastName.length > 0 && (
              <div>
                {errors.lastName.includes("required") && <small>Last Name is required.</small>}
                {errors.lastName.includes("maxLength") && <small>Last Name cannot exceed 50 characters.</small>}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
            />
            {touched.email && errors.email.length > 0 && (
              <div>
                {errors.email.includes("required") && <small>Email is required.</small>}
                {errors.email.includes("email") && <small>Email must be valid.</small>}
                {errors.email.includes("maxLength") && <small>Email cannot exceed 50 characters.</small>}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <InputText
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
            />
            {touched.password && errors.password.length > 0 && (
              <div>
                {errors.password.includes("required") && <small>Password is required.</small>}
                {errors.password.includes("minLength") && <small>Password needs to be at least 8 characters long.</small>}
                {errors.password.includes("passwordStrength") && <small>Password not strong enough.</small>}
              </div>
            )}
          </div>
          <div style={{ width: "100%" }}>
            <label htmlFor="roles">Roles</label>
            <MultiSelect
              id="roles"
              options={roleOptions}
              value={form.roles}
              onChange={(e) => handleChange("roles", e.value)}
            />
          </div>
          <div className="two-buttons">
            <Button type="submit">{isEdit ? "Update" : "Add"} User</Button>
            <Button type="button" severity="secondary" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </form>

        <div className="table-container">
          <DataTable value={users} paginator rows={10}>
            <Column field="firstName" header="First Name" />
            <Column field="lastName" header="Last Name" />
            <Column field="email" header="Email" />
            <Column header="Roles" body={rolesTemplate} />
            <Column header="Actions" body={actionsTemplate} />
          </DataTable>
        </div>
      </div>
    </>
  );
}

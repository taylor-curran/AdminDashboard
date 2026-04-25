import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { userService } from '../../services/userService';
import { User } from '../../types';
import { validatePassword } from './passwordValidator';
import './UsersPage.css';

const roleOptions = [
  { label: 'Administrator', value: 'Administrator' },
  { label: 'Customer', value: 'Customer' },
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

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roles: [],
};

const initialTouched: TouchedState = {
  firstName: false,
  lastName: false,
  email: false,
  password: false,
};

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<TouchedState>(initialTouched);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const toast = useRef<Toast>(null);

  const loadUsers = () => {
    userService.getUsers().then(setUsers).catch(() => {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load users',
      });
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (field: keyof FormState, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof TouchedState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getErrors = () => {
    const errors: Record<string, string[]> = {
      firstName: [],
      lastName: [],
      email: [],
      password: [],
    };

    if (!form.firstName) errors.firstName.push('First Name is required.');
    if (form.firstName.length > 50) errors.firstName.push('First Name cannot exceed 50 characters.');

    if (!form.lastName) errors.lastName.push('Last Name is required.');
    if (form.lastName.length > 50) errors.lastName.push('Last Name cannot exceed 50 characters.');

    if (!form.email) errors.email.push('Email is required.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email.push('Email must be valid.');
    if (form.email.length > 50) errors.email.push('Email cannot exceed 50 characters.');

    if (!form.password) errors.password.push('Password is required.');
    if (form.password && form.password.length < 8)
      errors.password.push('Password needs to be at least 8 characters long.');
    const pwStrength = validatePassword(form.password);
    if (form.password && form.password.length >= 8 && pwStrength)
      errors.password.push(pwStrength);

    return errors;
  };

  const errors = getErrors();
  const isFormValid =
    Object.values(errors).every((arr) => arr.length === 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, password: true });

    if (!isFormValid) return;

    const userData = {
      ...form,
      createdOn: new Date().toISOString(),
    };

    if (isEdit && currentUserId !== '') {
      userService
        .updateUser(currentUserId, userData as User)
        .then(() => {
          toast.current?.show({
            severity: 'info',
            summary: 'Success',
            detail: 'User updated',
          });
          loadUsers();
          resetForm();
        })
        .catch(() => {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update user',
          });
        });
    } else {
      userService
        .createUser(userData as Omit<User, 'id'>)
        .then(() => {
          toast.current?.show({
            severity: 'info',
            summary: 'Success',
            detail: 'User created',
          });
          loadUsers();
          resetForm();
        })
        .catch(() => {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create user',
          });
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
  };

  const confirmDeleteUser = (_event: React.MouseEvent, id: string) => {
    confirmDialog({
      message: 'Do you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger p-button-text',
      rejectClassName: 'p-button-text p-button-text',
      accept: () => {
        userService
          .deleteUser(id)
          .then(() => {
            toast.current?.show({
              severity: 'info',
              summary: 'Success',
              detail: 'User deleted',
            });
            loadUsers();
          })
          .catch(() => {
            toast.current?.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete user',
            });
          });
      },
      reject: () => {
        toast.current?.show({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  };

  const resetForm = () => {
    setIsEdit(false);
    setCurrentUserId('');
    setForm(initialForm);
    setTouched(initialTouched);
  };

  const rolesBodyTemplate = (user: User) => {
    return user.roles.length === 0 ? 'No roles' : user.roles.join(', ');
  };

  const actionsBodyTemplate = (user: User) => {
    return (
      <div className="two-buttons">
        <Button icon="pi pi-pencil" onClick={() => editUser(user)} />
        <div>
          <Button
            icon="pi pi-times"
            severity="danger"
            onClick={(e) => confirmDeleteUser(e, user.id)}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="title-container">
        <h1 className="title">User Management</h1>
      </div>
      <div className="user-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName">First Name</label>
            <InputText
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
            />
            {touched.firstName && errors.firstName.length > 0 && (
              <div>
                {errors.firstName.map((msg, i) => (
                  <small key={i}>{msg}</small>
                ))}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <InputText
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
            />
            {touched.lastName && errors.lastName.length > 0 && (
              <div>
                {errors.lastName.map((msg, i) => (
                  <small key={i}>{msg}</small>
                ))}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
            />
            {touched.email && errors.email.length > 0 && (
              <div>
                {errors.email.map((msg, i) => (
                  <small key={i}>{msg}</small>
                ))}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <InputText
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
            />
            {touched.password && errors.password.length > 0 && (
              <div>
                {errors.password.map((msg, i) => (
                  <small key={i}>{msg}</small>
                ))}
              </div>
            )}
          </div>
          <div style={{ width: '100%' }}>
            <label htmlFor="roles">Roles</label>
            <MultiSelect
              id="roles"
              options={roleOptions}
              value={form.roles}
              onChange={(e) => handleChange('roles', e.value)}
            />
          </div>
          <div className="two-buttons">
            <Button type="submit" label={isEdit ? 'Update User' : 'Add User'} />
            <Button
              type="button"
              severity="secondary"
              label="Reset"
              onClick={resetForm}
            />
          </div>
        </form>

        <div className="table-container">
          <DataTable value={users} paginator rows={10}>
            <Column field="firstName" header="First Name" />
            <Column field="lastName" header="Last Name" />
            <Column field="email" header="Email" />
            <Column header="Roles" body={rolesBodyTemplate} />
            <Column header="Actions" body={actionsBodyTemplate} />
          </DataTable>
        </div>
      </div>
    </>
  );
}

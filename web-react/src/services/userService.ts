import axios from 'axios';
import { User } from '../types';

const API_URL = '/api/users';

export const userService = {
  getUsers(): Promise<User[]> {
    return axios.get<User[]>(API_URL).then((res) => res.data);
  },

  getUserById(id: string): Promise<User> {
    return axios.get<User>(`${API_URL}/${id}`).then((res) => res.data);
  },

  createUser(user: Omit<User, 'id'>): Promise<User> {
    return axios.post<User>(API_URL, user).then((res) => res.data);
  },

  updateUser(id: string, user: Partial<User>): Promise<User> {
    return axios.put<User>(`${API_URL}/${id}`, user).then((res) => res.data);
  },

  deleteUser(id: string): Promise<void> {
    return axios.delete(`${API_URL}/${id}`).then(() => undefined);
  },
};

import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (data:
{ title: string, userId: number, completed: boolean }) => {
  return client.post<Todo>('/todos', data);
};

export const removeTodo = (id : number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data:
Todo) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

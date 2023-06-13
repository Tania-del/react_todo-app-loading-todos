import { createContext, ReactNode, useState } from 'react';
import { getTodos, removeTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';

const USER_ID = 10535;

interface ITodoContext {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  gainTodos: () => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  total: number;
  handleCompleted: (id: number) => void;
  handleFilter: (type: FilterType) => void;
  filter: FilterType;
  isAnyCompleted: boolean;
  clearCompleted: () => void;
  handleAddTodo: (todo: Todo) => void;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  alwaysGreenTodos: Todo[];
  setAlwaysGreenTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  // handleTodoTitle: (id: number) => void;
}

export const TodoContext = createContext<ITodoContext>({
  todos: [],
  setTodos: () => {},
  gainTodos: async () => {},
  deleteTodo: async () => {},
  total: 0,
  handleCompleted: () => {},
  handleFilter: () => {},
  filter: 'all',
  isAnyCompleted: false,
  clearCompleted: () => {},
  handleAddTodo: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  alwaysGreenTodos: [],
  setAlwaysGreenTodos: () => {},
});

type FilterType = 'all' | 'completed' | 'active';
export const handleActions = (values: Todo[], type: FilterType) => {
  const actions: Record<FilterType, Todo[]> = {
    active: values.filter((todo) => todo.completed === false),
    all: values,
    completed: values.filter((todo) => todo.completed),
  };

  return actions[type];
};

const getTodoIndex = (values: Todo[], todoId: number) => {
  return values.findIndex(({ id }) => todoId === id);
};

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [alwaysGreenTodos, setAlwaysGreenTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  const handleAddTodo = (todo: Todo) => {
    const updated = [...alwaysGreenTodos, todo];

    const todosWhichAreRendered = handleActions(updated, filter);

    setTodos(todosWhichAreRendered);
    setAlwaysGreenTodos(updated);
    // setEditedTitle(todo.title);
  };

  const handleCompleted = async (id: number) => {
    const updatedTodos = alwaysGreenTodos.map((todo) => ({
      ...todo,
      completed: todo.id === id ? !todo.completed : todo.completed,
    }));

    setAlwaysGreenTodos(updatedTodos);
    setTodos(handleActions(updatedTodos, filter));
    const todo = updatedTodos.find((item) => item.id === id);

    try {
      if (todo) {
        await updateTodo(id, todo);
      }
    } catch (error) {
      setErrorMessage('Unable to update a todo');

      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleFilter = (type: FilterType) => {
    setFilter(type);

    const res = handleActions(alwaysGreenTodos, type);

    setTodos(res);
  };

  const gainTodos = async () => {
    const todosFromServer = await getTodos(USER_ID);

    setTodos(todosFromServer);
    setAlwaysGreenTodos(todosFromServer);
  };

  const deleteTodo = async (id: number) => {
    const indexInArray = getTodoIndex(todos, id);

    try {
      setTodos((prev) => {
        const values = [...prev];

        values[indexInArray].loading = true;

        return values;
      });
      await removeTodo(id);
      const updatedTodos = alwaysGreenTodos.filter((todo) => todo.id !== id);

      setAlwaysGreenTodos(updatedTodos);
      setTodos(handleActions(updatedTodos, filter));
    } catch (error) {
      setErrorMessage('Unable to delete todo');
      setTodos((prev) => {
        const values = [...prev];

        values[indexInArray].loading = false;

        return values;
      });

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  // eslint-disable-next-line @typescript-eslint/comma-dangle
  const findIndexes = <N,>(
    arr: N[],
    cb: (currentValue: N, index?: number, arr?: N[]) => boolean,
  ) => {
    const newArray: number[] = [];

    for (let i = 0; i < arr.length; i += 1) {
      const currentValue = arr[i];

      if (cb(currentValue, i, arr)) {
        newArray.push(i);
      }
    }

    return newArray;
  };

  // console.log(
  //   findIndexes(alwaysGreenTodos, (currentValue) => currentValue.completed),
  // );

  const clearCompleted = async () => {
    const indexes = findIndexes(
      alwaysGreenTodos,
      (currentValue) => currentValue.completed,
    );

    setTodos((prev) => {
      const copy = [...prev];

      indexes.forEach((current) => {
        copy[current].loading = true;
      });

      return copy;
    });

    await Promise.all(indexes.map((current) => removeTodo(todos[current].id)));

    // console.log(indexes);

    const updatedTodos = alwaysGreenTodos.filter(({ completed }) => !completed);

    setAlwaysGreenTodos(updatedTodos);

    setTodos(handleActions(updatedTodos, filter));
  };

  return (
    <TodoContext.Provider
      value={{
        setErrorMessage,
        errorMessage,
        todos,
        setTodos,
        gainTodos,
        deleteTodo,
        total: alwaysGreenTodos.filter((item) => !item.completed).length,
        handleCompleted,
        handleFilter,
        filter,
        isAnyCompleted: alwaysGreenTodos.some((item) => item.completed),
        clearCompleted,
        handleAddTodo,
        alwaysGreenTodos,
        setAlwaysGreenTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

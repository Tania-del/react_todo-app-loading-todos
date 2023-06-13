/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { updateTodo } from '../api/todos';
import { handleActions, TodoContext } from '../context/TodoContext';
import { Todo } from '../types/Todo';

type TodoType = {
  todo: Todo;
};

export const TodoComponent: React.FC<TodoType> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    deleteTodo,
    handleCompleted,
    setErrorMessage,
    filter,
    setTodos,
    setAlwaysGreenTodos,
    alwaysGreenTodos,
  } = useContext(TodoContext);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const swapTodoInArray = (array: Todo[], todo: Todo) => {
    return array.map((item) => {
      return item.id === todo.id ? todo : item;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement> |
  React.FocusEvent<HTMLInputElement, Element>) => {
    if ('preventDefault' in e) {
      e.preventDefault();
    }

    try {
      const copyTodo = { ...todo, title: editedTitle };

      if (editedTitle === '') {
        deleteTodo(todo.id);
      }

      if (todo.title !== editedTitle && editedTitle) {
        const withLoading = swapTodoInArray(alwaysGreenTodos, {
          ...todo, loading: true,
        });

        const updatedTodosWithLoading = handleActions(withLoading, filter);

        setAlwaysGreenTodos(withLoading);
        setTodos(updatedTodosWithLoading);

        const resp = await updateTodo(copyTodo.id, copyTodo);

        const result = swapTodoInArray(alwaysGreenTodos, resp);

        const todosWhichAreRendered = handleActions(result, filter);

        setAlwaysGreenTodos(result);
        setTodos(todosWhichAreRendered);
      }
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }

    setIsEditing(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label
        className="todo__status-label"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCompleted(todo.id);
          }
        }}
      >
        <input type="checkbox" className="todo__status" />
      </label>

      {isEditing ? (
        <form action="" onSubmit={handleFormSubmit}>
          <input
            className="todo__title-field"
            type="text"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleInputChange}
            onBlur={handleFormSubmit}
            ref={inputRef}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <span className="todo__title" onDoubleClick={handleDoubleClick}>
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!isEditing && (
        <button
          onClick={(e) => {
            e.preventDefault();
            deleteTodo(todo.id);
          }}
          type="button"
          className="todo__remove"
        >
          ×
        </button>
      )}
      {/*
            {/* overlay will cover the todo while it is being updated */}

      <div
        className={`${
          todo.loading ? 'todo modal overlay is-active' : 'modal overlay'
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

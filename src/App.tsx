/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useContext, useEffect } from 'react';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { TodoContext } from './context/TodoContext';
// import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

// import classNames from 'classnames';

const USER_ID = 10535;

export const App: React.FC = () => {
  const {
    gainTodos,
    total,
    handleFilter,
    errorMessage,
    setErrorMessage,
    filter,
    isAnyCompleted,
    clearCompleted,
  } = useContext(TodoContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    gainTodos();
  }, []);

  return (
    <div className={`todoapp ${errorMessage ? 'has-error' : ''}`}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button type="button" className="todoapp__toggle-all active" />

          {/* Add a todo on form submit */}
          <NewTodo />
        </header>
        <TodoList />

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer">
          <span className="todo-count">{`${total}  items left`}</span>

          {/* Active filter should have a 'selected' class */}
          <nav className="filter">
            <a
              href="#/"
              onClick={() => handleFilter('all')}
              className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
            >
              All
            </a>

            <a
              href="#/active"
              onClick={() => handleFilter('active')}
              className={`filter__link ${
                filter === 'active' ? 'selected' : ''
              }`}
            >
              Active
            </a>

            <a
              href="#/completed"
              onClick={() => handleFilter('completed')}
              className={`filter__link ${
                filter === 'completed' ? 'selected' : ''
              }`}
            >
              Completed
            </a>
          </nav>
          <button
            type="button"
            disabled={!isAnyCompleted}
            className="todoapp__clear-completed"
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        </footer>
      </div>

      <div
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage ? '' : 'hidden'
        }`}
      >
        <button
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage('');
          }}
        />
        {errorMessage}
      </div>
    </div>
  );
};

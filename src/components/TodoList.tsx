import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { TodoComponent } from './TodoComponent';

export const TodoList = () => {
  const { todos } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      {/* This is a completed todo */}
      {todos?.map((todo) => (
        <TodoComponent key={todo.id} todo={todo} />

      ))}
    </section>
  );
};

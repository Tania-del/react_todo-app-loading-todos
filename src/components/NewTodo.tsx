import { useContext, useState } from 'react';
import { createTodo } from '../api/todos';
import { TodoContext } from '../context/TodoContext';

const USER_ID = 10535;

export const NewTodo = () => {
  const { handleAddTodo, setErrorMessage } = useContext(TodoContext);
  const [title, setTitle] = useState<string>('');

  const handleTitle = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(target.value);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (title !== '') {
          setTitle('');
          try {
            const newTodo = await createTodo({
              title,
              userId: USER_ID,
              completed: false,
            });

            handleAddTodo(newTodo);
          } catch (error) {
            setErrorMessage('Unable to add a todo');

            setTimeout(() => {
              setErrorMessage('');
            }, 3000);
          }
        } else {
          setErrorMessage('Title can not be empty');

          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        }
      }}
    >
      <input
        onChange={handleTitle}
        value={title}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  );
};

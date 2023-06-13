# React Todo App Load Todos

It is the first part of the React Todo App with API. You will implement the
final app step by step and use the result of this task in the next tasks.

You are given the markup of the Todo App. Split it into components and
implement the functionality saving all the changes to [the API](https://mate-academy.github.io/fe-students-api/).

> Here is [the working example](https://mate-academy.github.io/react_todo-app-with-api/)
# ❗️❗️❗️<br>Please implement ONLY todos loading, errors and filtering. <br><br>All the rest will be implemented in the next tasks<br>❗️❗️❗️

## General info

- register a user by your email [here](https://mate-academy.github.io/react_student-registration/)
- save the received `userId` in the `App` and use to load load todos
- log in to the [Demo Page](https://mate-academy.github.io/react_todo-app-with-api/) with your email
- create some todos to see them later in your App
- load your todos when the `App` is loaded (put your userId instead of `???`);
    ```
    https://mate.academy/students-api/todos?userId=???
    ```
- hide the list and the footer if there are no todos yet;

> The API client is already implemented in the `src/utils/fetchClient.ts`. Learn it to understand how to interact with the API. If you want to implement it yourself you can delete the `fetchClient`.

## Error messages

In case of any error show the notification with an appropriate message at the bottom

- the notification can be closed with the `close` button (add the `hidden` class);
- automatically hide the notification after 3 seconds;
- also hide the notification before any next request;
- use a wrong todos URL to test the error;
- there are no tests yet.

## Filtering todos

Filter todos by status `All` / `Active` / `Completed`:

- `all` is the default value;
- use the `selected` class to highlight a selected link;

## Instructions

- Implement a solution following the [React task guideline](https://github.com/mate-academy/react_task-guideline#react-tasks-guideline).
- Use the [React TypeScript cheat sheet](https://mate-academy.github.io/fe-program/js/extra/react-typescript).
- Replace `<Tania-del>` with your Github username in the [DEMO LINK](https://<your_account>.github.io/react_todo-app-loading-todos/) and add it to the PR description.


// Some important information about how calling callback within element events;

if my callback depends on element event object, i shouldn't call the callback with extra arrow function:
 example I have onClick on span I should call it as onClick={callback} not onClick={(e) => callback(e)} because
 it is overkill, but two cases are totaly working;

 another thing is when our callback doesn't have any arguments we shouldnt use extra arrow function as well:

 const callback = () => { whatever here} it doesn't have an argument;
 onClick={callback} is enough but you can see that people write as onClick={() => {callback()}} it works but it overkill as well;

 and anoter case:
 const callback = (name: string) => { whatever };

 in this case we have only on working way of using it; onClick={() => {callback('Tania')}} because if use use onClick={callback}
 you will have an error because instead of name you well have an object with planty of fields which represents event object of element it will look callbac({...plenty of key values }) instead of desire callback('tania'
 )

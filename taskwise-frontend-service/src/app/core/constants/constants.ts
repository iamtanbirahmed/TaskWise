import { environment } from "../../../environments/environment";
export const constants = {
  CURRENT_TOKEN: "CURRENT_TOKEN",
};

// const apiurl = "http://localhost:3000/api/v1";
const apiurl = environment.apiUrl;

export const apiEndpoint = {
  AuthEndpoint: {
    login: `${apiurl}/auth/login`,
    logout: `${apiurl}/logout`,
    loggedUser: `${apiurl}/user`,
  },
  TodoEndpoint: {
    getTodoDetails: `${apiurl}/list/details`,
    getAllTodo: `${apiurl}/list`,
    addTodo: `${apiurl}/list`,
    updateTodo: `${apiurl}/list`,
    deleteTodo: `${apiurl}/list`,
  },
  TodoItemEndpoint: {
    getAllTodoItem: `${apiurl}/list-item`,
    addTodoItem: `${apiurl}/list-item`,
    updateTodoItem: `${apiurl}/list-item`,
    deleteTodoItem: `${apiurl}/list-item`,
  },
};

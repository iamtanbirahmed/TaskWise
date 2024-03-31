export const constants = {
  CURRENT_TOKEN: "CURRENT_TOKEN",
};

const apiurl = "http://localhost:3000/api/v1";

export const apiEndpoint = {
  AuthEndpoint: {
    login: `${apiurl}/auth/login`,
    logout: `${apiurl}/logout`,
    loggedUser: `${apiurl}/user`,
  },
  TodoEndpoint: {
    getAllTodo: `${apiurl}/list`,
    addTodo: `${apiurl}/list`,
    updateTodo: `${apiurl}/list`,
  },
};

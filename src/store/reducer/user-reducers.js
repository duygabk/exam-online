import { ADD_USER, GET_ALL_USER, SET_CURRENT_USER } from "../constants";

const nameInitialState = {
  users: {},
  currentUser: {
    username: "",
    password: "",
    isAdmin: false,
    isLogged: false,
  },
};
const user_reducer = (state = nameInitialState, action) => {
  switch (action.type) {
    case ADD_USER:
      return state;

    case GET_ALL_USER:
      return {...state, users: action.allUser};

    case SET_CURRENT_USER:
      return {...state, currentUser: action.currentUser};

    default:
      return state;
  }
};

export default user_reducer;

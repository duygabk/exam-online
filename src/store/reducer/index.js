import { combineReducers } from "redux";
import examReducer from "./exam-reducers";
import userReducer from "./user-reducers";

export default combineReducers({
  exam: examReducer,
  user: userReducer,
});

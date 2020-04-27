import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import appReducer from "./reducer";

export default createStore(appReducer, applyMiddleware(thunk));

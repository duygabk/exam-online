import { getAllUserFromFirebase } from '../../utils/firebase';
import { GET_ALL_USER, ADD_USER, SET_CURRENT_USER, GET_CURRENT_USER } from '../constants';

export const getAllUser = () => async (dispatch) => {
  const allUser = await getAllUserFromFirebase();
  if (allUser && Object.keys(allUser).length) {
    Object.keys(allUser).forEach(key => {
      allUser[key] = JSON.parse(allUser[key])
    })
  }
  dispatch ({
    type: GET_ALL_USER,
    allUser,
  })
}

export const addUser = (user) => {
  return {
    type: ADD_USER,
    user,
  }
}

export const setCurrentUser = currentUser => dispatch => {
  dispatch ({
    type: SET_CURRENT_USER,
    currentUser,
  })
}

export const getCurrentUser = () => {
  return {
    type: GET_CURRENT_USER,
  }
}

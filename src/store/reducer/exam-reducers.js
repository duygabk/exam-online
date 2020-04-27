import {
  ADD_EXAM,
  REMOVE_EXAM,
  GET_ALL_EXAM,
  FETCHING_EXAM,
  FETCH_EXAM_ERROR,
  ADD_NEW_QUESTION,
} from "../constants";

const initialState = {
  exam: {},
  currentExam: {},
  isFetching: false,
  error: false,
};

export default function exam_reducers(state = initialState, action) {
  switch (action.type) {
    case FETCHING_EXAM:
      return { ...state, isFetching: true };

    case GET_ALL_EXAM:
      return { ...state, exam: action.allExam };

    case FETCH_EXAM_ERROR:
      return { ...state, error: true };

    case ADD_EXAM:
      return state;

    case REMOVE_EXAM:
      return state;

    // Add new question 
    case ADD_NEW_QUESTION:
      const currentQuestions = state.currentExam.questions;
      currentQuestions.push(action.oneQuestion)
      return {...state, currentExam: {...state.currentExam, questions: currentQuestions}}; 

    default:
      return state;
  }
}

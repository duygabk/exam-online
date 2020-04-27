import { getAllExamFromFirebase } from "../../utils/firebase";
import { GET_ALL_EXAM, FETCH_EXAM_ERROR, ADD_NEW_QUESTION } from "../constants";

export const getAllExam = () => async dispatch => {
    const allExam = await getAllExamFromFirebase();
    if (allExam && Object.keys(allExam).length) {
        Object.keys(allExam).forEach(key => {
            allExam[key] = JSON.parse(allExam[key]);
        });
    }
    dispatch ({
        type: GET_ALL_EXAM,
        allExam,
    })
};

export const addOneQuestionToNewExam = (oneQuestion) => {
    return {
        type: ADD_NEW_QUESTION,
        oneQuestion,
    }
}

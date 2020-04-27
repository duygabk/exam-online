import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Radio, Card, Button, Pagination, Modal } from "antd";
import "./DoTest.css";
import { useParams } from "react-router-dom";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

function OneQuestion(props) {
  const { question, quesNo, checkResult, getAnswer } = props;
  const { title, content, answers, correct, explanation } = question;
  const [checkedValue, setCheckedValue] = useState(0);
  // console.log(question)

  const onChange = (e) => {
    // console.log("Radio ", e.target.value);
    // send selected answer to parent
    setCheckedValue(e.target.value);
    // console.log({checkedValue, correct})
    getAnswer(quesNo, e.target.value === correct);
  };
  // console.log(checkResult, checkedValue)
  return (
    <div>
      {/* Question Title */}
      <Card
        title={
          <span style={!checkedValue && checkResult ? { color: "red" } : null}>
            Question {quesNo + 1}: {title}
          </span>
        }
      >
        {/* Question Content */}
        <p>
          <strong>{content}</strong>
        </p>
        {/* Question Answers */}
        Select your answer:
        <br />
        <Radio.Group name="answer" onChange={onChange} className="answer">
          {!!answers &&
            answers.map((answer, no) => {
              // console.log(checkedValue, no+1, correct, typeof checkedValue, typeof no+1, typeof correct)
              if (
                checkResult &&
                checkedValue === no + 1 &&
                checkedValue === correct
              ) {
                return (
                  <Radio value={no + 1} key={no}>
                    {answer}
                    <CheckOutlined className="true-answer" />{" "}
                  </Radio>
                );
              } else if (
                checkResult &&
                checkedValue === no + 1 &&
                checkedValue !== correct
              ) {
                return (
                  <Radio value={no + 1} key={no}>
                    {answer}
                    <CloseOutlined className="false-answer" />{" "}
                  </Radio>
                );
              }

              return (
                <Radio value={no + 1} key={no}>
                  {answer}
                </Radio>
              );
            })}
        </Radio.Group>
        {/* Question's Answer Explanation */}
        {checkResult ? <p style={{ color: "red" }}>{explanation}</p> : null}
      </Card>
    </div>
  );
}

function DoTest(props) {
  const { exam } = props.exam;
  const [currPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { examID } = useParams();
  const [isDoScore, setIsDoScore] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState('');

  /* exam object is {
    title: "EXAM TITLE",
    description: "EXAM DESCRIPTION",
    type: "EXAM TYPE" -> N1~N5
    questions: [array of questions]
  } */

  const currentExam = exam[examID] ? exam[examID] : {};
  const { questions } = currentExam ? currentExam : { questions: [] };
  let scored = questions ? Array(questions.length) : [];

  /* One Question Object is -> {
    title: "Question title",
    content: "Question content",
    answers: [Array of answers],
    correct: correct answer,
    explanation: "Question's answer explanation"
  } */

  const getAnswer = (quesNo, ans) => {
    // console.log(quesNo, ans);
    scored[quesNo] = ans;
  };

  const doScore = () => {
    // console.log("doScore");
    setIsDoScore(!isDoScore);
    const trueAns = scored.filter(Boolean).length;
    const score = `${trueAns} / ${scored.length}`;
    console.log({score})
    setShowScore(true);
    setScore(score)
  };

  /* Pagination's change event */
  const changePage = (page, pageSize) => {
    console.log({ page, pageSize });
    setCurrentPage(page);
  };
  const changePageSize = (page, size) => {
    console.log({ page, size });
    setPageSize(size);
  };

  /* caculate total Question */

  return (
    <>
      {questions &&
        questions.map((question, k) => (
          <OneQuestion
            quesNo={k}
            key={k}
            question={question}
            getAnswer={getAnswer}
            checkResult={isDoScore}
          />
        ))}

      {/* Pagination */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <Pagination
          total={questions ? questions.length : 0}
          // showQuickJumper
          onChange={changePage}
          onShowSizeChange={changePageSize}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>

      <Button
        type="primary"
        size="large"
        onClick={doScore}
        style={{ margin: "20px auto", width: "100%" }}
      >
        Score
      </Button>
      {/* show Score Modal */}
      <Modal
          title="Basic Modal"
          visible={showScore}
          onOk={() => setShowScore(false)}
          onCancel={() => setShowScore(false)}
        >
          <p><strong>{`You pass -->  ${score}`}</strong></p>
        </Modal>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    exam: state.exam,
  };
};

export default connect(mapStateToProps)(DoTest);

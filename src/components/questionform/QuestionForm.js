import React from "react";
import { MIN_ANSWER_NUMBER, MAX_ANSWER_NUMBER } from "../../constants";
import { Drawer, Form, Button, Col, Row, Input, Select } from "antd";

import {
  PlusSquareTwoTone,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Option } = Select;

class DrawerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      question: {
        title: "",
        content: "",
        answers: Array(MIN_ANSWER_NUMBER),
        correct: null,
        explanation: "",
      },
      questions: [],
      quesNo: 0,
      mode: "add"
    };
  }

  blankQuestion = {
    title: "",
    content: "",
    answers: Array(MIN_ANSWER_NUMBER),
    correct: null,
    explanation: "",
  }

  checkValidateQuestion = () => {
    const { question } = this.state;
    const { title, content, answers, correct } = question;
    if (title === "" || content === "" || correct === null || answers.some(x => x === "")) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.setState({ 
      visible: this.props.show,
      questions: (this.props.exam.questions && this.props.exam.questions.length) ? this.props.exam.questions : [],
      question: (this.props.exam.questions && this.props.exam.questions.length) ? this.props.exam.questions[0] : this.blankQuestion,
      mode: (this.props.isEdit) ? 'edit' : 'add',
    });
  }

  onChange = (e) => {
    const { question } = this.state;
    const inputName = e.target ? e.target.name : null;
    if (inputName !== null) { // Input text, text area field
      const value = e.target.value;
      if (inputName === "title" || inputName === "content" || inputName === "explanation") { // title, content, explanation
        question[inputName] = value;
      } else {  // answerX
        const ansIndex = Number(inputName.slice("answer".length));
        question.answers[ansIndex] = value;
      }
      this.setState({ question });
    } else { // Select field
      question.correct = e;
      this.setState({ question });
    }
  };

  onClose = () => {
    this.props.closeForm("cancel");
    this.setState({
      visible: false,
    });
  };

  doSaveAndClose = () => {
    console.log("submit");
    this.setState({ visible: false });
    const { quesNo, question, questions } = this.state;
    if(!this.checkValidateQuestion()) {
      this.props.closeForm("cancel");
      return;
    }
    questions[quesNo] = question;
    this.setState({ questions });
    this.props.closeForm(this.state.mode, questions);
    return;
  };

  nextQuestion = () => {
    // console.log("Next Question");
    let { quesNo, question, questions } = this.state;
    quesNo += 1;
    /*  */
    if (questions[quesNo]){
      console.log("EDIT EXISTING QUESTION");
      if (!this.checkValidateQuestion()) return;
      questions[quesNo - 1] = question;
      question = questions[quesNo];
      this.setState({ quesNo, question, questions });
    } else {
      console.log("ADD NEW QUESTION");
      /* Check validate Input */
      if (!this.checkValidateQuestion()) return;
      questions.push(question);
      question = {...this.blankQuestion, answers: Array(MIN_ANSWER_NUMBER)};
      this.setState({ quesNo, question, questions });
    }
  };

  prevQuestion = () => {
    // console.log("Prev Question");
    let { quesNo, question, questions } = this.state;
    if( quesNo > 0 ){
      quesNo -= 1;
      question = questions[quesNo]
      this.setState({ quesNo, question, questions });
    }
  };

  addAnswer = () => {
    // console.log("Add new Answer");
    const { question } = this.state;
    question.answers.length += 1;
    this.setState({ question });
  };

  removeAnswer = (i) => {
    // console.log(i)
    const { question } = this.state;
    if ( question.answers.length <= MIN_ANSWER_NUMBER ) return;
    question.answers.splice(i, 1);
    this.setState({ question });
  }

  render() {
    const { question, quesNo, questions } = this.state;
    console.log("current question --> ", question)
    const { answers } = question;
    let allAnswer = [];
    const correctAns = [];
    for (let i = 0; i < answers.length; i++) {
      // console.log(answers[i])
      allAnswer.push(
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                // name={`answer${i}`}
                rules={[
                  {
                    required: true,
                    message: "Please enter answer content",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  addonBefore={`AnsNo.${i+1}`}
                  placeholder={`Answer No.${i+1}`}
                  name={`answer${i}`}
                  onChange={this.onChange}    
                  value={answers[i]}              
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="delete">
                <Button type="danger"  onClick={() => this.removeAnswer(i)}>
                  <DeleteOutlined />
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </>
      );
      correctAns.push(
        <>
          <Option value={i+1}>{`Answer ${i+1}`}</Option>
        </>
      )
    }

    
    return (
      <div>
        <Drawer
          title={
            <div>
              {this.props.isEdit ? 'Edit ':'Create new '} Question:{" "}
              <Button onClick={this.prevQuestion}>
                <DoubleLeftOutlined />
                Prev
              </Button>
              {` ${quesNo+1}/${questions.length} `}
              <Button onClick={this.nextQuestion}>
                Next
                <DoubleRightOutlined />
              </Button>
              <span style={{float: 'right', marginRight: '20px'}}>{`  Current Exam: `} <strong style={{color: 'red'}}>{this.props.exam.title}</strong></span> 
            </div>
          }
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form
            layout="vertical"
            hideRequiredMark
            onFinish={this.doSaveAndClose}
          >
            {/* Question Title */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Question title"
                  rules={[
                    { required: true, message: "Please enter Question title" },
                  ]}
                >
                  <Input
                    name="title"
                    onChange={this.onChange}
                    placeholder="Please enter question title"
                    value={question.title}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* End Question title */}
            {/* Question Content */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Quesion Content"
                  rules={[
                    {
                      required: true,
                      message: "please enter Question Content",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="please enter Question Content"
                    name="content"
                    onChange={this.onChange}
                    value={question.content}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* End Question Content */}
            Answer:
            {allAnswer}
            <hr />
            {/* Answers */}
            {/* End Answers */}
            {/* Add new Answer Button */}
            <Row gutter={16}>
              <Col span={6}>
                <Button type="dashed" onClick={this.addAnswer}>
                  <PlusSquareTwoTone />
                  Add New Answer
                </Button>
              </Col>
            </Row>
            {/* Correct Anwser */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Correct Answer"
                  rules={[
                    { required: true, message: "Please choose correct answer" },
                  ]}
                >
                  <Select
                    name="correct"
                    placeholder="Please choose the correct answer"
                    onChange={this.onChange}
                    value={question.correct}
                  >
                    {correctAns}

                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {/* End correct Answer */}
            {/* Question'answer Explanation */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Question'answer Explanation"
                >
                  <Input.TextArea
                    rows={2}
                    placeholder="Enter Question's answer Explanation"
                    name="explanation"
                    onChange={this.onChange}
                    value={question.explanation}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* End Question's Explanation */}
            <Row gutter={16}>
              <Col span={12}>
                <Button type="primary" htmlType="submit">
                  Save And Close
                </Button>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    );
  }
}

export default DrawerForm;

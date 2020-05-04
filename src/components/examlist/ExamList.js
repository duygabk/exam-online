import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import { getAllExam } from "../../store/action/exam-actions";
import {
  List,
  Avatar,
  Button,
  Skeleton,
  Modal,
  Form,
  Input,
  Select,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import QuestionForm from "../questionform/QuestionForm";
import {
  addOneExamToFireBase,
  updateExamWithKey,
  removeExamWithKey,
} from "../../utils/firebase";
import { EditTwoTone, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";

const { Option } = Select;
const { Paragraph } = Typography;

const allLevel = ["N1", "N2", "N3", "N4", "N5"];
const EDIT_EXAM_INFO = "edit";
const REMOVE_EXAM = "remove";
const EDIT_EXAM_QUESTIONS = "questions";

function OneExam(props) {
  const { examKey, exam, getEditContent, isAdmin } = props;
  // console.log(examKey, exam)
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [examLevel, setExamLevel] = useState("");

  useEffect(() => {
    // console.log("re-render Item")
    setExamTitle(exam.title);
    setExamDescription(exam.description);
    setExamLevel(exam.level);
  }, [props.exam]);

  /* update exam info */ 
  const callEdit = () => {
    getEditContent(EDIT_EXAM_QUESTIONS, examKey, exam);
  }
  const doEdit = () => {
    callEdit();
  };
  const doRemove = () => {
    getEditContent(REMOVE_EXAM, examKey);
  };

  const onChangeLevel = (e) => {
    setExamLevel(e);
    getEditContent(EDIT_EXAM_INFO, examKey, {...exam, level: e});
  };

  const onChangeTitle = (str) => {
    setExamTitle(str);
    getEditContent(EDIT_EXAM_INFO, examKey, {...exam, title: str});
  };

  const onChangeDescription = (str) => {
    setExamDescription(str);
    getEditContent(EDIT_EXAM_INFO, examKey, {...exam, description: str});
  };

  const linkClick = (e) => {
    if( isAdmin ) e.preventDefault();
  };
  const levelSelect = [
    <Select name="level" value={examLevel} onChange={onChangeLevel} disabled={!isAdmin}>
      {allLevel.map((l) => (
        <Option value={l}>{l}</Option>
      ))}
    </Select>,
  ];
  return (
    <>
      <List.Item
        actions={isAdmin ? [
          <ButtonGroup>
            <Button type="dashed" onClick={doEdit}>
              <EditTwoTone />
            </Button>
            <Button type="danger" onClick={doRemove}>
              <DeleteOutlined />
            </Button>
          </ButtonGroup>,
        ] : null}
      >
        <Skeleton avatar title={false} loading={false} active>
          <List.Item.Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title={
              <Link to={`do-test/${examKey}`} onClick={linkClick}>
                <strong>
                  <Paragraph editable={isAdmin ? { onChange: onChangeTitle } : false}>
                    {examTitle}
                  </Paragraph>
                </strong>
              </Link>
            }
            description={[
              <p>
                <Paragraph editable={isAdmin ? { onChange: onChangeDescription } : false}>
                  {examDescription}
                </Paragraph>
              </p>,
              <span>Level: {levelSelect}</span>,
            ]}
          />
        </Skeleton>
      </List.Item>
    </>
  );
}

function FormNewExam(props) {
  let { show, onClose } = props;
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  useEffect(() => {
    setVisible(show);
  }, []);

  const handleCancel = () => {
    console.log("Cancel Click");
    onClose();
    setVisible(false);
  };
  const onChange = (e) => {
    if (e.target) {
      console.log(e.target.name);
      if (e.target.name === "title") setTitle(e.target.value);
      else setDescription(e.target.value);
    } else {
      console.log(e);
      setLevel(e);
    }
  };

  const onSubmit = () => {
    // console.log("submit new exam-> ", title, description, level);
    onClose(title, description, level);
    setVisible(false);
  };

  const levelOptions = allLevel.map((l) => <Option value={l}>{l}</Option>);

  return (
    <>
      <Modal title="Create New Exam" visible={visible} onCancel={handleCancel}>
        <Form onFinish={onSubmit}>
          <Form.Item
            name="title"
            label="Exam Title"
            rules={[
              {
                required: true,
                message: "Please input exam title",
              },
            ]}
          >
            <Input placeholder="Exam title" name="title" onChange={onChange} />
          </Form.Item>
          {/*  */}
          <Form.Item
            name="description"
            label="Exam Desciption"
            rules={[
              {
                required: true,
                message: "Please input exam description",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              name="description"
              placeholder="Exam description"
              onChange={onChange}
            />
          </Form.Item>
          {/*  */}
          <Form.Item
            name="rank"
            label="Select level"
            rules={[
              {
                required: true,
                message: "Please select level of exam",
              },
            ]}
          >
            <Select placeholder="Select Level of Exam" onChange={onChange}>
              {levelOptions}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

/* Create Context to pass state to child component */
const CurrentUserContext = React.createContext(null);

class ExamList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initLoading: true,
      data: {},
      showQuestionForm: false,
      showNewExamForm: false,
      exam: {
        title: "",
        description: "",
        level: "",
        questions: [],
      },
      examKey: "",
      isEdit: false,
    };
  }

  /* Set Context to this class */
  static contextType = CurrentUserContext;

  componentDidMount() {
    this.props.getAllExam();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.exam !== this.props.exam) {
      this.setState({ data: this.props.exam.exam, initLoading: false });
    }
  }

  addNewExam = () => {
    this.setState({ showNewExamForm: true });
  };

  onCloseFormQuestion = (mode, questions) => {
    this.setState({ showQuestionForm: false });
    if (mode === "cancel") return;
    // save questions into exam and store in firebase
    // console.log(questions)
    const { exam } = this.state;
    exam.questions = questions;
    this.setState({ exam });

    if (mode === "add") {
      // connect to fire base
      addOneExamToFireBase(exam).then((res) => {
        // console.log(res.key)
        const { data } = this.state;
        data[res.key] = exam;
        this.setState({ data });
      });
    } else if (mode === "edit") {
      const { examKey } = this.state;
      updateExamWithKey(examKey, exam).then(res => {
        console.log("update Question OK");
      })
    }

  };

  onNewExamClose = (title, description, level) => {
    console.log({ title, description, level });
    this.setState({ showNewExamForm: false });
    if (
      title !== undefined &&
      description !== undefined &&
      level !== undefined
    ) {
      const { exam } = this.state;
      exam.title = title;
      exam.description = description;
      exam.level = level;
      // create new exam
      this.setState({ exam, showQuestionForm: true, isEdit: false });
    }
    return;
  };

  /* get comnand from edit or delete button */
  getEditContent = (mode, examKey, editedExam) => {
    const { data } = this.state;
    // console.log(mode);
    switch (mode) {
      /* edit exam info: title, description, level */
      case EDIT_EXAM_INFO:
        // console.log({ examKey, editedExam });
        updateExamWithKey(examKey, editedExam).then(() => {
          console.log("Update OK");
          // update state do re-render views
          data[examKey] = editedExam;
          this.setState({ data });
        });
        break;
      /* Remove this exam */
      case REMOVE_EXAM:
        // console.log({examKey});
        removeExamWithKey(examKey).then(() => {
          console.log("remove OK");
          // update state to re-render views
          delete data[examKey];
          this.setState({ data });
        });
        break;
      /* Open question form to edit all question of exam */
      case EDIT_EXAM_QUESTIONS:
        this.setState({ exam: data[examKey], showQuestionForm: true, examKey, isEdit: true });
        break;

      default:
        break;
    }
  };

  render() {
    const {
      initLoading,
      data,
      showQuestionForm,
      showNewExamForm,
      exam, isEdit
    } = this.state;
    // console.log("data- - - >>> ", data);
    const { currentUser } = this.props.user;
    const isAdmin = currentUser && currentUser.isAdmin && currentUser.isLogged;
    const examItem = data && Object.keys(data).length ? Object.keys(data).map((examKey) => (
        <OneExam
          examKey={examKey}
          exam={data[examKey]}
          getEditContent={this.getEditContent}
          isAdmin={isAdmin}
        />
      )): null;

    const questionForm = showQuestionForm ? (
      <QuestionForm
        show={true}
        exam={exam}
        closeForm={this.onCloseFormQuestion}
        isEdit={isEdit}
      />
    ) : null;

    const newExam = showNewExamForm ? (
      <FormNewExam show={showNewExamForm} onClose={this.onNewExamClose} />
    ) : null;

    return (
      <CurrentUserContext.Provider state={this.props.user.currentUser}>
        {newExam}
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
        >
          {examItem}
        </List>
        {questionForm}
        <hr />
        {isAdmin ? 
        (<div
          style={{
            textAlign: "center",
            marginTop: 12,
            height: 32,
            lineHeight: "32px",
          }}
        >
          <Button type="primary" onClick={this.addNewExam}>
            <PlusOutlined />
            Add New Exam
          </Button>
        </div>) : null
        }
      </CurrentUserContext.Provider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    exam: state.exam,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllExam: () => {
      dispatch(getAllExam());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExamList);

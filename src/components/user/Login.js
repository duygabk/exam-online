import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getAllUser, setCurrentUser } from '../../store/action/user-actions';
import { Form, Input, Button, Checkbox } from "antd";
import "./Login.css"
import { Redirect } from "react-router-dom";

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 0,
    span: 16,
  },
};

const Login = (props) => {

  // const { users } = props.user;
  const [wrongMessage, setWrongMessage] = useState('');

  useEffect( () => {
    async function fetchUser(){
      await props.getAllUser();  
    }
    fetchUser();
  },[])

  const onFinish = (values) => {
    // console.log("Login: ", {values});
    // authentication validate     
    const { users } = props.user;
    if (users && Object.keys(users).length) {
      const currentUser = Object.values(users).filter(user => (user.username === values.username && user.password === values.password));
      // console.log(currentUser)
      if (currentUser.length) {
        // console.log("OK")
        const currUser = {...currentUser[0], isLogged: true};
        console.log({currUser})
        props.setCurrentUser(currUser);
        // Redirect to ExamList
        return <Redirect to="/examlist"/>
      } else {
        setWrongMessage("***Your username or password is incorect!!!")
      }
    } else {
      // some error
      console.log("user fetching error");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="form-login">
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <span style={{ color: 'red' }}>{wrongMessage}</span>
        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllUser: () => {
      dispatch(getAllUser())
    },
    setCurrentUser: (user) => {
      dispatch(setCurrentUser(user))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

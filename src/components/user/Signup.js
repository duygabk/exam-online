import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import "./Signup.css";

import { addUserToFireBase } from '../../utils/firebase';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 24 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24, offset: 4 },
};

function Signup(props) {
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  // const [rePassword, setRePassword] = useState('');
  const onSubmit = values => {
    const { username, password, repassword } = values;
    if (password === repassword) {
      const user = {username, password, isAdmin: false};
      addUserToFireBase(user).then(res => {
        console.log(res.key);
      }).catch(err => {
        console.err(err);
      })
    }
  }

  return (
    <>
      <div className="form-signup">
        <Form 
          {...formItemLayout}
          onFinish={onSubmit}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!!!"
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
                message: "Please Input your password"
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Re-Password:"
            name="repassword"
            rules={[
              {
                required: true,
                message: "Please Input your confirm password"
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...formTailLayout}>
            <Button htmlType="submit" type="primary">Signup</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default Signup;

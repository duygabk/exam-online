import React, { useEffect } from "react";
// import logo from './logo.svg';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import Login from "../user/Login";
import QuestionForm from "../questionform/QuestionForm";
import "./App.css";
import { connect } from "react-redux";
import { getAllExam } from "../../store/action/exam-actions";
import Signup from "../user/Signup";
import ExamList from "../examlist/ExamList";
import { Layout } from "antd";
import AppHeader from "../common/AppHeader";
import DoTest from "../dotest/DoTest";
import NotFound from "../common/NotFound";
// const { Header, Content, Footer } = Layout;
import { getAllUser } from '../../utils/axios';

function App(props) {
  useEffect(() => {
    // test server
    getAllUser().then(response => {
      console.log("From server ", response);
    })

  }, []); 

  return (
    <Router>
      <div className="App">
        <AppHeader />
        <Switch>
          <Route exact path="/">
            Home
          </Route>
          <Route path="/do-test/:examID" component={DoTest} />
          <Route path="/login" component={Login}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/examlist" component={ExamList}/>
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default withRouter(App);

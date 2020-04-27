import React from "react";
import { connect } from 'react-redux';
import { PageHeader, Button, Descriptions, Badge } from "antd";
import { Link } from "react-router-dom";
import { UserAddOutlined, UserOutlined, OrderedListOutlined } from '@ant-design/icons'

function AppHeader(props) {
  const { user } = props;
  const { currentUser } = user;
  // console.log("AppHeader ", currentUser) -> OK
  const loginBtn = (currentUser && currentUser.isLogged) ? (<Badge count={10}><UserOutlined /> Hello {currentUser.username}</Badge>) : (<Button key="1" type="primary">
  <Link to="/login"><UserOutlined /> Login</Link>
  </Button>);
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title="Title"
        subTitle="This is a subtitle"
        extra={[
          <Button key="3"><Link to="/examlist"><OrderedListOutlined />List Of Exam</Link></Button>,
          <Button key="2"><Link to="/signup"><UserAddOutlined />Signup</Link></Button>,
          loginBtn,
        ]}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Created">duygabk</Descriptions.Item>
          <Descriptions.Item label="Association">
            <a>421421</a>
          </Descriptions.Item>
          <Descriptions.Item label="Creation Time">
            2017-01-10
          </Descriptions.Item>
          <Descriptions.Item label="Effective Time">
            2017-10-10
          </Descriptions.Item>
          <Descriptions.Item label="Remarks">
            
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <br />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(AppHeader);

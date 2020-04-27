import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
const styles = {
  width: '400px',
  margin: '0 auto',
  textAlign: 'center',
  padding: '20px',
  border: '1px solid #336600',
  borderRadius: '10px',
}

export default function NotFound() {
  return (
    <div className="not-found" style={styles}>
      <h3>Not Found</h3>
      <Button type="primary"><Link to="/">Back To Home</Link></Button>
    </div>
  );
}
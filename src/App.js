import React from 'react';
import {Layout} from 'antd';
import './App.css';
import Product from './pages/Product';
import PhotoEditor from './components/PhotoEditor/index'

const { Header, Content, Footer } = Layout;
function App(props) {
  return (
    <div className="App">
      <Layout className="layout">
          <Header id="header">         
          </Header>
          <Content style={{ padding: '1em'}}>
            <PhotoEditor></PhotoEditor>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Threekit {new Date().getFullYear()}</Footer>
      </Layout>
    </div>
  );
}

export default App;

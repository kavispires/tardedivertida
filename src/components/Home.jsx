import React from 'react';
import { Image, Layout } from 'antd';

import logo from '../images/tarde-divertida-logo.svg';

function Home() {
  return (
    <Layout className="home">
      <div className="home__logo-container">
        <Image src={logo} className="home__logo" />
      </div>
      <div class="home__background">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </Layout>
  );
}

export default Home;

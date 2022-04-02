import { Image, Layout } from 'antd';

import logo from 'assets/images/tarde-divertida-logo.svg';

function Home() {
  return (
    <Layout className="home">
      <div className="home__logo-container">
        <Image src={logo} className="home__logo" preview={false} alt="Tarde Divertida logo" />
      </div>
      <div className="home__background">
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

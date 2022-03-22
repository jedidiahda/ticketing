// import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/build-client';
import Header from '../components/header';
import { useEffect } from 'react';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  // useEffect(() => {
  //   import('bootstrap/dist/js/bootstrap');
  // }, []);

  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  // const data = null;
  let pageProps;
  //if getInitialProps is execute in _app.js, then sub component wont inovke
  //to invoke them, need line below
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  // console.log(pageProps);
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;

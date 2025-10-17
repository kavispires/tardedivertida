import App from 'pages/App';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
// Components
import ErrorBoundary from 'components/errors/ErrorBoundary';
// Internal
import reportWebVitals from './reportWebVitals';
// Sass
import 'styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

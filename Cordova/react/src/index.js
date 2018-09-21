import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const onDeviceReady = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
};

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
  document.addEventListener("deviceready", onDeviceReady, false);
} else {
  window.AppVersion = {
    version: 0,
    build: 0
  };
  onDeviceReady();
  registerServiceWorker();
}

if (require("../env.js") == "development") {
  onDeviceReady();
  registerServiceWorker();
}
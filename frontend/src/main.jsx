import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Provider} from "react-redux"
import store from './redux-store/store.js'
import {positions, transitions, Provider as AlertProvider} from "react-alert"
import AlertTemplate from "react-alert-template-basic"
const optionsForAlert = {
  timeout : 5000,
  position : positions.BOTTOM_CENTER,
  transition : transitions.SCALE
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...optionsForAlert}>
        <App />
      </AlertProvider>
    </Provider>
  /* </React.StrictMode>, */
)

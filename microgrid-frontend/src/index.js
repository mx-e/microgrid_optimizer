import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import thunk from 'redux-thunk'
import DataRequestMiddleware from './middleware/data-requests'
import reducer from './store/reducer'
import axios from 'axios'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Result from './Results/Results'
import NewRequest from './Request/Request'
import NewHousehold from './NewHousehold/NewHousehold'


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer,composeEnhancers(applyMiddleware(thunk, DataRequestMiddleware)))

export const requestInstance = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 180000,
})

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Switch>
        <Route exact path={'/result'} component={Result}/>
        <Route exact path={'/request'} component={NewRequest}/>
        <Route exact path={'/newHousehold'} component={NewHousehold}/>
      </Switch>
    </Provider>
  </BrowserRouter>
  , document.getElementById('root'));
registerServiceWorker();

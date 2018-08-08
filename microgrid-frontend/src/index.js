import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import thunk from 'redux-thunk'
import reducer from './store/reducer'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Result from './Results/Results'
import NewRequest from './Request/Request'
import NewHousehold from './NewHousehold/NewHousehold'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer,composeEnhancers(applyMiddleware(thunk)))

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Switch>
        <Route path={'/result'} component={Result}/>
        <Route path={'/request'} component={NewRequest}/>
        <Route path={'/newHousehold'} component={NewHousehold}/>
      </Switch>
    </Provider>
  </BrowserRouter>
  , document.getElementById('root'));
registerServiceWorker();

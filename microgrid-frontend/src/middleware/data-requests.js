import {TYPE} from '../store/action'
import {requestInstance} from '../index'

const dataRequests = store => next => action => {
  switch (action.type) {
    case TYPE.SEND_REQUEST:
      return requestModelData(store.getState(), store.dispatch)
  default:
    return next(action)
}
}

const requestModelData = (state, dispatch) => {
  console.log('sending request...')
  requestInstance.post('/modelrequest', {
    test: 'testtest'
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export default dataRequests
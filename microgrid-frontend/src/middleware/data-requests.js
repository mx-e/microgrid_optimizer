import {
  abortPending,
  dataRequestPending,
  TYPE,
  updateData
} from '../store/action'
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
  dispatch(dataRequestPending())
  const requestData = state.request
  console.log(requestData)
  requestInstance.post('/modelrequest',
    {
      reqData: requestData
    })
    .then(function (response) {
      dispatch(updateData(response.data))
    })
    .catch(function (error) {
      dispatch(abortPending())
      console.log(error);
    })
}

export default dataRequests
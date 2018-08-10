import {TYPE} from './action'

const initialState = {
  result: null,
  households: [],
  requestPending: false
}


const reducer = (state = initialState, action) => {
  console.log('ACTION: ' + action.type, action)
  switch(action.type) {
    case TYPE.INIT:
      return Object.assign({}, state ,{result: action.result})
    case TYPE.ADD_HOUSEHOLD:
      const newHouseholds = state.households.concat([{id: state.households.length}])
      return Object.assign({}, state, {households: newHouseholds})
    case TYPE.DEL_HOUSHOLD:
      const newHouseholds2 = state.households.filter(f => f.id !== action.id)
      return Object.assign({}, state, {households: newHouseholds2})
    case TYPE.DATA_REQUEST_PENDING:
      return Object.assign({}, state, {
        requestPending: true
      })
    case TYPE.ABORT_PENDING:
      return Object.assign({}, state, {
        requestPending: false
      })
    case TYPE.UPDATE_DATA:
      return Object.assign({}, state, {
        result: action.payload,
        requestPending: false
      })
    default:
      return state
  }
}

export default reducer
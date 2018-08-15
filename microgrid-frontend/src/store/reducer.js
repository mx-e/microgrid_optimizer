import {TYPE} from './action'

const initialState = {
  result: null,
  households: [],
  requestPending: false,

  householdPresets: [
    {
      title: 'Single Family Home',
      demandWinter:[1,1,1,2,2,2,3,4.5,4,3.5,3,2,1.5,1.5,1.5,3,4.5,3,3,2.5,2,2,1.5,1],
      demandSummer:[1,1,1,2,2,2,3,4.5,4,3.5,3,2,1.5,1.5,1.5,3,4.5,3,3,2.5,2,2,1.5,1],
      demandSpringFall:[1,1,1,2,2,2,3,4.5,4,3.5,3,2,1.5,1.5,1.5,3,4.5,3,3,2.5,2,2,1.5,1]
  }
  ]
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
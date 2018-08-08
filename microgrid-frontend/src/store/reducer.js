const initialState = {
  result: {},
  households: []
}


const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'INIT':
      return Object.assign({}, state ,{result: action.result})
    case 'ADD_HOUSEHOLD':
      const newHouseholds = state.households.concat([{id: state.households.length}])
      return Object.assign({}, state, {households: newHouseholds})
    case 'DEL_HOUSEHOLD':
      const newHouseholds2 = state.households.filter(f => f.id !== action.id)
      return Object.assign({}, state, {households: newHouseholds2})
    default:
      return state
  }
}

export default reducer
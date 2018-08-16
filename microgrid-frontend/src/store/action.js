export const TYPE = Object.freeze({
  ADD_HOUSEHOLD: new String('ADD_HOUSEHOLD'),
  DEL_HOUSEHOLD: new String('DEL_HOUSEHOLD'),
  EDIT_HOUSEHOLD: new String('EDIT_HOUSEHOLD'),
  SAVE_HOUSEHOLD: new String('SAVE_HOUSEHOLD'),
  SEND_REQUEST: new String('SEND_REQUEST'),
  UPDATE_DATA: new String('UPDATE_DATA'),
  DATA_REQUEST_PENDING: new String('DATA_REQUEST_PENDING'),
  ABORT_PENDING: new String('DATA_PENDING')
})

export const addVanillaHousehold = () => {
  return {
    type: TYPE.ADD_HOUSEHOLD
  }
}

export const deleteHousehold = (id) => {
  return {
    type: TYPE.DEL_HOUSEHOLD,
    id: id
  }
}

export const editHousehold = (id) => ({
  type: TYPE.EDIT_HOUSEHOLD,
  payload: id
})

export const saveHousehold = (household) => ({
  type: TYPE.SAVE_HOUSEHOLD,
  payload: household
})

export const sendRequest = () => ({
  type: TYPE.SEND_REQUEST
})

export const updateData = (data) => ({
  type: TYPE.UPDATE_DATA,
  payload: data
})

export const dataRequestPending = () => ({
  type: TYPE.DATA_REQUEST_PENDING
})

export const abortPending = () => ({
  type: TYPE.ABORT_PENDING
})

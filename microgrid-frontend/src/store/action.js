export const TYPE = Object.freeze({
  ADD_HOUSEHOLD: new String('ADD_HOUSEHOLD'),
  DEL_HOUSHOLD: new String('DEL_HOUSEHOLD'),
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
    type: TYPE.DEL_HOUSHOLD,
    id: id
  }
}

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

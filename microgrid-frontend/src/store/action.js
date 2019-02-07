export const TYPE = Object.freeze({
  SEND_REQUEST: String('SEND_REQUEST'),
  UPDATE_DATA: String('UPDATE_DATA'),
  DATA_REQUEST_PENDING: String('DATA_REQUEST_PENDING'),
  ABORT_PENDING: String('DATA_PENDING'),
  SET_REQUEST_STRING: String('SET_REQUEST_STRING'),
  UPDATE_REQUEST: String('UPDATE_REQUEST')
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

export const setRequestString = (str) => ({
  type: TYPE.SET_REQUEST_STRING,
  payload: str
})

export const updateRequest = () => ({
  type: TYPE.UPDATE_REQUEST
})


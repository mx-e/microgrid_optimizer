import React from 'react'
import {connect} from 'react-redux'
import './Request.css'
import 'react-toastify/dist/ReactToastify.css';
import { sendRequest, setRequestString, updateRequest } from '../store/action'

class Request extends React.Component {
  handleCalculate = () => {
    this.props.updateRequest()
    this.props.history.push('/result')
    this.props.requestModel()
  }
  switchToResults = () => {
    this.props.history.push('/result')
  }
  handleTyping = () => {
    const str = document.getElementById('jsonEditor').value
    this.props.setRequestString(str)
  }

  render(){
    const paddingBox = window.innerWidth * 0.02

    return(
      <div className="Request">
        <div className="header">
          <h2>Request</h2>
          <button className="requestButton" onClick={this.handleCalculate}>CALCULATE</button>
          <button className="editButton" onClick={this.switchToResults}>RESULTS</button>
        </div>
        <div className="Subheader" style={{margin: paddingBox +'px '+ (paddingBox * 2) + 'px' +  ' 0 ' + (paddingBox * 2) + 'px'}}>
          <h2>Request JSON</h2>
          <div>
          <textarea rows="120" cols="160" id="jsonEditor" onChange={this.handleTyping}>
            {this.props.requestString}
          </textarea>
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    requestString: state.requestString
  }
}
const mapDispatchToProps = dispatch => {
  return {
    requestModel: () => dispatch(sendRequest()),
    setRequestString: (str) => dispatch(setRequestString(str)),
    updateRequest: () => dispatch(updateRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Request)
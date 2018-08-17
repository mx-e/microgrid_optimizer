import React from 'react'
import {connect} from 'react-redux'
import HouseholdPreview from './HouseholdPreview'
import './Request.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {addVanillaHousehold, deleteHousehold, sendRequest, editHousehold} from '../store/action'

class Request extends React.Component {
  handleCalculate = () => {
    if(this.props.households.filter(h => !h.isVanilla ).length > 0) {
      this.props.history.push('/result')
      this.props.requestModel()
    } else {
      calculateErrorMessage()
    }
  }
  render(){
    const topBarHeight = window.innerHeight * 0.07 +'px'
    const paddingBox = window.innerWidth * 0.02
    const households = this.props.households.map((h, key) =>
      <HouseholdPreview
        deleteHouse={this.props.deleteHousehold}
        editHouse={
          (id) => {
            this.props.editHousehold(id)
            this.props.history.push('/newHousehold')
          }
        }
        key={key}
        household={h}
      />)
    return(
      <div className="Request">
        <div className="TopBar" style={{height: topBarHeight}}>
          <h3>Request</h3>
        </div>
        <div className="Subheader" style={{margin: paddingBox +'px '+ (paddingBox * 2) + 'px' +  ' 0 ' + (paddingBox * 2) + 'px'}}>
          <h2>General Settings:</h2>
          <button style={{position: 'relative'}} onClick={this.handleCalculate}>Calculate</button>
        </div>
        <div className={'generalSettings'} style={{marginLeft: paddingBox*2}}>
        <p> Select duration simulated in the optimization: </p>
        <select>
          <option value={24}>1 Day</option>
          <option value={30*24}>1 Month</option>
          <option value={8760}>1 Year</option>
        </select>
        </div>
        <div className="Subheader" style={{margin: paddingBox + 'px '  + (paddingBox * 2) + 'px' +  ' 0 ' + (paddingBox * 2) + 'px'}}>
          <h2>Households:</h2>
        </div>
        <div style={{paddingLeft: paddingBox, paddingRight: paddingBox + 'px'}} className="HouseholdsWrapper" >
          {households}
          <HouseholdPreview add={this.props.addNewHousehold} last/>
        </div>
        <ToastContainer/>
      </div>
    )
  }
}

const calculateErrorMessage = () => {
  toast.error("You need at least 1 edited household for a calculation!", {
    position: toast.POSITION.TOP_CENTER
  })
}

const mapStateToProps = state => {
  return {
    households: state.households
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addNewHousehold: () => dispatch(addVanillaHousehold()),
    deleteHousehold: (id) => dispatch(deleteHousehold(id)),
    editHousehold: (id) => dispatch(editHousehold(id)),
    requestModel: () => dispatch(sendRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Request)
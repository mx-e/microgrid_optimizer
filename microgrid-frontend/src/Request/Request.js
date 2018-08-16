import React from 'react'
import {connect} from 'react-redux'
import HouseholdPreview from './HouseholdPreview'
import './Request.css'
import {addVanillaHousehold, deleteHousehold, sendRequest, editHousehold} from "../store/action"

class Request extends React.Component {
  handleCalculate = () => {
    this.props.history.push('/result')
    this.props.requestModel()
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
        <div className="Subheader" style={{margin: paddingBox + 'px '  + (paddingBox * 2) + 'px' +  ' 0 ' + (paddingBox * 2) + 'px'}}>
          <h2>Households:</h2>
          <button style={{position: 'relative'}} onClick={this.handleCalculate}>Calculate</button>
        </div>
        <div style={{paddingLeft: paddingBox, paddingRight: paddingBox + 'px'}} className="HouseholdsWrapper" >
          {households}
          <HouseholdPreview add={this.props.addNewHousehold} last/>
        </div>

      </div>
    )
  }


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
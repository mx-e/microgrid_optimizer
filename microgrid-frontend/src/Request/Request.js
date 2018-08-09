import React from 'react'
import {connect} from 'react-redux'
import HouseholdPreview from './HouseholdPreview'
import './Request.css'
import {addVanillaHousehold, deleteHousehold, sendRequest} from "../store/action"

class Request extends React.Component {
  render(){
    const topBarHeight = window.innerHeight * 0.07 +'px'
    const paddingBox = window.innerWidth * 0.02
    const households = this.props.households.map((h, key) => <HouseholdPreview deleteHouse={this.props.deleteHousehold} key={key} household={h}/>)
    return(
      <div className="Request">
        <div className="TopBar" style={{height: topBarHeight}}>
          <h3>Request</h3>
        </div>
        <div className="Subheader" style={{margin: paddingBox + 'px '  + (paddingBox * 2) + 'px' +  ' 0 ' + (paddingBox * 2) + 'px'}}>
          <h2>Households:</h2>
          <button style={{position: 'relative'}} onClick={this.props.requestModel}>Calculate</button>
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
    requestModel: () => dispatch(sendRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Request)
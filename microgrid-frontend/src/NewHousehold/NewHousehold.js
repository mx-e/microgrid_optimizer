import React, {Component} from 'react'
import './NewHousehold.css'
import {connect} from 'react-redux'
import DemandPreview from './DemandPreview'
import {saveHousehold} from "../store/action";

class NewHousehold extends Component {
    constructor(props) {
      super(props)
      this.state={
        select: {
          title:'No Preset',
          demandWinter:[],
          demandSummer:[],
          demandSpringFall:[]
        },
        currentInput: {
          demandWinter: Array.apply(null, Array(24)).map(Number.prototype.valueOf,0),
          demandSummer: Array.apply(null, Array(24)).map(Number.prototype.valueOf,0),
          demandSpringFall: Array.apply(null, Array(24)).map(Number.prototype.valueOf,0)
        },
        selectExpand: false}
    }

    onValueUpdate(inputField, event) {
      const newValue = event.target.value
      this.setState(state => Object.assign({}, state, {
        currentInput: Object.assign({}, state.currentInput, {
          name: inputField === 1 ? newValue : state.currentInput.name,
          totalPower: inputField === 2 ? newValue : state.currentInput.totalPower,
          hourlyVariance: inputField === 3 ? newValue : state.currentInput.hourlyVariance
        })
      }))
    }


    render(){
      const gridHeight = window.innerHeight * 0.6 + 'px'
      const presets = this.props.presets.map((pre, key) =>
        <div
          onClick={() => this.setState(state => ({
            select: this.props.presets[key],
            selectExpand: false,
            currentInput: Object.assign({}, state.currentInput, {
              demandSummer: this.props.presets[key].demandSummer,
              demandWinter: this.props.presets[key].demandWinter,
              demandSpringFall: this.props.presets[key].demandSpringFall ,
            })}
          ))}
          style={{
            zIndex: (99 - key) + '',
            background: key % 2 === 1 ? '#D3D3D3' : 'white',
            transform: this.state.selectExpand ? 'translateY(' + 100*(key+1) + '%)' : 'none',
            borderLeft: 'solid 1px black',
            borderBottom: key+1 === this.props.presets.length ? 'solid 1px black' : 'none',
            transition: 'all linear ' + (!this.state.selectExpand ? 100*(this.props.presets.length - key) : 100*(key+1)) + 'ms'
          }}
          key={key}>
          {pre.title}
        </div>)
        return(
          <div>
            <div style={{height: gridHeight}} className="NewHousehold">
            <h2>{this.state.currentInput.name ? this.state.currentInput.name : 'New Household'}</h2>
            <div className="Select" >
              <svg onClick={() => this.setState({selectExpand: true})} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 129 129'>
                <path d='m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z'
                />
              </svg>
              <div onClick={() => this.setState({selectExpand: !this.state.selectExpand})}>{this.state.select.title}</div>
              {presets}
            </div>
            <div className="InputBox">
              <p>Name</p>
              <input onChange={event => this.onValueUpdate(1, event)} type="text"/>
              <p>Yearly Energy Consumption</p>
              <input onChange={event => this.onValueUpdate(2, event)} type="text"/>
              <p>Hourly Demand Variance</p>
              <input onChange={event => this.onValueUpdate(3, event)} type="text"/>
            </div>
            <div className="FutureInputBox"></div>
            <div className="Summer">
              <DemandPreview data={this.state.currentInput.demandSummer} title={'Summer'} theme={'#FFA07A'}/>
            </div>
            <div className="Winter">
              <DemandPreview data={this.state.currentInput.demandWinter} title={'Winter'} theme={'#87CEFA'}/>
            </div>
            <div className="Fall">
              <DemandPreview data={this.state.currentInput.demandSpringFall} title={'Spring / Fall'} theme={'#20B2AA'}/>
            </div>
          </div>
            <button id={'saveChangesButton'}
                    onClick={ () => {
                      const newHouseholdData = Object.assign({}, this.state.currentInput,{id: this.props.currentlyEditedId})
                      this.props.saveHousehold(newHouseholdData)
                      this.props.history.push('/request')
                    }}> SAVE </button>
          </div>
        )
    }
}

const mapStateToProps = state => {
  return {
    presets: state.householdPresets,
    currentlyEditedId: state.currentlyEditedId
  }
}

const mapDispatchToProps = dispatch => ({
  saveHousehold: (household) => dispatch(saveHousehold(household))
})



export default connect(mapStateToProps, mapDispatchToProps)(NewHousehold)
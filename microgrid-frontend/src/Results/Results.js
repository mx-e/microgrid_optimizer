import React from 'react'
import './Results.css'
import SupplyGraph from "../SupplyGraph/SupplyGraph";
import connect from "react-redux/es/connect/connect";
import {Spinner} from '@blueprintjs/core'
import InvestmentArc from "../InvestmentArc/InvestmentArc";

class Results extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      currentHousehold: 0
    }
  }

  cycleUpHousehold() {
    if(this.props.result){
      this.setState(state => Object.assign({}, state, {
        currentHousehold: state.currentHousehold !== this.props.result.N - 1 ? state.currentHousehold + 1 : 0
      }))
    }
  }

  cycleDownHousehold() {
    if(this.props.result) {
      this.setState(state => Object.assign({}, state, {
        currentHousehold: state.currentHousehold !== 0 ? state.currentHousehold - 1 : this.props.result.N - 1
      }))
    }
  }

  render(){
    const calcBannerHeight = window.innerHeight * 0.18 + 'px'
    const calcTopBarHeight = window.innerHeight * 0.07 +'px'
    const calcHeight = window.innerHeight*0.34 + 'px'
    const calcMargin = window.innerHeight*0.035 + 'px'


    const supplyGraphProps = {
      data: this.props.result ? this.props.result.supply : null,
      id: this.state.currentHousehold,
      dataLength: this.props.result ? this.props.result.T : null,
      containerId: 'supplyGraphContainer'
    }

    const investmentArcProps = {
      data: this.props.result ? this.props.result.investment : null,
      id: this.state.currentHousehold,
      containerId: 'investmentArcContainer'
    }

    return (
      <div className="Results">
        <div style={{height: calcBannerHeight}}  >
          <div style={{height: calcTopBarHeight}} className="Header">
            <h3>Results</h3>
          </div>
        </div>
        <div className={'resultsGrid'}>
          <div onClick={() => this.cycleDownHousehold()} className={'cycleBack'}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 129" enable-background="new 0 0 129 129">
              <g fill={'darkgrey'}>
                <path d="m88.6,121.3c0.8,0.8 1.8,1.2 2.9,1.2s2.1-0.4 2.9-1.2c1.6-1.6 1.6-4.2 0-5.8l-51-51 51-51c1.6-1.6 1.6-4.2 0-5.8s-4.2-1.6-5.8,0l-54,53.9c-1.6,1.6-1.6,4.2 0,5.8l54,53.9z"/>
              </g>
            </svg>
          </div>
          <div className={'resultsCharts'}>
            <div id={'supplyGraphContainer'} style={{marginTop: calcMargin, height: calcHeight, background: 'lightgray'}}>
              {this.props.result &&
              <SupplyGraph {...supplyGraphProps} />
              }
              {this.props.requestPending &&
              <Spinner size={50}/>
              }
            </div>
            <div id={'investmentArcContainer'} style={{marginBottom: calcMargin, marginTop: calcMargin, height: calcHeight, background: 'lightgray'}}>
              {this.props.requestPending &&
              <Spinner size={50}/>
              }
              {this.props.result &&
              <InvestmentArc {...investmentArcProps}/>
              }
            </div>
          </div>
          <div onClick={() => this.cycleUpHousehold()} className={'cycleForward'}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 129" enable-background="new 0 0 129 129">
              <g fill={'darkgrey'}>
                <path d="m40.4,121.3c-0.8,0.8-1.8,1.2-2.9,1.2s-2.1-0.4-2.9-1.2c-1.6-1.6-1.6-4.2 0-5.8l51-51-51-51c-1.6-1.6-1.6-4.2 0-5.8 1.6-1.6 4.2-1.6 5.8,0l53.9,53.9c1.6,1.6 1.6,4.2 0,5.8l-53.9,53.9z"/>
              </g>
            </svg>
          </div>
        </div>
        <p>Copyright © 2018 Maximilian Eißler</p>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    result: state.result,
    requestPending: state.requestPending
  }
}


export default connect(mapStateToProps)(Results)
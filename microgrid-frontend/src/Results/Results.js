import React from 'react'
import './Results.css'
import SupplyGraph from "../SupplyGraph/SupplyGraph";
import connect from "react-redux/es/connect/connect";
import {Spinner} from '@blueprintjs/core'
import InvestmentArc from "../InvestmentArc/InvestmentArc";

class Results extends React.Component{


  render(){
    const calcBannerHeight = window.innerHeight * 0.18 + 'px'
    const calcTopBarHeight = window.innerHeight * 0.07 +'px'
    const calcHeight = window.innerHeight*0.34 + 'px'
    const calcMargin = window.innerHeight*0.035 + 'px'


    const supplyGraphProps = {
      data: this.props.result ? this.props.result.supply : null,
      id: 1,
      dataLength: this.props.result ? this.props.result.T : null,
      containerId: 'supplyGraphContainer'
    }

    const investmentArcProps = {
      data: this.props.result ? this.props.result.investment : null,
      id: 1,
      containerId: 'investmentArcContainer'
    }


    return (
      <div className="Results">
        <div style={{height: calcBannerHeight}}  >
          <div style={{height: calcTopBarHeight}} className="Header">
            <h3>Results</h3>
          </div>
        </div>
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
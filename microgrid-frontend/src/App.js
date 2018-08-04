import React, { Component } from 'react'
import './App.css'
import {json} from './data.js'
import SupplyGraph from './Components/SupplyGraph'
import InvestmentArc from './Components/InvestmentArc'

class App extends Component {
  constructor(){
    super()
    this.data = JSON.parse(json)
  }



  render(){
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Microgrid Optimizer</h1>
        </header>
        {[1,2].map( (n) =>
          <div key ={n} className={'graphholder'+n}>
            <SupplyGraph data={this.data.supply} id={n} dataLength={this.data.T}/>
          </div>
        )}

      </div>
    )
  }
}


export default App;

import React, { Component } from 'react'
import './App.css'
import {json} from './data.js'
import SupplyGraph from './Components/SupplyGraph'

class App extends Component {
  constructor(){
    super()
    this.data = JSON.parse(json)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Microgrid Optimizer</h1>
        </header>
        <div className="row">
          <SupplyGraph data={this.data.supply} id={1}/>
        </div>
      </div>
    );
  }
}

export default App;

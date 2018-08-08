import React, {Component} from 'react'
import './NewHousehold.css'

const dummyPresets = ['No Preset', 'Normal Households', 'TP Shortage', 'Apocalypse', 'Free Energy']
class NewHousehold extends Component {
    constructor(props) {
      super(props)
      this.state={select: 'No Preset', selectExpand: false}
    }


    render(){
      const gridHeight = window.innerHeight * 0.6 + 'px'
      const presets = dummyPresets.map((pre, key) =>
        <div
          onClick={() => this.setState({select: dummyPresets[key], selectExpand: false})}
          style={{
            zIndex: (99 - key) + '',
            background: key % 2 === 1 ? '#D3D3D3' : 'white',
            transform: this.state.selectExpand ? 'translateY(' + 100*(key+1) + '%)' : 'none',
            borderLeft: 'solid 1px black',
            borderBottom: key+1 === dummyPresets.length ? 'solid 1px black' : 'none',
            transition: 'all linear ' + (!this.state.selectExpand ? 100*(dummyPresets.length - key) : 100*(key+1)) + 'ms'
          }}
          key={key}>
          {pre}
        </div>)
        return(
          <div style={{height: gridHeight}} className="NewHousehold">
            <h2>New Household</h2>
            <div className="Select" >
                <svg onClick={() => this.setState({selectExpand: true})} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 129 129'>
                  <path d='m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z'
                  />
                </svg>
              <div onClick={() => this.setState({selectExpand: !this.state.selectExpand})}>{this.state.select}</div>
              {presets}
            </div>
            <div className="InputBox">
              <p>Name</p>
              <input type="text"/>
              <p>Total Eise Cons</p>
              <input type="text"/>
              <p>Variance</p>
              <input type="text"/>
            </div>
            <div className="FutureInputBox"></div>
            <div className="Summer"></div>
            <div className="Winter"></div>
            <div className="Fall"></div>
          </div>
        )
    }
}

export default NewHousehold
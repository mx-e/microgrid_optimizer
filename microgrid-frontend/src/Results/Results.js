import React from 'react'
import './Results.css'

const results = (props) => {
  const calcBannerHeight = window.innerHeight * 0.18 + 'px'
  const calcTopBarHeight = window.innerHeight * 0.07 +'px'
  const calcHeight = window.innerHeight*0.34 + 'px'
  const calcMargin = window.innerHeight*0.035 + 'px'
  return (
    <div className="Results">
      <div style={{height: calcBannerHeight}}  >
        <div style={{height: calcTopBarHeight}} className="Header">
          <h3>Results</h3>
        </div>
      </div>
      <div style={{marginTop: calcMargin, height: calcHeight, background: 'lightcoral'}}>box1</div>
      <div style={{marginBottom: calcMargin, marginTop: calcMargin, height: calcHeight, background: 'lightgreen'}}>box2</div>
      <p>Copyright © 2018 Maximilian Eißler</p>
    </div>
  )
}

export default results
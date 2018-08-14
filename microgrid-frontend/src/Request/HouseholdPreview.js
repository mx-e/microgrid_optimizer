import React from 'react'
import './HouseholdPreview.css'

const householdPreview = (props) => {
  const calcWidth = window.innerWidth*0.28 + 'px'
  const calcMargin = window.innerWidth*0.02 < (window.innerWidth-350) / 8 ? window.innerWidth*0.02 : 10
  if(props.last) return <div className="Add" onClick={() => props.add()} style={{width: calcWidth, margin: calcMargin + 'px'}}>
    <svg xmlns='http://www.w3.org/2000/svg' id='Capa_1' height='60%'
         viewBox='0 0 401.994 401.994'>
      <path d='M394,154.175c-5.331-5.33-11.806-7.994-19.417-7.994H255.811V27.406c0-7.611-2.666-14.084-7.994-19.414 C242.488,2.666,236.02,0,228.398,0h-54.812c-7.612,0-14.084,2.663-19.414,7.993c-5.33,5.33-7.994,11.803-7.994,19.414v118.775 H27.407c-7.611,0-14.084,2.664-19.414,7.994S0,165.973,0,173.589v54.819c0,7.618,2.662,14.086,7.992,19.411 c5.33,5.332,11.803,7.994,19.414,7.994h118.771V374.59c0,7.611,2.664,14.089,7.994,19.417c5.33,5.325,11.802,7.987,19.414,7.987 h54.816c7.617,0,14.086-2.662,19.417-7.987c5.332-5.331,7.994-11.806,7.994-19.417V255.813h118.77 c7.618,0,14.089-2.662,19.417-7.994c5.329-5.325,7.994-11.793,7.994-19.411v-54.819C401.991,165.973,399.332,159.502,394,154.175z'
            fill='#bfbfbf' />
    </svg>
  </div>
    return(
      <div style={{width: calcWidth, margin: calcMargin + 'px'}} className="Households">
        Preview {props.household.id}
        <svg onClick={() => props.deleteHouse(props.household.id)} id='Capa_1' xmlns='http://www.w3.org/2000/svg'
             viewBox='0 0 414.298 414.299'>
          <path d='M3.663,410.637c2.441,2.44,5.64,3.661,8.839,3.661c3.199,0,6.398-1.221,8.839-3.661l185.809-185.81l185.81,185.811 c2.44,2.44,5.641,3.661,8.84,3.661c3.198,0,6.397-1.221,8.839-3.661c4.881-4.881,4.881-12.796,0-17.679l-185.811-185.81 l185.811-185.81c4.881-4.882,4.881-12.796,0-17.678c-4.882-4.882-12.796-4.882-17.679,0l-185.81,185.81L21.34,3.663 c-4.882-4.882-12.796-4.882-17.678,0c-4.882,4.881-4.882,12.796,0,17.678l185.81,185.809L3.663,392.959 C-1.219,397.841-1.219,405.756,3.663,410.637z'
          />
        </svg>
      </div>
    )
}

export default householdPreview
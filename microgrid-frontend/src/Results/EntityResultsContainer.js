import React from 'react'
import RelativeBarChart from './RelativeBarChart'


const EntityResultsContainer = (props) => {
    console.log(props)
    return(
        <div className="entityWrapper">
            <h5>{props.entityName}</h5>
            <div className="supplyGraphWrapper">
                <RelativeBarChart {...props.barChartProps} />
            </div>
        </div>
    )
}

export default EntityResultsContainer

import React from 'react'
import RelativeBarChart from './RelativeBarChart'


const EntityResultsContainer = (props) => {
    return(
        <div className="entityWrapper">
            <h3>{props.entityName}</h3>
            <div className="supplyGraphWrapper">
                <RelativeBarChart {...props.barChartProps} />
            </div>
        </div>
    )
}

export default EntityResultsContainer

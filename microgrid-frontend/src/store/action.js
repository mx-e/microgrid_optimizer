const initialQuery = () => {
  return {
    type: 'INIT',
    result: {

      "T"
        :
        12,
      "N"
        :
        2, "supply"
        :
        [{
          "key": "Grid Consumption",
          "value": [[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0]],
          "type": "positive"
        }, {
          "key": "PV-Production",
          "value": [[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0]],
          "type": "positive"
        }, {
          "key": "CHP-Production",
          "value": [[1.5161290322580645, 1.6690561529273333], [1.2580645161290323, 2.334528076463667], [3.129032258064516, 4.167264038231833], [3.064516129032258, 1.0836320191159168], [3.129032258064516, 4.870967741935124], [3.129032258064516, 2.870967741935483], [2.129032258064875, 4.870967741935125], [2.0, 4.0], [3.129032258064516, 2.870967741935482], [3.129032258064876, 4.870967741935124], [1.9935483870969133, 1.8508960573478952], [3.129032258064516, 4.870967741935125]],
          "type": "positive"
        }, {
          "key": "Shifted Consumption",
          "value": [[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0]],
          "type": "positive"
        }, {
          "key": "Omitted Consumption",
          "value": [[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0]],
          "type": "positive"
        }, {
          "key": "From Battery",
          "value": [[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.8709677419354839, 1.1290322580648753], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 3.595126861042167e-13]],
          "type": "positive"
        }, {
          "key": "Grid Feed-In",
          "value": [[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.8444444444444094], [0.0, 0.0]],
          "type": "negative"
        }, {
          "key": "To Battery",
          "value": [[0.5161290322580645, 0.6690561529273334], [0.25806451612903225, 0.3345280764636668], [0.12903225806451624, 0.16726403823183345], [0.06451612903225813, 0.0836320191159166], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 3.991190968418912e-13], [0.0, 0.0]],
          "type": "negative"
        }, {
          "key": "To Trade",
          "value": [[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.8709677419354834, 0.0], [0.0, 0.12903225806487462], [0.0, 0.0], [0.8709677419354834, 0.0], [0.0, 0.1290322580648761], [0.006451612903086563, 0.0], [0.0, 1.129032258064516]],
          "type": "negative"
        }, {
          "key": "From Trade",
          "value": [[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.8709677419354834], [0.12903225806487464, 0.0], [0.0, 0.0], [0.0, 0.8709677419354834], [0.12903225806487625, 0.0], [0.0, 0.006451612903086562], [1.129032258064516, 0.0]],
          "type": "positive"
        }], "investment"
        :
        [{"key": "Solar PV", "value": [0.0, 0.0], "type": "generation"}, {
          "key": "CHP",
          "value": [3.129032258064516, 4.870967741935125],
          "type": "generation"
        }, {"key": "Gas Digester", "value": [7.445611402850922, 9.7701508710509], "type": "other"}, {
          "key": "Li-Ion Battery",
          "value": [1.0322580645161292, 1.3381123058546671],
          "type": "storage"
        }, {"key": "Gas Storage", "value": [7.445611402850922, 9.7701508710509], "type": "storage"}]

    }
  }
}

export const addVanillaHousehold = () => {
  return {
    type: 'ADD_HOUSEHOLD'
  }
}


export const deleteHousehold = (id) => {
  return {
    type: 'DEL_HOUSEHOLD',
    id: id
  }
}
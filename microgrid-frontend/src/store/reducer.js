import {TYPE} from './action'
import {data} from '../Results/prelResults'

const initialRequest = "{\n" +
  "    \"iterators\": {\n" +
  "        \"T\": 168,\n" +
  "        \"S\": 3,\n" +
  "        \"U\": 13,\n" +
  "        \"K\": 2,\n" +
  "        \"L\": 0,\n" +
  "        \"M\": 0,\n" +
  "        \"N\": 2\n" +
  "    },\n" +
  "    \"households\": [\n" +
  "        {\n" +
  "            \"opts\":{\n" +
  "                \"instances\": 8,\n" +
  "                \"areDemandSharesFixed\":true,\n" +
  "                \"curtailableShare\": 0.10,\n" +
  "                \"shiftableShare\": 0.20,\n" +
  "                \"adaptTimelines\": true,\n" +
  "                \"applyNoise\": true,\n" +
  "                \"variance\": 0.25\n" +
  "            },\n" +
  "            \"shiftP\": 0.15,\n" +
  "            \"curtP\": 0.35,\n" +
  "            \"DEM\": [\n" +
  "                [0.2713333333959073, 0.21183333338218574, 0.27950000006445835, 0.23516666672089936, 0.28116666673150825, 0.4356666667671373, 0.5708333334649784, 0.31516666673934796, 0.50433333344964, 0.4178333334296932, 0.8936666668727573, 0.6320000001457515, 0.9028333335415424, 0.3576666667491502, 0.4835000001114984, 0.3158333334061669, 0.4566666667719829, 0.3896666667565278, 0.4080000000940843, 1.586500000365867, 1.1541666669328356, 1.1773333336048415, 1.1920000002748834, 0.9815000002263541, 0.37007978980278955, 0.34457100779231264, 0.3309393306332761, 0.3312092648344452, 0.3340435739467203, 0.7976555644545902, 0.39464380210917144, 0.3302644951303524, 0.36400627027648647, 1.0211610830225795, 1.098227297456343, 0.4883109699148398, 0.7865882622066578, 0.5935853083707853, 0.32608051501224355, 0.46374695760845613, 0.2509038399866511, 0.3407919289759425, 0.5522853755919109, 0.8042689523832275, 1.0578721343815694, 1.093638416036471, 1.721235433754543, 0.2580570963176347, 0.37007978980278955, 0.34457100779231264, 0.3309393306332761, 0.3312092648344452, 0.3340435739467203, 0.7976555644545902, 0.39464380210917144, 0.3302644951303524, 0.36400627027648647, 1.0211610830225795, 1.098227297456343, 0.4883109699148398, 0.7865882622066578, 0.5935853083707853, 0.32608051501224355, 0.46374695760845613, 0.2509038399866511, 0.3407919289759425, 0.5522853755919109, 0.8042689523832275, 1.0578721343815694, 1.093638416036471, 1.721235433754543, 0.2580570963176347],\n" +
  "                [0.6416666667657518, 0.5600000000864735, 0.6333333334311291, 0.6066666667603436, 0.63000000009728, 0.8600000001327995, 1.406666666883882, 1.5916666669124526, 0.6066666667603478, 0.35666666672174174, 0.29166666671170705, 0.32333333338326553, 0.5816666667564939, 0.4400000000679294, 2.610000000403036, 1.4933333335639436, 0.8650000001335821, 0.6900000001065486, 1.5583333335739662, 1.0200000001574852, 1.285000000198406, 1.0850000001675102, 1.0050000001551582, 0.44500000006876533],\n" +
  "                [0.4733333414323607, 0.4866666597389296, 0.47666666471191954, 0.4716666546042482, 0.49333335667471384, 0.6183333322948386, 0.8183333335883713, 1.1100000021414402, 1.6216666620420606, 2.5316666628899682, 0.8566666520566324, 0.568333331971455, 1.1800000177071759, 0.6049999887999374, 0.9066666775683465, 1.2600000031115919, 2.3733333285325884, 0.589999983665254, 1.3316666803171064, 1.0866666636195255, 2.298333328047513, 0.9133333493158002, 1.243333311148794, 0.8733333440194274, 1.2099999998118742, 0.7968333332094456, 0.8046666665415604, 0.5286666665844729, 0.6008333332399165, 1.097833333162646, 1.1314999998240787, 0.6843333332269378, 0.7756666665460668, 0.7669999998807409, 1.4101666664474197, 0.3899999999393735, 0.3319999999483969, 0.33533333328121107, 0.32266666661651033, 0.47383333325966676, 0.8116666665404786, 0.5116666665871151, 0.7873333332109169, 1.4328333331105771, 1.5469999997594712, 1.4298333331110338, 1.6184999997483667, 1.6396666664117217, 1.2099999998118742, 0.7968333332094456, 0.8046666665415604, 0.5286666665844729, 0.6008333332399165, 1.097833333162646, 1.1314999998240787, 0.6843333332269378, 0.7756666665460668, 0.7669999998807409, 1.4101666664474197, 0.3899999999393735, 0.3319999999483969, 0.33533333328121107, 0.32266666661651033, 0.47383333325966676, 0.8116666665404786, 0.5116666665871151, 0.7873333332109169, 1.4328333331105771, 1.5469999997594712, 1.4298333331110338, 1.6184999997483667, 1.6396666664117217, 1.2099999998118742, 0.7968333332094456, 0.8046666665415604, 0.5286666665844729, 0.6008333332399165, 1.097833333162646, 1.1314999998240787, 0.6843333332269378, 0.7756666665460668, 0.7669999998807409, 1.4101666664474197, 0.3899999999393735, 0.3319999999483969, 0.33533333328121107, 0.32266666661651033, 0.47383333325966676, 0.8116666665404786, 0.5116666665871151, 0.7873333332109169, 1.4328333331105771, 1.5469999997594712, 1.4298333331110338, 1.6184999997483667, 1.6396666664117217]\n" +
  "            ]\n" +
  "        },\n" +
  "        {\n" +
  "            \"opts\":{\n" +
  "                \"instances\": 3,\n" +
  "                \"areDemandSharesFixed\":true,\n" +
  "                \"curtailableShare\": 0.10,\n" +
  "                \"shiftableShare\": 0.20,\n" +
  "                \"adaptTimelines\": true,\n" +
  "                \"applyNoise\": true,\n" +
  "                \"variance\": 0.15\n" +
  "            },\n" +
  "            \"shiftP\": 0.15,\n" +
  "            \"curtP\": 0.35,\n" +
  "            \"DEM\": [\n" +
  "                [0.9486957527015091, 0.9805846855654251, 0.9008623534056348, 0.919464230909586, 0.8517002485737637, 0.8689734205417184, 1.0589783121892196, 1.0058300907493591, 1.047019962365251, 1.062964428797209, 1.0510060789732405, 1.6517692211891737, 1.0762514841571742, 1.7485764853714088, 1.4469603287002006, 1.3592657633244312, 1.1891914547168778, 1.0842237173731533, 1.4031130460123162, 1.7857802403793113, 1.562557710331897, 1.0430338457572614, 0.9938717409253902, 0.9593253969894809, 0.6974032856385802, 0.7715951245363015, 0.5836424659954076, 0.5242889948772306, 0.553965730436319, 0.6034269563681331, 0.9842783960431026, 1.3206147323794393, 1.3552375905317091, 1.6025437201907802, 1.1722310545839965, 0.979332273449921, 1.6816816816816826, 1.2612612612612621, 0.9991167638226468, 0.7567567567567574, 1.5036212683271517, 2.0476947535771077, 1.5332980038862398, 1.6668433139021384, 1.7261967850203155, 1.543190249072603, 1.1277159512453636, 1.0040628864158283, 0.6974032856385802, 0.7715951245363015, 0.5836424659954076, 0.5242889948772306, 0.553965730436319, 0.6034269563681331, 0.9842783960431026, 1.3206147323794393, 1.3552375905317091, 1.6025437201907802, 1.1722310545839965, 0.979332273449921, 1.6816816816816826, 1.2612612612612621, 0.9991167638226468, 0.7567567567567574, 1.5036212683271517, 2.0476947535771077, 1.5332980038862398, 1.6668433139021384, 1.7261967850203155, 1.543190249072603, 1.1277159512453636, 1.0040628864158283],\n" +
  "                [1.2173450385740885, 1.2758712423516894, 1.1237031125299282, 1.3343974461292896, 1.1354083532854484, 1.4397446129289702, 1.826017557861133, 1.790901835594573, 2.3059324288374565, 2.0484171322160147, 1.5685022612396913, 1.6036179835062518, 1.3929236499068898, 2.247406225059856, 2.2942271880819365, 1.6387337057728117, 1.9079542431497738, 1.5919127427507311, 2.1771747805267356, 2.0484171322160147, 2.2239957435488162, 3.780792764032987, 2.2942271880819365, 1.7323756318169725],\n" +
  "                [1.1048445000455396, 1.1219407398915056, 1.0663779603921164, 1.021500330796456, 1.0877482601995738, 0.9744856712200505, 1.4232619671766524, 1.5814021857518363, 1.6455130851742075, 2.387013336803417, 1.5643059459058704, 3.216722706432877, 2.48988622027405, 1.634827935270479, 1.2287922389287917, 1.4959209865220071, 2.158400280553182, 2.5858062767023267, 3.365822219674516, 2.243881479783011, 2.2011408801680963, 2.382788428531483, 2.2973072293016537, 1.7203091345003083, 1.1120606843552283, 1.0931133856702766, 1.0202391599589251, 0.9823445625890221, 1.018781675444698, 1.2709264964059752, 1.7693862002716214, 1.82914306535493, 1.9967537844910388, 1.8859849614097846, 1.7737586538143026, 1.823313127298022, 1.456027029712809, 1.1368379210970878, 1.5638808837656097, 1.9705190632349525, 1.7606412931862594, 1.788333498956573, 4.094074000463744, 5.096823346251944, 2.5272781476696804, 2.0506807115174395, 1.5332737089668416, 1.4458246381132194, 1.1120606843552283, 1.0931133856702766, 1.0202391599589251, 0.9823445625890221, 1.018781675444698, 1.2709264964059752, 1.7693862002716214, 1.82914306535493, 1.9967537844910388, 1.8859849614097846, 1.7737586538143026, 1.823313127298022, 1.456027029712809, 1.1368379210970878, 1.5638808837656097, 1.9705190632349525, 1.7606412931862594, 1.788333498956573, 4.094074000463744, 5.096823346251944, 2.5272781476696804, 2.0506807115174395, 1.5332737089668416, 1.4458246381132194, 1.1120606843552283, 1.0931133856702766, 1.0202391599589251, 0.9823445625890221, 1.018781675444698, 1.2709264964059752, 1.7693862002716214, 1.82914306535493, 1.9967537844910388, 1.8859849614097846, 1.7737586538143026, 1.823313127298022, 1.456027029712809, 1.1368379210970878, 1.5638808837656097, 1.9705190632349525, 1.7606412931862594, 1.788333498956573, 4.094074000463744, 5.096823346251944, 2.5272781476696804, 2.0506807115174395, 1.5332737089668416, 1.4458246381132194]\n" +
  "            ]\n" +
  "        },\n" +
  "        {\n" +
  "            \"opts\":{\n" +
  "                \"instances\": 2,\n" +
  "                \"areDemandSharesFixed\":true,\n" +
  "                \"curtailableShare\": 0.00,\n" +
  "                \"shiftableShare\": 0.20,\n" +
  "                \"adaptTimelines\": true,\n" +
  "                \"applyNoise\": true,\n" +
  "                \"variance\": 0.15\n" +
  "            },\n" +
  "            \"shiftP\": 0.15,\n" +
  "            \"curtP\": 0.35,\n" +
  "            \"DEM\": [\n" +
  "                [1.030125, 0.9, 0.8294999999999999, 0.8340000000000001, 0.991125, 1.12575, 1.218375, 1.6173750000000002, 2.614875, 3.169875, 3.212625, 3.3108750000000002, 3.08025, 2.6235, 2.4779999999999998, 2.682375, 2.743125, 2.692125, 2.1622500000000002, 1.52325, 1.3665, 1.29225, 1.225125, 1.1763750000000002],\n" +
  "                [1.013625, 0.867, 0.8047500000000001, 0.811875, 0.9750000000000001, 1.0695000000000001, 1.1283750000000001, 1.531875, 2.454, 2.975625, 3.043875, 3.130125, 2.9467499999999998, 2.5717499999999998, 2.475375, 2.63175, 2.639625, 2.5545, 2.094375, 1.4722499999999998, 1.333875, 1.3091249999999999, 1.212375, 1.1441249999999998],\n" +
  "                [0.917625, 0.787875, 0.7256250000000001, 0.746625, 0.8925000000000001, 1.002, 1.20825, 1.7294999999999998, 2.8271249999999997, 3.4368749999999997, 3.4863750000000002, 3.588, 3.2977499999999997, 2.7577500000000006, 2.5912500000000005, 2.858625, 3.0131250000000005, 3.06075, 2.52225, 1.752375, 1.4340000000000002, 1.2570000000000001, 1.141125, 1.067625]\n" +
  "            ]\n" +
  "        }\n" +
  "    ],\n" +
  "    \"generationLinear\": [\n" +
  "        {\n" +
  "            \"name\": \"Solar-PV\",\n" +
  "            \"opts\":{\n" +
  "                \"isMaxFlConstant\": false,\n" +
  "                \"adaptTimelines\": true,\n" +
  "                \"applyNoise\": true,\n" +
  "                \"variance\": 0.25\n" +
  "            },\n" +
  "            \"cCap\": 1200,\n" +
  "            \"cOpFix\": 50,\n" +
  "            \"cOpVar\": 0.0,\n" +
  "            \"tLife\": 25,\n" +
  "            \"EFFel\": 1.0,\n" +
  "            \"PR\": 0.85,\n" +
  "            \"maxFl\": [\n" +
  "                [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.015, 0.107, 0.32, 0.372, 0.324, 0.447, 0.31, 0.465, 0.225, 0.289, 0.414, 0.271, 0.084, 0.003, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.02, 0.263, 0.495, 0.649, 0.725, 0.689, 0.455, 0.615, 0.396, 0.08, 0.009, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.001, 0.025, 0.043, 0.063, 0.313, 0.507, 0.431, 0.462, 0.222, 0.051, 0.054, 0.003, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.001, 0.08, 0.177, 0.196, 0.173, 0.238, 0.307, 0.651, 0.573, 0.185, 0.199, 0.086, 0.023, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.007, 0.072, 0.088, 0.121, 0.133, 0.235, 0.295, 0.593, 0.687, 0.289, 0.174, 0.152, 0.136, 0.09, 0.037, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.004, 0.034, 0.044, 0.077, 0.136, 0.048, 0.123, 0.116, 0.054, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],\n" +
  "                [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.011, 0.071, 0.256, 0.409, 0.383, 0.435, 0.376, 0.211, 0.219, 0.27, 0.265, 0.227, 0.189, 0.119, 0.043, 0.002, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.006, 0.022, 0.076, 0.163, 0.271, 0.484, 0.642, 0.761, 0.732, 0.641, 0.524, 0.513, 0.314, 0.195, 0.071, 0.007, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.002, 0.039, 0.102, 0.235, 0.25, 0.347, 0.554, 0.633, 0.526, 0.264, 0.104, 0.175, 0.146, 0.031, 0.0, 0.0, 0.0],\n" +
  "                [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.022, 0.095, 0.121, 0.151, 0.115, 0.069, 0.048, 0.004, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.001, 0.07, 0.107, 0.145, 0.064, 0.051, 0.016, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.022, 0.352, 0.52, 0.576, 0.745, 0.516, 0.44, 0.179, 0.165, 0.049, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]\n" +
  "            ]\n" +
  "        },\n" +
  "        {\n" +
  "            \"name\": \"Micro Fuel Cell\",\n" +
  "            \"opts\":{\n" +
  "                \"isMaxFlConstant\": true,\n" +
  "                \"applyNoise\": false\n" +
  "            },\n" +
  "            \"cCap\": 3500,\n" +
  "            \"cOpFix\": 175,\n" +
  "            \"cOpVar\": 0.0608,\n" +
  "            \"tLife\": 15,\n" +
  "            \"EFFel\": 0.60,\n" +
  "            \"PR\": 1.0,\n" +
  "            \"maxFl\": 999.0\n" +
  "        }\n" +
  "    ],\n" +
  "    \"generationDiscrete\":[],\n" +
  "    \"storageLinear\":[],\n" +
  "    \"storageDiscrete\":[\n" +
  "        {\n" +
  "            \"name\": \"Tesla Powerwall\",\n" +
  "            \"CAP\": 13.5,\n" +
  "            \"cCap\": 10000,\n" +
  "            \"tLife\": 10,\n" +
  "            \"EFF+-\": 0.9,\n" +
  "            \"maxP+\": 4.6,\n" +
  "            \"maxP-\": 4.6\n" +
  "        },\n" +
  "        {\n" +
  "            \"name\": \"Victron Li-Ion Battery\",\n" +
  "            \"CAP\": 4,\n" +
  "            \"cCap\": 5000,\n" +
  "            \"tLife\": 10,\n" +
  "            \"EFF+-\": 0.92,\n" +
  "            \"maxP+\": 4.8,\n" +
  "            \"maxP-\": 7.2\n" +
  "        }\n" +
  "    ],\n" +
  "    \"grid\": {\n" +
  "        \"opts\": {\n" +
  "            \"isCostConstant\": true,\n" +
  "            \"isSupplyConstant\": true,\n" +
  "            \"isDemandConstant\": true\n" +
  "        },\n" +
  "        \"maxS\": 500.0,\n" +
  "        \"maxD\": 20.0,\n" +
  "        \"gridC\": 0.30,\n" +
  "        \"feedC\": 0.08\n" +
  "    },\n" +
  "    \"otherParameters\": {\n" +
  "        \"S_weights\": [169,81,115],\n" +
  "        \"tradeC\":0.001\n" +
  "    }\n" +
  "    \n" +
  "}"

const initialState = {
  result: data,
  requestPending: false,
  request: JSON.parse(initialRequest),
  requestString: initialRequest,
}


const reducer = (state = initialState, action) => {
  console.log('ACTION: ' + action.type, action, state)
  switch(action.type) {
    case TYPE.DATA_REQUEST_PENDING:
      return Object.assign({}, state, {
        requestPending: true
      })
    case TYPE.ABORT_PENDING:
      return Object.assign({}, state, {
        requestPending: false
      })
    case TYPE.UPDATE_DATA:
      return Object.assign({}, state, {
        result: action.payload,
        requestPending: false
      })
    case TYPE.SET_REQUEST_STRING:
      return Object.assign({}, state, {
        requestString: action.payload
      })
    case TYPE.UPDATE_REQUEST:
      return Object.assign({}, state, {
        request: JSON.parse(state.requestString)
      })
    default:
      return state
  }
}



export default reducer
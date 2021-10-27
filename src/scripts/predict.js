// getWeights(-73.97092580795288,40.80971663141517,-73.94957542419434,40.79456207284583, 60, 5, 3).then(results => console.log(results));

// TODO If the box area is too large, we might have to download Planet.osm and put it on our backend
// export
export default function getWeights(x1, y1, x2, y2, timeout, r, c) {

    let tagWeights = await readTagWeights();

    // this works for testing!!!!!
    // let tagWeights = new Map();
    // tagWeights.set('crossing', [60, 0]);
    // tagWeights.set('highway', [60, 0]);

    // let matrix = new Array(400);
    // for (let i=0; i<400; i++) {
    //     matrix[i]=(0);
    // }


// let tagWeights = readTagWeights();

// //     // TODO figure out what the radius is (since if it's too large, the API call won't work)
// //     let rad = 0; rad /= 5280; // Size of the largest radius in the spreadsheet (in feet)

// //     // Call API and get nodes in box (nodes are points with tags in Open Street Map)
// //     // TODO Change this to use fetch?
// //     let nodes = [
// //         {
// //           type: 'node',
// //           id: 42421728,
// //           lat: 40.7980478,
// //           lon: -73.9600437,
// //           timestamp: '2019-09-22T17:58:44Z',
// //           version: 6,
// //           changeset: 74778073,
// //           user: 'LucasLarson',
// //           uid: 38533,
// //           tags: { crossing: 'traffic_signals', highway: 'traffic_signals' }
// //         },
// //         {
// //           type: 'node',
// //           id: 42421731,
// //           lat: 40.7986542,
// //           lon: -73.9614745,
// //           timestamp: '2021-10-06T04:19:34Z',
// //           version: 8,
// //           changeset: 112148500,
// //           user: 'SH17',
// //           uid: 2591427,
// //           tags: { highway: 'traffic_signals' }
// //         },
// //         {
// //           type: 'node',
// //           id: 42421737,
// //           lat: 40.7992437,
// //           lon: -73.9628734,
// //           timestamp: '2021-10-06T04:19:34Z',
// //           version: 10,
// //           changeset: 112148500,
// //           user: 'SH17',
// //           uid: 2591427,
// //           tags: { highway: 'traffic_signals' }
// //         }
// //     ]; // South-West-North-East

//     // Create flattened matrix to store tag frequencies for each grid cell
//     let tagMatrix = []; // tagMatrix[0] = (x1, y1) = top-left
//     if(r == null || r < 1){ r = 20; } r += 2 * Math.ceil(rad / ((y1 - y2) / r));
//     if(c == null || c < 1){ c = 20; } c += 2 * Math.ceil(rad / ((x2 - x1) / r));
//     for(let i = r * c; i > 0; i--){
//         tagMatrix.push(new Map());
//     }
//     let weightR = r;
//     let weightC = c;
    
//     // Take each node and assign its tags to the corresponding grid cell
//     for(let node of nodes){
//         let cell = tagMatrix[Math.floor((y1 - node.lat) / ((y1 - y2) / r)) * c + Math.floor((node.lon - x1) / ((x2 - x1) / c))];
//         // Take the tags and add them to a map (which stores each tag and its frequency)
//         for(let property in node.tags){
//             let key = property + ":" + node.tags[property]; // {[property]: node.tags[property]}; // Object equality checks are difficult
//             cell.set(key, (cell.has(key) ? cell.get(key) : 0) + 1);
//         }
//     }

//     // Call the algorithm to find the weight of each cell
//     return calculateWeights(tagWeights, tagMatrix, r, c, weightR, weightC);
// };

// // // async function readTagWeights(){
// // //     let xlsxFile = require('read-excel-file/node');
// // //     let tagWeights = new Map();
// // //     await xlsxFile('../OSMTags.xlsx').then((rows) => {
// // //         for(let row in rows) {
// // //             if(rows[row][1] !== null &&
// // //                rows[row][1] !== "feature" &&
// // //                rows[row][4] !== null &&
// // //                rows[row][5] !== null){
// // //                 let tagName = rows[row][1].split(' ').join('_');
// // //                 let radiusAndWeight = [rows[row][4], rows[row][5]];
// // //                 tagWeights.set(tagName, radiusAndWeight);
// // //             }
// // //         }
// // //     });
 
// // //     return tagWeights;
// // // }

// function readTagWeights() {
//     let tagWeights = new Map([
//         ['24_hour_business', [ 0.022727272727272728, 7 ]],
//         ['abandoned_anything', [ 0.03787878787878788, 4 ]],
//         ['abandoned_anything_tag', [ 0.03787878787878788, 4 ]],
//         ['abandoned_train_tracks', [ 0.03787878787878788, 4 ]],
//         ['abc_store', [ 0.011363636363636364, 3 ]],
//         ['abutters', [ 0.013257575757575758, 12 ]],
//         ['allotments', [ 0.00946969696969697, 14 ]],
//         ['apartments_(low_income)', [ 0.03787878787878788, 6 ]],
//         ['artificial_waterway', [ 0.01893939393939394, 3 ]],
//         ['bad_condition', [ 0.028409090909090908, 4 ]],
//         ['bad_condition_also', [ 0.028409090909090908, 4 ]],
//         ['bar', [ 0.011363636363636364, 6 ]],
//         ['barbed_wire_fence', [ 0.005681818181818182, 8 ]],
//         ['beach', [ 0.003787878787878788, 5 ]],
//         ['beach_or_lake', [ 0.011363636363636364, 0 ]],
//         ['bicycle_allowed', [ 0.002840909090909091, 12 ]],
//         ['bicycle_parking', [ 0.002840909090909091, 12 ]],
//         ['bicycle_road', [ 0.002840909090909091, 8 ]],
//         ['biergarten', [ 0.022727272727272728, 5 ]],
//         ['bike_rack', [ 0.003787878787878788, 12 ]],
//         ['bike_route', [ 0.002840909090909091, 12 ]],
//         ['boardwalk', [ 0.007575757575757576, 8 ]],
//         ['boat_launch', [ 0.007575757575757576, 2 ]],
//         ['boys_and_girls_club', [ 0.07575757575757576, 4 ]],
//         ['building_ruins', [ 0.03787878787878788, 4 ]],
//         ['bus_route', [ 0.01893939393939394, 60 ]],
//         ['bus_station', [ 0.007575757575757576, 24 ]],
//         ['bus_stop', [ 0.00946969696969697, 6 ]],
//         ['bus_stop_shelter', [ 0.00946969696969697, 6 ]],
//         ['camp_pitch', [ 0.007575757575757576, 3 ]],
//         ['camp_site', [ 0.007575757575757576, 6 ]],
//         ['camper_trailers', [ 0.015151515151515152, 6 ]],
//         ['chain_link_fence', [ 0.00946969696969697, 8 ]],
//         ['cigarette_vending_machine', [ 0.007575757575757576, 3 ]],
//         ['city', [ 0.001893939393939394, 400 ]],
//         ['city_block', [ 0.022727272727272728, 25 ]],
//         ['city_border', [ 0.07575757575757576, 30 ]],
//         ['city_with_taxis', [ 0.07575757575757576, 400 ]],
//         ['civic', [ 0.01893939393939394, 20 ]],
//         ['clay_road', [ 0.011363636363636364, 24 ]],
//         ['cleanup_location', [ 0.01893939393939394, 0 ]],
//         ['clock', [ 0.00946969696969697, 300 ]],
//         ['closed', [ 0.022727272727272728, 20 ]],
//         ['collapsed_building', [ 0.07575757575757576, 20 ]],
//         ['common/town_commons', [ 0.07575757575757576, 12 ]],
//         ['community_development_center', [ 0.015151515151515152, 0 ]],
//         ['construction', [ 0.011363636363636364, 12 ]],
//         ['convenience_store', [ 0.022727272727272728, 12 ]],
//         ['cycleway_opposite_traffic', [ 0.011363636363636364, 3 ]],
//         ['dam', [ 0.011363636363636364, 0 ]],
//         ['demolished_railway', [ 0.03787878787878788, 5 ]],
//         ['department_store', [ 0.022727272727272728, 3 ]],
//         ['disused', [ 0.022727272727272728, 2 ]],
//         ['dog_excrement', [ 0.005681818181818182, 4 ]],
//         ['downtown_trees', [ 0.015151515151515152, 3 ]],
//         ['drive_through_other', [ 0.011363636363636364, 0 ]],
//         ['dump', [ 0.11363636363636363, 3 ]],
//         ['dyke', [ 0.005681818181818182, 6 ]],
//         ['elevation', [ 0.00946969696969697, 30 ]],
//         ['ephemeral', [ 0.015151515151515152, 10 ]],
//         ['exit_with_shoulder', [ 0.011363636363636364, 0 ]],
//         ['extended_stay_hotel', [ 0.011363636363636364, 0 ]],
//         ['fast_food', [ 0.011363636363636364, 0 ]],
//         ['fish_and_wildlife_entrance', [ 0.013257575757575758, 0 ]],
//         ['fishing_spot', [ 0.013257575757575758, 0 ]],
//         ['flood_plain_below_populated', [ 0.1893939393939394, 0 ]],
//         ['flood_prone_near_populated', [ 0.03787878787878788, 0 ]],
//         ['flooded_tunnel', [ 0.011363636363636364, 'not sure' ]],
//         ['food_court', [ 0.01893939393939394, 14 ]],
//         ['food_pantry', [ 0.022727272727272728, 6 ]],
//         ['foot_route', [ 0.015151515151515152, 3 ]],
//         ['free_parking', [ 0.00946969696969697, 12 ]],
//         ['gas_station', [ 0.011363636363636364, 1 ]],
//         ['gazebo', [ 0.005681818181818182, 0 ]],
//         ['graffiti', [ 0.005681818181818182, 14 ]],
//         ['grocery_store', [ 0.011363636363636364, 8 ]],
//         ['groyne', [ 0.005681818181818182, 0 ]],
//         ['highway_exit_with_shoulder', [ 0.011363636363636364, 0 ]],
//         ['highway_rest_area', [ 0.011363636363636364, 4 ]],
//         ['historic_railroad', [ 0.015151515151515152, 0 ]],
//         ['homeless_encampment', [ 0.01893939393939394, 0 ]],
//         ['hostel', [ 0.015151515151515152, 6 ]],
//         ['icecream', [ 0, 0 ]],
//         ['impassible_roads', [ 0.011363636363636364, 6 ]],
//         ['inexpensive_hotel', [ 0.022727272727272728, 0 ]],
//         ['island', [ 0, 0 ]],
//         ['kiosk', [ 0.007575757575757576, 20 ]],
//         ['landfill', [ 0.15151515151515152, 4 ]],
//         ['laundry', [ 0.056818181818181816, 16 ]],
//         ['low_income_neighborhood', [ 0.07575757575757576, 20 ]],
//         ['low_standing', [ 0.07575757575757576, 4 ]],
//         ['massage_parlor', [ 0.01893939393939394, 36 ]],
//         ['mcdonalds', [ 0.015151515151515152, 0 ]],
//         ['medium_bridge', [ 0.011363636363636364, 6 ]],
//         ['minor_construction', [ 0.011363636363636364, 30 ]],
//         ['misc_outdoor_seating', [ 0.015151515151515152, 16 ]],
//         ['mobile_home_park', [ 0.022727272727272728, 14 ]],
//         ['mobile_money_agent', [ 0.007575757575757576, 14 ]],
//         ['mobile_phone_shop', [ 0.007575757575757576, 14 ]],
//         ['mofs', [ 0.007575757575757576, 12 ]],
//         ['motels', [ 0.026515151515151516, 0 ]],
//         ['narrow_alley', [ 0.015151515151515152, 16 ]],
//         ['nature_reserve', [ 0.007575757575757576, 16 ]],
//         ['nature_trail_entrance', [ 0.007575757575757576, 'point' ]],
//         ['neighboring_apartments', [ 0.022727272727272728, 'intersection' ]],
//         ['oxbow', [ 0.7575757575757576, 6 ]],
//         ['paths', [ 0.011363636363636364, 'line' ]],
//         ['paved_path', [ 0.011363636363636364, 'line' ]],
//         ['public_park', [ 0.022727272727272728, 8 ]],
//         ['public_transportation', [ 0.022727272727272728, 40 ]],
//         ['railroad_spur', [ 0.03787878787878788, 0 ]],
//         ['reported_location', [ 0.01893939393939394, 'point' ]],
//         ['rural_highway', [ 0.003787878787878788, 'line' ]],
//         ['secluded_roads/dead_ends', [ 0.005681818181818182, 'polygon' ]],
//         ['second_hand', [ 0.07575757575757576, 16 ]],
//         ['shop_operated_by_charity', [ 0.07575757575757576, 16 ]],
//         ['shopping', [ 0.007575757575757576, 'polygon' ]],
//         ['shoreline_lake', [ 0.011363636363636364, 'polygon' ]],
//         ['side_street_parking', [ 0.00946969696969697, 16 ]],
//         ['sidepath', [ 0.00946969696969697, 0 ]],
//         ['sidewalk', [ 0.002840909090909091, 25 ]],
//         ['stormwater_pipe', [ 0.011363636363636364, 'point' ]],
//         ['stream', [ 0.005681818181818182, 'line' ]],
//         ['stream_from_populated_area', [ 0.007575757575757576, 'line' ]],
//         ['tatoo_shop', [ 0.056818181818181816, 36 ]],
//         ['thrift_store', [ 0.007575757575757576, 4 ]],
//         ['tobacco_shop', [ 0.005681818181818182, 'point' ]],
//         ['town', [ 0.0946969696969697, 40 ]],
//         ['train_track', [ 0.00946969696969697, 'polygon' ]],
//         ['trash', [ 0.011363636363636364, 0 ]],
//         ['trolley_bus', [ 0, 0 ]],
//         ['variety_store', [ 0.01893939393939394, 12 ]],
//         ['viewpoint', [ 0.017045454545454544, 0 ]],
//         ['visible_trail', [ 0, 0 ]],
//         ['walmart', [ 0.011363636363636364, 'polygon' ]],
//         ['waste_basket', [ 0.007575757575757576, 4 ]],
//         ['water_basin', [ 0.01893939393939394, 2 ]],
//         ['wooded_area_near_downtown', [ 0.007575757575757576, 'polygon' ]]
//         ]);
//     return tagWeights;
// }

// function calculateWeights(tagWeights, tagMatrix, r, c, weightR, weightC){
//     // Initialize weight matrix
//     let weightMatrix = new Array(weightR * weightC); // weightMatrix will be smaller than tagMatrix because of the buffer zone from the radius
//     for(let i = 0; i < weightMatrix.length; i++){
//         weightMatrix[i] = 0; // 0
//     }

//     // Tag first
//     for(let i = 0; i < tagMatrix.length; i++){
//         for(let [tag, frequency] of tagMatrix[i].entries()){
//             tag = tag.split(':')[0];
//             let radius = tagWeights.has(tag) ? tagWeights.get(tag)[0] : 0;
//             let weight = tagWeights.has(tag) ? 1/tagWeights.get(tag)[1] : 0;

//             /* // Circle check for the future
//             for(x = xCenter - radius ; x <= xCenter; x++){
//                 for(y = yCenter - radius ; y <= yCenter; y++){
//                     // we don't have to take the square root, it's slow
//                     if((x - xCenter)*(x - xCenter) + (y - yCenter)*(y - yCenter) <= r*r){
//                         xSym = xCenter - (x - xCenter);
//                         ySym = yCenter - (y - yCenter);
//                         // (x, y), (x, ySym), (xSym , y), (xSym, ySym) are in the circle
//                     }
//                 }
//             }
//             */ 

//             // Calculate the amount that the tag contributes to the current cell's weight
//             for(let j = 0; j < weightMatrix.length; j++){
//                 let distance2 = Math.pow(j % weightC + (r - weightR)/2 - i % c, 2) + Math.pow(Math.floor(j / weightC) + (c - weightC)/2 - Math.floor(i / c), 2);
//                 if(distance2 < radius*radius){ // <=
//                     weightMatrix[j] += (1 - Math.sqrt(distance2)/radius) * weight * frequency;
//                 }
//             }
//         }
//     }

//     // Normalize weights
//     let maxWeight = 0;
//     for(let i = 0; i < weightMatrix.length; i++){
//         if(weightMatrix[i] > maxWeight){
//             maxWeight = weightMatrix[i];
//         }
//     }
//     if(maxWeight != 0){
//         for(let i = 0; i < weightMatrix.length; i++){
//             weightMatrix[i] /= maxWeight;
//         }
//     }

//     return weightMatrix;
// }


//     let matrix = [0,1,0.25,0,0,0,0,0.2,0.5,0.5,1,0.5,0,0,0,0,0,0,0,0,
//         0.5,1,0.5,0.33333,0,0,0,0.33333,0.5,1,0.33333,0.5,0,0,0.33333,0.5,0.33333,0.33333,0,0,
//         0.5,1,0.25,0,0,0,0,0.2,0.5,1,0.25,0,0,0.5,0.5,0.5,0.5,0.5,0,0,
//         0.33333,1,0.2,0,0,0,0.2,0.5,1,0.5,0.2,0,0,0.33333,0.5,0.33333,1,0.5,0,0,
//         0.33333,1,0.33333,0.2,0,0,0.33333,0.5,1,1,0,0,0,0,0,0,0.5,0,0,0,
//         0.5,1,0.25,0,0,0,0,0.25,1,0.5,0,0.3,0.2,0,0,0,0,0,0,0,
//         0.5,1,0.2,0,0,0.2,0,0.2,1,0.5,0.3,0.2,0.2,0.1,0,0,0,0,0,0,
//         0.33333,1,0,0,0.2,0.33333,0.2,0.2,1,0.33333,0,0,0,0,0,0,0,0,0,0,
//         0.33333,1,0,0,0.2,0.33333,0.2,0.33333,1,0.2,0,0,0,0,0,0,0,0,0,0,
//         0.5,1,0,0,0.25,0.2,0.2,0.25,1,0.25,0,0,0,0,0,0,0,0,0,0,
//         1,0.5,0,0,0,0.25,0.2,0.33333,1,0.33333,0,0,0,0,0,0,0,0,0,0,
//         0.5,0,0,0,0,0,0,0.33333,1,0.5,0.33333,0,0,0,0,0,0,0,0,0,
//         0.5,0,0,0,0,0,0,0.33333,1,1,0.5,0,0,0,0,0,0,0,0,0,
//         1,0,0,0,0,0,0,0.33333,1,1,0.33333,0,0,0,0,0,0,0.33333,0,0,
//         1,1,0,0,0,0,0,0.5,1,1,0.33333,0,0,0,0,0,0.33333,0.5,0.33333,0,
//         1,0.5,0.75,0,0,0,0,0.25,0.5,1,0.33333,0,0,0,0,0,0,0.33333,0,0,
//         0,1,0.75,0.75,0,0,0,0.5,1,0.25,0,0,0,0,0,0,0,0,0,0,
//         0,1,1,1,0,0,0.2,0.5,1,0.5,0,0,0,0,0,0,0,0,0,0,
//         0,0,0,1,0.33333,0.2,0.25,0.5,1,0,0,0,0,0,0,0,0,0,0,0,
//         0,0,0,0.25,1,0.5,0.5,1,0.5,0,0,0,0,0,0,0,0,0,0,0];

//     return matrix;
// }
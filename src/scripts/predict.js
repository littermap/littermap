// TODO If the box area is too large, we might have to download Planet.osm and put it on our backend
// module.exports.getWeights = getWeights;
// module.exports.readTagWeights = readTagWeights; 
// module.exports.calculateWeights = calculateWeights;

// export default // remove when unit testing
export default async function getWeights(x1, y1, x2, y2, timeout, r, c) {

    // TODO figure out what the radius is (since if it's too large, the API call won't work)
    let rad = 0; rad /= 5280; // Size of the largest radius in the spreadsheet (in feet)
    
    let tagWeights = await readTagWeights();
    let nodes = await fetch(`https://www.overpass-api.de/api/interpreter?data=[out:json][timeout:${timeout}][bbox:${y2 - rad},${x1 - rad},${y1 + rad},${x2 + rad}];node(if:count_tags()%20%3E%200);out%20meta;`)
    .then(response => response.json()).then(data => data.elements); 

    // Create flattened matrix to store tag frequencies for each grid cell
    let tagMatrix = []; // tagMatrix[0] = (x1, y1) = top-left
    if(r == null || r < 1){ r = 20; } r += 2 * Math.ceil(rad / ((y1 - y2) / r));
    if(c == null || c < 1){ c = 20; } c += 2 * Math.ceil(rad / ((x2 - x1) / r));
    for(let i = r * c; i > 0; i--){
        tagMatrix.push(new Map());
    }
    let weightR = r;
    let weightC = c;
    
    // Take each node and assign its tags to the corresponding grid cell
    for(let node of nodes){
        let cell = tagMatrix[Math.floor((y1 - node.lat) / ((y1 - y2) / r)) * c + Math.floor((node.lon - x1) / ((x2 - x1) / c))];
        // Take the tags and add them to a map (which stores each tag and its frequency)
        for(let property in node.tags){
            let key = property + ":" + node.tags[property]; // {[property]: node.tags[property]}; // Object equality checks are difficult
            cell.set(key, (cell.has(key) ? cell.get(key) : 0) + 1);
        }
    }

    // Call the algorithm to find the weight of each cell
    return calculateWeights(tagWeights, tagMatrix, r, c, weightR, weightC);
};

async function readTagWeights() {
    let spreadsheetID = "1AalZyIsB63celek82TKPRSEgCRnxL6s9Pug2Scf8l7o"; 
    let range = "B3:F183"; 
    let obj = {  
        method: 'GET',
        headers: {
            'Host': 'sheets.googleapis.com', 
            'Content-length': 0, 
            'Authorization': 'Bearer ya29.a0ARrdaM_89OxdiGABfVjL6V5rvDj-K3skiu5lTN3oWUw0qdNIRoj924f4IFmtqhSF-j0ngI2ZdVamRohxkl0Po-Byk_8I85jFVD2IlfPth3RGcxX2m5rB7_cnoNY8r7AjdyRoKWg9DTLxETjwpe_-vJs5-BRn'
        }
      }
    let rawWeights = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/Sheet1!${range}`, obj)
    .then(response => response.json()).then(data => data.values);  

    let tagWeights = new Map();
    for(value of rawWeights){
        if(!Number.isNaN(Number(value[3])) && !Number.isNaN(Number(value[4]))){
            tagWeights.set(value[0].trim().replaceAll(" ", "_"), [Number(value[3])/5280, Number(value[4])]); 
        }
    }

    return tagWeights;
}

function calculateWeights(tagWeights, tagMatrix, r, c, weightR, weightC){

    // Initialize weight matrix
    let weightMatrix = new Array(weightR * weightC); // weightMatrix will be smaller than tagMatrix because of the buffer zone from the radius
    for(let i = 0; i < weightMatrix.length; i++){
        weightMatrix[i] = 0; 
    }

    // Tag first
    for(let i = 0; i < tagMatrix.length; i++){
        for(let [tag, frequency] of tagMatrix[i].entries()){
            tag = tag.split(':')[0];
            let radius = tagWeights.has(tag) ? tagWeights.get(tag)[0] : 0;
            let weight = tagWeights.has(tag) ? (tagWeights.get(tag)[1] == 0 ? 1 : 1/tagWeights.get(tag)[1]) : 0;

            // Calculate the amount that the tag contributes to the current cell's weight
            for(let j = 0; j < weightMatrix.length; j++){
                let distance2 = Math.pow(j % weightC + (r - weightR)/2 - i % c, 2) + Math.pow(Math.floor(j / weightC) + (c - weightC)/2 - Math.floor(i / c), 2);
                if(distance2 < radius*radius){ // <=
                    weightMatrix[j] += (1 - Math.sqrt(distance2)/radius) * weight * frequency;
                }
            }
        }
    }

    // Normalize weights
    let maxWeight = 0;
    for(let i = 0; i < weightMatrix.length; i++){
        if(weightMatrix[i] > maxWeight){
            maxWeight = weightMatrix[i];
        }
    }
    if(maxWeight != 0){
        for(let i = 0; i < weightMatrix.length; i++){
            weightMatrix[i] /= maxWeight;
        }
    }

    return weightMatrix;
}

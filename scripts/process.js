
var wasabiData;

async function getWasabiData() {
    wasabiData = await getJSON("source/wasabi-artist.json");
    console.log(wasabiData)
}

function trierWasabiDataByType(){
    wasabiData = groupBy(wasabiData, 'type');
    console.log(wasabiData);
}


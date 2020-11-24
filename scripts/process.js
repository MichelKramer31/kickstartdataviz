
var wasabiData;
var artistes;

async function getWasabiData() {
    wasabiData = await getJSON("source/wasabi-artist.json");
    console.log(wasabiData);
}

function gitanPipeline(){

    stage0 = wasabiData;
    stage1 = keepCountry(stage0);
    stage2 = keepDeezerFans(stage1);
    stage3 = keepGenre(stage2);
    stage4 = keepLifeSpanBegin(stage3);
    stage5 = keepLocation(stage4);
    stage6 = keepReleaventData(stage5);

    console.log(stage6);
}

function trierWasabiDataByType(){
    wasabiData = groupBy(wasabiData, 'type');
    console.log(wasabiData);
}


function keepReleaventData(inputData){
    outputData = inputData.map(function (person) {
        return {
            'gender':(person.gender!=undefined||person.gender!="")?"NA":person.gender,
            'genre':(person.genre!=undefined||person.genre!="")?"NA":person.genre,
            'deezerFan':person.deezerFan,
            'lifeBegin':person.lifeSpan.begin,
        }
    })
    return outputData;
}

function keepLifeSpanBegin(inputData){

    outputData = inputData.filter(function (artist) {

        return artist.lifeSpan != undefined&&artist.lifeSpan.begin!=undefined&&artist.lifeSpan.begin!=""
    });
    return outputData

}
function keepLifeSpanEnd(inputData){

    outputData = inputData.filter(function (artist) {

        return artist.lifeSpan != undefined&&artist.lifeSpan.end!=undefined&&artist.lifeSpan.end!=""
    });
    return outputData

}

function keepCountry(inputData){

    outputData = inputData.filter(function (artist) {

        return artist.locationInfo!=undefined&&artist.locationInfo!=""
    });
    return outputData

}

function keepLocation(inputData){

    outputData = inputData.filter(function (artist) {

        return artist.location!=undefined&&artist.location.country!=undefined&&artist.localtion.country!=""
    });
    return outputData

}

function keepDeezerFans(inputData){

    outputData = inputData.filter(function (artist) {

        return artist.deezerFans!=undefined&&artist.deezerFans!=""
    });
    return outputData

}

function keepGenre(inputData){

    outputData = inputData.filter(function (artist) {

        return artist.dbp_genre!=undefined&&artist.dbp_genre!=""||artist.genre!=undefined&&artist.genre!=""
    });
    return outputData

}

function getArtistWithDeezerFan(inputData){
    outputData = inputData.filter(function(artiste){ return !artiste.deezerFans==""||!artiste.deezerFans==undefined })
    return outputData;
}

function getArtiste(){
    artist = wasabiData.filter((entry)=> !entry.type==""||!entry.type==undefined);
    console.log(artist);
}

function getSong(){
    song = wasabiData.filter(function(song){ return (song.type==""||song.type==undefined) && (!song.id_artist_musicbrainz == "" || !song.id_artist_deezer =="" || !song.id_artist_discogs =="")});
    console.log(song);
}

function lookUpArtist(){
    song2 = song.forEach((s)=>{

        var song_artist = artist.find(function(a){ return (s.id_artist_deezer !== "" && a.id_artist_deezer==s.id_artist_deezer) ||
            (s.id_artist_musicbrainz != "" && a.id_artist_musicbrainz==s.id_artist_musicbrainz) ||
            (s.id_artist_discogs != "" && a.id_artist_discogs==s.id_artist_discogs)
            })
        if(song_artist != undefined){
            return {
                song_name:s.name,
                artist_name:song_artist.name
            }
        }
    })
}

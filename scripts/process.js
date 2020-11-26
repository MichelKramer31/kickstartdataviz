
var wasabiData;
var actualData;

async function getWasabiData(callback) {
    wasabiData = await getJSON("source/wasabi-artist.json");
    console.log(wasabiData);
    callback();
}

function pipeline(callback) {

    actualData = wasabiData;

    //filter
    keepCountry();
    keepDeezerFans();
    keepGenre();
    keepLifeSpanBegin();
    keepLocation();
    keepReleaventData();

    //prepare data
    splitDBPGenre();
    splitGenre();
    splitLocation();

    //consolidation des données
    mergeGenres();
    pickCountry();
    determinerFin();

    //unwind les genre
    unwindGenre();
    clusterGenre();

    callback()
}

function unwindGenre(){

    finalData = [];
    actualData.forEach(function (artiste) {

        artiste.genres.forEach(function(genre){
            finalData.push({
                'location': artiste.location,
                'genre': genre,
                'fini': artiste.fini
            })
        })

    })
}

function determinerFin(){

    actualData.forEach(function(artist){
        if(artist.lifeSpan.end != ""){
            artist.fini = "En activité";
        }
        else{
            artist.fini = "Dissous"
        }
        delete(artist.lifeSpan);

    })
}

function pickCountry(){
    actualData.forEach(function(artist){
        artist.location = artist.location[0]
    })
}

function mergeGenres(){
    actualData.forEach(function(artist){

        //si les deux contiennent des array on les fusionne
        if(Array.isArray(artist.genres)&&Array.isArray(artist.dbp_genres)){
            artist.genres = artist.genres.concat(artist.dbp_genres)
        }
        else if(Array.isArray(artist.genres)&&!Array.isArray(artist.dbp_genres)){
            delete artist['dbp_genres']
        }
        else if(!Array.isArray(artist.genres)&&Array.isArray(artist.dbp_genres)){
            artist.genres = artist.dbp_genres
            delete artist.dbp_genres
        }
    })
}

function keepReleaventData(){
    actualData = actualData.map(function (person) {
        return {
            'genres':person.genres,
            'dbp_genres':person.dbp_genre,
            'deezerFan':person.deezerFans,
            'lifeSpan':person.lifeSpan,
            'location':person.locationInfo
        }
    })

}

function keepLifeSpanBegin(){

    actualData = actualData.filter(function (artist) {

        return artist.lifeSpan != undefined&&artist.lifeSpan.begin!=undefined&&artist.lifeSpan.begin!=""
    });

}

function splitDBPGenre(){

    actualData.forEach(function(artist){
        if(artist.dbp_genres !="[]"&&artist.dbp_genres!=""&&artist.dbp_genres!=undefined){
            artist.dbp_genres = parseStringToArray(artist.dbp_genres);
        }
    })

}

function splitGenre(){

    actualData.forEach(function(artist){
        if(artist.genres !="[]"&&artist.genres!=""&&artist.genres!=undefined){
            artist.genres = parseStringToArray(artist.genres);
        }
    })
}

function splitLocation(){

    actualData.forEach(function(artist){
        if(artist.location!=undefined&&artist.location.length>0&&artist.location!=""){
            artist.location = parseStringToArray(artist.location);
        }
    })
}

function keepCountry(){

    actualData = actualData.filter(function (artist) {

        return artist.locationInfo!=undefined&&artist.locationInfo!=""
    });

}

function keepLocation(){

    actualData = actualData.filter(function (artist) {

        return artist.location!=undefined&&artist.location.country!=undefined&&artist.location.country!=""
    });

}

function keepDeezerFans(){

    actualData = actualData.filter(function (artist) {

        return artist.deezerFans!=undefined&&artist.deezerFans!=""
    });

}

function keepGenre(inputData){

    actualData = actualData.filter(function (artist) {

        return artist.dbp_genre!=undefined&&artist.dbp_genre!=""&&artist.dbp_genre!="[]"||artist.genres!=undefined&&artist.genres!="[]"&&artist.genres!=""
    });


}

function clusterGenre(){
    resolveGenreDatabase();
    finalData.forEach(function(artiste){
        genreParent = genreDataBase.find(genre => genre.enfant.toLowerCase() == artiste.genre.toLowerCase() || genre.parent.toLowerCase() == artiste.genre.toLowerCase() )
        if(false){
            genreExplose = artiste.genre.split(" ");
            StandardGenreFound = false;
            i = 0;
            while(!StandardGenreFound||i!=genreExplose.length){
                proposition = genreDataBase.find(genre => genre.enfant.toLowerCase() === genreExplose[i].toLowerCase() || genre.parent.toLowerCase() === genreExplose[i].toLowerCase());
                if(proposition != undefined){
                    artiste.genre = proposition.parent;
                    StandardGenreFound = true;
                }
                i++;
            }
            if(proposition == undefined){
                artiste.genre = "Autre"
            }
        }
        else if(genreParent != undefined){
            artiste.genre =  genreParent.parent
        }
        else{
            artiste.genre = "Autre";
        }
    })
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

function trierWasabiDataByType(){
    wasabiData = groupBy(wasabiData, 'type');
    console.log(wasabiData);
}

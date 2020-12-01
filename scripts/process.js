
var wasabiData;
var actualData;
var wasabiMusicData;

async function getWasabiData(callback) {
    wasabiData = await getJSON("source/wasabi-artist.json");
    console.log(wasabiData);
    callback();
}

async function getWasabiMusicData() {
    wasabiMusicData = await fetch("source/OUT.csv").then(function(data){
        return data.text();
    });
    wasabiMusicData = d3.csvParse(wasabiMusicData);
    console.log(wasabiMusicData);
    return wasabiMusicData;
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

/**
 * Nettoye les données de wasibi
 * Filtre pour retirer les chansons sans longeur ou longeur qui ne sont pas un nombre
 * Définie une langue par défaut `Sans langue` pour les chansons qui n'ont pas de langue détécté
 * Définie un album_genre par défaut `Sans genre` pour les chansons qui n'ont pas de album_genre
 * @param {object[]} wasabiMusicData
 * @returns {{length: number, language_detect: string, album_genre: string}[]}
 */
function cleanData(wasabiMusicData) {
  return wasabiMusicData
    .map((d) => {
      const length = parseInt(d.length, 10);
      return {
        length : Math.min(length, 550),
        language_detect: d.language_detect || "sans langue",
        album_genre:
          d.album_genre && d.album_genre.length > 0
            ? filterGenre(d.album_genre)
            : "sans genre",
      };
    })
    .filter((d) => !isNaN(d.length));
}

/**
 * Regroupe la longeur des chansons par langue et par album_genre
 * @param {{length: number, language_detect: string, genre: string[]}[]} data
 * @returns {Map<string, Map<string, number[]>>}
 */
function computeLengthByLanguageAndGenre(data) {
  return data.reduce(
    (lengthByLanguageAndGenre, { length, language_detect, album_genre }) => {
      if (!lengthByLanguageAndGenre.has(language_detect)) {
        lengthByLanguageAndGenre.set(language_detect, new Map());
      }
      const lengthByGenre = lengthByLanguageAndGenre.get(language_detect);
        if (!lengthByGenre.has(album_genre)) {
          lengthByGenre.set(album_genre, []);
        }
        lengthByGenre.get(album_genre).push(length);
      return lengthByLanguageAndGenre;
    },
    new Map()
  );
}

/**
 * Récupère tous les genres différents dans les données
 * @param {{length: number, language_detect: string, album_genre: string[]}[]} data
 * @returns {string[]}
 */
function computeAllGenre(data) {
  const allGenre = new Set();
  data.forEach(({ album_genre }) => {
    allGenre.add(album_genre);  
  });
  return Array.from(allGenre.values());
}

/**
 * Calcul la moyenne des nombres en paramètres
 * @param {number[]} numbers
 * @returns {number}
 */
function avg(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  } else {
    return numbers.reduce((sum, length) => sum + length, 0) / numbers.length;
  }
}

/**
 * Regroupe les genres par famille, pour éviter d'avoir trop d'axes sur le radar
 * Il y en a environ 550 dans le jeux de données sinon
 * @param {string} album_genre
 * @returns {string}
 */
function filterGenre(album_genre){

  listeGenre = ["rock", "pop", "metal", "punk", "hip hop", "rap", "soul", "folk", "electro", "jazz",
    "core", "funk", "blues", "reggae", "wave"];
  for( const genre of listeGenre) {
    if(album_genre.toLowerCase().includes(genre)) {
     return genre;
    }
  }
  return "autre";
}
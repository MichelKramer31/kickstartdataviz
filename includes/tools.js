
// La fonction groupBy exploitant la puissance du reduce
function groupBy(tableauObjets, propriete){
    return tableauObjets.reduce(function (acc, obj) {
        var cle = obj[propriete];
        if(!acc[cle]){
            acc[cle] = [];
        }
        acc[cle].push(obj);
        return acc;
    }, {});
}

//recupération du json
function getJSON(url){
    return new Promise(resolve => {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
               resolve(JSON.parse(this.response));
            } else {
                console.error("Erreur lors de l'aquisition de la base wasabi")
            }
        };

        request.onerror = function() {
            console.error("Erreur lors de l'aquisition de la base wasabi")
        };

        request.send();
    })
}

const removeEmpty = (obj) => {
    Object.keys(obj).forEach(k =>
        (obj[k] && typeof obj[k] === 'object') && removeEmpty(obj[k]) ||
        (!obj[k] && obj[k] !== undefined) && delete obj[k]
    );
    return obj;
};

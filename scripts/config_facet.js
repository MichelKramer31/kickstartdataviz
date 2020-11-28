function drawFacet(){

    settings = {
        items            : finalData,
        facets           : {
            'fini'     : 'Activite',
            'genre'    : 'Genre',
            'location' : 'Pays'
        },
        facetSelector    : '#facets',

    }

    $.facetelize(settings);

}

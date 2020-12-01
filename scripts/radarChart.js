/**
* Méthode pour afficher le radarChart
*/
getWasabiMusicData().then((wasabiMusicData) => {
  FusionCharts.ready(function () {
    const data = cleanData(wasabiMusicData);
    const allGenre = computeAllGenre(data);
    const lengthByLanguageAndGenre = computeLengthByLanguageAndGenre(data);

    const lengthByGenre =  Array.from(lengthByLanguageAndGenre.entries()).reduce((acc, [langugage, lengthByGenre]) => {
      Array.from(lengthByGenre.entries()).forEach(([genre, lengths]) => {
        if(!acc.has(genre)) acc.set(genre, 0)
          acc.set(genre, lengths.length + acc.get(genre))
      })
      return acc
    }, new Map())
    console.log("lengthByGenre", lengthByGenre);

    const dataset = [];
    Array.from(lengthByLanguageAndGenre.entries()).forEach(
      ([language, lengthByGenre]) => {
        dataset.push({
          seriesname: language,
          plottooltext: `La durée moyenne des chansons <b>${language} - $label</b> est <b>$datavalue</b> secondes`,
          data: allGenre.map((album_genre) => ({
            value: Math.round(avg(lengthByGenre.get(album_genre))),
          })),
        });
      }
    );

    const categories = [
      {
        category: allGenre.map((album_genre) => ({ label: album_genre })),
      },
    ];

    const dataSource = {
      chart: {
        caption: "Durée moyenne des chansons par genre",
        subcaption: "et par langue",
        theme: "fusion",
        numbersuffix: "",
        plotfillalpha: "40",
      },
      categories,
      dataset,
    };

    // Liste des attribut pour les FusionCharts de type radar:
    // https://www.fusioncharts.com/dev/chart-attributes/radar
    new FusionCharts({
      type: "radar",
      renderAt: "chart",
      width: "100%",
      height: "100%",
      dataFormat: "json",
      dataSource,
    }).render();
  });
});
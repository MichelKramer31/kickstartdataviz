const fs = require('fs');
 const csv = require('csv');
const path = require('path');
 const EOL = require('os').EOL;

 FILE = path.join(__dirname, 'wasabi_songs.csv');
 NEW_FILE = path.join(__dirname, 'OUT.csv');

 const readStream = fs.createReadStream(FILE);
 const writeStream = fs.createWriteStream(NEW_FILE);

 const parse = csv.parse({ quote: '"', ltrim: true, rtrim: true, delimiter: '\t', headers: true });
 let ligne = 0
 const transform = csv.transform((row, cb) => {
     result = [row[0], row[4], row[36], row[37], row[39]].join(',') + EOL; //on ne garde que les colonnes qui nous interessent 
     cb(null, result);
     if(ligne % 1000 === 0)console.log(ligne);
     ligne++;
});

readStream.pipe(parse).pipe(transform).pipe(writeStream);
console.log("terminé !")
const csvData = fs.readFileSync(path.join(__dirname, "OUT.csv"), {enconding: "utf-8"})
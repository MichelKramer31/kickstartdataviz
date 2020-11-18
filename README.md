# Kickstart Dataviz Project

## Start the environement
Install http-server for the whole machine
> npm install --global http-server

Go to the project repository and start the server with

> npm start

This will launch a server ready to serve file for the projet

## Fetch the json

Import both library process.js and tool.js in the **index.html** file

> \<script src="scripts/process.js"></script>
>
> \<script src="scripts/tools.js"></script>

You can now anywhere in your code fetch the json file using.
> getJSON(urlToTheJsonFile)

The function getJSON use Promise to deal with the asynchronous call of the GET http method.

The function getWasabiData() illustrate how to get the data and store it in a variable.

To wait for the promise to be resolved, just use await before the call of the function. 

## Try it
In the console of your web browser, call the method getWasabiData() to display the collection the console.

Then try the function trierWasabiDataByType() to categorised entries by type.




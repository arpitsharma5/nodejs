function pushObject(objObj) {
    var arrObj = new Array();
    for (var1 in objObj) {

        arrObj.push(objObj[var1]);
    }
    return arrObj;
}

function csvToJson(inputData) {
    var headerLine = [];
    inputData.split("\n").map(function(eachRow, index) {
        if (eachRow !== "") {
            var eachColumn = eachRow.split(",");
            if (index > 0) {
                ageKey = eachColumn[5];
                if (eachColumn[4] === "Total") {
                    if (eachColumn[5] !== "All ages") {
                        //For Age wise Total Literate Population JSON
                        eachColumn[12] = parseInt(eachColumn[12]);
                        if (ageWiseLiteratePopulation.hasOwnProperty(ageKey)) //to check whether agekey is present in object
                        {
                            ageWiseLiteratePopulation[ageKey].TotalLiteratePop += eachColumn[12];

                        } else {
                            ageWiseLiteratePopulation[ageKey] = {
                                ageGroup: ageKey,
                                TotalLiteratePop: eachColumn[12]
                            };
                        }
                    } else {

                        //For Statwise and gender wise Graduate Population
                        var areaName = eachColumn[3];
                        var graduateMales = parseInt(eachColumn[40]);
                        var graduateFemales = parseInt(eachColumn[41]);

                        if (graduatePopulation.hasOwnProperty(areaName)) //to check whether areaName is present in object
                        {
                            graduatePopulation[areaName].graduateMale += graduateMales;
                            graduatePopulation[areaName].graduateFemale += graduateFemales;
                        } else {
                            graduatePopulation[areaName] = {
                                area: areaName,
                                graduateMale: graduateMales,
                                graduateFemale: graduateFemales
                            };
                        }

                        //For  Education Category
                        for (eduCatIndex = 15; eduCatIndex < 44; eduCatIndex += 3) {

                            var eduCatValue = headerLine[eduCatIndex];

                            var totalPopValue = parseInt(eachColumn[eduCatIndex]);
                            if (educationCategory.hasOwnProperty(eduCatValue)) //to check whether eduCatValue is present in object
                            {
                                educationCategory[eduCatValue].totalPop += totalPopValue;
                            } else {
                                educationCategory[eduCatValue] = {
                                    eduCateg: eduCatValue,
                                    totalPop: totalPopValue
                                };

                            }
                        }
                    }

                }
            } else {

                headerLine = eachColumn;

            }
        }

    });
}


var ageWiseLiteratePopulation = {}; //contains ageWiseLiteratePopulation object
var graduatePopulation = {}; //contains graduatePopulation object
var educationCategory = {}; //contains educationCategory object

var fs = require('fs');
var data = fs.readFileSync('../csv/India2011.csv', 'utf8', (err, data) => {}).toString(); //reads file

csvToJson(data); //calling the function which processes data


ageWiseLiteratePopulation = pushObject(ageWiseLiteratePopulation);
var ageWiseLiteratePopulationjson = JSON.stringify(ageWiseLiteratePopulation);
console.log(ageWiseLiteratePopulationjson);

console.log("\n");
console.log("\n");


graduatePopulation = pushObject(graduatePopulation);
var graduatePopulationjson = JSON.stringify(graduatePopulation);
console.log(graduatePopulationjson);

console.log("\n");
console.log("\n");

educationCategory = pushObject(educationCategory);
var educationCategoryjson = JSON.stringify(educationCategory);
console.log(educationCategoryjson);

//write json into a filter

fs.writeFileSync('../json/ageWiseLiteratePopulation.json', ageWiseLiteratePopulationjson, 'utf8', function(err) {
    if (err) throw err;
    console.log('nothing');
});

fs.writeFileSync('../json/graduatePopulation.json', graduatePopulationjson, 'utf8', function(err) {
    if (err) throw err;
    console.log('nothing');
});
fs.writeFileSync('../json/educationCategory.json', educationCategoryjson, 'utf8', function(err) {
    if (err) throw err;
    console.log('nothing');
});

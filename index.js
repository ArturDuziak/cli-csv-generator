const fs = require("fs");
const readLineSync = require("readline-sync");
const faker = require("faker");
const csv = require("csv");
const argv = require("minimist")(process.argv.slice(2));
const { selectCategory } = require("./selectCategory");

const columnsValues = [];
let { fileName, numOfColumns, numOfRows } = argv;

if (!fileName) {
  fileName = readLineSync.question("How to name your csv file? ", {
    limit: (input) => input.trim().length > 0,
    limitMessage: "File name is required to proceed",
  });
}

let myFile = fs.createWriteStream(`${fileName}.csv`);

if (!numOfColumns) {
  numOfColumns = readLineSync.question("How many columns should the csv have? ", {
    limit: /^[1-9][0-9]*$/i,
    limitMessage: "Number of columns is required to proceed",
  });
}

if (!numOfRows) {
  numOfRows = readLineSync.question("How many rows should the csv have? ", {
    limit: /^[1-9][0-9]*$/i,
    limitMessage: "Number of rows is required to proceed",
  });
}

const fakerMainCategories = Object.values(faker);

for (i = 0; i < numOfColumns; i++) {
  const chosenMainCategoryIndex = selectCategory(
    Object.keys(faker),
    `Choose main category of data for column number ${i + 1}: `
  );

  const chosenSubCategoryIndex = selectCategory(
    Object.keys(fakerMainCategories[chosenMainCategoryIndex]),
    `Choose sub-category of data for column number ${i + 1}: `
  );

  const chosenMainCategoryName = Object.keys(faker)[chosenMainCategoryIndex];
  const chosenSubCategory = Object.keys(faker[chosenMainCategoryName])[chosenSubCategoryIndex];

  columnsValues.push([chosenMainCategoryName, chosenSubCategory]);
}

const includeHeaders = readLineSync.keyInYN("Do you want to include headers for the columns? ");

const columnHeaders = [];
if (includeHeaders) {
  for (i = 0; i < numOfColumns; i++) {
    const columnHeader = readLineSync.question(`What header do you want for ${i + 1} column? `, {
      limit: (input) => input.trim().length > 0,
      limitMessage: "Header is required",
    });

    columnHeaders.push(columnHeader);
  }
}

const includeIndexColumn = readLineSync.keyInYN("Do you want to add a column with index value? ");
includeIndexColumn && columnHeaders.unshift("ID");
let indexColumnValue = 1;

csv
  .generate({
    delimiter: ",",
    length: Number(numOfRows),
    columns: Number(numOfColumns),
  })
  .pipe(csv.parse())
  .pipe(
    csv.transform(function (record) {
      const newRecords = record.map(function (value, index) {
        const [mainCategory, subCategory] = columnsValues[index];
        value = faker[mainCategory][subCategory]();

        return value;
      });

      if (includeIndexColumn) {
        newRecords.unshift(indexColumnValue);
        indexColumnValue++;
      }

      return newRecords;
    })
  )
  .pipe(csv.stringify(includeHeaders ? { header: true, columns: columnHeaders } : {}))
  .pipe(myFile);

const fs = require("fs");
const readLineSync = require("readline-sync");
const faker = require("faker");
const csv = require("csv");
const argv = require("minimist")(process.argv.slice(2));

const presetValues = ["email", "username", "phone_number"];
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
    limitMessage: "Number of column is required to proceed",
  });
}

if (!numOfRows) {
  numOfRows = readLineSync.question("How many rows should the csv have? ", {
    limit: /^[1-9][0-9]*$/i,
    limitMessage: "Length of csv is required to proceed",
  });
}

for (i = 0; i < numOfColumns; i++) {
  const columnValue = readLineSync.keyInSelect(
    presetValues,
    `What preset value do you want for column number ${i + 1}? `
  );
  columnsValues.push(columnValue);
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

csv
  .generate({
    delimiter: ",",
    length: Number(numOfRows),
    columns: Number(numOfColumns),
  })
  .pipe(
    csv.parse({
      delimiter: ",",
    })
  )
  .pipe(
    csv.transform(function (record) {
      return record.map(function (value, index) {
        switch (columnsValues[index]) {
          case 0:
            value = faker.internet.email();
            break;
          case 1:
            value = faker.internet.userName();
            break;
          case 2:
            value = faker.phone.phoneNumber();
            break;
          default:
            value = value;
        }

        return value;
      });
    })
  )
  .pipe(csv.stringify(includeHeaders ? { header: true, columns: columnHeaders } : {}))
  .pipe(myFile);

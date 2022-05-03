# Command line CSV file generator

**Disclaimer: not all categories that can be chosen will work correctly, some of them result with error and file not being properly generated, this is a known issue and current limitation of this app**

Generate simple CSV files filled with fake data, all in command line. Created using NodeJS and [Faker](https://github.com/faker-js/faker)

## Installation
1. Clone the repository
2. Run `npm install`
3. Run `npm start` to start the app

## Usage
To generate a file simply run `npm start` and go through the wizard, in the wizard you will choose a name for a file, then a number of columns and rows, then you will choose a category of data from Faker for each column. Optionally, you can add title headers for each column and also add an index column at the beginning. To speed up the first steps you can provide such arguments to the starting script:
* `--fileName` - file name of generated CSV file
* `--numOfColumns` - number of columns to be generated
* `--numOfRows` - number of rows to be generated

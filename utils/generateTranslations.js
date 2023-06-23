const { GoogleSpreadsheet } = require("google-spreadsheet");
const secret = require("./secret.json");

// Initialize the sheet
const doc = new GoogleSpreadsheet("1f2lYY2JDnC4ujGXh27WdHNPTmRCpiw3jN_XFDPsQ5eM");

const fs = require("fs");

// Initialize Auth
const init = async () => {
  await doc.useServiceAccountAuth({
    client_email: secret.client_email, //don't forget to share the Google sheet with your service account using your client_email value
    private_key: secret.private_key,
  });
};

const read = async () => {
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByTitle["Traducciones"]; //get the sheet by title, I left the default title name. If you changed it, then you should use the name of your sheet
    await sheet.loadHeaderRow(); //Loads the header row (first row) of the sheet
    const colTitles = sheet.headerValues; //array of strings from cell values in the first row
    const rows = await sheet.getRows({ limit: sheet.rowCount }); //fetch rows from the sheet (limited to row count)
  
    let result = {};
    //map rows values and create an object with keys as columns titles starting from the second column (languages names) and values as an object with key value pairs, where the key is a key of translation, and value is a translation in a respective language
    rows.map((row) => {
      colTitles.slice(1).forEach((title) => {
        result[title] = result[title] || [];
        const key = row[colTitles[0]];
        result = {
          ...result,
          [title]: {
            ...result[title],
            [key]: row[title] !== "" ? row[title] : undefined,
          },
        };
      });
    });
  
    return result;
  };

  const write = (data) => {
    Object.keys(data).forEach((key) => {
      fs.writeFile(
        `../translations/${key}.json`,
        JSON.stringify(data[key], null, 2),
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    });
  };

  init()
  .then(() => read())
  .then((data) => write(data))
  .catch((err) => console.log("ERROR!!!!", err));
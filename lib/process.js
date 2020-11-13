const fs = require('fs');
const getStream = require('get-stream');
const parse = require('csv-parse');
const csv = require('csv-parser');
const _ = require('lodash');

module.exports = {
  readFile: async (path) => {
    return await getStream.array(fs.createReadStream(path).pipe(csv()));
  },
  convertVariants: ( variantData ) => {
    let nameIndex = 0;
    const variantList = {};
    const data = module.exports.trimData(variantData);
    data.forEach((pair, i) => {
      let { name } = pair;
      const value = pair['value_ids/name'];
      if ( name.length ){
        nameIndex = i;
      } else {
        name = data[nameIndex].name;
      }
      if (typeof variantList[name] === "undefined"){
        variantList[name] = [];
      }
      variantList[name].push(value);
    });
    return variantList;
  },
  convertProducts: ( productData, variantList ) => {
    const initRow = {
      default_code: 0,
      name: "",
      list_price: 0,
      standard_price: 0,
      barcode: "",
      purchase_ok: "TRUE",
      sale_ok: "TRUE",
      categ_id: "All / Saleable / Magic: the Gathering / Singles",
      "attribute_line_ids/attribute_id": "",
      "attribute_line_ids/value_ids": ""
    };
    const subsequentRow = {
      default_code: "",
      name: "",
      list_price: "",
      standard_price: "",
      barcode: "",
      purchase_ok: "",
      sale_ok: "",
      categ_id: "",
      "attribute_line_ids/attribute_id": "",
      "attribute_line_ids/value_ids": ""
    };
    const productList = [];
    const data = module.exports.trimData(productData);
    data.forEach(( row ) => {
      const firstRow = _.clone(initRow);
      firstRow.default_code = row['ID'];
      firstRow.name = `${row["CARD NAME"]} (${row["CARD SET"]},${row["RARITY"]})`;
      Object.keys(variantList).forEach(( k, i ) => {
        if (i === 0) {
          firstRow["attribute_line_ids/attribute_id"] = k;
          firstRow["attribute_line_ids/value_ids"] = variantList[k].join(',');
          productList.push(firstRow);
          return true;
        }
        const row = _.clone(subsequentRow);
        row["attribute_line_ids/attribute_id"] = k;
        row["attribute_line_ids/value_ids"] = variantList[k].join(',');
        productList.push(row);
      });
    });
    console.log(productList);
  },
  trimData: (data) => {
    return data.map( point => {
      const newPoint = {};
      Object.keys( point ).forEach( k => {
        newPoint[k.trim()] = point[k].trim();
      });
      return newPoint;
    });
  }
};

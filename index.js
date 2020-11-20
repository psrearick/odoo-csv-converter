#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const minimist = require('minimist');
const CLI = require('clui');
const files = require('./lib/files');
const processData = require('./lib/process');
const Spinner = CLI.Spinner;

clear();

console.log(
  chalk.redBright(
    figlet.textSync('Odoo CSV', { horizontalLayout: 'full' })
)
);

const args = minimist(process.argv.slice(2), {
  string: [ 'file', 'out', 'variants' ],
  alias: { f: 'file', o: 'out', v: 'variants' },
  '--': true,
});
const file = args.f;
const out = args.o;
const variants = args.v;

if (typeof file === "undefined") {
  console.log(chalk.red('Input file required. Use option "-f"'));
  process.exit();
}

if (typeof out === "undefined") {
  console.log(chalk.red('Output file required. Use option "-o"'));
  process.exit();
}

if (typeof variants === "undefined") {
  console.log(chalk.red('Variants file required. Use option "-v"'));
  process.exit();
}

if (!files.pathExists(file)) {
  console.log(chalk.red('Input file not found.'));
  process.exit();
}

if (!files.pathExists(variants)) {
  console.log(chalk.red('Variants file not found.'));
  process.exit();
}

if (files.pathExists(out)){
  console.log(chalk.red('That file already exists. Please choose a different name to write to.'));
  process.exit();
}

const status = new Spinner('Processing file, please wait...');
status.start();

const convert = async ( file, variants, out ) => {
  const header = [
    {id: 'default_code', title: 'default_code'},
    {id: 'name', title: 'name'},
    {id: 'list_price', title: 'list_price'},
    {id: 'standard_price', title: 'standard_price'},
    {id: 'barcode', title: 'barcode'},
    {id: 'purchase_ok', title: 'purchase_ok'},
    {id: 'sale_ok', title: 'sale_ok'},
    {id: 'categ_id', title: 'categ_id'},
    {id: 'attribute_line_ids/attribute_id', title: 'attribute_line_ids/attribute_id'},
    {id: 'attribute_line_ids/value_ids', title: 'attribute_line_ids/value_ids'}
  ]
  const variantData = await processData.readFile( variants );
  const variantList = await processData.convertVariants( variantData );
  const productData = await processData.readFile( file );
  const productList = await processData.convertProducts( productData, variantList );
  return await processData.writeFile(out, header, productList);
};

convert(file, variants, out)
  .then(
    () => {
      status.stop();
  }
);



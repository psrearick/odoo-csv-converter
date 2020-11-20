# odoo-csv-converter
Converts CSV files of raw data into a format Odoo can import. This is only for inventory data, but it can be adapted to any module.

Currently, this is used for magic card singles. It can only process a single category, "All / Saleable / Magic: the Gathering / Singles".

The card csv needs to have the column headers "Card Name", "Card Set", and "Rarity".

Only those three name columns, default code ("ID"), and "categ_id" (hardcoded) are used. Adding the rest should be easy though.


**To Do:**

* write a separate script outside of this project to combine the three unique column headers into a single "name" column. This way the code for the three fields that are being concatenated (name, set, and rarity) can be removed.
* change the import method from requiring multiple scripts to accepting a single "config" file of a json array:
    * "variants": path to variants file
    * "categories": nested array
        * "\<Category Name\>": path to csv for category data
    * "data": array of paths to input data as an alternative to the "categories" value with only one of the two fields used. Instead of having the data of each category in a separate file, just add a "category" column to the data csv file.
* finish adding support for remaining columns, this should be quick, I just didn't need to do it. Each of the column values should only be on the first row generated from each row of the csv, so not on the row for subsequent attributes unless its value is somehow determined by the attribute, like price (the csv would need parsed slightly differently for this).
* maybe this script should be able to output different files. I am thinking it could also output a file for variants to import as needed. Also, though, giving the ability to use this data to create POS pricelists. That way there are ways to have different pricing rules for each variant.
    
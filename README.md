# sfcc-images-cleaner
SFCC image catalog cleaner to remove the unused images


## Install the package
```bash
npm install -g sfcc-images-cleaner
```

## Run the cleaner
A Command-line Interface is available and can be used as the example below:

source-catalog-folder: relative path of the catalog folder where the images are
output-folder: relative path of the folder where you want to have the cleaned folder.

```bash
sfcc-images-cleaner <source-catalog-folder> <output-folder>
```

```bash
sfcc-images-cleaner ../default-catalog/ ../default-clean-catalog --config=catalog.xml
```


## Options
### config (required)
This option is mandatory and needs to be filled. It is the XML file where you want to map with your catalog image folder.

```bash
sfcc-images-cleaner <source-catalog-folder> <output-folder> --config=catalog.xml
```

### Export (mandatory)

You can export the results into a worksheet. You can define the format yourself but by default it is CSV if you forget the extension.
The file is created in the output folder


```bash
sfcc-images-cleaner ../default-catalog/ ../default-clean-catalog --config=catalog.xml --export=myFile
```

#### CSV
```bash
sfcc-images-cleaner ../default-catalog/ ../default-clean-catalog --config=catalog.xml --export=myFile.csv
```

#### XLSX
```bash
sfcc-images-cleaner ../default-catalog/ ../default-clean-catalog --config=catalog.xml --export=myFile.xlsx
```

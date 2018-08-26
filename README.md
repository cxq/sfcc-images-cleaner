# sfcc-images-cleaner
SFCC image catalog cleaner to remove the unused images and also optimize the ones that are used.
It helps to improve the speed of the site import/export as it's usually main cause of slowness.

It also gives a text report with the following information:

- Total images referenced in the XML
- Total images in the image folder
- Total images that were copied
- Total images that were not copied because they are not used
- Total images in XML not found in the folder
- Total size of the optimized image folder


## Install the package
```bash
npm install -g sfcc-images-cleaner
```

## Run the cleaner
A Command-line Interface is available and can be used as the example below:

source-catalog-folder: relative path of the catalog folder where the images are.

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

### optimize (optional)
Output a image optimized version of the cleaned folder.

#### optim
Optim option can be passed to enable the feature. Be aware that can take time depending on the number of images you have

```bash
sfcc-images-cleaner ../default-catalog/ ../default-clean-catalog --config=catalog.xml --optim
```

#### quality
Quality can be defined from a range `0` (worst) to `100` (perfect). 
By default, if nothing is passed the value 60 is taken. The option can work only if `optim` options is set

```bash
sfcc-images-cleaner ../default-catalog/ ../default-clean-catalog --config=catalog.xml --optim --quality=80
```

### Export (optional)

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

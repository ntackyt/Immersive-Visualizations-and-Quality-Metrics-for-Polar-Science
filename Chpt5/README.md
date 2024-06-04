
# EXTENDED CONTROLS AND RECOMMENDED EVALUATION OF WEBXR FENCE DIAGRAMS

## References:
[Aframe](https://aframe.io/docs/1.5.0/introduction/)

[Cresis](https://data.cresis.ku.edu/)



## Processing and Generating Images

1. Get the raw radar grams from [Cresis](https://data.cresis.ku.edu/), or similar. The code is formated to expect the same dimensions as Cresis data as input. There is some checking for basic flipping of arrays such as (n,1) -> (1,n), but this is not extensive so debugging may be required if you use data from another source.

2. Open the " Generate Images.ipynb". Update the folder to the correct relative or full path. The processed images are placed in this folder as well and required the following substructure:

``` 
- FolderName
    - radar_images // Holds all .png images
    - matlab_files // Holds all .mat files
```

3. Run the first 5 cells with code. These import all the necessary packages and gets the file names to save the images as. Please check as this point that all the expected files have been added.

4. (Optional) Cell 6 displays all the plots with axis data. This can be used for understanding each slice individually. You can save these as needed.

5. Cell 7 processes every radar image to extracts positional information and place it in a json file for easy access for the Aframe visualizer, this json is named the same as the folder. It also identifies the highest elevation across all radar slices. The json contains the following information per radar slice:

```
filename: {
    id: filename
    m: slope of y=mx+b
    b: shift of y=mx+b
    xo: epsg:3413 projection of the start longitude (Scaled by 1000)
    yo: epsg:3413 projection of the start latitude (Scaled by 1000)
    x: epsg:3413 projection of the end longitude (Scaled by 1000)
    y: epsg:3413 projection of the end latitude (Scaled by 1000)
    xmid: Mid point between xo and x - used to place the planes in XR(Scaled by 1000)
    ymid: Mid point between yo and y - used to place the planes in XR (Scaled by 1000)
    deltax: Total change in x(Scaled by 1000)
    deltay: Total change in y (Scaled by 1000)
}

```

6. (Optional) Cell 0elevation: This cell produces images with a indicator line at the 0 elevation portion for debugging.

7. Cell adjusted: This cell takes the maximum elevation calculaed in Step 5 (Cell 7) and pads any radar image which begins at a lower elevation up to the same elevation by adding rows of 0's to the top. It also crops every image to at approximately -2000 elevation along the bottom row of pixels. NOTE: these are not precise but generally cannot be distinguished by the eye.

8. Cell adjusted_flipped: Simply opens the newly created images and preforms a vertical flip. This is needed so that the planes will have the images aligned correctly on both sides.


## Loading Images into Aframe

1. Make a copy of "North_West_Greenland.html" and rename. I tend to make this and the folder used above have a similar, or the same, name.

2. Modify Line 32 to: ```await loadPlanes("Folder_Name");``` 

3. Save and push all to get and pull on the GL server side. 

4. Debug. Most likely there will be some missalignment of images. Either the orientation is flipped so the images are not correctly aligned along the plane or there are gaps. Some massaging made be required of the JSON file and checking that the format of the data was as expected in the input mat file.
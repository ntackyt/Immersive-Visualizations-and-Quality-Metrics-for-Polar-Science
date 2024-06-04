
function loadPlanes(location) {

    fetch("./"+location+"/"+location+".json")
    .then((response) => response.json())
    .then((data) => generateDisplay(data));

    function generateDisplay(img_data){
        

        // Find the min and max x values for the mid points - get thisr middle and calculate the shift to move them to the z axis
        // THIS NEEDS TO BE DEBUGGED!!! - With other scenes. this may be just for this scene.
        let xmin = Infinity;
        let xmax = -Infinity;
        let zmin = Infinity;
        let zmax = -Infinity;
        for(let i in img_data){
            console.log(img_data[i].id, img_data[i].xmid, img_data[i].ymid)
            if(-img_data[i].xmid > xmax){
                // console.log("updated xmax: ", xmax, img_data[i].xmid)
                xmax = -img_data[i].xmid
            }
            if (-img_data[i].xmid < xmin){
                // console.log("updated xmin: ", xmin, img_data[i].xmid)
                xmin = -img_data[i].xmid
            }

            if(img_data[i].ymid > zmax){
                // console.log("updated zmax: ", zmax, img_data[i].ymid)
                zmax = img_data[i].ymid
            }
            if (img_data[i].ymid < zmin){
                // console.log("updated zmin: ", zmin, img_data[i].ymid)
                zmin = img_data[i].ymid
            }
        }
        
        let xshift = xmin* (-1); // flip the sign so that the shift is the mid point to the origin 
        let zshift = zmax* (-1);
        console.log(xshift, zshift)

        let i = 0;
        for(let key in img_data){
            console.log(img_data[key].id);
            console.log("xo: ", -img_data[key].xo)
            console.log("x: ", -img_data[key].x)
            console.log("zo: ", img_data[key].yo)
            console.log("z: ", img_data[key].y)
            console.log("midx: ", img_data[key].xmid)
            console.log("midz: ", img_data[key].ymid)
            
            let xo = (-img_data[key].xo + xshift); 
            let x = (-img_data[key].x + xshift);
            console.log(xo, x)
            let zo = (img_data[key].yo + zshift); 
            let z = (img_data[key].y + zshift);
            console.log(zo, z)

            // var line = document.createElement("a-entity");
            // line.setAttribute("line", "start: "+ xo+ " 0 "+ zo+ "; end: "+ x+ " 0 "+ z+";");
            // document.getElementById("placePlanes").appendChild(line); // append node
            // line.flushToDOM(); 
            
            // Get the length of the image
            let dist = Math.sqrt( Math.pow((xo - x),2) + Math.pow((zo - z),2));

            // Calculate the rotation of the line
            let b = img_data[key].b
            let m = img_data[key].m
            let bm = -b/m
            console.log("atan(y/x)= ",  Math.atan((m*(bm+1)+b - 0)/ ((bm+1) - bm))* 180 / Math.PI)
            ntheta =  Math.atan((m*(bm+1)+b - 0)/ ((bm+1) - bm))* 180 / Math.PI
            // if the plane needs yo be flipped 
            if((xo - x)/(zo - z) > 0){
                ntheta = -ntheta;
            }

                        
            // Place the plane in the XZ plane
            let xdist = -img_data[key].xmid + xshift;
            let ydist = 0;
            let zdist = img_data[key].ymid + zshift; // may need to shift here.. ?

            // get create the image tag and addi ti to the assets
            var image = document.createElement("img");
            image.id = img_data[key].id + "_im";
            // if(img_data[key].id == "Data_20140512_01_043"){
                
            //     image.setAttribute("src", location+"/radar_images/" + img_data[key].id + "_adjusted_marked.png"); 
            // }
            // else{
            //      image.setAttribute("src", location+"/radar_images/" + img_data[key].id + "_adjusted.png"); 

                // }
            image.setAttribute("src", location+"/radar_images/" + img_data[key].id + "_adjusted_flipped.png"); 
            // will need to adjust this in the future so that they have the correct tag based on options
            document.getElementById("assets").appendChild(image); // append the image src ot the assets tag
           
            var plane = document.createElement("a-plane");
            plane.setAttribute("id", "plane"+i);

            document.getElementById("placePlanes").appendChild(plane); // append node
            
            let pos = (xdist) + " " + (ydist) + " " + (zdist);
            
            plane.setAttribute('position',pos);
            plane.object3D.position.setX(xdist); 
            plane.object3D.position.setY(ydist); 
            plane.object3D.position.setZ(zdist); 
            console.log(plane.object3D.position);


            plane.setAttribute("rotation", '180 '+ ntheta +' 180');
            plane.setAttribute("width", dist);//"36");
            plane.setAttribute("height", "25");
            plane.setAttribute("material", "side: double ");
            plane.setAttribute("src","#" + img_data[key].id+"_im");
            
            //https://aframe.io/docs/0.9.0/core/component.html#flushtodom
            // https://stackoverflow.com/questions/55023197/a-frame-how-to-save-inspector-changes-made-with-the-3d-widget-to-the-clipboard
            plane.flushToDOM(); 
          
            i++;
        }


    } // end generateData
    // return true;
} // end loadPlanes

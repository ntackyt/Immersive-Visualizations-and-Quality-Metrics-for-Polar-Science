function getlength(number) {
    number = Math.floor(number);
    return number.toString().length;
}

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

            // console.log(img_data[i].id, img_data[i].xmid, img_data[i].ymid)

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
                // console.log("updated zmin: ", zmin, img_data[i].ymid)y
                zmin = img_data[i].ymid
            }
        }
        
        let xshift = xmin* (-1); // flip the sign so that the shift is the mid point to the origin 
        let zshift = zmin* (-1);
        // console.log("x:", xmin, xmax);
        // console.log("z:", zmin, zmax);
        // console.log(xshift, zshift)

        let i = 0;
        for(let key in img_data){
            console.log(img_data[key].id);
            // console.log("xo: ", -img_data[key].xo)
            // console.log("x: ", -img_data[key].x)
            // console.log("zo: ", img_data[key].yo)
            // console.log("z: ", img_data[key].y)
            // console.log("midx: ", img_data[key].xmid)
            // console.log("midz: ", img_data[key].ymid)
            
            // Enforce all numers are 2 digits

            let xo = (-img_data[key].xo + xshift); 
            let x = (-img_data[key].x + xshift);
            // console.log(xo, x)
            let len_x = Math.max(getlength(x), getlength(xo))
            if( len_x > 3){
                // console.log("x num digs: ", len_x)
                x  /= Math.pow(10,(len_x-3))
                xo /= Math.pow(10,(len_x-3))
            }
            // console.log(xo, x)


            let zo = (img_data[key].yo + zshift); 
            let z = (img_data[key].y + zshift);
            // console.log(zo, z)
            let len_z = Math.max(getlength(z), getlength(zo))
            if( len_z > 3 ){
              // console.log("z num digs: ", len_z)
                z  /= Math.pow(10,(len_z-3))
                zo /= Math.pow(10,(len_z-3))
            }
            // console.log(zo, z)

            // console.log(-img_data[key].xmid, img_data[key].ymid)
            // console.log(-img_data[key].xmid+ xshift, img_data[key].ymid+ zshift)


            // var line = document.createElement("a-entity");
            // line.setAttribute("line", "start: "+ xo+ " 0 "+ zo+ "; end: "+ x+ " 0 "+ z+";");
            // document.getElementById("placePlanes").appendChild(line); // append node
            // line.flushToDOM(); 
            
            // Get the length of the image
            let dist = Math.sqrt( Math.pow((xo - x),2) + Math.pow((zo - z),2));
            // console.log("dist: ", dist);
            // if(getlength(dist) > 2){
            //     dist /= Math.pow(10,(getlength(dist)-2))
            // }
            // console.log("dist: ", dist);


            // Calculate the rotation of the line
            let b = img_data[key].b
            let m = img_data[key].m
            let bm = -b/m
            // console.log("atan(y/x)= ",  Math.atan((m*(bm+1)+b - 0)/ ((bm+1) - bm))* 180 / Math.PI)
            ntheta =  Math.atan((m*(bm+1)+b - 0)/ ((bm+1) - bm))* 180 / Math.PI
            // if the plane needs yo be flipped 
            if((xo - x)/(zo - z) > 0){
                ntheta = -ntheta;
            }
            // console.log("atan+check vs atan2", ntheta, Math.atan2((m*(bm+1)+b - 0)/ ((bm+1) - bm))* 180 / Math.PI)
            // console.log("alt atan2", Math.atan2((zo - z), (xo - x))* 180 / Math.PI)
            
            // Place the plane in the XZ plane
            let xdist = -img_data[key].xmid + xshift;
            if(getlength(xdist) > 2){
                xdist /= Math.pow(10, (getlength(xdist)-2))
            }
            let ydist = 0;
            let zdist = img_data[key].ymid + zshift; // may need to shift here.. ?
            if(getlength(zdist) > 2){
                zdist /= Math.pow(10, (getlength(zdist)-2))
            }

            // get create the image tag and addi ti to the assets
            // var image = document.createElement("img");
            // image.id = img_data[key].id + "_im";
            // if(img_data[key].id == "Data_20140512_01_043"){
                
            //     image.setAttribute("src", location+"/radar_images/" + img_data[key].id + "_adjusted_marked.png"); 
            // }
            // else{
            //      image.setAttribute("src", location+"/radar_images/" + img_data[key].id + "_adjusted.png"); 

                // }
            var image_4 = document.createElement("img");
            image_4.id = img_data[key].id + "_im_4"
            image_4.setAttribute("src", location+"/radar_images/" + img_data[key].id + "_adjusted_flipped.png"); 
            // will need to adjust this in the future so that they have the correct tag based on options
            document.getElementById("assets").appendChild(image_4); // append the image src ot the assets tag
            var image_5 = document.createElement("img");
            image_5.id = img_data[key].id + "_im_5"
            image_5.setAttribute("src", location+"/radar_images/" + img_data[key].id + "_adjusted.png"); 
            // will need to adjust this in the future so that they have the correct tag based on options
            document.getElementById("assets").appendChild(image_5); // append the image src ot the assets tag
           
            // var plane_l = document.createElement("a-plane");
            var plane_l = document.createElement("a-box"); // try as a box

            plane_l.setAttribute("id", "plane"+i);
            // var plane_r = document.createElement("a-plane");
            // plane_r.setAttribute("id", "plane"+i+"_r");
            
            document.getElementById("placePlanes").appendChild(plane_l); // append node
            // document.getElementById("placePlanes").appendChild(plane_r); // append node
            
            let pos = (xdist) + " " + (ydist) + " " + (zdist);
            console.log("pos:", pos)
            
            plane_l.setAttribute('position', pos);
            // plane_r.setAttribute('position', pos);
            
            // plane_l.setAttribute("myplane", "");
            // plane_l.flushToDOM(); 
            // plane_l.object3D.position.setX(xdist); 
            // plane_l.object3D.position.setY(ydist); 
            // plane_l.object3D.position.setZ(zdist); 
            // console.log(plane_l.object3D.position);


            plane_l.setAttribute("rotation", '180 '+ ntheta +' 180');
            plane_l.setAttribute("width", dist);//"36");
            plane_l.setAttribute("height", 25);
            plane_l.setAttribute("depth", 0.01); // for box only
            plane_l.setAttribute("material", "transparent: true; opacity: 1.0"); // transparency/opacity
            // plane_l.setAttribute("material", "side: double "); // for plane only?
            // plane_l.setAttribute("src","#" + img_data[key].id+"_im");

            plane_l.setAttribute('multisrc', "src4:#" + image_4.id+";src5:#"+image_5.id)
            // plane_l.setAttribute("repeat","0.5 0.5");
            // material.displacementTextureRepeat
            // plane_l.setAttribute("spherical-env-map", image.id);
            plane_l.setAttribute("class","clickable");

            // plane_r.setAttribute("rotation", '180 '+ ntheta +' 180');
            // plane_r.setAttribute("width", dist);//"36");
            // plane_r.setAttribute("height", 25);
            // plane_r.setAttribute("material", "side: double ");
            // plane_r.setAttribute("src","#" + img_data[key].id+"_im");
            // // plane_r.setAttribute("repeat","0.9 1");
            // // plane_r.setAttribute("offset","0.1 0");
            // plane_r.setAttribute("stereo","eye: right");
            // plane_l.setAttribute("class","clickable");

            
            //https://aframe.io/docs/0.9.0/core/component.html#flushtodom
            // https://stackoverflow.com/questions/55023197/a-frame-how-to-save-inspector-changes-made-with-the-3d-widget-to-the-clipboard
            plane_l.flushToDOM(); 
            // plane_r.flushToDOM(); 
          
            i++;
        }


    } // end generateData
    // return true;
} // end loadPlanes

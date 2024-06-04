function getlength(number) {
    number = Math.floor(number);
    return number.toString().length;
}

function loadPlanes_copy(location) {

    fetch("./"+location+"/"+location+".json")
    .then((response) => response.json())
    .then((data) => generateDisplay(data));

    function generateDisplay(img_data){
        
        // Get the shifts 
        // flip the sign so that the shift is the mid point to the origin 
        let xshift = img_data['global_data'].x_closest_to_zero * (-1); 
        let zshift = img_data['global_data'].y_closest_to_zero * (-1);

        console.log("shifts, x, z:", xshift, zshift)

        let i = 0;
        for(let key in img_data){
            if(key == 'global_data'){continue;}
            console.log(img_data[key].id);
            
            // Get the length of the image
            // let dist = Math.sqrt( Math.pow((xo - x),2) + Math.pow((zo - z),2));
            let dist = Math.sqrt( (img_data[key].xo - img_data[key].x)*(img_data[key].xo - img_data[key].x) 
                                + (img_data[key].yo - img_data[key].y)*(img_data[key].yo - img_data[key].y) );

            console.log("dist: ", dist)
            
            // Calculate the rotation of the line
            let b = img_data[key].b
            let m = img_data[key].m
            let bm = -b/m
            // console.log("atan(y/x)= ",  Math.atan((m*(bm+1)+b - 0)/ ((bm+1) - bm))* 180 / Math.PI)
            ntheta =  Math.atan((m*(bm+1)+b - 0)/ ((bm+1) - bm))* 180 / Math.PI
            // if the plane needs yo be flipped 
            if(img_data[key].deltax < 0){
                ntheta = -ntheta;
            }
            console.log("atan+check", ntheta)
            console.log("atan(m)", Math.atan(m)* 180 / Math.PI)
            console.log("atan2(deltay, deltax)", Math.atan2(img_data[key].deltay, img_data[key].deltax)* 180 / Math.PI)
            // console.log("alt atan2", Math.atan2((zo - z), (xo - x))* 180 / Math.PI)
            ntheta = Math.atan2(img_data[key].deltay, img_data[key].deltax)* 180 / Math.PI

            // Place the plane in the XZ plane
            let xdist = img_data[key].xmid + xshift;
            if(getlength(xdist) > 2){
                xdist /= Math.pow(10, (getlength(xdist)-2))
            }
            let ydist = 0;
            let zdist = img_data[key].ymid + zshift; // may need to shift here.. ?
            if(getlength(zdist) > 2){
                zdist /= Math.pow(10, (getlength(zdist)-2))
            }

            // Add the images to the DOC
            // will need to adjust this in the future so that they have the correct tag based on options
            var image_4 = document.createElement("img");
            image_4.id = img_data[key].id + "_im_4"
            image_4.setAttribute("src", location+"/radar_images/" + img_data[key].id + "_adjusted_flipped.png"); 
            document.getElementById("assets").appendChild(image_4); // append the image src to the assets tag
            var image_5 = document.createElement("img");
            image_5.id = img_data[key].id + "_im_5"
            image_5.setAttribute("src", location+"/radar_images/" + img_data[key].id + "_adjusted.png"); 
            document.getElementById("assets").appendChild(image_5); // append the image src to the assets tag
           

            // Add the shape to place the images on
            var plane_l = document.createElement("a-box"); // try as a box

            plane_l.setAttribute("id", "plane"+i);
            
            document.getElementById("placePlanes").appendChild(plane_l); // append node
            
            let pos = (xdist) + " " + (ydist) + " " + (zdist);
            console.log("pos:", pos)
            
            plane_l.setAttribute('position', pos);
            plane_l.setAttribute("rotation", '0 '+ ntheta +' 0');
            // plane_l.setAttribute("rotation", '180 '+ ntheta +' 180');
            plane_l.setAttribute("width", dist);//"36");
            plane_l.setAttribute("height", 25);
            plane_l.setAttribute("depth", 0.1); // for box only
            plane_l.setAttribute("material", "transparent: true; opacity: 1.0"); // transparency/opacity
            plane_l.setAttribute('multisrc', "src4:#" + image_4.id+";src5:#"+image_5.id) 
            plane_l.setAttribute("class","clickable");

                      
            //https://aframe.io/docs/0.9.0/core/component.html#flushtodom
            // https://stackoverflow.com/questions/55023197/a-frame-how-to-save-inspector-changes-made-with-the-3d-widget-to-the-clipboard
            plane_l.flushToDOM();           
            i++;
        }


    } // end generateData
    // return true;
} // end loadPlanes

// https://aframe.io/docs/1.5.0/components/oculus-touch-controls.html
// https://aframe.io/docs/1.5.0/components/tracked-controls.html#events_axismove 

AFRAME.registerComponent('opacity-controls',{
    schema: {
        enabled: {default: true},
        planeWrapperId: {default: 'placePlanes'},
      },

    init: function () {
    //   this.el.addEventListener('axismove', this.logAxisMove);
		this.planeWrapperEl = document.getElementById(this.data.planeWrapperId);
		this.all_planes = this.planeWrapperEl.children
        console.log(this.all_planes)

        this.last_opacity = 1.0 
        this.VELOCITY = 0.01
        this.direction = 0;

        this.el.addEventListener('thumbstickmoved', evt => {
            // console.log(evt)
            this.change = true;
            if (evt.detail.y >  0.90) { this.direction = -1; }//console.log("decrease: ", this.direction) }
            else if (evt.detail.y < -0.90) { this.direction =  1;}// console.log("increase: ", this.direction)}
            else { this.direction = 0 }

        });
        this.el.addEventListener('thumbsticktouchend', evt => {
            // console.log(evt)
            this.change = false;
            this.direction = 0;
        });
        // this.el.addEventListener('thumbstickmoved', this.changeOpacity.bind(this));
    },

    tick: function() {

        if(this.direction < 0 || this.direction > 0){
            // console.log("dir: ", this.direction)
            // if (this.opacity <= 0.0 || this.opacity >= 1.0) { return }
            let op = this.last_opacity + (this.VELOCITY * this.direction)
            if (op < 0.0) { op = 0.0}
            if (op > 1.0) { op = 1.0}
            // console.log("Change opacity to: ", op)
            for (p in this.all_planes){
                let plane = this.all_planes.item(p)
                plane.setAttribute("material", "transparent: true; opacity: " + op)
                plane.flushToDOM(); 
            }
            // console.log("last: ", this.last_opacity, ", cur: ", op)
            this.last_opacity = op
            // console.log("last: ", this.last_opacity, ", cur: ", op)
        }
    }
  });
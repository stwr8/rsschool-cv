function parallaxHover(el, parent, intensity) {

    var self = this,
        elClass = el.replace(/\./g, ''),
        parentClass = parent.replace(/\./g, ''),
        parent = document.getElementsByClassName(parentClass),
        els = document.getElementsByClassName(elClass);

    this.perspective = function(e, el) {

        var elX = el.getBoundingClientRect().left,
            elY = el.getBoundingClientRect().top,
            elWidth = el.offsetWidth,
            elHeight = el.offsetHeight;

        var mouseX = e.clientX,
            mouseY = e.clientY;

        var valY = -((elWidth / 2 - (mouseX - elX)) / (elWidth / 2) * intensity),
            valX = (elHeight / 2 - (mouseY - elY)) / (elHeight / 2) * intensity;

        el.style.webkitTransform = 'rotateX(' + valX.toFixed(1) + 'deg) rotateY(' + valY.toFixed(1) + 'deg)'; // need webkit transform for this to work in safari 8
        el.style.transform = 'rotateX(' + valX.toFixed(1) + 'deg) rotateY(' + valY.toFixed(1) + 'deg)'; // toFixed to round decimal values

    }

    this.anim = function(el, valX, valY, time) {

        animate({
            time: time, // time in seconds
            run: function(rate) {
                el.style.webkitTransform = 'rotateX(' + rate * valX + 'deg) rotateY(' + rate * valY + 'deg)';
                el.style.transform = 'rotateX(' + rate * valX + 'deg) rotateY(' + rate * valY + 'deg)';
            }
        });

        function animate(item) {

            var duration = 1000 * item.time,
                end = +new Date() + duration;

            var step = function() {

                var current = +new Date(),
                    remaining = end - current;

                if (remaining < 60) {
                    item.run(0); // 1 = progress is at 100%
                    return;

                } else {
                    var rate = remaining / duration;
                    item.run(rate);
                }
                window.requestAnimationFrame(step);
            }
            step();
        }
    }

    this.getTransforms = function(el) {

        var st = window.getComputedStyle(el, null),
            matrix = st.getPropertyValue("transform"),
            webkitMatrix = st.getPropertyValue("-webkit-transform"),
            rotateX = 0,
            rotateY = 0,
            rotateZ = 0;

        if (matrix !== 'none') {

            // for safari
            if (!webkitMatrix == '') {
                matrix = webkitMatrix;
            }

            // calculate the values of the rotation
            var values = matrix.split('(')[1].split(')')[0].split(','),
                pi = Math.PI,
                sinB = parseFloat(values[8]),
                b = Math.asin(sinB) * 180 / pi,
                cosB = Math.cos(b * pi / 180),
                matrixVal10 = parseFloat(values[9]),
                a = Math.asin(-matrixVal10 / cosB) * 180 / pi,
                rotateX = a;
            rotateY = b;

            return [rotateX, rotateY];

        }

    }
}

parallaxHover('.parallax-card', '.parallax-perspective', 8);
class SmoothScroll {
  constructor(_containerSelector, _params) {
    
    // Init DOM elements
    this.$ = {
      container: document.querySelector(_containerSelector),
      containerBody: document.querySelector(_containerSelector + '__body'),
      hitbox: document.querySelector(_containerSelector + '--hitbox'),
    }
    
    // Init params
    this.params = {
      containerHeight: this.$.containerBody.offsetHeight,
      duration: _params.duration,
      timingFunction: _params.timingFunction,
    }

    // Launch init functions
    document.addEventListener('DOMContentLoaded', () => { 
      this._initStyle()
      this._initListeners()
    })
  }

  _initStyle() {

    const currentScrollY = window.scrollY

    // Set container style
    this.$.container.style.overflow = `hidden`
    this.$.container.style.position = `fixed`
    this.$.container.style.height = `100vh`
    
    // Set containerBody style
    this.$.containerBody.style.transform = `translateY(${-window.scrollY}px)` // Scroll to current scroll
    
    // Add transtion after scroll to
    const addTransition = () => {
      // Set currentTranslateY
      const regex = /\s?([,])\s?/ 
      const splitTransform = getComputedStyle(this.$.containerBody).transform.split(regex)
      const currentTranslateY = parseInt(splitTransform[splitTransform.length-1])
      
      if(-currentTranslateY != currentScrollY) {
        setTimeout(() => {
          addTransition(currentTranslateY)
        }, 10);
      } else {
        // Add transition
        this.$.containerBody.style.transition = `transform ${this.params.duration}ms ${this.params.timingFunction}`
      }
    }

    // Run addTranstion

    addTransition()

    // Set hitbox style
    this.$.hitbox.style.height = `${this.params.containerHeight}px`

  }



  _initListeners() {
    // console.log('doh! one')
    var smoothest =this;
    // reduce number of triggered mouseweheel scroll events
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    var delay = 10;
    // 


    var handlerFunction = debounce(function (e) {
      smoothest._handleScroll(event);
    }, delay);

    $(document).on('scroll', handlerFunction);

    // window.addEventListener('scroll', (event) => {this._handleScroll(event);})
    window.addEventListener('resize', () => {this._handleResize() })
  }



  _handleScroll(_event) {
    // console.log('doh two')
    var smoothest = this;
    // Setup a timer
    var timeout;

    // Listen for resize events
    window.addEventListener('scroll', function ( event ) {

      // console.log( 'no debounce' );

      // If there's a timer, cancel it
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }

        // Setup the new requestAnimationFrame()
      timeout = window.requestAnimationFrame(function () {

            // Run our scroll functions
        // console.log( 'debounced' );
        smoothest.$.containerBody.style.transform = `translateY(${-window.scrollY}px)`

      });

    }, false);

    // this.$.containerBody.style.transform = `translateY(${-window.scrollY}px)`
  }

  _handleResize() {
    // Update usefull params
    this.params.containerHeight = this.$.containerBody.offsetHeight
    
    // Update useful style
    this.$.hitbox.style.height = `${this.params.containerHeight}px`
  }

}

const params = {
  duration: 1000,
  timingFunction: 'cubic-bezier(0.16, 1.04, 1, 1)'
}


new SmoothScroll('.containersmooth', params)
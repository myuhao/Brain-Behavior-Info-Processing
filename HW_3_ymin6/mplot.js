// Matlab-like graphing capability:
// figure, clf, gca, gcf, gtext, plot, xlabel, ylabel, xlim, ylim, xticks, yticks
// eventClick (calls ax.onclick)
//
// TODO: implement more plot symbols (currently only 'o' is different)

/* global exports */

if (!assert) {
  var assert = function (condition, message) {
    if (!condition) {
      message = message || 'assertion failed';
      throw new Error(message);
    }
  };
}

(function (target) { // target is 'window' (browser) or 'exports' (node.js)

  var cf;  // current figure  id, eg. "fig1"
  var gcf = () => (cf); // get current figure id, eg. "fig1"

  var ca;  // current axis
  var gca = () => (ca); // get current axis

  function eventClick(e) {

    // get position of cursor relative to top left of canvas
    var x;
    var y;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    // loop through offsets, including parent elemtns
    var a = this;
    while(a) {
      x -= a.offsetLeft;
      y -= a.offsetTop;
      a = a.offsetParent;
    }

    // check if click is within axis limits

    let W = this.width;
    let H = this.height;
    let ax = this.axis;
    if (x < ax.xpad.left || x > W - ax.xpad.right ||
      y < ax.ypad.top || y > H - ax.ypad.bottom) {
      //console.log('clicked outside of axis');
      return;
    }

    // transform canvas coords to data coords
    let px = (x - ax.xpad.left) / (W - ax.xpad.left - ax.xpad.right);
    let dataX = ax.xticks.min + px * (ax.xticks.max - ax.xticks.min);

    let py = (H - ax.ypad.bottom - y) / (H - ax.ypad.bottom - ax.ypad.top);
    let dataY = ax.yticks.min + py * (ax.yticks.max - ax.yticks.min);

    // make this the current figure
    figure(this.id);

    //call user-defined callback
    ax.onclick(dataX, dataY);

  }

  function figure(fid, opts) {

    var id; // id of the drawing canvas

    // options: 
    //   handled by this code: opts.width, opts.height, 
    //   passed to Axis object: opts.bgcolor
    opts = opts || {};

    // if fid is a number (1, 2, ...) then id becomes "fig1", "fig2", ...
    // if fid is a string, it is the id of an existing canvas
    // if fid has a leading # (like a css selector), the # is removed
    if (typeof fid === 'number') {
      id = 'fig' + fid;
    } else if (typeof fid === 'string') {
      // strip leading #, if present
      id = (fid[0]==='#') ? fid.slice(1) : fid;
    } else {
      throw new Error('unrecognized figure id')
    }

    // looks for the corresponding canvas id as "fig1", "fig2", ...
    var cnv = document.getElementById(id);

    // if canvas with this id is not found, create one
    if (!cnv) {
      cnv = document.createElement('canvas');
      cnv.id = id;
      cnv.width = opts.width || 400;
      cnv.height = opts.height || 300;
      document.body.appendChild(cnv);
      cnv.axis = new Axis(cnv, opts);
    } else {
      // found existing canvas
      if (opts.width && (opts.width !== cnv.width)) cnv.width = opts.width;
      if (opts.height && (opts.height !== cnv.height)) cnv.height = opts.height;
      //add an axis if it doesn't already exist
      if (!cnv.axis) cnv.axis = new Axis(cnv, opts);
    }
    cnv.addEventListener('click', eventClick, false);
    cf = cnv.id;
    ca = cnv.axis;
  }

  function gfill(colorName) {
    // colorName can be a valid css string
    // or a single letter (r,g,b,c,m,k)
    let styles = {
      r: 'red',
      g: 'green',
      b: 'blue',
      c: 'cyan',
      m: 'magenta',
      i: 'indigo',
      k: 'black'
    };
    let ctx = gca().cnv.getContext('2d');
    if (arguments[0].length === 1) {
      // single letter
      ctx.fillStyle = styles[arguments[0]];
    } else {
      ctx.fillStyle = colorName;
    }
  }

  function gtext(str, x, y, colorName, fontSize) {

    let ctx = ca.cnv.getContext('2d');

    if (colorName) gfill(colorName);

    if (fontSize) {
      ctx.font = fontSize + 'px sans-serif';
    } else {
      ctx.font = '12px sans-serif';
    }

    let gWidth = ca.cnv.width - ca.xpad.left - ca.xpad.right;
    let gHeight = ca.cnv.height - ca.ypad.bottom - ca.ypad.top;

    // tranformations from data coordinates to screen coordinates
    let tx = (x) => ca.xpad.left + (x - ca.xticks.min) / (ca.xticks.max - ca.xticks.min) * gWidth;
    let ty = (y) => ca.cnv.height - ca.ypad.bottom - (y - ca.yticks.min) / (ca.yticks.max - ca.yticks.min) * gHeight;

    ctx.textAlign = 'left';
    ctx.fillText(str, tx(x), ty(y));
  }

  function plot() {
    if (!cf) figure(1);
    let tr = new Trace(...arguments);
    ca.traces.push(tr);
    ca.draw();
  }

  function clf() {
    ca.traces = [];
    ca.draw();
  }

  function xlabel(str) {
    ca.xlabel = str;
    ca.draw();
  }

  function ylabel(str) {
    ca.ylabel = str;
    ca.draw();
  }

  function xlim(xmin, xmax) {
    // allow xlim(0,100) or xlim([0, 100])
    if (!xmax && Array.isArray(xmin)) {
      xmax = xmin[1];
      xmin = xmin[0];
    }
    xticks(xmin, xmax);
  }

  function ylim(ymin, ymax) {
    // allow ylim(0,100) or ylim([0, 100])
    if (!ymax && Array.isArray(ymin)) {
      ymax = ymin[1];
      ymin = ymin[0];
    }
    yticks(ymin, ymax);
  }

  function xticks(xmin, xmax, xstep) {
    if (!xstep) xstep = (xmax - xmin) / 5;
    if (arguments[0] === 'auto') {
      ca.xtickMode = 'auto';
    } else {
      ca.xtickMode = 'manual';
      ca.xticks = {
        min: xmin,
        max: xmax,
        step: xstep
      };
    }
    ca.draw();
  }

  function yticks(ymin, ymax, ystep) {
    if (!ystep) ystep = (ymax - ymin) / 5;
    if (arguments[0] === 'auto') {
      ca.ytickMode = 'auto';
    } else {
      ca.ytickMode = 'manual';
      ca.yticks = {
        min: ymin,
        max: ymax,
        step: ystep
      };
    }
    ca.draw();
  }

  //==================================================================
  // Axis Class
  // 
  // an axis is a graph that can display multiple traces
  //==================================================================

  class Axis {
    constructor(cnv, opts) {

      // options:  
      // passed to Axis object: opts.bgcolor
      opts = opts || {};
      this.bgcolor = opts.bgcolor || 'ghostWhite';

      this.cnv = cnv;
      this.traces = [];
      this.xlabel = 'xlabel';
      this.xpad = {
        left: 40,
        right: 15
      };
      this.xtickMode = 'auto'; // 'auto' (default) or 'manual'
      this.xticks = {
        min: 0,
        max: 1,
        step: 0.2
      };
      this.ylabel = 'ylabel';
      this.ypad = {
        bottom: 40,
        top: 10
      };
      this.ytickMode = 'auto'; // 'auto' (default) or 'manual'
      this.yticks = {
        min: 0,
        max: 1,
        step: 0.2
      };
      this.onclick = function (x, y) {
        console.log(`mouseClick on ${this.cnv.id} at (${x.toFixed(1)}, ${y.toFixed(1)})`);
      };
    }

    calcTicks(vmin, vmax, ntry) {
      // ntry is number of ticks to try
      if (vmin == Infinity) return {
        min: 0,
        max: 1,
        step: 0.25
      };
      if (vmin === vmax) {
        let vfloor = Math.floor(vmin);
        let vceil = Math.ceil(vmin);
        if (vfloor !== vceil) return {
          min: vfloor,
          max: vceil,
          step: 0.25
        };
        else return {
          min: vfloor - 0.5,
          max: vfloor + 0.5,
          step: 0.25
        };
      }
      let tickStep = (vmax - vmin) / (ntry - 1);
      let mag = Math.pow(10, Math.floor(Math.log10(tickStep)));
      let residual = tickStep / mag;
      if (residual > 5) {
        tickStep = 10 * mag;
      } else if (residual > 2) {
        tickStep = 5 * mag;
      } else if (residual > 1) {
        tickStep = 2 * mag;
      } else {
        tickStep = mag;
      }
      let tickMin = tickStep * Math.floor(vmin / tickStep);
      let tickMax = tickStep * Math.ceil(vmax / tickStep);
      return {
        min: tickMin,
        max: tickMax,
        step: tickStep
      };
    }

    draw() {

      let cnv = this.cnv;
      assert(cnv.id, 'Axis.draw, canvas not found' + cnv);
      let ctx = cnv.getContext('2d');

      // useful dimensions
      let W = cnv.width;
      let H = cnv.height;
      let gWidth = W - this.xpad.left - this.xpad.right;
      let gHeight = H - this.ypad.top - this.ypad.bottom;

      // colors
      let styles = {
        r: 'red',
        g: 'green',
        b: 'blue',
        c: 'cyan',
        m: 'magenta',
        k: 'black',
      };

      // draw background
      ctx.fillStyle = this.bgcolor;
      ctx.fillRect(0, 0, W, H);

      // draw guidelines and values
      ctx.fillStyle = 'gray';
      ctx.strokeStyle = 'gray';
      ctx.font = '11px Arial';

      // get axes limits and ticks based on trace info
      let ntraces = this.traces.length;
      if (ntraces > 0) {
        let xrange = {
          min: Infinity,
          max: -Infinity
        };
        let yrange = {
          min: Infinity,
          max: -Infinity
        };
        for (let trace of this.traces) {
          xrange.min = Math.min(xrange.min, trace.xrange.min);
          xrange.max = Math.max(xrange.max, trace.xrange.max);
          yrange.min = Math.min(yrange.min, trace.yrange.min);
          yrange.max = Math.max(yrange.max, trace.yrange.max);
        }
        if (this.xtickMode === 'auto') {
          this.xticks = this.calcTicks(xrange.min, xrange.max, 9);
        }
        if (this.ytickMode === 'auto') {
          this.yticks = this.calcTicks(yrange.min, yrange.max, 9);
        }
      }

      var xmin = this.xticks.min;
      var xmax = this.xticks.max;
      var ymin = this.yticks.min;
      var ymax = this.yticks.max;

      // tranformations from data coordinates to screen coordinates
      let tx = (x) => this.xpad.left + (x - xmin) / (xmax - xmin) * gWidth;
      let ty = (y) => H - this.ypad.bottom - (y - ymin) / (ymax - ymin) * gHeight;

      // float-to-text conversion for axis labels
      let f2t = (x) => '' + Math.round(x * 100) / 100;

      ctx.beginPath();
      ctx.textAlign = 'center';

      // xticks
      let eps = 1e-6;
      var xdat = this.xticks.min;
      do {
        let xpos = tx(xdat);
        ctx.moveTo(xpos, this.ypad.top);
        ctx.lineTo(xpos, this.ypad.top + gHeight);
        ctx.fillText(f2t(xdat), xpos, this.ypad.top + gHeight + 15);
        xdat += this.xticks.step;
      } while (xdat <= this.xticks.max + eps);

      // xlabel
      ctx.fillText(this.xlabel, this.xpad.left + gWidth / 2, H - 10);

      // yticks
      ctx.textAlign = 'end';
      var ydat = this.yticks.min;
      do {
        let ypos = ty(ydat);
        ctx.moveTo(this.xpad.left, ypos);
        ctx.lineTo(W - this.xpad.right, ypos);
        ctx.fillText(f2t(ydat), this.xpad.left - 5, ypos);
        ydat += this.yticks.step;
      } while (ydat <= this.yticks.max + eps);

      // ylabel
      ctx.save();
      ctx.translate(10, H - this.ypad.bottom - gHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(this.ylabel, 0, 0);
      ctx.restore();

      ctx.stroke();

      // draw data
      if (this.traces.length === 0) return;

      // define clipping recgion inside axis boundaries
      ctx.save();
      ctx.rect(this.xpad.left + 1, this.ypad.top + 1, gWidth - 2, gHeight - 2);
      ctx.clip();

      for (let tr of this.traces) {
        ctx.strokeStyle = styles[tr.style[0]];
        ctx.fillStyle = ctx.strokeStyle;
        // check for line style, styles have 2-3 characters, 1st char is a color
        // examples "b-", "b.-", "bo-", etc. (like matlab)
        // NEW: 'b|' draws vertical bar graph (useful for histograms)
        let nchar = tr.style.length;
        let drawBars = tr.style[nchar - 1] === '|' || tr.style[nchar - 2] === '|';
        let drawLine = tr.style[nchar - 1] === '-' || tr.style[nchar - 2] === '-';
        let drawPts = tr.ydat.length === 1 || (tr.style[1] !== '-' && tr.style[1] !== '|');

        //------------------------
        // LINE
        //------------------------
        if (drawLine) {
          ctx.beginPath();
          if (tr.xmode === 'implicit') {
            ctx.moveTo(tx(0), ty(tr.ydat[0]));
            for (let i = 1; i < tr.ydat.length; i++) {
              ctx.lineTo(tx(i), ty(tr.ydat[i]));
            }
          } else {
            // find the start and stop indices that fall between xmin and xmax
            ctx.moveTo(tx(tr.xdat[0]), ty(tr.ydat[0]));
            for (let i = 1; i < tr.ydat.length; i++) {
              ctx.lineTo(tx(tr.xdat[i]), ty(tr.ydat[i]));
            }
          }
          ctx.stroke();
        }
        //------------------------
        // BARS (for histograms)
        //------------------------
        // bars are draw with left edge aligned with lower bin edge
        if (drawBars) {
          let ymin = Math.max(0, this.yticks.min);
          ctx.beginPath();
          if (tr.xmode === 'implicit') {
            let wbar = (tx(1) - tx(0)) - 1; // subtract 1 to leave small gap between bars
            for (let i = 0; i < tr.ydat.length; i++) {
              let y1 = ty(tr.ydat[i]);
              ctx.fillRect(tx(i), y1, wbar, ty(ymin) - y1);
            }
          } else {
            let wbar = (tx(tr.xdat[1]) - tx(tr.xdat[0])) - 1;
            for (let i = 0; i < tr.ydat.length; i++) {
              let y1 = ty(tr.ydat[i]);
              ctx.fillRect(tx(tr.xdat[i]), y1, wbar, ty(ymin) - y1);
            }
          }
          ctx.stroke();
        }

        //------------------------
        // POINTS
        //------------------------
        // TODO: add support for different point styles
        if (drawPts) {
          // define point style
          var drawpt = function (x, y) {   //jshint ignore:line
            ctx.fillRect(x - 1, y - 1, 3, 3);
          };
          if (tr.style[1] === 'o') {
            drawpt = function (x, y) {  //jshint ignore:line
              ctx.beginPath();
              ctx.arc(x, y, 3, 0, 2 * Math.PI);
              ctx.stroke();
            };
          }
          ctx.save(); // save to change line width
          ctx.lineWidth = 1.5;
          for (let i = 0; i < tr.ydat.length; i++) {
            let xval = tr.xmode === 'implicit' ? i : tr.xdat[i];
            let yval = tr.ydat[i];
            drawpt(tx(xval), ty(yval));

          }
          ctx.restore(); // restore to previous line width
        }
      }
      ctx.restore(); // restore to full canvas drawing (from clipped)
    }
  }

  //==================================================================
  // Trace Class
  //
  // a trace is a set of data points and associated style, label, etc
  //==================================================================

  class Trace {
    constructor() {
      this.label = 'none'; // TODO: use this or get rid of it
      this.style = 'b-'; //default plot style
      this.xmode = 'implicit'; // 'implicit' or 'xy' (implicit means no x data)
      this.xdat = [];
      this.xrange = {
        min: null,
        max: null
      }; // [xmin, xmax]
      this.ydat = [];
      this.yrange = {
        min: null,
        max: null
      }; // [ymin, ymax]

      // constructor can optionally add data points
      // new Trace(x,y,[linespec])
      // new Trace(y, [linespec])
      // linespec is an optional string that sets the style
      // e.g. "b-", "g.", "go-"
      let nargs = arguments.length;
      if (nargs === 1) { // new Trace(y)
        this.add(arguments[0]);
      } else if (nargs === 2) {
        if (typeof arguments[1] === 'string') {
          this.add(arguments[0]); // new Trace(y,'b-');
          this.style = arguments[1];
        } else {
          this.add(arguments[0], arguments[1]); // new Trace(x,y)
        }
      } else if (nargs === 3) { // new Trace(x, y, 'b-');
        this.add(arguments[0], arguments[1]);
        this.style = arguments[2];
      }
    }

    add() {
      // add data to the trace
      //  possible usage:
      //   tr.add(ypt) - a single y value (xmode must be implicit)
      //   tr.add(yarray) - array of y values (xmode must be implicit)
      //   tr.add(xpt, ypt)
      //   tr.add(xarray, yarray)
      let args = arguments;
      let nargs = args.length;

      if (nargs === 1) {
        // called with one argument, 
        // either a single y value or an array of y values
        // can't add this if xmode is 'xy'
        assert(this.xmode === 'implicit', 'trace error: wrong mode');
        // if singleton, make it an array
        let ynew = Array.isArray(args[0]) ? args[0] : [args[0]];
        if (!this.yrange.min) this.yrange = {
          min: Infinity,
          max: -Infinity
        };
        for (let i = 0; i < ynew.length; i++) {
          this.ydat.push(ynew[i]);
          this.yrange.min = Math.min(this.yrange.min, ynew[i]);
          this.yrange.max = Math.max(this.yrange.max, ynew[i]);
        }
        // update xrange based on # of y data points (implicit mode)
        if (!this.xrange.min) {
          this.xrange = {
            min: 0,
            max: ynew.length - 1
          };
        } else {
          this.xrange.max += ynew.length;
        }
      } else if (nargs === 2) {
        // called with two arguments, either a single (x, y) point
        // or an array of xvalues and corresponding array of y values
        assert(this.ydat.length === 0 || this.xmode === 'xy',
          'trace.add usage error: cannot add xy data to implicit mode data');
        let xnew = Array.isArray(args[0]) ? args[0] : [args[0]];
        let ynew = Array.isArray(args[1]) ? args[1] : [args[1]];
        assert(xnew.length === ynew.length,
          'trace.add usage error: x and y data length mismatch');
        this.xmode = 'xy';
        if (!this.xrange.min) this.xrange = {
          min: Infinity,
          max: -Infinity
        };
        if (!this.yrange.min) this.yrange = {
          min: Infinity,
          max: -Infinity
        };
        for (let i = 0; i < xnew.length; i++) {
          this.xdat.push(xnew[i]);
          this.xrange.min = Math.min(this.xrange.min, xnew[i]);
          this.xrange.max = Math.max(this.xrange.max, xnew[i]);
          this.ydat.push(ynew[i]);
          this.yrange.min = Math.min(this.yrange.min, ynew[i]);
          this.yrange.max = Math.max(this.yrange.max, ynew[i]);
        }
      } else {
        throw new Error('trace.add: invalid arguments');
      }
    }
  }
  // figure, gca, gcf, gtext, plot, xlabel, ylabel, xlim, ylim, xticks, yticks
  // target is "window" or "exports" 
  target.clf = clf;
  target.eventClick = eventClick;
  target.figure = figure;
  target.gca = gca;
  target.gcf = gcf;
  target.gtext = gtext;
  target.plot = plot;
  target.xlabel = xlabel;
  target.ylabel = ylabel;
  target.xlim = xlim;
  target.ylim = ylim;
  target.xticks = xticks;
  target.yticks = yticks;

})(typeof window !== 'undefined' ? window : exports); // browser or node.js


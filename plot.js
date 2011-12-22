//JS PLOT (yet again)
//
// Library to plot functions in a 2D canvas.
// 
// Usage :
// window.jsPlot(
//    id, // id of the div container (String)
//    settings, // setting of the plot, object containing the setting for the canvas and the plotting space (object)
//    functions // array of functions to draw on the canvas. Functions must be of the form : float -> float
// )
//
// Settings available : 
//   Xmin : minimum x value of the plot (default value : 0)
//   Xmax : maximum x value of the plot (default value : 10)
//   Ymin : minimum y value of the plot (default value : 0)
//   Ymax : maximum y value of the plot (default value : 3)
//   xLabel : x axis label (default value : x) 
//   yLabel : y axis label (default value : y)
//   canvasHeight : canvas height in pixels (default value : 500)
//   canvasWidth : canvas width in pixels (default value : 500)
//
// Example of use :
// jsPlot(
// "plotHere", 
// {
//   Xmin : -5,
//   Xmax : 5,
//   Ymin : -5,
//   Ymax : 5,
//   canvasHeight : 250,
//   canvasWidth : 250
// },
// [function x(x){return x}, 
// function x2(x){return x*x}]);

window.jsPlot =
// w and d are respectively the window and the document; renamed here for ease of use.
  (function(w, d){
    
    var utils = {
// extend is a function taken shamelessly from Zepto.js (https://github.com/madrobby/zepto)
      extend : function(target){
        [].slice.call(arguments, 1).forEach(function(source) {
          for (key in source) target[key] = source[key];
        })
        return target;
      },
// Given a dom id of an existing element, returns a reference to a 2d context of a newly created or the existing one if it has already been created. It also sets the size to the canvas.
      createCanvas : function(id, set){
        var e = d.getElementById(id);
        var canvas = e.getElementsByTagName("canvas")[0];
        if(!canvas){
          canvas = d.createElement("canvas"); 
          e.appendChild(canvas);
        }
        canvas.width=set.canvasWidth;
        canvas.height=set.canvasHeight;
        return canvas.getContext("2d");
      },
      drawAxes : function(c, set){
        c.save()
        c.strokeStyle="#888";
        c.beginPath();
        c.moveTo((set.Xmin * set.xscale),0);
        c.lineTo((set.Xmax * set.xscale),0);  
        c.moveTo(0,(set.Ymin * set.yscale));
        c.lineTo(0,(set.Ymax * set.yscale));
        c.stroke();
       
        c.fillStyle = "black"; 
        c.beginPath();
        c.moveTo((set.Xmax * set.xscale),0);  
        c.lineTo((set.Xmax * set.xscale)-10,6);  
        c.lineTo((set.Xmax * set.xscale)-10,-6);  
        c.lineTo((set.Xmax * set.xscale),0);  
        c.moveTo(0,(set.Ymax * set.yscale));
        c.lineTo(-6,(set.Ymax * set.yscale)-10);
        c.lineTo(6,(set.Ymax * set.yscale)-10);
        c.lineTo(0,(set.Ymax * set.yscale));
        c.fill();

        c.scale(-1, 1);
        c.font = "13px helvetica";
        c.textAlign = "end";
        c.textBaseline = "bottom";

        c.rotate(Math.PI);
        c.save();
        c.translate((set.Xmax * set.xscale) - 13, -2);
        c.fillText(set.xLabel, 0, 0);
        c.restore();
        c.rotate(- Math.PI / 2);
        c.translate((set.Ymax * set.yscale) - 13, -2);
        c.fillText(set.yLabel,0 ,0);
        c.restore();
      },
// Draw the grid on the canvas c given the parameters set 
      drawGrid : function(c, set){
        c.save();
        c.strokeStyle="#CCF";
        c.beginPath();
        for(var a=Math.floor(set.Xmin); a<set.Xmax; a++){
          c.moveTo(a*set.xscale, set.Ymin * set.yscale);
          c.lineTo(a*set.xscale, set.Ymax * set.yscale);
        }
        c.stroke();

        c.beginPath();
        for(var b=Math.floor(set.Ymin); b<set.Ymax; b++){
          c.moveTo(set.Xmin * set.xscale, b*set.yscale);
          c.lineTo(set.Xmax * set.xscale, b*set.yscale);
        }
        c.stroke();
        c.restore();
      },
// Draw a single function on the canvas c given the parameters set
      drawFunction: function(c, set, func){
        var start = set.Xmin * set.xscale;
        var stop = set.Xmax * set.xscale;
        c.moveTo(start, func(start));
        c.beginPath();
        for(var i = start; i<=stop; i++){
          var y = func(i/set.xscale);
          c.lineTo(i, y*set.yscale);
        }
        c.stroke();
      }
    }; 

// Default configuration 
    var defaultConfig = {
      Xmin : 0,
      Xmax : 10,
      Ymin : 0,
      Ymax : 3,
      xLabel : "x",
      yLabel : "y",
      canvasHeight : 500,
      canvasWidth : 500
    };

// plot.js main function
    return function(id, settings, funcZ){
      var set = utils.extend({}, defaultConfig, settings);
      
      var X = set.X = set.Xmax - set.Xmin;
      var Y = set.Y = set.Ymax - set.Ymin;

      var xscale = set.xscale = set.canvasWidth/X;
      var yscale = set.yscale = set.canvasHeight/Y;
      
      var c = utils.createCanvas(id, set);
      //Axes redefinition
      c.scale(1,-1);
      c.translate(0, -set.canvasHeight); //Finish axes changing properly
      c.translate(-(set.Xmin * xscale), -(set.Ymin * yscale) ); //Not 0,0 on bottom left :)  
     
      //Background 
      utils.drawGrid(c, set);
      utils.drawAxes(c, set);

      //Tracé de la fonction
      for(var fi = 0; fi < funcZ.length; fi++){
        utils.drawFunction(c, set, funcZ[fi]);
      } 
    };
   })(window, document);

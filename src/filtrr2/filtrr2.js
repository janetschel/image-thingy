//
// Copyright (C) 2012 Alex Michael
//
// ### Licence

// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
// ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// ### Documentation

// #### F

// The F object is created and returned by the ```Filtrr2```
// constructor. Users can save a reference to this object to
// manually update the state of the image later on.
// It provides a simple API which allows one to save the image,
// provide callbacks to be called when the image is ready and
// update the image with new effects manually, instead of one-off
// in the constructor callback.
var F = function(el, callback, timestamp) {
  var name = el[0].nodeName.toLowerCase(),
    offset = el.position(),
    events = null,
    _ready = false,
    _callback = callback || null;

  // Replaces an image with a canvas element.
  var repl = function(pic) {
    var img = new Image();

    img.src = el.attr("src");
    img.onload = $.proxy(function() {
      var c = $("<canvas>", {
          id: "filtrr2-" + el.attr("id"),
          class: el.attr("class"),
          style: el.attr("style")
        }).css({
          width: el.width(),
          height: el.height(),
          top: offset.top,
          left: offset.left
        }),
        canv = c[0],
        ctx;

      this.canvas = c;

      canv.width = img.width;
      canv.height = img.height;

      canv.getContext("2d").drawImage(img, 0, 0);

      // Replace with canvas.
      el.hide();
      el.parent().append(c);

      // All done - call callback with a new
      // ImageProcessor object as context.
      this.processor = new Filtrr2.ImageProcessor(this);
      if (_callback) {
        _callback.call(this.processor);
      }
      _ready = true;
    }, this);
  };

  // Original element, usually a picture.
  this.el = el;

  // When was this created? Mainly for testing purposes.
  this.created = timestamp;

  // Reference to the image processor.
  this.processor = null;

  // Reference to the canvas element.
  this.canvas = null;

  // Setup proxies for the event methods. The ```on()```
  // method is replaced with a proxy method which sets
  // the context of all events to ```this```.
  events = new Filtrr2.Events();
  this.on = $.proxy(function(ev, callback) {
    events.on(ev, callback, this);
  }, this);
  this.off = events.off;
  this.trigger = events.trigger;

  // Register a callback to be called when ```Filtrr2``` is ready. If
  // it's already ready by the time of this call, the callback
  // will immediately fire. If a callback was passed through
  // the ```Filtrr2``` constructor, then any callback passed through
  // this method will override that.
  this.ready = function(callback) {
    if (!callback) {
      return _ready;
    }
    _callback = callback;
    if (_ready) {
      _callback.call(this.ip);
    }
  };

  // Update ```Filtrr2``` through a callback. The callback
  // is given the ImageProcessor as context. Used to
  // dynamically update the image with new filters.
  // This method will only execute if ```Filtrr2``` is ready,
  // otherwise the callback is ignored.
  this.update = function(callback) {
    if (callback) {
      if (_ready) {
        callback.call(this.processor);
      }
    }
  };

  // 'Forces' a download of the current image. If the
  // canvas is not ready this is a noop.
  this.save = function(type) {
    var data,
      type = type || "png",
      mimetype = "image/" + type;
    if (_ready) {
      data = this.canvas[0].toDataURL(mimetype);
      if (data.indexOf(mimetype) == -1) {
        mimetype = "image/png";
      }
      // Force octet-stream.
      data = data.replace(mimetype, "image/octet-stream");
      window.location.href = data;
    }
  };

  // Resets the internal buffer of the object. This doesn't
  // reset the actual canvas. Therefore, you need to call
  // render() for the reset to take place.
  this.reset = function() {
    if (_ready) return this.processor.reset();
  };

  // If this is an image we need to replace it with
  // a canvas element.
  if (name == "img") {
    repl.call(this, el);

    // If this is a canvas element then create the processor
    // immediately.
  } else if (name == "canvas") {
    this.canvas = el;
    this.processor = new Filtrr2.ImageProcessor(this);
    if (_callback) {
      _callback.call(this.processor);
    }
    _ready = true;

    // Only images and canvas elements are supported.
  } else {
    throw new Error("'" + name + "' is an invalid object.");
  }

  return this;
};

// #### Filtrr2

// The constructor almighty. Performs checks for canvas support
// and gets the element if it's a selector. Also maintains an
// internal cache of F instances keyd on selector. The timestamp
// on the cache entries serves no particular purpose - it's mainly
// for testing.
// The constructor can take an array of options. The only one supported
// so far is 'store' which if false, will not cache this
export var Filtrr2 = (function() {
  var store = {};

  // Check for canvas compatibility.
  if ($("<canvas/>")[0].getContext("2d") == null) {
    throw new Error("Canvas is not supported in this browser.");
  }

  return function(_el, callback, options) {
    var t, el, isSelector, timestamp, key, inst;

    if (options == null) options = { store: true };

    if (typeof _el === "undefined" || _el === null) {
      throw new Error("The element you gave Filtrr2 was not defined.");
    }

    t = typeof _el;
    el = _el;

    // Is this a string i.e a jQuery selector?
    isSelector =
      t === "string" ||
      (t === "object" && _el.constructor.toString().indexOf("String") > -1);

    if (isSelector) {
      key = _el;
    } else {
      key = _el.selector;
    }

    // If cached return cached F instance.
    if (store[key]) {
      return store[key].F;
    } else {
      if (isSelector) {
        el = $(_el);
      }

      // Bad selector!
      if (el.length === 0) {
        throw new Error("Element not found.");
      }

      timestamp = new Date().getTime();
      inst = new F(el, callback, timestamp);
      if (options.store) {
        store[key] = {
          timestamp: timestamp,
          F: inst
        };
      }
      return inst;
    }
  };
})();

Filtrr2.Events = function() {
  var registry = {};

  this.on = function(ev, callback, ctx) {
    if (!registry[ev]) {
      registry[ev] = [];
    }
    if (ctx === undefined) {
      ctx = null;
    }
    registry[ev].push({
      cback: callback,
      ctx: ctx
    });
  };

  this.off = function(ev, callback) {
    var i = 0,
      cbacks = [],
      cb = null,
      offs = [];
    if (registry[ev] && registry[ev].length > 0) {
      if (!callback) {
        registry[ev] = [];
      } else {
        cbacks = registry[ev];
        for (i = 0; i < cbacks.length; i++) {
          if (cbacks.hasOwnProperty(i)) {
            cb = cbacks[i];
            if (cb.cback === callback) {
              delete cbacks[i];
            }
          }
        }
      }
    }
  };

  this.trigger = function(ev) {
    var cbacks = registry[ev],
      i = null,
      cb = null,
      args = [].slice.apply(arguments);
    for (i in cbacks) {
      if (cbacks.hasOwnProperty(i)) {
        cb = cbacks[i];
        if (cb) {
          cb.cback.apply(cb.ctx, args.slice(1));
        }
      }
    }
  };
};

Filtrr2.FxStore = (function() {
  var effects = {},
    exports = {},
    count = 0;

  exports.add = function(name, def) {
    effects[name] = def;
    count++;
  };

  exports.count = function() {
    return count;
  };

  exports.get = function(name) {
    return effects[name];
  };

  exports.getNames = function() {
    var names = [],
      n = null;
    for (n in effects) {
      if (effects.hasOwnProperty(n)) {
        names.push(n);
      }
    }
    return names;
  };

  return exports;
})();

// #### Filtrr2.fx

// Registers an effect. Registering an effect consists of a name
// and a function which will execute the effect. All registered
// effects will be available on any ImageProcessor instance.
// This method is merely a nice wrapper around the ```Filtrr2.FxStore.add```
// method.
Filtrr2.fx = function(name, def) {
  Filtrr2.FxStore.add(name, def);
};

// #### Filtrr2.ImageProcessor

// The *meat* of the framework. This is the context of the callback function
// which you pass into the ```Filttr2``` constructor i.e
//
//     Filtrr2('#img', function() {
//         // 'this' will be an ImageProcessor instance.
//     });
//
// It is also the context of the update function and it always
// contains all preset and user-defined effects *up to the point
// of it's creation*.
Filtrr2.ImageProcessor = function(F) {
  var $canvas = F.canvas,
    canvas = $canvas[0];

  var w = canvas.width,
    h = canvas.height,
    ctx = canvas.getContext("2d");

  // Returns a copy of the ImageData object passed
  // as a parameter.
  var copyImageData = function(imageData) {
    var copy = ctx.createImageData(imageData),
      // Store some references for quicker processing.
      cData = copy.data,
      imData = imageData.data,
      len = imData.length,
      i = 0;
    // Copy over all pixel values to the copy buffer.
    for (i = 0; i < len; i++) {
      cData[i] = imData[i];
    }
    return copy;
  };

  var clamp = Filtrr2.Util.clamp,
    // Canvas image data buffer - all manipulations are applied
    // here. Rendering the ImageProcessor object will save the buffer
    // back to the canvas.
    buffer = ctx.getImageData(0, 0, w, h),
    // Save a clean copy of the buffer to enable resetting.
    originalBuffer = copyImageData(buffer),
    //
    _F = F,
    layers = new Filtrr2.Layers();

  // Copy over all registered effects and create
  // proxy functions.
  var names = Filtrr2.FxStore.getNames(),
    len = names.length,
    i = 0,
    n = null,
    that = this;

  for (i = 0; i < len; i++) {
    n = names[i];
    this[n] = (function(_n, _f) {
      return $.proxy(function() {
        var fx = Filtrr2.FxStore.get(_n);
        _f.trigger(_n + ":preprocess");
        fx.apply(this, arguments);
        _f.trigger(_n + ":postprocess");
        return this;
      }, that);
    })(n, _F);
  }

  // Returns a new ImageProcessor instance. It's important to note
  // that the new instance's buffer will be a different copy than
  // this instance's buffer since getImageData() always returns a
  // copy. But, any duplicate of this instance will share a reference
  // to the canvas object, hence rendering a duplicate will alter
  // the canvas element and potentially override any previous rendering
  // by this instance (if called after a render() was already called on
  // this instance).
  this.dup = function() {
    return new Filtrr2.ImageProcessor(_F);
  };

  this.buffer = function() {
    return buffer;
  };

  this.dims = function() {
    return { w: w, h: h };
  };

  // Resets the buffer to the original buffer by creating
  // a copy of it.
  this.reset = function() {
    buffer = copyImageData(originalBuffer);
    return this;
  };

  // Put another layer on top of this ImageProcessor. The other
  // layer needs to be another ImageProcessor object, usually
  // created by using the ```dup()``` method.
  this.layer = function(type, top) {
    layers.merge(type, this, top);
    return this;
  };

  // Puts the modified context data buffer back
  // into the context which causes the image
  // to be redrawn. This extra step exists for
  // performance reasons because we don't want to
  // be writing the data buffer on every effect
  // application in the case of chained effects.
  // The render method takes a callback which is
  // called after it is finished.
  this.render = function(callback) {
    _F.trigger("prerender");
    ctx.putImageData(buffer, 0, 0);
    _F.trigger("postrender");
    if (callback) {
      callback.call(this);
    }
    _F.trigger("finalize");
  };

  // Performs a pixel-by-pixel manipulation on the
  // data buffer pixels. This means that ```procfn``` is
  // called *on every pixel* in the data buffer and its
  // result is used to replace the existing valus in the
  // buffer in-place.
  // The values returned from ```procfn``` are clamped
  // so that they are in the range [0,255].
  this.process = function(procfn) {
    var data = buffer.data;
    var i = 0,
      j = 0;
    for (i = 0; i < h; i++) {
      for (j = 0; j < w; j++) {
        var index = i * w * 4 + j * 4;

        // Pass an rgba objects to the processing function.
        var rgba = {
          r: data[index],
          g: data[index + 1],
          b: data[index + 2],
          a: data[index + 3]
        };

        // Process the tuple.
        procfn(rgba, j, i);

        // Put back the data.
        data[index] = parseInt(clamp(rgba.r));
        data[index + 1] = parseInt(clamp(rgba.g));
        data[index + 2] = parseInt(clamp(rgba.b));
        data[index + 3] = parseInt(clamp(rgba.a));
      }
    }
    return this;
  };

  // Performs a kerner convolution manipulation on the data
  // buffer. This is mostly used in masks i.e blurring or
  // sharpening. It is a *very* intensive operation and will
  // be slow on big images!
  // It creates a temporary data buffer where it writes the
  // new data. We can't modify the original buffer in-place
  // because each new pixel value depends on the original
  // neighbouring values of that pixel (i.e the values residing)
  // inside the kernel.
  this.convolve = function(kernel) {
    if (!ctx.createImageData) {
      throw "createImageData is not supported.";
    }

    var temp = ctx.createImageData(buffer.width, buffer.height),
      tempd = temp.data,
      bufferData = buffer.data,
      kh = parseInt(kernel.length / 2),
      kw = parseInt(kernel[0].length / 2),
      i = 0,
      j = 0,
      n = 0,
      m = 0;

    for (i = 0; i < h; i++) {
      for (j = 0; j < w; j++) {
        var outIndex = i * w * 4 + j * 4;
        var r = 0,
          g = 0,
          b = 0;
        for (n = -kh; n <= kh; n++) {
          for (m = -kw; m <= kw; m++) {
            if (i + n >= 0 && i + n < h) {
              if (j + m >= 0 && j + m < w) {
                var f = kernel[n + kh][m + kw];
                if (f === 0) {
                  continue;
                }
                var inIndex = (i + n) * w * 4 + (j + m) * 4;
                r += bufferData[inIndex] * f;
                g += bufferData[inIndex + 1] * f;
                b += bufferData[inIndex + 2] * f;
              }
            }
          }
        }
        tempd[outIndex] = clamp(r);
        tempd[outIndex + 1] = clamp(g);
        tempd[outIndex + 2] = clamp(b);
        tempd[outIndex + 3] = 255;
      }
    }
    buffer = temp;
    return this;
  };
};

// #### Pre-defined effects

// ```Filtrr2``` comes with 15 pre-defined effects. Reading the code
// below is a good tutorial on how to create your own effects.

// #### Adjust [No Range]
Filtrr2.fx("adjust", function(pr, pg, pb) {
  this.process(function(rgba) {
    rgba.r *= 1 + pr;
    rgba.g *= 1 + pg;
    rgba.b *= 1 + pb;
  });
});

// #### Temperature [-255, 255]
Filtrr2.fx("temperature", function(p) {
  this.process(function(rgba) {
    rgba.r = rgba.r + p > 255 ? 255 : rgba.r + p;
    rgba.b = rgba.b - p < 0 ? 0 : rgba.b - p;
  });
});

// #### Brighten [-100, 100]
Filtrr2.fx("brighten", function(p) {
  p = Filtrr2.Util.normalize(p, -255, 255, -100, 100);
  this.process(function(rgba) {
    rgba.r += p;
    rgba.g += p;
    rgba.b += p;
  });
});

// #### Alpha [-100, 100]
Filtrr2.fx("alpha", function(p) {
  p = Filtrr2.Util.normalize(p, 0, 255, -100, 100);
  this.process(function(rgba) {
    rgba.a = p;
  });
});

// #### Saturate [-100, 100]
Filtrr2.fx("saturate", function(p) {
  p = Filtrr2.Util.normalize(p, 0, 2, -100, 100);
  this.process(function(rgba) {
    var avg = (rgba.r + rgba.g + rgba.b) / 3;
    rgba.r = avg + p * (rgba.r - avg);
    rgba.g = avg + p * (rgba.g - avg);
    rgba.b = avg + p * (rgba.b - avg);
  });
});

// #### Invert
Filtrr2.fx("invert", function() {
  this.process(function(rgba) {
    rgba.r = 255 - rgba.r;
    rgba.g = 255 - rgba.g;
    rgba.b = 255 - rgba.b;
  });
});

// #### Posterize [1, 255]
Filtrr2.fx("posterize", function(p) {
  p = Filtrr2.Util.clamp(p, 1, 255);
  var step = Math.floor(255 / p);
  this.process(function(rgba) {
    rgba.r = Math.floor(rgba.r / step) * step;
    rgba.g = Math.floor(rgba.g / step) * step;
    rgba.b = Math.floor(rgba.b / step) * step;
  });
});

// #### Gamma [-100, 100]
Filtrr2.fx("gamma", function(p) {
  p = Filtrr2.Util.normalize(p, 0, 2, -100, 100);
  this.process(function(rgba) {
    rgba.r = Math.pow(rgba.r, p);
    rgba.g = Math.pow(rgba.g, p);
    rgba.b = Math.pow(rgba.b, p);
  });
});

// #### Constrast [-100, 100]
Filtrr2.fx("contrast", function(p) {
  p = Filtrr2.Util.normalize(p, 0, 2, -100, 100);
  function c(f, c) {
    return (f - 0.5) * c + 0.5;
  }
  this.process(function(rgba) {
    rgba.r = 255 * c(rgba.r / 255, p);
    rgba.g = 255 * c(rgba.g / 255, p);
    rgba.b = 255 * c(rgba.b / 255, p);
  });
});

// #### Sepia
Filtrr2.fx("sepia", function() {
  this.process(function(rgba) {
    var r = rgba.r,
      g = rgba.g,
      b = rgba.b;
    rgba.r = r * 0.393 + g * 0.769 + b * 0.189;
    rgba.g = r * 0.349 + g * 0.686 + b * 0.168;
    rgba.b = r * 0.272 + g * 0.534 + b * 0.131;
  });
});

// #### Subtract [No Range]
Filtrr2.fx("subtract", function(r, g, b) {
  this.process(function(rgba) {
    rgba.r -= r;
    rgba.g -= g;
    rgba.b -= b;
  });
});

// #### Fill [No Range]
Filtrr2.fx("fill", function(r, g, b) {
  this.process(function(rgba) {
    rgba.r = r;
    rgba.g = g;
    rgba.b = b;
  });
});

// #### Blur ['simple', 'gaussian']
Filtrr2.fx("blur", function(t) {
  t = t || "simple";
  if (t == "simple") {
    this.convolve([
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9]
    ]);
  } else if (t == "gaussian") {
    this.convolve([
      [1 / 273, 4 / 273, 7 / 273, 4 / 273, 1 / 273],
      [4 / 273, 16 / 273, 26 / 273, 16 / 273, 4 / 273],
      [7 / 273, 26 / 273, 41 / 273, 26 / 273, 7 / 273],
      [4 / 273, 16 / 273, 26 / 273, 16 / 273, 4 / 273],
      [1 / 273, 4 / 273, 7 / 273, 4 / 273, 1 / 273]
    ]);
  }
});

// #### Sharpen
Filtrr2.fx("sharpen", function() {
  this.convolve([
    [0.0, -0.2, 0.0],
    [-0.2, 1.8, -0.2],
    [0.0, -0.2, 0.0]
  ]);
});

// #### Curves
Filtrr2.fx("curves", function(s, c1, c2, e) {
  var bezier = new Filtrr2.Util.Bezier(s, c1, c2, e),
    points = bezier.genColorTable();
  this.process(function(rgba) {
    rgba.r = points[rgba.r];
    rgba.g = points[rgba.g];
    rgba.b = points[rgba.b];
  });
});

// #### Expose [-100, 100]
Filtrr2.fx("expose", function(p) {
  var p = Filtrr2.Util.normalize(p, -1, 1, -100, 100),
    c1 = { x: 0, y: 255 * p },
    c2 = { x: 255 - 255 * p, y: 255 };
  this.curves({ x: 0, y: 0 }, c1, c2, { x: 255, y: 255 });
});

Filtrr2.Layers = function() {
  var clamp = Filtrr2.Util.clamp;

  var apply = function(bottom, top, fn) {
    var bottomData = bottom.buffer().data,
      topData = top.buffer().data,
      i = 0,
      j = 0,
      h = Math.min(bottom.dims().h, top.dims().h),
      w = Math.min(bottom.dims().w, top.dims().w),
      index,
      brgba,
      trgba;

    for (i = 0; i < h; i++) {
      for (j = 0; j < w; j++) {
        index = i * w * 4 + j * 4;

        // Create bottom/top rgbas.
        brgba = {
          r: bottomData[index],
          g: bottomData[index + 1],
          b: bottomData[index + 2],
          a: bottomData[index + 3]
        };
        trgba = {
          r: topData[index],
          g: topData[index + 1],
          b: topData[index + 2],
          a: topData[index + 3]
        };

        // Execute blend.
        fn(brgba, trgba);

        // Re-assign data.
        bottomData[index] = clamp(brgba.r);
        bottomData[index + 1] = clamp(brgba.g);
        bottomData[index + 2] = clamp(brgba.b);
        bottomData[index + 3] = clamp(brgba.a);
      }
    }
  };

  var layers = {
    multiply: function(bottom, top) {
      apply(bottom, top, function(b, t) {
        b.r = (t.r * b.r) / 255;
        b.g = (t.g * b.g) / 255;
        b.b = (t.b * b.b) / 255;
      });
    },

    screen: function(bottom, top) {
      apply(bottom, top, function(b, t) {
        b.r = 255 - ((255 - t.r) * (255 - b.r)) / 255;
        b.g = 255 - ((255 - t.g) * (255 - b.g)) / 255;
        b.b = 255 - ((255 - t.b) * (255 - b.b)) / 255;
      });
    },

    overlay: function(bottom, top) {
      var c = function(b, t) {
        return b > 128
          ? 255 - (2 * (255 - t) * (255 - b)) / 255
          : (b * t * 2) / 255;
      };

      apply(bottom, top, function(b, t) {
        b.r = c(b.r, t.r);
        b.g = c(b.g, t.g);
        b.b = c(b.b, t.b);
      });
    },

    // Thanks to @olivierlesnicki for suggesting a better algoritm.
    softLight: function(bottom, top) {
      var c = function(b, t) {
        b /= 255;
        t /= 255;
        return t < 0.5
          ? 255 * ((1 - 2 * t) * b * b + 2 * t * b)
          : 255 * ((1 - (2 * t - 1)) * b + (2 * t - 1) * Math.pow(b, 0.5));
      };
      apply(bottom, top, function(b, t) {
        b.r = c(b.r, t.r);
        b.g = c(b.g, t.g);
        b.b = c(b.b, t.b);
      });
    },

    addition: function(bottom, top) {
      apply(bottom, top, function(b, t) {
        b.r += t.r;
        b.g += t.g;
        b.b += t.b;
      });
    },

    exclusion: function(bottom, top) {
      apply(bottom, top, function(b, t) {
        b.r = 128 - (2 * (b.r - 128) * (t.r - 128)) / 255;
        b.g = 128 - (2 * (b.g - 128) * (t.g - 128)) / 255;
        b.b = 128 - (2 * (b.b - 128) * (t.b - 128)) / 255;
      });
    },

    difference: function(bottom, top) {
      var abs = Math.abs;
      apply(bottom, top, function(b, t) {
        b.r = abs(t.r - b.r);
        b.g = abs(t.g - b.g);
        b.b = abs(t.b - b.b);
      });
    }
  };

  // Merges two layers. Takes a ```type``` parameter and
  // a bottom and top layer. The ```type``` parameter specifies
  // the blending mode.
  this.merge = function(type, bottom, top) {
    if (layers[type] != null) {
      layers[type](bottom, top);
    } else {
      throw Error("Unknown layer blend type '" + type + "'.");
    }
  };
};

Filtrr2.Util = (function() {
  var exports = {},
    clamp = function(val, min, max) {
      min = min || 0;
      max = max || 255;
      return Math.min(max, Math.max(min, val));
    },
    dist = function(x1, x2) {
      return Math.sqrt(Math.pow(x2 - x1, 2));
    },
    normalize = function(val, dmin, dmax, smin, smax) {
      var sdist = dist(smin, smax),
        ddist = dist(dmin, dmax),
        ratio = ddist / sdist,
        val = clamp(val, smin, smax);
      return dmin + (val - smin) * ratio;
    },
    // **Adapted from (with special thanks)** <br>
    // 13thParallel.org Beziér Curve Code <br>
    // *by Dan Pupius (www.pupius.net)*
    Bezier = function(C1, C2, C3, C4) {
      var C1 = C1,
        C2 = C2,
        C3 = C3,
        C4 = C4;
      var B1 = function(t) {
        return t * t * t;
      };
      var B2 = function(t) {
        return 3 * t * t * (1 - t);
      };
      var B3 = function(t) {
        return 3 * t * (1 - t) * (1 - t);
      };
      var B4 = function(t) {
        return (1 - t) * (1 - t) * (1 - t);
      };

      var getPoint = function(t) {
        return {
          x: C1.x * B1(t) + C2.x * B2(t) + C3.x * B3(t) + C4.x * B4(t),
          y: C1.y * B1(t) + C2.y * B2(t) + C3.y * B3(t) + C4.y * B4(t)
        };
      };

      // Creates a color table for 1024 points. To create the table
      // 1024 bezier points are calculated with t = i/1024 in every
      // loop iteration and map is created for [x] = y. This is then
      // used to project a color RGB value (x) to another color RGB
      // value (y).
      this.genColorTable = function() {
        var points = {};
        var i;
        for (i = 0; i < 1024; i++) {
          var point = getPoint(i / 1024);
          points[parseInt(point.x)] = parseInt(point.y);
        }
        return points;
      };
    };

  exports.clamp = clamp;
  exports.dist = dist;
  exports.normalize = normalize;
  exports.Bezier = Bezier;

  return exports;
})();

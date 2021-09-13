import "../css/main.scss";
import { fitImageToCanvas } from "./imageTools";

// grab DOM elements inside index.html

var fileSelector = document.getElementById("fileSelector");
var imageContainer = document.getElementById("imageContainer");
var debugContainer = document.getElementById("debugContainer");

var MAX_WIDTH = 15;
var MAX_HEIGHT = 10;
var UNIT = "in";

function log(msg) {
  // show debug/state message on screen
  debugContainer.innerHTML += "<p>" + msg + "</p>";
}

fileSelector.onchange = function (e) {
  // get all selected Files
  var files = e.target.files;
  var file;
  for (var i = 0; i < files.length; ++i) {
    file = files[i];
    // check if file is valid Image (just a MIME check)
    switch (file.type) {
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        // read Image contents from file
        var reader = new FileReader();
        reader.onload = function () {
          // create HTMLImageElement holding image data
          var img = new Image();
          img.src = reader.result;
          img.id = "draggable";
          img.style.position = "relative";

          // remove existing images from ImageContainer
          while (imageContainer.childNodes.length > 0)
            imageContainer.removeChild(imageContainer.childNodes[0]);

          // add image to container
          imageContainer.appendChild(img);

          img.onload = function () {
            let result = fitImageToCanvas(
              img,
              MAX_WIDTH,
              MAX_HEIGHT,
              imageContainer,
              UNIT
            );
            if (result.width != result.photo.width) {
              alert(
                "Uploaded image is resized to fit to the canvas. you can resize or change its position on your own too."
              );
            }
            log(
              "Loaded Image w/dimensions " +
                result.width +
                " x " +
                result.height
            );
          };

          // do your magic here...
        };
        reader.readAsDataURL(file);
        // process just one file.
        return;
      default:
        log("not a valid Image file :" + file.name);
    }
  }
};

log("Test application ready");

(function () {
  imageContainer.style.width = MAX_WIDTH + UNIT;
  imageContainer.style.height = MAX_HEIGHT + UNIT;
  debugContainer.style.width = MAX_WIDTH + UNIT;
  debugContainer.style.height = MAX_HEIGHT + UNIT;
})();

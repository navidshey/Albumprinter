const imageData = {
  width: null,
  height: null,
  photo: {
    id: null,
    src: null,
    width: null,
    height: null,
    unit: null,
    x: 0,
    y: 0,
  },
};

var changeSize = 20;

export function fitImageToCanvas(
  img,
  boxWidth,
  boxHeight,
  parentElement,
  unit,
  unitSize
) {
  var result;
  unit = unit ?? "px";
  changeSize = unitSize ?? unit == "px" ? 20 : 1;
  const imgWidth = img.width;
  const imgHeight = img.height;
  const isHorizontal = img.width > img.height;

  //Fit image to canvas size
  if (isHorizontal) {
    result = fitHorizontal(imgWidth, imgHeight, boxWidth);
    if (result.height < boxHeight) {
      result = fitVertical(result.width, result.height, boxHeight);
    }
  } else {
    result = fitVertical(imgWidth, imgHeight, boxHeight);
    if (result.width < boxWidth) {
      result = fitHorizontal(result.width, result.height, boxWidth);
    }
  }

  //Save image data
  imageData.width = img.naturalWidth;
  imageData.height = img.naturalHeight;
  imageData.photo = {
    id: img.id,
    src: img.src,
    width: result.width + unit,
    height: result.height + unit,
    unit: unit ?? unit,
    x: 0,
    y: 0,
  };

  applyChanges(result.width + unit);
  createControllBar(parentElement);

  return imageData;
}

function fitVertical(imgWidth, imgHeight, boxHeight) {
  let ratio = boxHeight / imgHeight;
  return { width: imgWidth * ratio, height: boxHeight };
}

function fitHorizontal(imgWidth, imgHeight, boxWidth) {
  let ratio = boxWidth / imgWidth;
  return { width: boxWidth, height: imgHeight * ratio };
}

function moveHorizontal(size, element) {
  element = element || document.getElementById(imageData.photo.id);
  if (!validateElement(element)) {
    return;
  }
  element.style.left = calulateNewValue(element.style.left, size);
  saveImageData(element.style.left);
}

function moveVertical(size, element) {
  element = element || document.getElementById(imageData.photo.id);
  if (!validateElement(element)) {
    return;
  }
  element.style.top = calulateNewValue(element.style.top, size);
  saveImageData(null, element.style.top);
}

function extendWidth(size, element) {
  element = element || document.getElementById(imageData.photo.id);
  if (!validateElement(element)) {
    return;
  }
  element.style.width = calulateNewValue(
    element.style.width.length > 0
      ? element.style.width
      : element.width + imageData.photo.unit,
    size
  );
  element.style.height = "auto";
  saveImageData(null, null, element.style.width);
}

function calulateNewValue(value, newNumber) {
  if (!value || value == "") return newNumber + imageData.photo.unit;
  return (
    +value.split(imageData.photo.unit)[0] + newNumber + imageData.photo.unit
  );
}

function saveImageData(left, top, width, height) {
  if (width) {
    imageData.photo.width = width;
  }
  if (height) {
    imageData.photo.height = height;
  }
  if (left) {
    imageData.photo.x = left;
  }
  if (top) {
    imageData.photo.y = top;
  }
}

function applyChanges(width, element) {
  element = element || document.getElementById(imageData.photo.id);
  element.style.width = width;
  element.style.height = "auto";
}

function validateElement(element) {
  if (!element) {
    alert("No image is loaded!");
    return false;
  }
  return true;
}

function createControllBar(parentElement) {
  let parrentNode = parentElement.parentNode;

  let controllBar = document.createElement("div");
  controllBar.id = "controllBar";

  controllBar.appendChild(
    generateButton(`${changeSize} ${imageData.photo.unit} Left`, "moveLeft", () => moveHorizontal(-changeSize))
  );
  controllBar.appendChild(
    generateButton(`${changeSize} ${imageData.photo.unit} Right`, "moveRight", () => moveHorizontal(changeSize))
  );
  controllBar.appendChild(
    generateButton(`${changeSize} ${imageData.photo.unit} Up`, "moveUp", () => moveVertical(-changeSize))
  );
  controllBar.appendChild(
    generateButton(`${changeSize} ${imageData.photo.unit} Down`, "moveDown", () => moveVertical(changeSize))
  );
  controllBar.appendChild(
    generateButton(`${changeSize} ${imageData.photo.unit} Larger`, "larger", () => extendWidth(changeSize))
  );
  controllBar.appendChild(
    generateButton(`${changeSize} ${imageData.photo.unit} Smaller`, "smaller", () => extendWidth(-changeSize))
  );
  parrentNode.appendChild(controllBar);

  parrentNode.appendChild(
    generateButton("Submit", "SubmitButton", function submitImageDate() {
      var debugContainer = document.getElementById("debugContainer");
      debugContainer.innerHTML = imageData
        ? JSON.stringify(imageData, null, 2)
        : "NO image is loaded!";
    })
  );
  parrentNode.appendChild(
    generateButton("Generate", "generateButton", function importStyledPhoto() {
      var debugContainer = document.getElementById("debugContainer");
      if (!imageData.width) return;
      var img = new Image();
      img.src = imageData.photo.src;
      img.id = "loaded-image";
      img.style.position = "relative";
      img.style.width = imageData.photo.width;
      img.style.height = "auto";
      img.style.top = imageData.photo.y;
      img.style.left = imageData.photo.x;

      // remove existing images from ImageContainer
      while (debugContainer.childNodes.length > 0)
        debugContainer.removeChild(debugContainer.childNodes[0]);

      // add image to container
      debugContainer.appendChild(img);
    })
  );
}

function generateButton(name, id, onclick) {
  let btn = document.createElement("button");
  btn.innerHTML = name;
  btn.name = name;
  btn.id = id;
  btn.onclick = onclick;
  return btn;
}

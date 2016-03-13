---
---
"use strict";

function sleep (duration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + duration) { /* Do nothing. */ } 
}

window.onload = function () {

  // Loop through the gallery containers.
  var galleryContainerNodeList = document.querySelectorAll('.gallery-container'); // TODO: Replace with something that is more widely supported.
  var galleryContainerElements = Array.prototype.slice.call(galleryContainerNodeList); // Get a true Array.
  galleryContainerElements.forEach(function(containerElement) {

    // Loop through the contained images (i.e. the thumbnails).
    // NB: The class must be `thumbnail`.
    var galleryThumbnailNodeList = containerElement.querySelectorAll('img.thumbnail'); // TODO: Replace with something that is more widely supported.
    var galleryThumbnailImageElements = Array.prototype.slice.call(galleryThumbnailNodeList); // Get a true Array.
    galleryThumbnailImageElements.forEach(function(thumbnailElement) {

      // Install the onclick action.
      thumbnailElement.onclick = function () {

        // Create the 'image view' element.
        var imageViewElement = document.createElement("img"); // Create a new image element.
        imageViewElement.src = thumbnailElement.getAttribute('data-src'); // Set its source to be the value of the `data-src` attribute.

        // Produce an overlay.
        var overlay = document.createElement("div");
        overlay.style.cssText = "width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 1; opacity: 0.6; background-color: #000;"
        overlay.hidden = true;
        overlay.onclick = function () {
          imageViewElement.parentNode.removeChild(imageViewElement);
          overlay.hidden = true;
        }
        document.body.insertBefore(overlay, document.body.firstChild);

        // Reuse the overlay's onclick on the image view.
        imageViewElement.onclick = overlay.onclick;

        // Continue once the image has loaded...
        imageViewElement.onload = function () {

          // Calculate the image view's position.
          var thumbnailHeight = thumbnailElement.getBoundingClientRect().bottom - thumbnailElement.getBoundingClientRect().top;
          var thumbnailVerticalOffset = thumbnailElement.getBoundingClientRect().top - containerElement.getBoundingClientRect().top;
          var imageHeight = imageViewElement.naturalHeight;
          var imageVerticalOffset = thumbnailVerticalOffset - (imageHeight - thumbnailHeight) / 2;

          // Sanitize it.
          var containerHeight = containerElement.getBoundingClientRect().bottom - containerElement.getBoundingClientRect().top;
          if (imageVerticalOffset + imageHeight > containerHeight) imageVerticalOffset = containerHeight - imageHeight;
          if (imageVerticalOffset < 0) imageVerticalOffset = 0;
          
          // Insert the image view into the DOM and position it.
          containerElement.insertBefore(imageViewElement, containerElement.firstChild); // Insert it as the first child of the container.
          imageViewElement.style.zIndex = 2;
          imageViewElement.style.position = "absolute";
          containerElement.style.position = "relative";
          imageViewElement.style.top = imageVerticalOffset + "px";

          // Activate the overlay.
          overlay.hidden = false;
        }

      }
    });

  });

};
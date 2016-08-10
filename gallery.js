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
  galleryContainerElements.forEach(function(container) {

    // Configure the container.
    container.style.position = "relative"; // In order to use absolute positioning.

    // Loop through the contained images (i.e. the thumbnails).
    // NB: The class must be `thumbnail`.
    var galleryThumbnailNodeList = container.querySelectorAll('img.thumbnail'); // TODO: Replace with something that is more widely supported.
    var galleryThumbnailImageElements = Array.prototype.slice.call(galleryThumbnailNodeList); // Get a true Array.
    galleryThumbnailImageElements.forEach(function(thumbnail) {

      // Install the onclick action.
      thumbnail.onclick = function () {

        var thumbnailRect = thumbnail.getBoundingClientRect();
        var thumbnailWidth = thumbnailRect.right - thumbnailRect.left;
        var thumbnailHeight = thumbnailRect.bottom - thumbnailRect.top;
        var thumbnailTop = thumbnailRect.top - container.getBoundingClientRect().top;
        var thumbnailLeft = thumbnailRect.left - container.getBoundingClientRect().left;

        var dismissingFunction = function () {

          // Make the image unclickable.
          image.style.pointerEvents = "none";

          // Animate the opacity (removing the temporary elements on completion).
          TweenLite.to(overlay,      0.2, {opacity:0, onComplete:function(){ overlay.parentNode.removeChild(overlay) }});
          TweenLite.to(imageBacking, 1.0, {opacity:0, onComplete:function(){ imageBacking.parentNode.removeChild(imageBacking) }});
          TweenLite.to(image,        0.2, {opacity:0, onComplete:function(){ image.parentNode.removeChild(image) }});

          // Animate the dimensions.
          var vars = {width:thumbnailWidth, height:thumbnailHeight, left:thumbnailLeft, top:thumbnailTop};
          TweenLite.to(imageBacking, 0.4, vars);
          TweenLite.to(image,        0.4, vars);
        }

        // Produce a full screen overlay.
        var overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed; background-color:#000; opacity:0";
        overlay.style.pointerEvents = "none";
        overlay.style.width = "100%"; overlay.style.height = "100%";
        overlay.style.left = 0; overlay.style.top = 0;
        overlay.onclick = dismissingFunction;
        document.body.appendChild(overlay);

        // Produce the image view's backing.
        var imageBacking = document.createElement("div");
        imageBacking.style.cssText = "position:absolute; background-color:#000; opacity:0.5";
        imageBacking.style.pointerEvents = "none";
        imageBacking.style.width = thumbnailWidth + "px";
        imageBacking.style.height = thumbnailHeight + "px";
        imageBacking.style.left = thumbnailLeft + "px";
        imageBacking.style.top = thumbnailTop + "px";
        container.appendChild(imageBacking);

        // Produce the image view.
        var image = document.createElement("img"); // Create a new image element.
        image.style.cssText = "position:absolute; opacity:0; z-index:1";
        image.src = thumbnail.getAttribute('data-src');
        image.style.width = thumbnailWidth + "px";
        image.style.height = thumbnailHeight + "px";
        image.style.left = thumbnailLeft + "px";
        image.style.top = thumbnailTop + "px";
        image.onclick = dismissingFunction;
        container.appendChild(image);

        // Continue once the image has loaded:
        image.onload = function () {

          // Make the overlay clickable.
          overlay.style.pointerEvents = "";

          // Produce the image view's dimensions and position.
          var imageWidth = image.naturalWidth;  var imageHeight = image.naturalHeight;
          var imageLeft = 0;  var imageTop = thumbnailTop - (imageHeight - thumbnailHeight) / 2;
          var containerHeight = container.getBoundingClientRect().bottom - container.getBoundingClientRect().top;
          if (imageTop + imageHeight > containerHeight) imageTop = containerHeight - imageHeight;
          if (imageTop < 0) imageTop = 0;

          // Animate the opacity.
          TweenLite.to(overlay,      0.2, {opacity:0.6});
          TweenLite.to(imageBacking, 0.2, {opacity:0.8});
          TweenLite.to(image,        0.2, {opacity:1.0});

          // Animate the dimensions.
          var onImageGrow
          TweenLite.to(imageBacking, 0.2, {width:imageWidth, height:imageHeight, left:imageLeft, top:imageTop});
          TweenLite.to(image,        0.2, {width:imageWidth, height:imageHeight, left:imageLeft, top:imageTop});
        }

      }
    });

  });

};
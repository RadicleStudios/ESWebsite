---
---
// The purpose is to 'load' image elements contained within horizontally-scrolling container DIVs; where 'loading' entails the following: as soon as the images are scrolled into view, their `src` attribute is replaced by their `data-src` attribute, with the intended effect that the quick-loading `src` image assets be replaced by the slower-loading assets referred by `data-src`, but only when needed, ie when scrolled into view.

"use strict";

window.onload = function () {

  // Loop through the gallery containers.
  var galleryContainerNodeList = document.querySelectorAll('.GalleryContainer'); // TODO: Replace with something that is more widely supported.
  var galleryContainerElements = Array.prototype.slice.call(galleryContainerNodeList); // Get a true Array.
  galleryContainerElements.forEach(function(containerElement) {

    // Get the image view element.
    var imageViewElement = containerElement.querySelector('.ImageView');
    // TODO: Do something if there is no image view element.
    imageViewElement.onclick = function() {
      imageViewElement.style.visibility = "hidden";
      imageViewElement.src = null;
    }

    // Loop through the contained images (the thumbnails). NB: The class must be `Thumbnail`.
    var galleryThumbnailNodeList = containerElement.querySelectorAll('img.Thumbnail'); // TODO: Replace with something that is more widely supported.
    var galleryThumbnailImageElements = Array.prototype.slice.call(galleryThumbnailNodeList); // Get a true Array.
    galleryThumbnailImageElements.forEach(function(thumbnailElement) {

      // Install the onclick action.
      thumbnailElement.onclick = function() {
        console.log(imageViewElement.src);
        imageViewElement.src = thumbnailElement.getAttribute('data-src');
        imageViewElement.style.visibility = "visible";
      }
    });

  });

    // // Loop through the horizontally-scrolling containers.
    // var containerNodeList = document.querySelectorAll('.ManagedImageContainer');
    // for (var i = 0; i < containerNodeList.length; i++) {
    //
    //     var containerElement = containerNodeList[i];
    //
    //     // Get the 'managed' image elments within this container.
    //     // NB: We depend upon the array variable's being captured inside the upcoming closure.
    //     var managedImageElementsNodeList = containerElement.querySelectorAll('img[data-src]');
    //     var managedImageElements = Array.prototype.slice.call(managedImageElementsNodeList);
    //
    //     // Declare the 'loading' function.
    //     var manageImages = function() {
    //
    //         var containerRect = containerElement.getBoundingClientRect();
    //
    //         // Loop through the 'managed' images.
    //         for (var j = 0; j < managedImageElements.length; j++) {
    //
    //             // If the image should be 'loaded', 'load' it (and correspondingly remove the element from `managedImageElements`.
    //             var imageElement = managedImageElements[j];
    //             var imageRect = imageElement.getBoundingClientRect();
    //             if (imageRect.left < containerRect.right && imageRect.right > containerRect.left) {
    //                 imageElement.src = imageElement.getAttribute('data-src');
    //                 managedImageElements.splice(j, 1); j--; // Remove the element from our array, and adjust the loop counter.
    //             }
    //         }
    //
    //     };
    //
    //     // Call the function now, to 'load' any visible images.
    //     manageImages();
    //
    //     // Have the function called whenever the container scrolls.
    //     containerElement.onscroll = manageImages;
    // }
};
---
---
"use strict";

function sleep (duration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + duration) { /* Do nothing. */ } 
}

function selectGalleryMenuItem (menu, index) {

  menu.querySelectorAll('a').forEach( function(item, index2) {

    if (index2 == index) {
      TweenLite.set(item, {className:"+=selected"});
    } else {
      TweenLite.set(item, {className:"-=selected"});
    }
  });
}

function revealGallery (gallery, menu) {

  var offset = gallery.offsetLeft;
  console.log("Offset: `" + offset + "`");
  var outerContainer = gallery.parentElement.parentElement;
  TweenLite.to(outerContainer, 0.5, {scrollTo:{y:0, x:offset}});
}

function prepareGallery (gallery) {

  // Loop through the contained images (ie the thumbnails; and all contained
  //   images will be understood as thumbnails)
  gallery.querySelectorAll('img').forEach( function(thumbnail) {

    // Install the onclick action
    thumbnail.onclick = function () {

      // Arrest scrolling
      document.documentElement.style.overflow = "hidden";

      var thumbnailRect = thumbnail.getBoundingClientRect();
      var thumbnailWidth = thumbnailRect.width;
      var thumbnailHeight = thumbnailRect.height;
      var thumbnailTop = thumbnailRect.top;
      var thumbnailLeft = thumbnailRect.left

      var dismissingFunction = function () {

        // Allow scrolling
        document.documentElement.style.overflow = "scroll";

        // Make the image unclickable.
        image.style.pointerEvents = "none";

        // Animate the opacity (removing the temporary elements on completion).
        TweenLite.to(overlay,      0.2, {opacity:0, onComplete:function(){
          overlay.parentNode.removeChild(overlay) }});
        TweenLite.to(imageBacking, 1.0, {opacity:0, onComplete:function(){
          imageBacking.parentNode.removeChild(imageBacking) }});
        TweenLite.to(image,        0.2, {opacity:0, onComplete:function(){
          image.parentNode.removeChild(image) }});

        // Animate the dimensions.
        var vars = {width:thumbnailWidth, height:thumbnailHeight,
          left:thumbnailLeft, top:thumbnailTop};
        TweenLite.to(imageBacking, 0.4, vars);
        TweenLite.to(image,        0.4, vars);
      }

      // Produce a full screen overlay.
      var overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.style.pointerEvents = "none";
      overlay.onclick = dismissingFunction;
      document.documentElement.appendChild(overlay);

      // Produce the image view's backing.
      var imageBacking = document.createElement("div");
      imageBacking.style.cssText =
        "position:fixed; background-color:#000; opacity:0.5";
      imageBacking.style.pointerEvents = "none";
      imageBacking.style.width = thumbnailWidth + "px";
      imageBacking.style.height = thumbnailHeight + "px";
      imageBacking.style.left = thumbnailLeft + "px";
      imageBacking.style.top = thumbnailTop + "px";
      document.documentElement.appendChild(imageBacking);

      // Produce the image view.
      var image = document.createElement("img"); // Create a new image element.
      image.style.cssText = "position:fixed; opacity:0; z-index:1";
      image.src = thumbnail.getAttribute('src').replace('-thumbnails/', '/');
      image.style.width = thumbnailWidth + "px";
      image.style.height = thumbnailHeight + "px";
      image.style.left = thumbnailLeft + "px";
      image.style.top = thumbnailTop + "px";
      image.onclick = dismissingFunction;
      document.documentElement.appendChild(image);

      // Continue once the image has loaded:
      image.onload = function () {

        // Make the overlay clickable.
        overlay.style.pointerEvents = "";

        // Determine the image's dimensions and position
        var imageWidth, imageHeight, imageLeft, imageTop;
        var imageAspect = image.naturalWidth / image.naturalHeight;
        var screenWidth = document.documentElement.clientWidth;
        var screenHeight = document.documentElement.clientHeight;
        var windowAspect = screenWidth / screenHeight;
        if (imageAspect > windowAspect) {
          imageWidth = screenWidth;
          imageHeight = imageWidth / imageAspect;
          imageLeft = 0;
          imageTop = (screenHeight - imageHeight) / 2;
        } else {
          imageHeight = screenHeight;
          imageWidth = imageHeight * imageAspect;
          imageLeft = (screenWidth - imageWidth) / 2;
          imageTop = 0;
        }

        // Animate the opacity.
        TweenLite.to(overlay,      0.2, {opacity:0.6});
        TweenLite.to(imageBacking, 0.2, {opacity:0.8});
        TweenLite.to(image,        0.2, {opacity:1.0});

        // Animate the dimensions.
        var onImageGrow
        TweenLite.to(imageBacking, 0.2,
          {width:imageWidth, height:imageHeight, left:imageLeft, top:imageTop});
        TweenLite.to(image,        0.2,
          {width:imageWidth, height:imageHeight, left:imageLeft, top:imageTop});
      }

    }
  });

}

window.onload = function() {

  // Configure the gallery containers and container-containers
  // NB: A gallery is supposed to be a direct descendant of a container, a
  //   container a direct descendant of a container-container.

  // Loop through the gallery containers
  document.querySelectorAll('.gallery-container').forEach( function(container) {

    // Loop through the galleries
    var galleries = container.querySelectorAll('.gallery');
    galleries.forEach( function(gallery, index) {

      // Configure the gallery
      gallery.style.width = 100 / galleries.length + "%";

    });

    // Configure the container
    container.style.width = galleries.length * 100 + "%";

  });

  // Make the gallery menus interactive
  // NB: The menu is supposed to have the same number of items as there are
  //   gallery sections following.

  // Loop through the gallery menus
  document.querySelectorAll('.gallery-menu').forEach( function(menu) {

    // Get lists of the menu items and galleries
    var menuItems = menu.querySelectorAll('a');
    var containerId = menu.getAttribute('data-container-id');
    var container = document.getElementById(containerId);
    var galleries = container.querySelectorAll('.gallery');

    // Loop through the menu items
    menuItems.forEach( function(item, index) {

      // Make it so clicking an item causes the corresponding gallery to slide
      // in
      var gallery = galleries.item(index);
      item.addEventListener('click', function() {
        selectGalleryMenuItem(menu, index);
        revealGallery(gallery);
      });
    });
  });

  // Make the thumbnails interactive

  // Loop through the gallery containers
  document.querySelectorAll('.gallery-container').forEach( function(container) {

    // Loop through the galleries
    container.querySelectorAll('.gallery').forEach( function(gallery) {

      // Make the thumbnails interactive
      prepareGallery(gallery);
    });
  });
};

/********** CAPTURE  **********/

$(function() {

  $("input").change(function(ev) {

    var reader = new FileReader();
    reader.onload = (function(ev) {
      $(".latest img").attr("src", ev.target.result).fadeIn();
    });

    var file = this.files[0];
    $(".latest img").data("name", file.name);
    reader.readAsDataURL(file);
  });

  $(".latest")
  /*
    .click(function() {
      if ($("img",this).attr("src")) $(".menu", this).show();
    }, function() {
      $(".menu", this).hide();
    })
  */
  .click(function() {
      if ($("img",this).attr("src")) addPhoto($("img", this).data("name"));
   });
});



function addPhoto() {
  var name = $(".latest img").data("name");
  if (localStorage[name]) return; // TODO error message
  var dataURI = $(".latest img").attr("src");
  var photo = renderPhoto(name, dataURI, false);
  $(".latest").fly($(".photo", photo), function() {
    $(photo).appear();
  });
  $(".latest img").fadeOut();
  $(".latest .menu").hide();

  $(".message").html("saving");
  var album = localStorage.album ? JSON.parse(localStorage.album) : [];
  localStorage[name] = dataURI;
  $(".message").html("adding photo");
  album.push(name);
  $(".message").html("storing photo");
  localStorage.album = JSON.stringify(album);
  $(".message").html("updated with "+album.length+" photos");
}

function removePhoto(name) {
  var album = JSON.parse(localStorage.album);
  var index = album.indexOf(name);
  album.remove(index);
  localStorage.album = JSON.stringify(album);
  delete localStorage[name];
  $(".photos img").eq(index).remove();
}

var photoTemplate;
function renderPhoto(name, dataURI, visible) {
  if (arguments.length<2) visible = true;
  if (!photoTemplate) photoTemplate = _($("#photoTemplate").html()).template();
  var $photoContainer = $("<span/>")
    .css("visibility", visible ? "visible" : "hidden")
    .html(photoTemplate({name: name, url: dataURI}))
    .appendTo(".photos");
  $photoContainer.find(".photo").data("name", name)
  return $photoContainer;
}

/********** GENERIC FUNCTIONALITY **********/

$.fn.replace= function() {
  var $el = $(this).fadeOut();
  $el.clone().insertBefore($el).fadeIn();
  $el.remove();
}

$.fn.fly = function(target, callback) {
  var callback = callback || function() {};
  var $target = $(target);
  target=$target.get(0);
  return $(this).each(function(i, el) {
    var $el = $(el);
    var $clone = $el
                 .clone()
                 .css({position: "absolute",
                       left: el.offsetLeft, top: el.offsetTop,
                       width: el.offsetWidth, height: el.offsetHeight,
                       padding: 0, margin: 0 })
                .appendTo("body");
    var targetStyle = target ?
      { width: target.offsetWidth, height: target.offsetHeight,
        top: target.offsetTop, left: target.offsetLeft } :
      { width: 0, height: 0, opacity: 0.4, top: 0, };

    var isLast = (i == $(this).length-1);
    $clone.animate(targetStyle, function() {
      $clone.remove();
      if (isLast) callback();
    });
  });
}


  var isMaterial = Framework7.prototype.device.ios === false;
var isIos = Framework7.prototype.device.ios === true;

// Add the above as global variables for templates
Template7.global = {
  material: isMaterial,
  ios: isIos,
};

var mainView;

// A template helper to turn ms durations to mm:ss
// We need to be able to pad to 2 digits
function pad2(number) {
  if (number <= 99) { number = ('0' + number).slice(-2); }
  return number;
}

// Now the actual helper to turn ms to [hh:]mm:ss
function durationFromMsHelper(ms) {
  if (typeof ms != 'number') {
    return '';
  }
  var x = ms / 1000;
  var seconds = pad2(Math.floor(x % 60));
  x /= 60;
  var minutes = pad2(Math.floor(x % 60));
  x /= 60;
  var hours = Math.floor(x % 24);
  hours = hours ? pad2(hours) + ':' : '';
  return hours + minutes + ':' + seconds;
}

// A stringify helper
// Need to replace any double quotes in the data with the HTML char
//  as it is being placed in the HTML attribute data-context
function stringifyHelper(context) {
  var str = JSON.stringify(context);
  return str.replace(/"/g, '&quot;');
}

// Finally, register the helpers with Template7
Template7.registerHelper('durationFromMs', durationFromMsHelper);
Template7.registerHelper('stringify', stringifyHelper);

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

if (!isIos) {
  // Change class
  $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
  // And move Navbar into Page
  $$('.view .navbar').prependTo('.view .page');
}

// Initialize app
var myApp = new Framework7({
  material: isIos? false : true,
  template7Pages: true,
  precompileTemplates: true,
  swipePanel: 'left',
  swipePanelActiveArea: '30',
  swipeBackPage: true,
  animateNavBackIcon: true,
  pushState: !!Framework7.prototype.device.os,
  template7Data: {
            index: {
            firstname: 'William ',
            lastname: 'Root',
            age: 27,
            position: 'Developer',
            company: 'TechShell',
        }
    },
});

function init() {
  // Add view
  //alert('guillermo.. este es el init .....');
  var urlLocalImg = 'http://localhost:8082/VentasOnline/img';
  mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true,
  });

  // Handle Cordova Device Ready Event
  $$(document).on('deviceready', function deviceIsReady() {
    //alert('deviceready');
    //console.log('Device is ready!');
  });
  $$(document).on('click', '.panel .search-link', function searchLink() {
    // Only change route if not already on the index
    //  It would be nice to have a better way of knowing this...
	alert('Busca link');

    var indexPage = $$('.page[data-page=index]');
    if (indexPage.hasClass('cached')) {
      mainView.router.load({
        pageName: 'index',
        animatePages: false,
        reload: true,
      });
    }
  });

  $$(document).on('click', '.panel .favorites-link', function searchLink() {
    // @TODO fetch the favorites (if any) from localStorage
	//alert('favoritos.....');
    var favorites = JSON.parse(localStorage.getItem('favorites'));
    mainView.router.load({
      template: myApp.templates.favorites,
      animatePages: false,
      context: {
        tracks: favorites,
      },
      reload: true,
    });
  });
  $$(document).on('click', '.panel .login-link', function searchLink() {
    // @TODO fetch the favorites (if any) from localStorage
	alert('login esta es una prueba');
	/*var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCALqy7VMo7lkAGgnMly-qi7mNdRyyHWuM&callback=initMap';
    //document.body.appendChild(script);
*/
    var favorites = JSON.parse(localStorage.getItem('favorites'));
	//initMap();
    mainView.router.load({
      template: myApp.templates.login,
      animatePages: false,
      context: {
        tracks: favorites,
      },
      reload: true,
    });
	//mainView.router.load({url:'home.html', ignoreCache: true, reload: false});
    //mainView.router.loadPage('home.html');
  });
  
  $$(document).on('click', '.panel .mapa-link', function searchLink() {
    // @TODO fetch the favorites (if any) from localStorage
	/*var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCALqy7VMo7lkAGgnMly-qi7mNdRyyHWuM&callback=initMap';
    //document.body.appendChild(script);
*/
    var favorites = JSON.parse(localStorage.getItem('favorites'));
	//initMap();
    mainView.router.load({
      template: myApp.templates.mapa,
      animatePages: false,
      context: {
        tracks: favorites,
      },
      reload: true,
    });
	//mainView.router.load({url:'home.html', ignoreCache: true, reload: false});
    //mainView.router.loadPage('home.html');
  });
  
  
  $$(document).on('submit', '#search', searchSubmit);
}

/**
 * Search
 *  - functionality for the main search page
 */

function searchSubmit(e) {
  //alert('guillermo');
  var formData = myApp.formToJSON('#search');
  
  e.preventDefault();
  if (!formData.term) {
    //por ahora no le paro....No filtro nada
    //myApp.alert('Please enter a search term', 'Search Error');
    //return;
  }

  if (formData.filter === 'all') {
    formData.term = formData.term.trim();
  } else {
    formData.term = formData.filter + ':' + formData.term.trim();
  }
  delete formData.filter;
  formData.media = 'music';
  
  $$('input').blur();
   url1 = 'http://192.168.8.100:8082/VentasOnline/json/data/admin/all/products';
   //url1 ='http://localhost/angular_php/php/index2.php';
  myApp.showPreloader('Searching');
   $$.ajax({
   //movil   crossDomain: true,
   //movil    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
	//movil 	headers: {},
   // data: formData,
    processData: true,
    url: url1,
	//useDefaultXhrHeader: false,
	crossDomain: true,
    success: function searchSuccess(resp) {
      var results = { count: 0 };
      results.count = 1; //resp.resultCount === 25 ? "25 (max)" : resp.resultCount;
      results.items = resp;
      myApp.hidePreloader();
      mainView.router.load({
        template: myApp.templates.results,
        context: {
          tracks: results,
        },
      });
    },
    error: function searchError(xhr, err) {
      myApp.hidePreloader();
      myApp.alert('An error has occurred', 'Search Error');
	  alert(JSON.stringify(err));
      console.error("Error on ajax call: " + err);
      console.log(JSON.stringify(xhr));
    }
  });
}


/**
 * Details page
 *  - controls the playback controls and preview media object
 */

var mediaPreview = null;
var mediaTimer = null;

function playbackControlsClickHandler(e) {
  alert('este es el click.....lo borro');
 var buttonTarget = $$(e.target);
  if (buttonTarget.hasClass('play')) {
    monitorMediaPreviewCurrentPosition(mediaPreview);
    mediaPreview.play();
    setPlaybackControlsStatus('pending');
    return;
  }
  monitorMediaPreviewCurrentPosition();
  mediaPreview.stop();
  setPlaybackControlsStatus('stopped');
  
  return;
};

function setPlaybackControlsStatus(status) {
alert('estes es el status uno ');
status ='stopped';
alert(status);
alert('estes es el status 2');
  var allButtons = $$('.playback-controls a');
  var playButton = $$('.playback-controls .play-button');
  var pendingButton = $$('.playback-controls .pending-button');
  var stopButton = $$('.playback-controls .stop-button');
  switch (status) {
    case 'stopped':
      allButtons.removeClass('displayed');
      playButton.addClass('displayed');
      break;
    case 'pending':
      allButtons.removeClass('displayed');
      pendingButton.addClass('displayed');
      break;
    case 'playing':
      allButtons.removeClass('displayed');
      stopButton.addClass('displayed');
      break;
    default:
      allButtons.removeClass('displayed');
      playButton.addClass('displayed');
  }
}

function monitorMediaPreviewCurrentPosition(media) {
alert('este es el status de monitor.....' );
  var percent = 0;
  var progressbar = $$('.playback-controls .duration .progressbar');
  // If no media object is provided, stop monitoring
  if (!media) {
    alert("Error getting position media timer ");
    clearInterval(mediaTimer);
    return;
  }
  mediaTimer = setInterval(function () {
    media.getCurrentPosition(
      function (position) {
        if (position > -1) {
          percent = (position / media.getDuration()) * 100;
          myApp.setProgressbar(progressbar, percent);
        }
      },
      function (e) {
	    alert("Error getting position");
        console.error("Error getting position", e);
      });
  }, 100);
}

function mediaPreviewSuccessCallback() {
   alert('Media preview callback');
  var progressbar = $$('.playback-controls .duration .progressbar');
  setPlaybackControlsStatus('stopped');
  myApp.setProgressbar(progressbar, 0, 100);
}

function mediaPreviewErrorCallback(error) {
alert('Media Error');
  setPlaybackControlsStatus('stopped');
  console.error(error);
}

function mediaPreviewStatusCallback(status) {
//guillermo alert('Media 1 status');
  status = 4;
 // var progressbar = $$('.playback-controls .duration .progressbar');
  switch (status) {
    case 2: // playing
      setPlaybackControlsStatus('playing');
      myApp.setProgressbar(progressbar, 0, 0);
      break;
    case 4: // stopped
      setPlaybackControlsStatus('stopped');
      break;
    default:
      // Default fall back not needed
  }
}

function addOrRemoveFavorite(e) {
alert('favorities.....');
  if (this.isFavorite) {
    // remove the favorite from the arrays
    this.favoriteIds.splice(this.favoriteIds.indexOf(this.id), 1);
    var favorites = this.favorites.filter(function(fave) {
      return fave.id !== this.id;
    }, this);
    this.favorites = favorites;
    this.isFavorite = false;
    // update the UI
    $$('.link.star').html('<i class="fa fa-star-o"></i>');
  } else {
    // add the favorite to the arrays
    if (this.favorites === null) this.favorites = [];
    this.favorites.push(this.track);
    this.favoriteIds.push(this.id);
    this.isFavorite = true;
    // update the UI
    $$('.link.star').html('<i class="fa fa-star"></i>');
  }
  if (this.favorites.length === 0) {
    // clear it out so the template knows it's empty when it returns
    //  as {{#if favorites}} sees an empty array as truthy
    this.favorites = null;
  }
  // save it back to localStorage
  localStorage.setItem('favorites', JSON.stringify(this.favorites));
  localStorage.setItem('favoriteIds', JSON.stringify(this.favoriteIds));
  // if we got here from the favorites page, we need to reload its context
  //  so it will update as soon as we go "back"
  if (this.fromPage === 'favorites') {
    // Reload the previous page
    mainView.router.load({
      template: myApp.templates.favorites,
      context: {
        tracks: this.favorites,
      },
      reload: true,
      reloadPrevious: true,
    });
  }
}

myApp.onPageInit('details', function(page) {

  var previewUrl = page.context.previewUrl;
  //return ; // que pirato soy.....
  if (typeof Media !== 'undefined') {
   alert('Media sin definir ......');
    // Create media object on page load so as to let it start buffering right
    //  away...
        /*guillermo ....mediaPreview = new Media(previewUrl, mediaPreviewSuccessCallback,
        mediaPreviewErrorCallback, mediaPreviewStatusCallback);
		*/
  } else {
    // Create a dummy media object for when viewing in a browser, etc
    //  this really is optional, using `phonegap serve` polyfills the
    //  Media plugin
	//alert('Media definido..........'); ojo solo para que funcione hay que
	// quitar esta funcion se deja solo para play.....
   function noMedia() {
      myApp.alert('Media playback not supported', 'Media Error');
	  alert('Media playback not supported');
      setTimeout(function() {
        setPlaybackControlsStatus('stopped');
        mediaPreviewStatusCallback(4); // stopped
        console.error('No media plugin available');
      }, 0);
    }
    mediaPreview = {
      play: noMedia,
      stop: function() {},
      release: function() {},
      getCurrentPosition: function() {},
    };
  }

  // fetch the favorites
  var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  var favoriteIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];
  var isFavorite = false;
  if (favoriteIds.indexOf(page.context.id) !== -1) {
    $$('.link.star').html('<i class="fa fa-star"></i>');
    isFavorite = true;
  }
  // set up a context object to pass to the handler
  var pageContext = {
    track: page.context,
    id: page.context.id,
    isFavorite: isFavorite,
    favorites: favorites,
    favoriteIds: favoriteIds,
    fromPage: page.fromPage.name,
  };

  // bind the playback and favorite controls
  $$('.playback-controls a').on('click', playbackControlsClickHandler);
  $$('.link.star').on('click', addOrRemoveFavorite.bind(pageContext));
});

myApp.onPageBeforeRemove('details', function(page) {
 return ; //que pirata soy.....jejejeje
alert('Media 1 onpageBefore');
  // stop playing before leaving the page
  monitorMediaPreviewCurrentPosition();
  mediaPreview.stop();
  mediaPreview.release();
  // keep from leaking memory by removing the listeners we don't need
  $$('.playback-controls a').off('click', playbackControlsClickHandler);
  $$('.link.star').off('click', addOrRemoveFavorite);
});

  myApp.onPageInit('index', function (page) { 
    alert('Inicio index');
    });

  myApp.onPageInit('mapa', function (page) {
      //console.log('About page initialized');
      //console.log(page);
	//  alert('Inicio de Mapa....');
	if (navigator.geolocation){

   //myApp.alert("Location obtained");
   navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true, timeout: 10000});
   } else {

   //myApp.alert("Location not obtained");
   }
	  
			
      });
	   var map;

function onSuccess(position) {

   myApp.alert("Estoy Aqui.....");
   var longitude = position.coords.longitude;
   //myApp.alert(longitude);
   var latitude = position.coords.latitude;
   //myApp.alert(latitude);
   var latLong = new google.maps.LatLng(latitude, longitude);

   var mapOptions = {

   center: latLong,
   zoom: 5,
   mapTypeId: google.maps.MapTypeId.ROADMAP

  };
   //myApp.alert('llego al mapa...');
   map = new google.maps.Map(document.getElementById("map_holder"), mapOptions);

   var marker = new google.maps.Marker({

   position: latLong,
   map: map,
   title: 'Aqui estoy'
   });
}



function onError(error) {
   myApp.alert(error.message);
}

  

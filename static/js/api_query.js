/**
 * @fileoverview
 * Provides methods for the Hello Endpoints sample UI and interaction with the
 * Hello Endpoints API.
 */

/** google global namespace for Google projects. */
var google = google || {};

/** appengine namespace for Google Developer Relations projects. */
google.appengine = google.appengine || {};

/** samples namespace for App Engine sample code. */
google.appengine.samples = google.appengine.samples || {};

/** hello namespace for this sample. */
google.appengine.samples.hello = google.appengine.samples.hello || {};


/**
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
google.appengine.samples.hello.CLIENT_ID =
    '935842685891-akaa53kqu9v86pcnh5kn4j41kaltnd18.apps.googleusercontent.com';

/**
 * Scopes used by the application.
 * @type {string}
 */
google.appengine.samples.hello.SCOPES =
    'https://www.googleapis.com/auth/userinfo.email';

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
google.appengine.samples.hello.signedIn = false;

/**
 * Loads the application UI after the user has completed auth.
 */
google.appengine.samples.hello.userAuthed = function() {
  var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
    if (!resp.code) {
      google.appengine.samples.hello.signedIn = true;
      document.querySelector('#signinButton').textContent = resp.name;
    }
  });
};


/**
 * Handles the auth flow, with the given value for immediate mode.
 * @param {boolean} mode Whether or not to use immediate mode.
 * @param {Function} callback Callback to call on completion.
 */
google.appengine.samples.hello.signin = function(mode, callback) {
  gapi.auth.authorize({client_id: google.appengine.samples.hello.CLIENT_ID,
      scope: google.appengine.samples.hello.SCOPES, immediate: mode},
      callback);
};




/**
 * Presents the user with the authorization popup.
 */
google.appengine.samples.hello.auth = function() {
  if (!google.appengine.samples.hello.signedIn) {
    google.appengine.samples.hello.signin(false,
        google.appengine.samples.hello.userAuthed);
  } else {
    google.appengine.samples.hello.signedIn = false;
    document.querySelector('#signinButton').textContent = 'Sign in';
  }
};





/**
 * Prints a greeting to the greeting log.
 * param {Object} greeting Greeting to print.
 */
google.appengine.samples.hello.print = function(model) {
  var element = document.createElement('div');
  element.classList.add('row');
  // element.innerHTML = model.productname;
  element.innerHTML = '<img src="data:image/png;base64,'+model.productimg+'"/>';
  // element.innerHTML = '<img src="'+model.productimg+'"/>';
  document.querySelector('#outputLog').appendChild(element);
};

/**
 * Gets a numbered greeting via the API.
 * @param {string} id ID of the greeting.
 */
google.appengine.samples.hello.getProductByID = function(id) {
  gapi.client.myapi.mymodel.getByID({'id': id}).execute(
      function(resp) {
        if (!resp.code) {
          google.appengine.samples.hello.print(resp);
        }
      });
};

/**
 * Lists greetings via the API.
 */
google.appengine.samples.hello.productList = function() {
  gapi.client.myapi.mymodel.list().execute(
      function(resp) {
        if (!resp.code) {
          resp.items = resp.items || [];
          for (var i = 0; i < resp.items.length; i++) {
            console.log(resp.items[i]);
            google.appengine.samples.hello.print(resp.items[i]);
          }
        }
      });
};

// myapi.mymodel.insert
google.appengine.samples.hello.insert = function(productname,category,offerprice,usualprice,doe,productimg) {
  gapi.client.myapi.mymodel.insert({
      'productname':productname,
      'category':category,
      'offerprice':offerprice,
      'usualprice':usualprice,
      'doe':doe,
      'productimg':productimg
    }).execute(function(resp) {
      if (!resp.code) {
        google.appengine.samples.hello.print(resp);
      }
    });
};


function converbtoa(){
  file=document.querySelector("#productimg").files[0];
  var reader=new FileReader();
  reader.onload=function(e){
    var rawData=reader.result;
  }
  reader.removeAttr(file);
}

/**
 * Enables the button callbacks in the UI.
 */
google.appengine.samples.hello.enableButtons = function() {
  var getProductByID = document.querySelector('#a-success');
  getProductByID.addEventListener('click', function(e) {
    google.appengine.samples.hello.getProductByID(
        document.querySelector('#offerprice').value);
  });

  var insertProduct = document.querySelector('#b-success');
  insertProduct.addEventListener('click',function(){
      var productname=document.querySelector('#productname').value;
      var category=document.querySelector('#category').value;
      var offerprice=document.querySelector('#offerprice').value;
      var usualprice=document.querySelector('#usualprice').value;
      var doe=document.querySelector('#doe').value;

      // file=document.querySelector('#productimg').files[0];
      // var reader = new FileReader();
      // reader.onload = (function(theFile){
      //     var fileName = theFile.name;
      //     productimg=reader.result;
      //     return function(e){
      //         console.log(fileName);
      //     };
      // })(file);   
      // reader.readAsDataURL(file);
      // file=document.querySelector("#productimg").files[0];

      // var reader = new FileReader();

      // reader.onload = function(e) {
      //   var rawData = reader.result;
      // }
      

      // reader.readAsBinaryString(file);
      p=productimage;
      // // convert to base 64 to send via endpoints
      // productimg=btoa(reader.result);

      google.appengine.samples.hello.insert(productname,category,offerprice,usualprice,doe,p)
    });

  var signinButton = document.querySelector('#signinButton');
  signinButton.addEventListener('click', google.appengine.samples.hello.auth);

};
/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
google.appengine.samples.hello.init = function(apiRoot) {
  // Loads the OAuth and helloworld APIs asynchronously, and triggers login
  // when they have completed.
  var apisToLoad;
  var callback = function() {
    if (--apisToLoad == 0) {
      google.appengine.samples.hello.enableButtons();
      google.appengine.samples.hello.signin(true,
          google.appengine.samples.hello.userAuthed);
    }
  }

  apisToLoad = 2; // must match number of calls to gapi.client.load()
  gapi.client.load('myapi', 'v1', callback, apiRoot);
  gapi.client.load('oauth2', 'v2', callback);
};

var productimage;
window.onload = function(){
        
    //Check File API support
    if(window.File && window.FileList && window.FileReader)
    {
        var filesInput = document.getElementById("productimg");
        
        filesInput.addEventListener("change", function(event){
            
            var files = event.target.files; //FileList object
            var output = document.getElementById("result");
            
            file=files[0];

            //Only pics
            // if(!file.type.match('image'))
            //   continue;
                
            var picReader = new FileReader();
                
            picReader.addEventListener("load",function(event){
                    
              var picFile = event.target;
            
              productimage= btoa(picFile.result);        
            // var div = document.createElement("div");
                    
            // div.innerHTML = "<img class='thumbnail' src='" + picFile.result + "'" +
            //                 "title='" + picFile.name + "'/>";
                    
                    // output.insertBefore(div,null);            
                
            });
                
                 //Read the image
                picReader.readAsBinaryString(file);
            });   
    }
    else
    {
        console.log("Your browser does not support File API");
    }
}
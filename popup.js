console.log("in popup.js");
// Google Forms constants
var GOOGLE_FORMS_URL = 'https://docs.google.com/forms/d/1kuwxu2lXYSRpkwBj4o9kwjURZL3hgk-mSFoK4qkC4ZI/formResponse?ifq';
var NAME_FIELD = '&entry.604638068=';
var EMAIL_FIELD = '&entry.582835473=';
var EVENTNAME_FIELD = '&entry.1800984457=';
var URL_FIELD = '&entry.242612017=';
var COMMENT_FIELD = '&entry.1562922032=';
var NOTIFICATION_TOOL_URL = 'http://digital2.library.unt.edu/nomination/eth2016/url/';

// This callback function is called when the content script has been 
// injected and returned its results
function onPageDetailsReceived(pageDetails)  { 
    document.getElementById('title').value = pageDetails.title; 
    document.getElementById('url').value = pageDetails.url; 
    document.getElementById('summary').innerText = pageDetails.summary; 
}

// Global reference to the status display SPAN
var statusDisplay = null;


// get all of that data over to our thing.


// POST the data to the server using XMLHttpRequest
function addBookmark() {
    console.log("good god let this work!");
    // Cancel the form submit
    event.preventDefault();
    // Prepare the data to be POSTed by URLEncoding each field's contents
    var title = encodeURIComponent(document.getElementById('title').value);
    var url = encodeURIComponent(document.getElementById('url').value);
    var summary = encodeURIComponent(document.getElementById('summary').value);
    var tags = encodeURIComponent(document.getElementById('tags').value);
    
    var params = COMMENT_FIELD + title + 
        URL_FIELD + url + 
        '&summary=' + summary +
        '&tags=' + tags;
    
    // Replace any instances of the URLEncoded space char with +
    params = params.replace(/%20/g, '+');


    // Do GET call to post to Google Form and open new tab
    $.get( {
        //url: GOOGLE_FORMS_URL + NAME_FIELD + localStorage.name + EMAIL_FIELD + localStorage.email + EVENTNAME_FIELD + localStorage.eventName + COMMENT_FIELD + commentAnswer + URL_FIELD + currentURL + '&submit=Submit',
        url: GOOGLE_FORMS_URL + params  + '&submit=Submit',

        success: function( res ) {
            alert( "Thank you for submitting \n" + currentURL + ". \n\nThe nomination will be added to the seed queue." );
            // uncomment this line to also add the URL through the official notificaiton tool.
            // window.open(NOTIFICATION_TOOL_URL + currentURL);
        },
        error: function( err ) {
            console.error( err );
        }
    } );
}

window.addEventListener('load', function(evt) {
    // Cache a reference to the status display SPAN


  // Instantiate locaStorage Variables
  var default_name = localStorage.name || 'Enter your name ';
  var default_EventName = localStorage.eventName || 'Enter event name';
  var default_email = localStorage.email || 'Enter your email or type a space to make this message disappear! ';

  console.log( "pressed" );

  // Check if localStorage has name if not prompt
  if ( !localStorage.name ) {
    var nameAnswer = prompt( 'Please enter your name', default_name );
    localStorage.name = nameAnswer;
  }

  // Check if localStorage has event anem if not prompt
  if ( !localStorage.eventName ) {
    var eventAnswer = prompt( 'Please enter your event name', default_EventName );
    localStorage.eventName = eventAnswer;
  }

  // Check if localStorage has email if not prompt
  if ( !localStorage.email ) {
    var emailAnswer = prompt( 'Please enter your email', default_email );
    localStorage.email = emailAnswer;
}
    statusDisplay = document.getElementById('status-display');
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);
    
    // Get the event page
    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Call the getPageInfo function in the event page, passing in 
        // our onPageDetailsReceived function as the callback. This injects 
        // content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});
    

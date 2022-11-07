//
//Call the Facebook JavaScript SDK
//

let appId = {config.meta.app_id}
let version = {config.meta.api_version}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '{appId}',
    cookie     : true,
    xfbml      : true,
    version    : '{version}'
  });
  FB.AppEvents.logPageView();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

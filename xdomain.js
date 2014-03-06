var xdomain = {};

xdomain.applications = [
      "http://domain1.com/xdomain.html",
      "http://domain2.com/xdomain.html"
    ];

xdomain.expires_in_days_days = 10*365; // 10 years

xdomain.top_level_domains = ["se", "com", "local", "net", "org", "xxx", "edu", "es", "gov", "biz", "info", "fr", "nl", "ca", "de", "kr", "it", "me", "ly", "tv", "mx", "cn", "jp", "il", "in", "iq"];
xdomain.special_domains = ["jp", "uk", "au"];

function setCookie(c_name, c_value, c_exdays, c_domain) {
    var cookie_string = c_name + "=" + c_value;
    if (c_exdays != null) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + c_exdays);
      cookie_string += "; expires=" + exdate.toUTCString();
    }
    if (c_domain != null) {
      cookie_string += "; domain=" + c_domain;
    }
   document.cookie = cookie_string;
}

xdomain.publicSuffix = function () {
    var tmp = window.location.hostname;
    var parts = tmp.split(".");
    var last = parts[parts.length - 1];
    if (parts.length > 2 && xdomain.special_domains.indexOf(last) != -1){
      tmp = parts[parts.length - 3] + "." + parts[parts.length - 2] + "." + last
    } else if (parts.length > 1 && xdomain.top_level_domains.indexOf(last) != -1) {
      tmp = parts[parts.length - 2] + "." + last
    }
    return tmp;
} ();

(function(){
    var cookies;
    function readCookie(name,c,C,i){
        if(cookies){ return cookies[name]; }
        c = document.cookie.split('; ');
        cookies = {};
        for(i=c.length-1; i>=0; i--){
           C = c[i].split('=');
           cookies[C[0]] = C[1];
        }
        return cookies[name];
    }
    xdomain.Cookie = readCookie;
})();



function loadIframe(element, index, array) {
    if (xdomain.Cookie("cookie1") && xdomain.Cookie("cookie2")) {
      var url = element
            + "?b=" + xdomain.Cookie("cookie1")
            + "&i=" + xdomain.Cookie("cookie2");
      var iframe = document.createElement('iframe');
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
    }
}

function getQueryString() {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
      // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
}


function shareCookies() {
    if (xdomain.Cookie("cookie1") && xdomain.Cookie("cookie2")) {
      if (xdomain.Cookie("cookie1") != xdomain.Cookie("__xdomain_cookie2__")
        || xdomain.Cookie("cookie2") != xdomain.Cookie("__xdomain_cookie2__")) {
        xdomain.applications.forEach(loadIframe);
      }
    }
}

function saveCookies () {
  var queryString = getQueryString();
  if (queryString != null) {
    if (queryString.b != null && queryString.i != null) {
      setCookie("cookie1", queryString.b, xdomain.expires_in_days_days, xdomain.publicSuffix);
      setCookie("cookie2", queryString.i, xdomain.expires_in_days_days, xdomain.publicSuffix);

      // save a copy which does also prevent flooding if the cookie is already shared.
      setCookie("__xdomain_cookie1__", queryString.b, xdomain.expires_in_days_days, xdomain.publicSuffix);
      setCookie("__xdomain_cookie2__", queryString.i, xdomain.expires_in_days_days, xdomain.publicSuffix);
    }
  }
}

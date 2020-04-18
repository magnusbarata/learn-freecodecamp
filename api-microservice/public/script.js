// client-side js, loaded by index.html
// run by the browser each time the page is loaded

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('getTimestamp').onclick = function(){
    const reqString = document.getElementById('dateString').value == '' ?
      '/api/timestamp' : '/api/timestamp/'+document.getElementById('dateString').value;
    const req = new XMLHttpRequest();
    req.open('GET', reqString, true);
    req.send();
    req.onload=function(){
      const json = JSON.parse(req.responseText);
      document.getElementById('showTimestamp').innerHTML = JSON.stringify(json);
    };
  };

  document.getElementById('getWhoami').onclick = function(){
    const req = new XMLHttpRequest();
    req.open('GET', '/api/whoami', true);
    req.send();
    req.onload=function(){
      const json = JSON.parse(req.responseText);
      document.getElementById('showWhoami').innerHTML = JSON.stringify(json);
    };
  };
});

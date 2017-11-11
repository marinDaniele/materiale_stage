var page = require('webpage').create();
page.open('http://localhost/~damarin/stage_progetto/editor3/index.html', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('example.png');
  }
  phantom.exit();
});

//dalla console 'phantomjs test1.js'
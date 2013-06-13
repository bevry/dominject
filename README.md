# DOM Inject

[![View this project's NPM page](https://badge.fury.io/js/dominject.png)](https://npmjs.org/package/dominject)
[![Donate monthly to this project via Flattr](https://raw.github.com/balupton/flattr-buttons/master/badge-89x18.gif)](http://flattr.com/thing/344188/balupton-on-Flattr)
[![Donate once-off to this project via Paypal](https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif)](https://www.paypal.com/au/cgi-bin/webscr?cmd=_flow&SESSION=IHj3DG3oy_N9A9ZDIUnPksOi59v0i-EWDTunfmDrmU38Tuohg_xQTx0xcjq&dispatch=5885d80a13c0db1f8e263663d3faee8d14f86393d55a810282b64afed84968ec)

Inject scripts and styles into the DOM with duplicate prevention and completion callback support


## Install

### Backend

1. [Install Node.js](http://bevry.me/node/install)
2. `npm install --save dominject`

### Frontend

1. [See Browserify](http://browserify.org/)


## Usage

``` javascript
var dominject = require('dominject');
var element = dominject({
    type: 'script',
    url: '//some-url.js',
    attrs: {},  // attributes to be added to the injected dom element
    timeout: 60*1000, // defaults to one minute that is allowed before the injection times out
    next: function(err,el){
        // completion callback for once the element has completed or error'd
    }
}); // returns the element that was injected
```


## History
You can discover the history inside the [History.md](https://github.com/bevry/dominject/blob/master/History.md#files) file


## Backers
Check out the [Backers.md](https://github.com/bevry/dominject/blob/master/Backers.md#files) file to discover all the amazing people who financially supported the development of this project.


## License
Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://creativecommons.org/licenses/MIT/)
<br/>Copyright © 2013+ [Bevry Pty Ltd](http://bevry.me)

# DOM Inject

[![NPM version](https://badge.fury.io/js/dominject.png)](https://npmjs.org/package/dominject)
[![Flattr this project](https://raw.github.com/balupton/flattr-buttons/master/badge-89x18.gif)](http://flattr.com/thing/344188/balupton-on-Flattr)

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
dominject({
    type: 'script',
    url: '//some-url.js',
    attrs: {},  // attributes to be added to the injected dom element
    next: function(err,el){
        // completion callback for once the element has completed or error'd
    }
})
```



## History
You can discover the history inside the [History.md](https://github.com/bevry/dominject/blob/master/History.md#files) file



## Backers
Check out the [Backers.md](https://github.com/bevry/dominject/blob/master/Backers.md#files) file to discover all the amazing people who financially supported the development of this project.



## License
Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://creativecommons.org/licenses/MIT/)
<br/>Copyright © 2013+ [Bevry Pty Ltd](http://bevry.me)

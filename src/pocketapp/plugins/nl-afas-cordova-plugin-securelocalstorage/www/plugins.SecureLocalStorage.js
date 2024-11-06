cordova.define("nl-afas-cordova-plugin-securelocalstorage.SecureLocalStorage", function(require, exports, module) {
/*
The MIT License (MIT)

Copyright (c) 2015 Dick Verweij, dickydick1969@hotmail.com, AFAS Software  - d.verweij@afas.nl

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/  
var exec = require('cordova/exec');

function SecureLocalStorage() {
    var self = this;

    // the plugin initializes async so some initialization handling is needed
    this.initialized = false;
    this.fallbackActive = false;
    this.initQueue = [];

    exec(initialized, error, 'SecureLocalStorage', 'clearIfInvalid', []);

    function initialized() {
        self.initialized = true;
        for (var f; f = self.initQueue.shift() ;){
            f();
        }
    }

    // fallback to localStorage on a error(not encrypted local storage)
    // needed for rooted devices..
    function error()
    {
        console.log("falling back to insecure localStorage")
        self.initialized = true;
        self.fallbackActive = true;

        for (var f; f = self.initQueue.shift() ;) {
            f();
        }
    }
}


SecureLocalStorage.prototype.getItem = function (key) {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (self.initialized) {
            getItem(key,resolve,reject);
        }
        else {
            self.initQueue.push(function () {
                getItem(key, resolve, reject);
            });
        }
    });
    
    function getItem(key, resolve, reject) {
        if(self.fallbackActive)
        {
            resolve(localStorage.getItem(key));
        }
        else
        {
            exec(resolve, reject, 'SecureLocalStorage', 'getItem', [key]);
        }
    }
};

SecureLocalStorage.prototype.setItem = function (key, value) {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (self.initialized) {
            setItem(key, value, resolve, reject);
        }
        else {
            self.initQueue.push(function () {
                setItem(key, value, resolve, reject);
            });
        }
    });

    function setItem(key, value, resolve, reject) {
        if(self.fallbackActive)
        {
            localStorage.setItem(key, value);
            resolve();
        }
        else
        {
            exec(resolve, reject, 'SecureLocalStorage', 'setItem', [key, value]);
        }
    }
};

SecureLocalStorage.prototype.removeItem = function (key) {
    var self = this;
    return new Promise(function (resolve, reject) {        
        if (self.initialized) {
            removeItem(key, resolve, reject);
        }
        else {
            self.initQueue.push(function () {
                removeItem(key, resolve, reject);
            });
        }
    });

    function removeItem(key, resolve, reject) {
        if(self.fallbackActive)
        {
            localStorage.removeItem(key);
            resolve();
        }
        else
        {
            exec(resolve, reject, 'SecureLocalStorage', 'removeItem', [key]);
        }
    }
};

SecureLocalStorage.prototype.clear = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (self.initialized) {
            clear(resolve, reject);
        }
        else {
            self.initQueue.push(function () {
                clear(resolve, reject);
            });
        }
    });

    function clear(resolve, reject)
    {
        if(self.fallbackActive)
        {
            localStorage.clear();
            resolve();
        }
        else
        {
            exec(resolve, reject, 'SecureLocalStorage', 'clear', []);
        }
    }
};

module.exports = new SecureLocalStorage();


});

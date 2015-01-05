# promise-retryer [![Build Status](https://travis-ci.org/icodeforlove/promise-retryer.png?branch=master)](https://travis-ci.org/icodeforlove/promise-retryer)

provides an easy way to make promises retry based on exceptions or result validation

## install

```
npm install promise-retryer
```

## params

- delay (can be a number or function that returns a number, if its a function it gets called with an attempt argument)
- maxRetries (the maximum amount of retries)
- validate (validation promise) 
- onError (callback function on errors, gets called with an error object and an attempt argument)
- onAttempt (callback function on attempts, gets called with an attempt argument)
- debug (enable verbose logging)
- name (this is useful for debugging purposes)

## examples

heres a basic retry example

```javascript
var PromiseRetryer = require('promise-retryer')(Promise);

PromiseRetryer.run({
	delay: 1000,
	maxRetries: 5,
	promise: function (attempt) {
		return makeAsyncRequest(); // returns a promise
	}
}).then(
	function (response) {
		console.log(response);
	},
	function (error) {
		console.log(error);
	}
);
```

and heres a little more advanced example with validation and custom delays

```javascript
var PromiseRetryer = require('promise-retryer')(Promise);

PromiseRetryer.run({
	delay: function (attempt) {
		return attempt * 1000;
	},
	maxRetries: 5,
	promise: function (attempt) {
		return makeAsyncRequest(); // returns a promise
	},
	validate: function (response, attempt) {
		return new Promise(function (resolve, reject) {
			if (typeof response === 'object') {
				resolve(response);
			} else {
				reject(new Error('response was not an object'));
			}
		});
	}
}).then(
	function (response) {
		console.log(response);
	},
	function (error) {
		console.log(error);
	}
);
```

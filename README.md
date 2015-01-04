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

```javascript
var PromiseRetryer = require('promise-retryer');

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
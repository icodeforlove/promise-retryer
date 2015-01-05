var P = require('es6-promise').Promise,
	PromiseRetryer = require('../index')(P);

describe('General', function() {
	it('can do 10 basic retries', function(done) {
		PromiseRetryer.run({
			debug: true, 
			name: 'basic retries',
			delay: 1,
			maxRetries: 10,
			promise: function (attempt) {
				return new P(function (resolve, reject) {
					if (attempt == 10) {
						resolve(true);
					} else {
						reject(new Error('could not make the required amount of attempts'));
					}
				});
			}
		}).then(
			function (response) {
				expect(response).toEqual(true);
				done();
			},
			done
		);
	});

	it('can do 5 retries that also take validation into account', function(done) {
		PromiseRetryer.run({
			debug: true,
			name: 'validation retries',
			delay: 1,
			maxRetries: 5,
			promise: function (attempt) {
				return new P(function (resolve, reject) {
					if (attempt > 2) {
						resolve(true);
					} else {
						reject(new Error('could not make the required amount of attempts'));
					}
				});
			},
			validate: function (response, attempt) {
				return new P(function (resolve, reject) {
					// console.log('Validation attempt #' + attempt);
					if (attempt < 5) {
						reject(new Error('did not pass validation'));
					} else {
						resolve(response);
					}
				});
			}
		}).then(
			function (response) {
				expect(response).toEqual(true);
				done();
			},
			done
		);
	});

	it('can do 5 retries with a int delay', function(done) {
		var start = new Date();

		PromiseRetryer.run({
			debug: true, 
			name: 'int delay',
			delay: 100,
			maxRetries: 5,
			promise: function (attempt) {
				return new P(function (resolve, reject) {
					if (attempt == 5) {
						resolve(true);
					} else {
						reject(new Error('could not make the required amount of attempts'));
					}
				});
			}
		}).then(
			function (response) {
				var duration = new Date() - start;

				expect(response).toEqual(true);
				expect(duration).toBeGreaterThan(400);
				done();
			},
			done
		);
	});

	it('can do 5 retries with a computed duration', function(done) {
		var start = new Date();

		PromiseRetryer.run({
			debug: true, 
			name: 'computed delay',
			delay: function (attempt) {
				return attempt * 100;
			},
			maxRetries: 5,
			promise: function (attempt) {
				return new P(function (resolve, reject) {
					if (attempt == 5) {
						resolve(true);
					} else {
						reject(new Error('could not make the required amount of attempts'));
					}
				});
			}
		}).then(
			function (response) {
				var duration = new Date() - start;

				expect(response).toEqual(true);
				expect(duration >= 1000).toBeTruthy();
				done();
			},
			done
		);
	});
});
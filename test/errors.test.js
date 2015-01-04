var BlueBird = require('bluebird'),
	PromiseRetryer = require('../index');

describe('Errors', function() {
	it('can fail', function(done) {
		PromiseRetryer.run({
			debug: true, 
			name: 'basic fail',
			delay: 1,
			maxRetries: 2,
			promise: function (attempt) {
				return new BlueBird(function (resolve, reject) {
					if (attempt == 3) {
						resolve(true);
					} else {
						reject(new Error('could not make the required amount of attempts'));
					}
				});
			}
		}).then(
			function (response) {
				done(new Error('did not fail'));
			},
			function (error) {
				done();
			}
		);
	});
});
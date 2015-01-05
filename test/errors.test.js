var P = require('es6-promise').Promise,
	PromiseRetryer = require('../index')(P);

describe('Errors', function() {
	it('can fail', function(done) {
		PromiseRetryer.run({
			debug: true, 
			name: 'basic fail',
			delay: 1,
			maxRetries: 2,
			promise: function (attempt) {
				return new P(function (resolve, reject) {
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
module.exports = function (Promise) {
	var PromiseObject = require('promise-object')(Promise);

	var PromiseRetryer = PromiseObject.create({
		$TRUE_FUNC: function () {return true;},
		$TRUE_PROMISE: function ($deferred, response) {$deferred.resolve(response);},

		$run: function ($deferred, $class, $config, _attempt) {
	 		if (typeof $config.promise !== 'function') {
				throw new TypeError($class.message('the :promise property mush be a function that returns a promise'));
			}

			_attempt = _attempt || 1;

			$config.delay = $config.delay || 0;
			$config.maxRetries = $config.maxRetries || 1;
			$config.debug = $config.debug || false;
			$config.validate = $config.validate || $class.TRUE_PROMISE;
			$config.onError = $config.onError || $class.TRUE_FUNC;
			$config.onAttempt = $config.onAttempt || $class.TRUE_FUNC;

			$class.debug($config, 'Starting Attempt #' + _attempt);
			$config.onAttempt(_attempt);
			
			$config.promise(_attempt)
				.then(function (response) {
					return $config.validate(response, _attempt);
				})
				.then(
					function (result) {
						$deferred.resolve(result);
					},
					function (error) {
						$class.debug($config, 'Error on attempt #' + _attempt);

						$config.onError(error, _attempt);

						if (_attempt < $config.maxRetries) {
							setTimeout(function () {
								$class.run($config, ++_attempt).then(
									function (result) {
										$deferred.resolve(result);
									},
									function (error) {
										$deferred.reject(error);
									}
								);
							}, typeof $config.delay === 'function' ? $config.delay(_attempt) : $config.delay);
						} else {
							$deferred.reject(error);
						}
					}
				);
		},

		$message: function ($config, message) {
			return 'PromiseRetryer' + ($config.name ? '[' + $config.name + ']' : '')  + ': ' + message;
		},

		$debug: function ($class, $config, message) {
			if ($config.debug) {
				console.log($class.message($config, message));
			}
		}
	});

	return PromiseRetryer;
};
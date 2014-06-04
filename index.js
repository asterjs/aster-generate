'use strict';

var Rx = require('rx');
var generate = require('escodegen').generate;

module.exports = function (options) {
	options = options || {};
	options.sourceMapWithCode = true;

	return function (files) {
		return files.flatMap(function (file) {
			var result = generate(file.program, options);

			var code = result.code;
			var map = result.map;

			var fileName = file.loc.source;
			var files = [];

			if (map) {
				map = result.map.toString();
				code += '\n//# sourceMappingURL=' + fileName + '.map';
			}

			files.push({
				path: fileName,
				contents: code
			});

			if (map) {
				files.push({
					path: fileName + '.map',
					contents: map
				});
			}

			return Rx.Observable.fromArray(files);
		});
	};
};

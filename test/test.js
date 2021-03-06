/* global describe, it */

'use strict';

var assert = require('chai').assert,
	Rx = require('rx'),
	parse = require('esprima').parse,
	generate = require('..');

it('test', function (done) {
	var input = [{
			type: 'File',
			program: parse('/* hello, world! */a=1', {loc: true, source: 'file.js', attachComment: true}),
			loc: {
				source: 'file.js'
			}
		}],
		expected = [
			{
				path: 'file.js',
				contents: '/* hello, world! */\na = 1;\n//# sourceMappingURL=file.js.map'
			},
			{
				path: 'file.js.map',
				contents: '{"version":3,"sources":["file.js"],"names":["a"],"mappings":"AAAmB;AAAAA,CAAA,GAAE,CAAF"}'
			}
		];

	// simulating file sequence and applying transformation
	generate({comment: true, sourceMap: true})(Rx.Observable.fromArray(input))
	// checking against array of expected results iteratively
	.zip(expected, assert.deepEqual)
	// subscribing to check results
	.subscribe(function () {}, done, done);
});


/**
 * Teacher - Spell check for Node.js
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */

/**
 * Dependencies.
 */
var crypto = require('crypto');
var os = require('os');
var xml2js = require('xml2js');

/**
 * `Api` constructor.
 *
 * @param {String} Language.
 * @param {Array} Ignored types.
 */
function Api(lang, ignored) {
  this.uris = {
    'en': 'http://service.afterthedeadline.com',
    'fr': 'http://fr.service.afterthedeadline.com',
    'de': 'http://de.service.afterthedeadline.com',
    'pt': 'http://pt.service.afterthedeadline.com',
    'es': 'http://es.service.afterthedeadline.com'
  };

  this.language = lang || 'en';

  this.ignored = ignored || [
    'bias language', 'cliches', 'complex expression',
    'diacritical marks', 'double negatives', 'hidden verbs',
    'jargon language', 'passive voice', 'phrases to avoid',
    'redundant expression'
  ];

  this.parser = new xml2js.Parser;
};

/**
 * Return the current language.
 *
 * @returns {String} Language.
 * @api public
 */
Api.prototype.lang = function() {
  return this.language;
};

/**
 * Returns ignored types.
 *
 * @returns {Array}
 * @api public
 */
Api.prototype.ignore = function() {
  return this.ignored;
};

/**
 * Return an url address for supplied language.
 *
 * @returns {Object|String}
 * @api public
 */
Api.prototype.url = function(lang) {
  if (arguments.length === 0) return this.uris;
  return this.uris[lang];
};

/**
 * Build a request options in order to spell check the
 * supplied text.
 *
 * @param {String} Text.
 * @param {String} Action.
 * @param {Function} Callback.
 * @api public
 */
Api.prototype.get = function(text, action, fn) {
  var self = this;

  var options = {
    method: 'POST',
    url: this.url(this.lang()) + '/' + action,
    form: {data: text, key: this.key()}
  };

  this.request(options, function(err, res, body) {
    if (err) return fn(err, null);

    self.parser.parseString(body, function(err, result) {
      if (err) return fn(err);
      fn(null, result);
    });
  });
};

/**
 * Send a HTTP request to After The Deadline server.
 *
 * @param {Object} Request options.
 * @param {Function} Callback.
 * @api private
*/
Api.prototype.request = function(options, fn) {
  request(options, fn);
};

/**
 * Returns API key, which in this case is created from
 * the hostname.
 *
 * @returns {String}
 * @api private
*/
Api.prototype.key = function() {
  var sha = crypto.createHash('sha1');
  return sha.update(os.hostname()).digest('hex');
};

/**
 * Expose `Api`.
*/
module.exports = Api;
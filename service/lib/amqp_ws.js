// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var util = require('util');
var anHourFromNow = require('azure-iot-common').anHourFromNow;
var Base = require('azure-iot-amqp-base').Amqp;
var Amqp = require('./amqp.js');
var PackageJson = require('../package.json');

/**
 * @class       module:azure-iothub.AmqpWs
 * @classdesc   Constructs an {@linkcode Amqp} object that can be used in an application
 *              to connect to IoT Hub instance, using the AMQP protocol over secure websockets.
 *              This class overloads the constructor of the base {@link module:azure-iothub--amqp:Amqp} class from the AMQP transport, and inherits all methods from it.
 */
/*Codes_SRS_NODE_IOTHUB_SERVICE_AMQP_WS_16_001: [The `AmqpWs` constructor shall accept a config object with those four properties:
- `host` – (string) the fully-qualified DNS hostname of an IoT Hub
- `hubName` - (string) the name of the IoT Hub instance (without suffix such as .azure-devices.net).
- `keyName` – (string) the name of a key that can be used to communicate with the IoT Hub instance
- `sharedAccessSignature–` (string) the key associated with the key name.]*/
function AmqpWs(config) {
  this._config = config;
  this._amqp = new Base(false, PackageJson.name + '/' + PackageJson.version);
}

/*Codes_SRS_NODE_IOTHUB_SERVICE_AMQP_WS_16_002: [`AmqpWs` should inherit from `Amqp`.]*/
util.inherits(AmqpWs, Amqp);

AmqpWs.prototype._getConnectionUri = function _createConnectionUri() {
  return 'wss://' +
          encodeURIComponent(this._config.keyName) +
          '%40sas.root.' +
          this._config.hubName +
          ':' +
          encodeURIComponent((typeof(this._config.sharedAccessSignature) === 'string') ? this._config.sharedAccessSignature : this._config.sharedAccessSignature.extend(anHourFromNow())) +
          '@' +
          this._config.host + ':443/$iothub/websocket';
};

module.exports = AmqpWs;
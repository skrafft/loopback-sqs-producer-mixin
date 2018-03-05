'use strict';
var crypto = require('crypto');
var producers = {};

module.exports = function(Model, options) {
  var canSend = true;
  var Producer = require('sqs-producer');

  if (!process.env.SQS_QUEUE_URL && !options.queueUrl) {
    console.log('Amazon SQS Queue url not set, events will not be sent, please set SQS_QUEUE_URL env variable');
    canSend = false;
  }
  if (!process.env.AWS_REGION) {
    console.log('Aws region missing, events will not be sent, please set AWS_REGION env variable');
    canSend = false;
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_ACCESS_KEY_ID) {
    console.warn('No AWS authentication variables, events will not received. Please set AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID.');
    canSend = false;
  }

  var sha256 = function (str) {
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  var template = function (str) {
    if (str.indexOf("$") === 0) {
      return process.env[str.substring(1)];
    }
    return str;
  }

  if (canSend) {
    var _initProducer = function() {
      if (!options.queueUrl) {
        options.queueUrl = {"default": process.env.SQS_QUEUE_URL}
      }
      if (typeof options.queueUrl === 'object') {
        Object.keys(options.queueUrl).forEach(function (key) {
          if (!producers[key]) {
            // Template function is used for json configuration in models
            var url = template(options.queueUrl[key]);
            if (url) {
              producers[key] = Producer.create({
                queueUrl: url,
                region: process.env.AWS_REGION
              });
            } else {
              console.error(options.queueUrl[key] + " resolves to empty variable");
            }
          }
        });
      }
    };
    _initProducer();
  }

  Model.sendEvent = function(model, next) {
    if (canSend) {
      if (!model.topic || !producers[model.topic]) {
        if (next) {
          return next(new Error('Topic not set or does not exist'));
        }
      }
      var sentMessage = JSON.stringify(model.messages);
      producers[model.topic].send({
        id: model.id || sha256(sentMessage),
        body: sentMessage,
        groupId: model.groupId,
        deduplicationId: model.deduplicationId
      }, function(err) {
        if (next) {
          next (err);
        }
      });
    } else {
      if (next) {
        next(null, null);
      }
    }
  };
};

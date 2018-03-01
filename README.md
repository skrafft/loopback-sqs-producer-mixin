[![NPM](https://nodei.co/npm/loopback-sqs-producer-mixin.png?compact=true)](https://nodei.co/npm/loopback-sqs-producer-mixin/)

# loopback-sqs-producer-mixin

SQS Producer mixin for loopback to add sendEvent method to your models.

INSTALL
=============

```bash
  npm install loopback-sqs-producer-mixin --save
```

SERVER CONFIG
=============

Add the `mixins` property to your `server/model-config.json`:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "../node_modules/loopback-sqs-producer-mixin",
      "../common/mixins"
    ]
  }
}
```

MODEL CONFIG
=============

To use with your Models add the `mixins` attribute to the definition object of your model config.

```json
  {
    "name": "Widget",
    "properties": {
      "name": {
        "type": "string",
      }
    },
    "mixins": {
      "SQSProducer" : true
    }
  }
```

CONNEXIONS
=============

To be able to connect to your SQS queue and listen for events in the topic, you have to set the SQS_QUEUE_URL and AWS_REGION env variables.
You also have to set AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID for authentication.

```bash
export SQS_QUEUE_URL=https://sqs.eu-west-1.amazonaws.com/account-id/queue-name
export AWS_SECRET_ACCESS_KEY=...
export AWS_ACCESS_KEY_ID=...
export AWS_REGION=eu-west-1
```

LICENSE
=============
[Apache-2.0] (LICENSE)

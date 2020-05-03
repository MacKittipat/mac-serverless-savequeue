const aws = require('aws-sdk');

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const SQS_URL = 'https://sqs.ap-southeast-1.amazonaws.com/' + AWS_ACCOUNT_ID + '/SaveQueue';

const sqs = new aws.SQS({region : 'ap-southeast-1'});

exports.saveQueue = async (event) => {
    var payload = event.body;
    console.log('Saving message to SQS. params=' + JSON.stringify(payload));
    var params = {
        MessageBody: JSON.stringify(payload),
        QueueUrl: SQS_URL
    };
    const sqsResponse = await sqs.sendMessage(params).promise();
    console.log('Saved message to SQS completed. response=' + JSON.stringify(sqsResponse));

    return {
        statusCode: 200,
        body: JSON.stringify(sqsResponse, null, 2),
    };
};

exports.saveDynamo = async (event) => {
    console.log('Saving message to DynamoDB', JSON.stringify(event));

    // var message = JSON.parse(event.body);
    // var docClient = new AWS.DynamoDB.DocumentClient();
    //
    // docClient.put(params, function(err, data) {
    //     if (err) {
    //         console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    //     } else {
    //         console.log("Added item:", JSON.stringify(data, null, 2));
    //     }
    // });

};

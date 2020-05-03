const aws = require('aws-sdk');

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const REGION = process.env.REGION;
const QUEUE_NAME = process.env.QUEUE_NAME;
const TABLE_NAME = process.env.TABLE_NAME;
const SQS_URL = 'https://sqs.ap-southeast-1.amazonaws.com/' + AWS_ACCOUNT_ID + '/' + QUEUE_NAME;

const sqs = new aws.SQS({region : REGION});

exports.saveQueue = async (event) => {
    var payload = event.body;
    console.log('Saving message to SQS. params=' + JSON.stringify(payload));
    var params = {
        MessageBody: payload,
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

    var docClient = new aws.DynamoDB.DocumentClient({region: REGION});
    for(var i=0; i < event.Records.length; i++) {
        var record = event.Records[i];
        var payload = JSON.parse(record.body);

        var params = {
            TableName: TABLE_NAME,
            Item: {
                "username": payload.username,
                "createdTime": new Date().getTime(),
                "message": payload.message
            }
        };
        console.log('Putting message to DynamoDB, request=', JSON.stringify(params));
        var dynamoResponse = await docClient.put(params).promise();
        console.log('Putted message to DynamoDb completed. response=', dynamoResponse);
    }
};

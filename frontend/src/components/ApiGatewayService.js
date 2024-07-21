// ApiGatewayService.js

import AWS from 'aws-sdk';

export const fetchApiGatewayUrl = async (stackName, region) => {
    AWS.config.update({ region }); // Update AWS SDK with your region
    const cloudFormation = new AWS.CloudFormation();

    // Function to get stack outputs
    const getStackOutputs = async (stackName) => {
        const params = {
            StackName: stackName,
        };

        try {
            const data = await cloudFormation.describeStacks(params).promise();
            const stack = data.Stacks[0]; // Assuming there's only one stack
            const outputs = stack.Outputs || [];

            // Find the API Gateway URL output
            const apiGatewayUrlOutput = outputs.find(output => output.ExportName === 'ApiGatewayUrl');

            return apiGatewayUrlOutput ? apiGatewayUrlOutput.OutputValue : null;
        } catch (err) {
            console.error('Error fetching stack outputs:', err);
            return null;
        }
    };

    // Fetch API Gateway URL and return
    return await getStackOutputs(stackName);
};

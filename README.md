# Configuring web based authentication using Cognito and Javascript

This repo has 3 working configurations using Javascript and Amazon Cognito.

Dir|Description
---|---
cognito-unauthenticated-polly/| Uses a Congnito Federated Identity to assign credetials to unauthenticated users.
cognito-auth-basic/  |           Users Cognito User Pool to authenticate users.
cognito-auth-with-s3/ |    Extends the above example by fetching AWS credentials and listing an S3 bucket.


**Note:** Both examples are almost copy and pastes from the examples in the Amplify resources links blow. This was more about me figuring out how Javascript works and therefore I didn't bother with anything like webpack or doing things "the right way" and simply went for the minimum config with the least abstractions like the amplify cli.


## Configration

The polly example only needs the Identity Pool configuration from the Cognito side since its unauthenticated.

### Amazon Cognito: User Pool

1. Create a Cognito Identity Pool.
1. Create a user in the Identity Pool.
1. Use the aws cli command in the Troubleshooting section to clear the FORCE_CHANGE_PASSWORD flag on the user (so you don't have to write code to do it)
1. Create an App client (use default settings but be sure NOT to generate an app client secret)
1. I didn't change any settings under the App Integration -> App client settings page. No callback URLs etc.

### Amazon Cognito: Identity Pool (Federated Identities)

1. Create a Identity Pool
1. Enable Unauthenticated users (this is for the Amazon Polly example)
1. Enable your previously created Cognito Pool to be used for Authentication by filling in the values under Authentication Providers -> Cognito. Note that the auto filled values are not always correct!
1. Go to IAM and modify the two roles that are created (Unauthenticated and Authenticated). I gave my unauthenticated role AmazonPollyFullAccess and the authenticated role AmazonS3FullAccess for these to work.

### Amazon S3 Bucket

1. Create an S3 bucket
1. Add the following CORS policy

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>HEAD</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```
[Reference](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photos-view.html)

### Javascript

The polly example pulls the javascript SDK inline from a URL, so no setup required.

For the others, install the required modules:
```
cd <project-dir>
npm install --save-dev webpack json-loader # Although I don't use it.
npm install --save amazon-cognito-identity-js
npm install aws-sdk
```
This installs modules to node_modules in working dir, make sure the paths in your JS files are correct.

1. Edit the .js files to have the correct values for  variables near the top of the scripts.

## Running it

1. Open the html file in any browswer (I used Chrome)
1. What the console log in developer tools to see the interaction with Congito

## Resources

https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/installing-jssdk.html




## Troubleshooting

If User's account status is FORCE_CHANGE_PASSWORD, then you can use the aws cli to set it permanently:
```
pip3 install awscli --upgrade
aws cognito-idp admin-set-user-password --user-pool-id <your user pool id> --username user1 --password password --permanent
```
Make sure you set the CORS policy on the S3 bucket otherwise you will be getting errors like this:
```
Access to XMLHttpRequest at 'https://s3.ap-southeast-2.amazonaws.com/' from origin 'null' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```
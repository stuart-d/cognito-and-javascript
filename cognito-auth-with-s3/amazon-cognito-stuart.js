function authenticateUser() {

    // Fill these in with your values.
    var userPoolId = ""
    var clientId = ""
    var identityPoolId = ""
    var awsRegion = "ap-southeast-2"

    // This is derived for you
    var identityLoginKey = "cognito-idp." + awsRegion + ".amazonaws.com/" + userPoolId

    // These come from the HTML page.
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var bucket = document.getElementById("bucket").value
 
    console.log("Sending username: " + username)

    var authenticationData = {
        Username: username,
        Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );
    var poolData = {
        UserPoolId: userPoolId,
        ClientId: clientId
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool,
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            console.log("Login success!")
            console.log("accessToken: [" + accessToken + "]")

            AWS.config.region = awsRegion ;

     
           /* This is the original code from the examples

           AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: identityPoolId,
                Logins: {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_rnRV42oO2': result // YOU NEED TO CHANGE THIS LINE!!
                        .getIdToken()
                        .getJwtToken(),
                },
            });
            */

            // I changed the code above to the following so I could use a variable for the key in the object

            var logins = {} ;
            logins[identityLoginKey] = result.getIdToken().getJwtToken() ; 

            var creds = {} ;
            creds['IdentityPoolId'] = identityPoolId
            creds['Logins'] = logins

            console.log(creds)

            AWS.config.credentials = new AWS.CognitoIdentityCredentials(creds)

            //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
            AWS.config.credentials.refresh(error => {
                if (error) {
                    console.error(error);
                } else {

                    console.log('Identity credentials issued!');

                    // Instantiate aws sdk service objects now that the credentials have been updated.

                    console.log('Attempting to list bucket [' + bucket + "]");
                    var s3 = new AWS.S3({
                        apiVersion: "2006-03-01",
                        params: {
                            Bucket: bucket
                        }
                    });
                    s3.listObjects(function (err, data) {
                        if (err) {
                            console.log("Error", err);
                        } else {
                            console.log("Success");
                            console.log(data)
                        }
                    });
                }
            });

        },

        onFailure: function (err) {
            console.log("Identity credentials failed!")
            alert(err.message || JSON.stringify(err));
        },
    });

}
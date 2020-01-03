function authenticateUser() {

    // Fill these in with your values
    var userPoolId = ""
    var clientId = ""

    // These come from the HTML page.
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value

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
        ClientId: clientId,
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
       
        },

        onFailure: function (err) {
            console.log("Identity credentials failed!")
            alert(err.message || JSON.stringify(err));
        },
    });

}
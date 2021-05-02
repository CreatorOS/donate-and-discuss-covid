const { TwitterClient } =require('twitter-api-client');


//bearer-token = "AAAAAAAAAAAAAAAAAAAAAKu%2FOgEAAAAAIp2gVyIivwKoa0r98QzBG8DxU9g%3DMeibloO83BLOa6osgUFXXG8JbtwUzFX2pqif9IRcA9zMnaNxGo"
const getTwitterUser = async (username, size) => {
    try{
    const twitterClient = new TwitterClient({
        apiKey: 'CKtihVD2EAIzoIKOnNGb28CH3',
        apiSecret: 'cVI2e3bJLNNdJs1nGUj77KrHwNYTrKhEhKXLMNPWqjDvDqhztq',
        accessToken: '75773685-lnlINKnylkwPVgu51iY5XgsSSW5bJgC6AfoRkk0Jv',
        accessTokenSecret: 'Bci0ORMYGw6G0emOG9MkJQ1Nl2K9gSNtBwvUezOND7gn6',
      });
      const data = await twitterClient.accountsAndUsers.usersSearch({ q: username });
      if(data && data[0] && data[0].name){
	  data[0].profile_image_url = data[0].profile_image_url.replace("_normal","_bigger")
          return data[0];      
      }
    }
    catch(e){
    }
    return {
        name: "@"+username,
        profile_image_url: "https://img.buzzfeed.com/buzzfeed-static/static/2017-03/31/13/enhanced/buzzfeed-prod-fastlane-02/original-grid-image-14740-1490981786-4.jpg?crop=590:590;5,0"
    }
  };
  
module.exports.getTwitterUser = getTwitterUser;

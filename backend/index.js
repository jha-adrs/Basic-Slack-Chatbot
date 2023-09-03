require('dotenv').config();
const {App, directMention} = require('@slack/bolt');
const botAuthToken = process.env.BOT_AUTH_TOKEN;
const signingSecret = process.env.SIGNING_SECRET;
const xappToken = process.env.XAPP_TOKEN;
const app = new App({
    token: botAuthToken,
    signingSecret: signingSecret,
    socketMode: true,
    appToken: xappToken,
});
const OpenAI = require('openai');
const openai= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai_completion = async (prompt) => {
    try{
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            temperature: 0.9,
            messages: [{ role: 'user', content: prompt }],
          });
    console.log(JSON.stringify(response.choices));
    return response.choices[0].message.content;
}
    catch(err){
        console.log(err);
    }
};

app.message('<@U05QRKEEK8T>', async ({ message, say }) => {
    console.log(app.appId)
    console.log(message)
    let prompt ="You are a slackbot named Swaggy in a channel and a user has just mentioned you with a message, generate a reply in pleasant and friendly tone, the message must also open ended and should increase interactions in the channel, here's the user's message"
    prompt=prompt+ message.text.replace('<@U05QRKEEK8T>', '')
    try {
        const response = await openai_completion(prompt);
        await say(response);
      } catch (err) {
        await say('An error occurred while generating a reply.');
      }
    
});

  (async () => {
    await app.start();
    console.log('Bot is running');
  })();
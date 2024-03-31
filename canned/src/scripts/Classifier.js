

const axios = require("axios");

async function callOpenAIWithImage(path) {
   try {
       const response = await axios.post(
           "https://api.openai.com/v1/chat/completions",
           {
               model: "gpt-4-1106-vision-preview",
               messages: [
                   {
                       role: "user",
                       content: [
                           {
                               type: "text",
                               text: "Should this be disposed of in a 'recycle bin' or a 'waste bin'? Please answer with either 'recycle bin' or 'waste bin' only.",
                           },
                           {
                               type: "image_url",
                               image_url: {
                                   url: path,
                               },
                           },
                       ],
                   },
               ],
           },
           {
               headers: {
                   "Content-Type": "application/json",
                   Authorization:
                       "Bearer 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",
               },
           }
       );


       console.log(response.data.choices[0].message.content);
   } catch (error) {
       console.error("Error calling the OpenAI API:", error.message);
   }
}


callOpenAIWithImage(
   "https://upload.wikimedia.org/wikipedia/commons/b/bf/Apple_03.jpg"
);



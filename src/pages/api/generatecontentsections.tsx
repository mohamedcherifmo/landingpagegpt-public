

if (!process.env.DATA_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { message } = (await req.json()) as {
    message?: string;
    };
  
    if (!message) {
      return new Response("No prompt in the request", { status: 400 });
    }
  
        try {
        let startResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.DATA_API_KEY,
        },
        body: JSON.stringify({
            "model": "gpt-4",
            "messages": [
                {
                    "role": "system",
                    "content": "Upon receiving a request, you need to explain what content sections the user should use for a web landing page. Respond with the json array with section, description and component_type"
                },
                {
                    "role": "user",
                    "content": message
                }
            ]
        }),
      });
     
      let jsonStartResponse = await startResponse.json();
     
      
      if(jsonStartResponse?.choices && jsonStartResponse?.choices.length>0 )
      {
        
        let inputText= jsonStartResponse?.choices[0].message?.content;
        inputText=inputText.replace("json","");
        // With GPT-3.5 turbo it creates it as markdown, this doesn't occur with GPT-4
         const matches = inputText.match(/```([\s\S]*?)```/m);
         let outputText = matches ? matches[1].trim() : '';
         if(outputText=="")
         {
          outputText=inputText;
         }
         
        return new Response(JSON.stringify( outputText));

      }
        
    } catch (error) {
        console.log(`An error occured: ${error}`);
        
    }
    
    
    
  return new Response("");
};

export default handler;
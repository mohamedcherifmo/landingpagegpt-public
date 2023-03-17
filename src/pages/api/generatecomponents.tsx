if (!process.env.DATA_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};


async function createCompletion(prompt:any) {
  let body = JSON.stringify({
    "model": "gpt-4",
    "messages": [
      {
        "role": "system",
        "content": "Given an input name and description, you will generate a sample html component for a campaign landing page on an intranet representing that description, use html and tailwind css.  \n\n Answer should contain the generated html only. \n\n Use real image placeholders from unsplash and use indigo for primary color and cyan for secondary using tailwind css classes"
      },
      {
        "role": "user",
        "content": prompt.section + ":" + prompt.description
      }
    ]
  });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DATA_API_KEY}`,
    },
    body: body,
  });

  const data = await response.json();
   if (data?.choices && data?.choices.length > 0) {
            let inputText = data?.choices[0].message?.content;
            inputText = inputText.replace("html", "");
            // With GPT-3.5 turbo it creates it as markdown, this doesn't occur with GPT-4
            const matches = inputText.match(/```([\s\S]*?)```/m);
            let outputText = matches ? matches[1].trim() : '';
            if(outputText=="")
            outputText=inputText
            
            return outputText;
           
  
          }
  return ""
}


const handler = async (req: Request): Promise<Response> => {
  const { messages } = (await req.json()) as {
    messages?: string;
  };
  
  if (!messages) {
    return new Response("No prompt in the request", { status: 400 });
  }
  let messagesArr = JSON.parse(messages)

  const encoder = new TextEncoder();
 
  const readable =await new ReadableStream({
    async  start(controller) {
      for (const message of messagesArr) 
      {
        try {
          
          const outputText=await createCompletion(message);
          controller.enqueue(encoder.encode(outputText));
         
          
        } catch (error:any) {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
          } else {
            console.log(error.message);
          }
        }
        
      }

     
      controller.close();
    },
  });
 
  return new Response(readable, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });


  
};
export default handler;
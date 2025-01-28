

async function getOpenAIResponse(userMessage) {
  const apiKey = process.env.OPENAI_API_KEY; // Soma API Key kutoka .env
  const endpoint = "https://api.openai.com/v1/chat/completions";
    // Soma taarifa za shule kutoka JSON
    const schoolInfo = await fetch("./school_info.json").then((res) => res.json());
  
    // Payload ya API
    const payload = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
            You are City Bot, an assistant for City College. Here is information about City College:
            
            - **Institution Name:** ${schoolInfo.institution_name}
            - **Courses Offered:** ${schoolInfo.courses_offered.join(", ")}.
            - **Duration of Courses:** ${schoolInfo.duration}.
            - **Academic Year:** ${schoolInfo.academic_year}.
            - **Unique Features:** ${schoolInfo.unique_features}.
            - **Contact information:** ${schoolInfo.contact_information}.
            
            Use this information to answer user questions.
          `,
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0.7,
    };
  
    // Tuma maombi kwa OpenAI API
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (data.error) {
        return `Error: ${data.error.message}`;
      }
  
      return data.choices[0].message.content;
    } catch (error) {
      return "There was an error connecting to the server. Please try again later.";
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const chatContainer = document.getElementById("chat-container");
    const inputField = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");
  
    // Fungua ujumbe wa mtumiaji na majibu ya bot
    const sendMessage = async () => {
      const userMessage = inputField.value.trim();
  
      if (!userMessage) return;
  
      // Onyesha ujumbe wa mtumiaji upande wa kulia
      const userBubble = document.createElement("div");
      userBubble.className = "user-bubble";
      userBubble.textContent = userMessage;
      chatContainer.appendChild(userBubble);
  
      inputField.value = "";
  
      // Onyesha "typing indicator" kwa bot
      const typingIndicator = document.createElement("div");
      typingIndicator.className = "typing-indicator";
      typingIndicator.textContent = "City is typing...";
      chatContainer.appendChild(typingIndicator);
      chatContainer.scrollTop = chatContainer.scrollHeight;
  
      // Pata jibu kutoka kwa OpenAI API
      const botResponse = await getOpenAIResponse(userMessage);
  
      // Ondoa "typing indicator"
      typingIndicator.remove();
  
      // Onyesha ujumbe wa bot upande wa kushoto
      const botBubble = document.createElement("div");
      botBubble.className = "bot-bubble";
      botBubble.textContent = botResponse;
      chatContainer.appendChild(botBubble);
  
      chatContainer.scrollTop = chatContainer.scrollHeight;
    };
  
    // Bonyeza kitufe cha "Send"
    sendButton.addEventListener("click", sendMessage);
  
    // Ruhusu mtumiaji kubonyeza "Enter" kutuma ujumbe
    inputField.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  });
  

import { Together } from "together-ai";
import dotenv from "dotenv";

dotenv.config();
const together = new Together({
    apiKey: process.env.TOGETHER_AI_API_KEY
});

async function getChatResponse() {
    try {
        const response = await together.chat.completions.create({
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages: [{ "role": "user", "content": "What are some fun things to do in New York?" }],
        });

        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error("Error fetching response:", error);
    }
}

getChatResponse(); 
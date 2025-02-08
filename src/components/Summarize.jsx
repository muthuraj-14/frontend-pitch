import { useState } from "react";
import { HfInference } from "@huggingface/inference";

const client = new HfInference("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");

export default function Home() {
  const [text, setText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  const generateText = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const response = await client.textGeneration({
        model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
        inputs: text,
        parameters: { max_new_tokens: 100 },
      });
  
      // Extracting text after the "<|think|>" tag
      let generated = response.generated_text || "No text generated";
      const thinkTagIndex = generated.indexOf("</think>");
      
      if (thinkTagIndex !== -1) {
        generated = generated.substring(thinkTagIndex + 9).trim(); // 9 to skip "<|think|>"
      }
  
      setGeneratedText(generated);
    } catch (error) {
      console.error("Error generating text:", error);
      setGeneratedText("An error occurred while generating text.");
    }
    setLoading(false);
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Text Generator</h1>
        <textarea
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="5"
          placeholder="Enter text to generate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button
          className="w-full bg-blue-500 text-white py-2 mt-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          onClick={generateText}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        {generatedText && (
          <div className="mt-4 p-3 bg-gray-200 rounded-md">
            <h2 className="font-semibold">Generated Text:</h2>
            <p className="mt-2">{generatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
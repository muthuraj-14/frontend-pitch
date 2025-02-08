import { useState, useRef } from "react";
import { HfInference } from "@huggingface/inference";
import axios from "axios";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

const client = new HfInference(import.meta.env.VITE_HUGGINGFACE);

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const CreatePostForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tech",
    author: "",
    image: "",
  });

  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [generatedTexts, setGeneratedTexts] = useState({});
  const [loadingFields, setLoadingFields] = useState({});
  const cropperRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setImage(base64);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedBase64 = croppedCanvas.toDataURL();
        setCroppedImage(croppedBase64);
        setFormData((prev) => ({ ...prev, image: croppedBase64 }));
      }
    }
  };

  const generateText = async (field) => {
    if (!formData[field]) return;
    setLoadingFields((prev) => ({ ...prev, [field]: true }));
    try {
      const response = await client.textGeneration({
        model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
        inputs: formData[field],
        parameters: { max_new_tokens: 250 },
      });

      let generated = response.generated_text || "No text generated";
      const thinkTagIndex = generated.indexOf("</think>");
      if (thinkTagIndex !== -1) {
        generated = generated.substring(thinkTagIndex + 9).trim();
      }

      setGeneratedTexts((prev) => ({ ...prev, [field]: generated }));
    } catch (error) {
      console.error("Error generating text:", error);
      setGeneratedTexts((prev) => ({ ...prev, [field]: "An error occurred." }));
    }
    setLoadingFields((prev) => ({ ...prev, [field]: false }));
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/posts",
        formData
      );
      console.log("Post created:", response.data);
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response ? error.response.data : error
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div
            key={key}
            className={`flex flex-col ${key === "image" ? "hidden" : ""}`}
          >
            <label htmlFor={key} className="font-medium mb-1">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </label>
            <div className="flex gap-2">
              {key === "description" ? (
                <textarea
                  id={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full p-2 border rounded h-32"
                  placeholder={`Enter your ${key}`}
                />
              ) : key === "category" ? (
                <select
                  id={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  <option value="Programming">Programming</option>
                  <option value="HealthCare">HealthCare</option>
                  <option value="Tech">Tech</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Coding">Agriculture</option>

                </select>
              ) : (
                <input
                  type={key === "image" ? "url" : "text"}
                  id={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder={`Enter your ${key}`}
                />
              )}
              {(key === "title" || key === "description") && (
                <button
                  type="button"
                  onClick={() => generateText(key)}
                  disabled={loadingFields[key]}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                  {loadingFields[key] ? "Generating..." : "Generate"}
                </button>
              )}
            </div>
            {generatedTexts[key] && (
              <p className="text-sm text-gray-600 mt-1">
                Generated: {generatedTexts[key]}
              </p>
            )}
          </div>
        ))}

        {/* Visible Image Upload Field */}
        <label htmlFor="imageUpload" className="block font-medium">
          Upload Image
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageChange}
        />

        {image && (
          <div>
            <Cropper
              src={image}
              style={{ height: 300, width: 400 }}
              aspectRatio={4 / 3}
              guides={false}
              ref={cropperRef}
            />
            <button
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
              type="button"
              onClick={handleCrop}
            >
              Crop Image
            </button>
          </div>
        )}

        {croppedImage && (
          <div className="mt-4">
            <p>Cropped Preview:</p>
            <img
              src={croppedImage}
              alt="Cropped"
              style={{ maxWidth: "500px" }}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-700 text-white p-2 rounded hover:bg-green-700"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default CreatePostForm;

import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
interface FormDataType {
  dietary_preferences: string;
  fitness_goals: string;
  lifestyle_factors: string;
  dietary_restrictions: string;
  health_conditions: string;
  user_query: string;
}

export const FormPage: FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormDataType>({
    dietary_preferences: "",
    fitness_goals: "",
    lifestyle_factors: "",
    dietary_restrictions: "",
    health_conditions: "",
    user_query: ""
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Read JSON only once
      console.log("Response Data:", data); // Log it after storing in a variable

      onSubmit(data.recommendations);
      navigate("/recommendations", { state: { recommendations: data.recommendations } });

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold">Recommendation Form</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-4">
            <label className="block font-semibold capitalize">{key.replace("_", " ")}</label>
            {key === "user_query" ? (
              <textarea name={key} value={formData[key as keyof FormDataType]} onChange={handleChange} className="w-full p-2 border rounded-md" required />
            ) : (
              <input type="text" name={key} value={formData[key as keyof FormDataType]} onChange={handleChange} className="w-full p-2 border rounded-md" required />
            )}
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Get Recommendations</button>
      </form>
    </div>
  );
};

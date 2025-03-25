const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(cors({ origin: "*" })); // Enable CORS
app.use(bodyParser.json()); // Handle JSON
app.use(express.urlencoded({ extended: true }));

// Secure API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Function to generate recommendations
async function generateRecommendation(formData) {
    const prompt = `
You are a fitness and diet recommendation assistant. 
Based on the following details, generate a personalized fitness and diet plan in JSON format.

Provide recommendations under the following categories:
- Diet Recommendations
- Workout Options
- Breakfast Ideas
- Lunch Options
- Dinner Options
- Additional Tips (snacks, supplements, hydration)

Input Details:
- Dietary Preferences: ${formData.dietary_preferences}
- Fitness Goals: ${formData.fitness_goals}
- Lifestyle Factors: ${formData.lifestyle_factors}
- Dietary Restrictions: ${formData.dietary_restrictions}
- Health Conditions: ${formData.health_conditions}
- User Query: ${formData.user_query}

Respond strictly in a valid JSON format with the following structure:
{
  "diet_types": ["recommendation 1", "recommendation 2"],
  "workouts": ["workout 1", "workout 2"],
  "breakfasts": ["breakfast 1", "breakfast 2"],
  "lunches": ["lunch 1", "lunch 2"],
  "dinners": ["dinner 1", "dinner 2"],
  "additional_tips": ["tip 1", "tip 2"]
}
`;

    try {
        const response = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        console.log("AI Raw Response:", response);

        const responseText = response?.response?.text();
        if (!responseText) throw new Error("No response from AI.");

        console.log("Response Text:", responseText);

        // Clean and parse JSON from AI response
        const cleanJsonString = responseText.replace(/```json|```/g, "").trim();
        const recommendations = JSON.parse(cleanJsonString);
        return recommendations;

    } catch (error) {
        console.error("AI Error:", error);
        return { error: "Failed to generate recommendations." };
    }
}

// POST API to handle form submission
app.post("/recommendations", async (req, res) => {
    console.log("Request received:", req.body);
    const recommendations = await generateRecommendation(req.body);
    console.log("Recommendations:", recommendations);
    res.json({ recommendations });
});

// Start server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const path = require("path");

const app = express();
const port = 3000;

// Secure API Key
const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Function to generate recommendations
async function generateRecommendation(dietaryPreferences, fitnessGoals, lifestyleFactors, dietaryRestrictions, healthConditions, userQuery) {
    const prompt = `
    Can you suggest a comprehensive plan that includes diet and workout options for better fitness?
    Dietary Preferences: ${dietaryPreferences}
    Fitness Goals: ${fitnessGoals}
    Lifestyle Factors: ${lifestyleFactors}
    Dietary Restrictions: ${dietaryRestrictions}
    Health Conditions: ${healthConditions}
    User Query: ${userQuery}

    Provide(create separate sections for below points and give 3-5 points for each sections, additional detail should not exceed above 5 points):
    - diet recommendations
    - workout options
    - breakfast ideas
    - lunch options
    - dinner options
    - Additional tips (snacks, supplements, hydration)

    Use clear section headings.
    `;

    try {
        const response = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const responseText = response.response?.text() || "No response from the model.";
        // console.log("AI Response:", responseText);
        return responseText;
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return "Error generating recommendations.";
    }
}

// Routes
app.get("/", (req, res) => {
    res.render("index", { recommendations: null });
});

app.post("/recommendations", async (req, res) => {
    const { dietary_preferences, fitness_goals, lifestyle_factors, dietary_restrictions, health_conditions, user_query } = req.body;

    const recommendationsText = await generateRecommendation(
        dietary_preferences,
        fitness_goals,
        lifestyle_factors,
        dietary_restrictions,
        health_conditions,
        user_query
    );

    // Define sections and expected output object
    const recommendations = {
        diet_types: [],
        workouts: [],
        breakfasts: [],
        lunches: [],
        dinners: [],
        additional_tips: []
    };

    // console.log("Response Text:", recommendationsText);

    // Define section mappings
    const sections = {
        "Diet Recommendations": "diet_types",
        "Workout Options": "workouts",
        "Breakfast Ideas": "breakfasts",
        "Lunch Options": "lunches",
        "Dinner Options": "dinners",
        "Additional Tips": "additional_tips"
    };

    let currentSection = null;

    // Split response by lines
    const lines = recommendationsText.split("\n");

    lines.forEach((line) => {
        line = line.trim();

        // Check if line is a section header
        Object.keys(sections).forEach(section => {
            if (line.toLowerCase().includes(section.toLowerCase())) {
                currentSection = sections[section];
            }
        });

        // If current section is set and line contains meaningful text, add it
        if (currentSection && line && !Object.keys(sections).some(sec => line.includes(sec))) {
            // Remove bullets, numbers, extra spaces, and markdown formatting (**bold**, *italics*)
            const cleanedLine = line.replace(/^[-•\d.]+\s*/, "") // Remove list markers
                .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove **bold**
                .replace(/\*([^*]+)\*/g, "$1") // Remove *italics*
                .trim();
            if (cleanedLine) recommendations[currentSection].push(cleanedLine);
        }
    });


    // console.log("Parsed Recommendations:", recommendations);
    res.render("recommendations", { recommendations });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

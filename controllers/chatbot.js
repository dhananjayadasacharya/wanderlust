const { GoogleGenerativeAI } = require("@google/generative-ai");
const Listing = require("../models/listing.js");

// Initialize the AI model with updated model name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatbotSearch = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { query } = req.body;
        
        if (!query || query.trim() === '') {
            console.log("No query provided");
            return res.json({ error: "Please provide a search query", success: false });
        }

        console.log("Processing query:", query);

        // Get all listings from database
        const allListings = await Listing.find({});
        
        let filteredListings = [];
        let analysisDescription = "Results based on your search";

        try {
            // Try AI analysis first
            const prompt = `
            You are a travel assistant. Based on the user's description: "${query}", 
            analyze what type of vacation place they're looking for and return ONLY a valid JSON response with:
            {
                "keywords": ["list", "of", "relevant", "keywords"],
                "location_preferences": ["any", "location", "hints"],
                "type": "beach/mountain/city/adventure/romantic/family/budget/luxury",
                "description": "Brief description of what they're looking for"
            }
            
            Return only the JSON object, no markdown formatting, no code blocks, no additional text.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let responseText = response.text().trim();
            
            // Clean up the response - remove markdown code blocks if present
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            
            console.log("AI Response:", responseText);
            
            const aiAnalysis = JSON.parse(responseText);

            // Filter listings based on AI analysis
            filteredListings = allListings.filter(listing => {
                const title = listing.title.toLowerCase();
                const description = listing.description ? listing.description.toLowerCase() : '';
                const location = listing.location.toLowerCase();
                const country = listing.country.toLowerCase();
                
                // Check for keyword matches
                const keywordMatch = aiAnalysis.keywords.some(keyword => 
                    title.includes(keyword.toLowerCase()) || 
                    description.includes(keyword.toLowerCase()) ||
                    location.includes(keyword.toLowerCase()) ||
                    country.includes(keyword.toLowerCase())
                );

                // Check for location preferences
                const locationMatch = aiAnalysis.location_preferences.some(loc => 
                    location.includes(loc.toLowerCase()) || 
                    country.includes(loc.toLowerCase())
                );

                return keywordMatch || locationMatch;
            });

            analysisDescription = `Smart search found ${filteredListings.length} matches: ${aiAnalysis.description}`;
            console.log("AI search successful, found:", filteredListings.length);

        } catch (aiError) {
            console.log("AI analysis failed, using fallback search:", aiError.message);
            
            // Fallback: Simple keyword search
            const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
            filteredListings = allListings.filter(listing => {
                const title = listing.title.toLowerCase();
                const description = listing.description ? listing.description.toLowerCase() : '';
                const location = listing.location.toLowerCase();
                const country = listing.country.toLowerCase();
                
                return searchTerms.some(term => 
                    title.includes(term) || 
                    description.includes(term) ||
                    location.includes(term) ||
                    country.includes(term)
                );
            });

            analysisDescription = `Found ${filteredListings.length} results matching "${query}"`;
            console.log("Fallback search completed, found:", filteredListings.length);
        }

        res.json({
            success: true,
            analysis: { description: analysisDescription },
            listings: filteredListings,
            totalFound: filteredListings.length
        });

    } catch (error) {
        console.error("Search error:", error);
        res.json({ 
            error: "Sorry, I couldn't process your request. Please try again.",
            success: false 
        });
    }
};

module.exports = {
    chatbotSearch
};

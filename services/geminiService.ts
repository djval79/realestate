
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Property, PropertyAnalysisReport, Lead, AIEmail, AIInsightsReport, ClickData, Conversion, AITipSuggestion, AIStrategicPlan, Language } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const prompts = {
    en: {
        chatSystemInstruction: `
            You are a savvy real estate marketing expert specializing in creating viral social media content.
            Your goal is to help the user craft the perfect social media post to promote an investment property.
            You must follow these instructions for all responses:
            1.  Incorporate relevant emojis to make the post visually appealing.
            2.  Highlight the key metrics: ROI, location, and minimum investment.
            3.  Subtly weave in property details like type, bedrooms, and area.
            4.  Include a strong call to action, prompting users to invest using the provided referral link.
            5.  Mention that the property is "AI-vetted" by Realiste.
            6.  The final output should be only the text for the social media post. Do not add any introductory text like "Here is the post:".
        `,
        initialChatMessage: "Generate an enthusiastic and visually appealing post suitable for Instagram.",
        analysisPrompt: `
            As a senior real estate investment analyst at Realiste, create a concise yet insightful investment analysis for the following property.
            The analysis should be structured for a potential investor who is smart but busy. Use clear, confident language.
        `,
        emailPrompt: `
            As a friendly and professional real estate advisor, write a follow-up email to a new lead.
            The goal is to be helpful and provide immediate value by suggesting a top-performing property.
            Your tone should be welcoming, knowledgeable, and not overly salesy.
            You must generate a response with a 'subject' and a 'body'.
        `,
        insightsPrompt: `
            As an expert marketing data analyst, review the following performance data for a real estate referrer.
            Provide a concise, insightful report that identifies strengths, opportunities, and actionable advice.
            Your tone should be encouraging and strategic.
        `,
        proactiveTipPrompt: `
            You are a proactive assistant AI for a real estate referral marketing web application.
            Your goal is to analyze the user's performance data and provide ONE SINGLE, highly relevant, and actionable tip to help them succeed.
            Do not be generic. Base your tip on the provided data.
            If no tip is particularly relevant or timely right now, you MUST set "shouldShow" to false.
        `,
        strategicPlanPrompt: `
            You are an expert financial and marketing strategist for real estate referrers.
            Your task is to create a motivational and actionable 4-week plan to help a user achieve their monthly earnings goal.
            The plan should be realistic, building momentum over the month.
            Base your advice on the user's data. If they have a top-earning property, leverage that.
            Focus on key activities: generating content, capturing leads, and following up.
            Be specific. Instead of "generate content", suggest "generate 3 new posts for your top property, focusing on its high ROI."
            Keep the tone encouraging, like a personal coach.
        `
    },
    es: {
        chatSystemInstruction: `
            Eres un experto en marketing inmobiliario especializado en crear contenido viral para redes sociales.
            Tu objetivo es ayudar al usuario a crear la publicación perfecta en redes sociales para promocionar una propiedad de inversión.
            Debes seguir estas instrucciones en todas tus respuestas:
            1.  Incorpora emojis relevantes para que la publicación sea visualmente atractiva.
            2.  Destaca las métricas clave: ROI, ubicación e inversión mínima.
            3.  Menciona sutilmente detalles de la propiedad como tipo, habitaciones y área.
            4.  Incluye una fuerte llamada a la acción, animando a los usuarios a invertir usando el enlace de referido proporcionado.
            5.  Menciona que la propiedad está "evaluada por IA" por Realiste.
            6.  La salida final debe ser solo el texto para la publicación en redes sociales. No añadas texto introductorio como "Aquí está la publicación:".
        `,
        initialChatMessage: "Genera una publicación entusiasta y visualmente atractiva, adecuada para Instagram.",
        analysisPrompt: `
            Como analista senior de inversiones inmobiliarias en Realiste, crea un análisis de inversión conciso pero perspicaz para la siguiente propiedad.
            El análisis debe estar estructurado para un inversor potencial que es inteligente pero está ocupado. Usa un lenguaje claro y seguro.
        `,
        emailPrompt: `
            Como un asesor inmobiliario amigable y profesional, escribe un correo electrónico de seguimiento a un nuevo lead.
            El objetivo es ser útil y proporcionar valor inmediato sugiriendo una propiedad de alto rendimiento.
            Tu tono debe ser acogedor, experto y no demasiado comercial.
            Debes generar una respuesta con un 'asunto' y un 'cuerpo'.
        `,
        insightsPrompt: `
            Como experto analista de datos de marketing, revisa los siguientes datos de rendimiento para un referidor de bienes raíces.
            Proporciona un informe conciso y perspicaz que identifique fortalezas, oportunidades y consejos accionables.
            Tu tono debe ser alentador y estratégico.
        `,
        proactiveTipPrompt: `
            Eres una IA de asistente proactivo para una aplicación web de marketing de referidos inmobiliarios.
            Tu objetivo es analizar los datos de rendimiento del usuario y proporcionar UN ÚNICO consejo, muy relevante y accionable, para ayudarle a tener éxito.
            No seas genérico. Basa tu consejo en los datos proporcionados.
            Si ningún consejo es particularmente relevante u oportuno en este momento, DEBES establecer "shouldShow" en falso.
        `,
        strategicPlanPrompt: `
            Eres un experto estratega financiero y de marketing para referidores inmobiliarios.
            Tu tarea es crear un plan de 4 semanas motivador y accionable para ayudar a un usuario a alcanzar su meta de ganancias mensuales.
            El plan debe ser realista, construyendo impulso a lo largo del mes.
            Basa tus consejos en los datos del usuario. Si tiene una propiedad con mayores ganancias, aprovéchala.
            Concéntrate en actividades clave: generar contenido, capturar leads y hacer seguimiento.
            Sé específico. En lugar de "generar contenido", sugiere "generar 3 nuevas publicaciones para tu propiedad principal, enfocándote en su alto ROI".
            Mantén un tono alentador, como un entrenador personal.
        `
    }
};

export class ContentChatService {
  private chat: Chat;
  private property: Property;
  private referralCode: string;
  private language: Language;

  constructor(property: Property, referralCode: string, language: Language) {
    this.property = property;
    this.referralCode = referralCode;
    this.language = language;
    this.chat = this.initializeChat();
  }

  private initializeChat(): Chat {
    const referralLink = `https://realiste.ai/?ref=${this.referralCode}`;
    const propertyDetailsLabel = this.language === 'es' ? 'Detalles de la Propiedad' : 'Property Details';
    
    const systemInstruction = `
      ${prompts[this.language].chatSystemInstruction}

      ${propertyDetailsLabel}:
      -   **Name:** ${this.property.name}
      -   **Location:** ${this.property.location}
      -   **Type:** ${this.property.type}
      -   **Bedrooms:** ${this.property.bedrooms}
      -   **Bathrooms:** ${this.property.bathrooms}
      -   **Area:** ${this.property.area} ${this.language === 'es' ? 'm²' : 'sq. ft.'}
      -   **Projected ROI:** ${this.property.roi}%
      -   **Minimum Investment:** $${this.property.minInvestment.toLocaleString()}
      -   **Referral Link:** ${referralLink}
    `;
    
    return ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 0.95,
        }
    });
  }

  public resetChat() {
    this.chat = this.initializeChat();
  }

  async startConversationStream(): Promise<AsyncGenerator<GenerateContentResponse, any, unknown>> {
    try {
        return await this.chat.sendMessageStream({ message: prompts[this.language].initialChatMessage });
    } catch (error) {
        console.error("Error starting streaming conversation with Gemini API:", error);
        throw new Error(this.language === 'es' ? "No se pudo generar el contenido de marketing inicial." : "Failed to generate initial marketing content.");
    }
  }

  async sendMessageStream(message: string): Promise<AsyncGenerator<GenerateContentResponse, any, unknown>> {
    try {
        return await this.chat.sendMessageStream({ message });
    } catch (error) {
        console.error("Error sending streaming message to Gemini API:", error);
        throw new Error(this.language === 'es' ? "No se pudo obtener respuesta de la IA. Por favor, inténtalo de nuevo." : "Failed to get response from AI. Please try again.");
    }
  }
}

export const generatePropertyImage = async (property: Property): Promise<string> => {
  const prompt = `A stunning, photorealistic architectural rendering of the exterior of "${property.name}", a luxury ${property.type} in ${property.location} with ${property.bedrooms} bedrooms. The style should be modern, aspirational, and high-end, with warm, inviting sunset lighting. Capture the essence of a prime real estate investment.`;

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    throw new Error("Failed to generate property image. Please try again.");
  }
};

export const generateHashtags = async (postContent: string, property: Property, language: Language): Promise<string[]> => {
    const prompt = language === 'es' ? `
        Basado en la siguiente publicación de redes sociales y detalles de la propiedad, genera una lista de 8-12 hashtags altamente relevantes y efectivos para la visibilidad en plataformas como Instagram y X.
        Los hashtags deben ser concisos, populares e incluir una mezcla de términos inmobiliarios generales, etiquetas específicas de la ubicación y palabras clave centradas en la inversión.
        Evita etiquetas demasiado genéricas como #inmobiliaria. Enfócate en un nicho. Devuelve el resultado como un array JSON de strings, sin el símbolo '#'.

        Contenido de la Publicación:
        "${postContent}"

        Detalles de la Propiedad:
        - Nombre: ${property.name}
        - Ubicación: ${property.location}
        - Tipo: ${property.type}, Propiedad de Inversión de Lujo
        - Habitaciones: ${property.bedrooms}
    ` : `
        Based on the following social media post and property details, generate a list of 8-12 highly relevant and effective hashtags for discoverability on platforms like Instagram and X.
        The hashtags should be concise, popular, and include a mix of general real estate terms, location-specific tags, and investment-focused keywords.
        Avoid overly generic tags like #realestate. Focus on a niche. Return the result as a JSON array of strings, without the '#' symbol.

        Social Media Post Content:
        "${postContent}"

        Property Details:
        - Name: ${property.name}
        - Location: ${property.location}
        - Type: ${property.type}, Luxury Investment Property
        - Bedrooms: ${property.bedrooms}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        hashtags: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: language === 'es' ? "Un solo hashtag de redes sociales, sin el símbolo '#'." : "A single social media hashtag, without the '#' symbol."
                            }
                        }
                    }
                },
                temperature: 0.5,
            }
        });

        const jsonResponse = JSON.parse(response.text);
        
        if (jsonResponse && jsonResponse.hashtags && Array.isArray(jsonResponse.hashtags)) {
            return jsonResponse.hashtags.map((tag: string) => `#${tag.replace(/#/g, '')}`);
        }
        return [];
    } catch (error) {
        console.error("Error generating hashtags with Gemini API:", error);
        return [];
    }
};

export const generatePropertyAnalysis = async (property: Property, language: Language): Promise<PropertyAnalysisReport> => {
    const prompt = `
        ${prompts[language].analysisPrompt}

        Property Details:
        - Name: ${property.name}
        - Location: ${property.location}
        - Type: ${property.type}
        - Bedrooms: ${property.bedrooms}
        - Bathrooms: ${property.bathrooms}
        - Area: ${property.area} sq. ft.
        - Projected ROI: ${property.roi}%
        - Minimum Investment: $${property.minInvestment.toLocaleString()}
        - Realiste Risk Score: ${property.riskScore}/10

        Generate a report with four sections: 'summary', 'marketSnapshot', 'riskBreakdown', and 'growthPotential'.
    `;

    const reportSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: "A compelling executive summary of the investment opportunity. Should be 1-2 sentences." },
            marketSnapshot: { type: Type.STRING, description: "Analysis of the local market, including demand drivers, recent trends, and why this location is attractive. 2-3 sentences." },
            riskBreakdown: { type: Type.STRING, description: `A qualitative explanation of the ${property.riskScore}/10 risk score. Mention factors contributing to the score (e.g., market volatility, property age, competition). 2-3 sentences.` },
            growthPotential: { type: Type.STRING, description: "Forward-looking analysis of growth drivers. Mention any upcoming infrastructure projects, demographic shifts, or market forecasts that support future appreciation. 2-3 sentences." }
        },
        required: ["summary", "marketSnapshot", "riskBreakdown", "growthPotential"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: reportSchema,
                temperature: 0.6,
            }
        });
        
        return JSON.parse(response.text) as PropertyAnalysisReport;

    } catch (error) {
        console.error("Error generating property analysis with Gemini API:", error);
        throw new Error(language === 'es' ? "No se pudo generar el informe de análisis de la IA." : "Failed to generate AI analysis report.");
    }
};

export const generateFollowUpEmail = async (lead: Lead, topProperty: Property, referralCode: string, language: Language): Promise<AIEmail> => {
    const referralLink = `https://realiste.ai/?ref=${referralCode}`;
    const prompt = `
        ${prompts[language].emailPrompt}

        Information to use:
        - Lead's Email: ${lead.email}
        - Suggested Property: ${topProperty.name}, a ${topProperty.bedrooms}-bedroom ${topProperty.type} in ${topProperty.location}.
        - Key Benefit: It has a projected ROI of ${topProperty.roi}%.
        - Your Referral Link: ${referralLink}
        
        Instructions:
        1.  Create a compelling but professional subject line.
        2.  In the body, start by thanking them for their interest.
        3.  Introduce yourself as their contact for AI-vetted real estate opportunities.
        4.  Subtly introduce the suggested property as a great example of what Realiste offers.
        5.  Include a call to action to view the property or learn more using your referral link.
        6.  Keep the email concise and easy to read. Sign off warmly.
    `;

    const emailSchema = {
        type: Type.OBJECT,
        properties: {
            subject: { type: Type.STRING, description: "The subject line of the email." },
            body: { type: Type.STRING, description: "The full body of the email, including greetings and sign-off. Use newline characters for paragraph breaks." }
        },
        required: ["subject", "body"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: emailSchema,
                temperature: 0.7,
            }
        });
        
        return JSON.parse(response.text) as AIEmail;

    } catch (error) {
        console.error("Error generating follow-up email with Gemini API:", error);
        throw new Error(language === 'es' ? "No se pudo generar el email de seguimiento de la IA." : "Failed to generate AI follow-up email.");
    }
};


export const generateDashboardInsights = async (
    analyticsData: {
        totalClicks: number;
        totalLeads: number;
        totalConversions: number;
        totalEarnings: number;
        topPropertyByClicks: Property | null;
        topPropertyByEarnings: Property | null;
    },
    language: Language
): Promise<AIInsightsReport> => {
    const prompt = `
        ${prompts[language].insightsPrompt}

        Performance Data Snapshot:
        - Total Clicks: ${analyticsData.totalClicks}
        - Total Leads Captured: ${analyticsData.totalLeads}
        - Total Conversions (Investments): ${analyticsData.totalConversions}
        - Total Referral Earnings: $${analyticsData.totalEarnings.toFixed(2)}
        - Top Property by Clicks: ${analyticsData.topPropertyByClicks?.name || 'N/A'}
        - Top Property by Earnings: ${analyticsData.topPropertyByEarnings?.name || 'N/A'}

        Generate a report with four sections:
        1.  'performanceSummary': A 1-2 sentence overview of the current performance.
        2.  'keyStrengths': A list of 2-3 bullet points highlighting what the user is doing well.
        3.  'opportunitiesForGrowth': A list of 2-3 bullet points identifying potential areas for improvement or growth.
        4.  'actionableTips': A list of 2-3 concrete, actionable tips the user can implement right away to improve their numbers.
    `;

    const insightsSchema = {
        type: Type.OBJECT,
        properties: {
            performanceSummary: { type: Type.STRING, description: "A high-level summary of performance." },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key strengths." },
            opportunitiesForGrowth: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of growth opportunities." },
            actionableTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of actionable tips." }
        },
        required: ["performanceSummary", "keyStrengths", "opportunitiesForGrowth", "actionableTips"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: insightsSchema,
                temperature: 0.7,
            }
        });
        
        return JSON.parse(response.text) as AIInsightsReport;

    } catch (error) {
        console.error("Error generating dashboard insights with Gemini API:", error);
        throw new Error(language === 'es' ? "No se pudo generar el análisis de rendimiento de la IA." : "Failed to generate AI performance insights.");
    }
};

export const generateProactiveTip = async (
    data: {
        referralCodeSet: boolean;
        totalClicks: number;
        totalLeads: number;
        totalConversions: number;
        totalEarnings: number;
        unconvertedLeads: Lead[];
        topPropertyByClicks: Property | null;
        savedContentCount: number;
    },
    dismissedTipIds: string[],
    language: Language
): Promise<AITipSuggestion | null> => {
    const prompt = `
        ${prompts[language].proactiveTipPrompt}

        USER'S CURRENT DATA:
        - Referral Code Set: ${data.referralCodeSet}
        - Total Clicks: ${data.totalClicks}
        - Total Leads: ${data.totalLeads}
        - Total Conversions: ${data.totalConversions}
        - Total Earnings: $${data.totalEarnings.toFixed(2)}
        - Number of Unconverted Leads: ${data.unconvertedLeads.length}
        - Newest Unconverted Lead Email: ${data.unconvertedLeads[0]?.email || 'N/A'}
        - Top Performing Property (by clicks): ${data.topPropertyByClicks?.name || 'N/A'}
        - Saved Content Library Items: ${data.savedContentCount}
        - Previously Dismissed Tip IDs: ${JSON.stringify(dismissedTipIds)}

        AVAILABLE ACTIONS:
        1.  actionType: "compose_email" -> Requires 'actionPayloadId' to be the lead's email string.
        2.  actionType: "generate_content" -> Requires 'actionPayloadId' to be the property's id string.
        3.  actionType: "navigate" -> Requires 'actionPayloadId' to be the view name ('dashboard' or 'settings').
        4.  actionType: "none" -> No action needed.

        ANALYSIS & RESPONSE:
        - Review the data. Find the single most important action the user should take right now.
        - High priority: If referral code is not set but they have clicks/leads, tell them to set it.
        - Medium priority: If there's a new unconverted lead, suggest following up.
        - Low priority: If they are idle, suggest generating content for a top property.
        - Do not suggest a tip if its ID is in the 'Dismissed Tip IDs' list.
        - If you decide on a tip, set "shouldShow" to true and fill out all other fields.
        - If no tip is needed, set "shouldShow" to false and other fields can be empty.
    `;

    const tipSchema = {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "A unique ID for the tip suggestion, e.g., 'follow_up_lead_abc@test.com' or 'set_referral_code'." },
            shouldShow: { type: Type.BOOLEAN, description: "Set to true if a relevant tip is found, otherwise false." },
            message: { type: Type.STRING, description: "The concise, helpful message to show the user." },
            actionLabel: { type: Type.STRING, description: "The text for the action button, e.g., 'Compose Email'." },
            actionType: { type: Type.STRING, description: "One of: 'compose_email', 'generate_content', 'navigate', 'none'." },
            actionPayloadId: { type: Type.STRING, description: "The ID needed for the action (lead email, property id, or view name). Optional." }
        },
        required: ["id", "shouldShow", "message", "actionLabel", "actionType"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: tipSchema,
                temperature: 0.8,
            }
        });

        const suggestion = JSON.parse(response.text) as AITipSuggestion;
        if (suggestion.shouldShow && !dismissedTipIds.includes(suggestion.id)) {
            return suggestion;
        }
        return null;

    } catch (error) {
        console.error("Error generating proactive tip with Gemini API:", error);
        return null;
    }
};

export const generateStrategicPlan = async (
    goal: number,
    analytics: {
        totalEarnings: number;
        totalConversions: number;
        topPropertyByEarnings: Property | null;
    },
    language: Language
): Promise<AIStrategicPlan> => {
    const prompt = `
        ${prompts[language].strategicPlanPrompt}

        USER'S DATA:
        - Monthly Earnings Goal: $${goal.toLocaleString()}
        - Current Monthly Earnings: $${analytics.totalEarnings.toLocaleString()}
        - Total Conversions this Month: ${analytics.totalConversions}
        - Top Earning Property: ${analytics.topPropertyByEarnings?.name || 'N/A'} (Location: ${analytics.topPropertyByEarnings?.location || 'N/A'})
    `;
    
    const weekPlanSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "A short, motivational title for the week." },
            actions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 concrete actions for the week." }
        },
        required: ["title", "actions"]
    };

    const planSchema = {
        type: Type.OBJECT,
        properties: {
            week1: weekPlanSchema,
            week2: weekPlanSchema,
            week3: weekPlanSchema,
            week4: weekPlanSchema,
        },
        required: ["week1", "week2", "week3", "week4"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: planSchema,
                temperature: 0.7,
            }
        });
        
        return JSON.parse(response.text) as AIStrategicPlan;

    } catch (error) {
        console.error("Error generating strategic plan with Gemini API:", error);
        throw new Error(language === 'es' ? "No se pudo generar el plan estratégico de la IA." : "Failed to generate AI strategic plan.");
    }
};

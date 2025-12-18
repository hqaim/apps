import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- UTILITIES ---
export const generateText = async (prompt: string, model: string = 'gemini-2.5-flash'): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7, // Slightly creative
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Text API Error:", error);
    throw new Error("Failed to generate text content. Check API Key or connection.");
  }
};

export const enhanceImagePrompt = async (rawPrompt: string): Promise<string> => {
  const systemPrompt = `
    You are an expert AI Art Curator and Prompt Engineer (specializing in Midjourney/DALL-E styles).
    TASK: Upgrade the following user prompt into a highly detailed, professional image generation prompt.
    
    USER PROMPT: "${rawPrompt}"
    
    REQUIREMENTS:
    1. Add details about lighting (e.g., volumetric, cinematic, studio).
    2. Add details about camera/lens (e.g., 85mm, f/1.8, wide angle).
    3. Add details about style/texture (e.g., octane render, hyper-realistic, 8k).
    4. Keep the core subject clear.
    5. Output ONLY the enhanced prompt string. No intro/outro text.
  `;
  
  try {
    const text = await generateText(systemPrompt);
    return text.trim();
  } catch (e) {
    return rawPrompt; // Fallback to original if fails
  }
};

// --- LOGO FORGE ENGINES ---

// Engine 1: Vector (SVG Code)
export const generateLogo = async (brandName: string, industry: string, style: string, colors: string, type: string): Promise<string> => {
  const prompt = `
    Act as a Senior Brand Identity Designer.
    
    TASK: Create a professional Vector Logo (SVG) for a client.
    
    CLIENT BRIEF:
    - Brand Name: "${brandName}"
    - Industry: "${industry}"
    - Design Style: "${style}"
    - Logo Type: "${type}" (e.g., Abstract Mark, Letterform, Emblem, Combination)
    - Color Palette: "${colors}"

    DESIGN RULES:
    1. COMPOSITION: Use a 500x500 viewBox. Center the main element.
    2. SHAPES: Use geometric precision. Use <path>, <circle>, <rect> with clean coordinates.
    3. SOPHISTICATION: Use <defs> and <linearGradient> to add depth if the style implies it. Use opacity for layering.
    4. TYPOGRAPHY: If text is included, use modern sans-serif fonts (Arial, Helvetica, system-ui) or geometric custom paths for letters.
    5. BACKGROUND: Do NOT include a background rectangle. Keep it transparent.
    
    OUTPUT FORMAT:
    - Return ONLY valid XML SVG code.
    - Start with <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">.
    - End with </svg>.
    - NO markdown blocks (\`\`\`). NO explanations.
  `;
  
  const text = await generateText(prompt);
  
  const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
  if (svgMatch) return svgMatch[0];
  
  const cleaned = text.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
  if (cleaned.includes('<svg')) return cleaned;

  throw new Error("Model generated invalid SVG data.");
};

// Engine 2: Concept (Raster Image)
export const generateLogoConcept = async (brandName: string, style: string, description: string): Promise<string> => {
  const prompt = `
    Professional logo design for brand "${brandName}".
    Style: ${style}.
    Description: ${description}.
    
    Requirements:
    - High contrast, vector-like aesthetic.
    - Centered composition.
    - White background (for easy removal) or dark background if neon style.
    - High quality, 4k, Behance portfolio quality.
    - Minimal text artifacts.
  `;
  
  return generateImage(prompt, "1:1");
};

// --- SITE ARCHITECT & EVENT HORIZON ---
export interface SiteConfig {
  hasThreeJs: boolean;
  hasAnimations: boolean;
  structure: string; // 'Bento Grid', 'Parallax', 'Single Page'
}

export const generateHtml = async (
  type: 'website' | 'flyer', 
  name: string, 
  description: string, 
  theme: string,
  config?: SiteConfig
): Promise<string> => {
  
  let techStackPrompt = "";
  if (config?.hasThreeJs) {
    techStackPrompt += `
    - INTEGRATE THREE.JS: You MUST use Three.js via CDN (https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js).
    - CREATE A 3D HERO: Build a scene in a <canvas> or container id="canvas-container" that features a rotating 3D geometry (Icosahedron, TorusKnot, or Particles) relevant to the theme "${theme}".
    - ENSURE it handles window resize.
    - PLACEMENT: Put 3D scripts at the end of <body>.
    `;
  }
  if (config?.hasAnimations) {
    techStackPrompt += `
    - INTEGRATE GSAP: Use GSAP via CDN (https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js) and ScrollTrigger.
    - Animate elements as they scroll into view (fade-up, slide-in).
    `;
  }

  const prompt = `
    Act as an Awwwards-winning Creative Developer.
    Task: Build a SINGLE-FILE HTML solution for a ${type}.
    
    Project: "${name}"
    Description: "${description}"
    Theme: "${theme}"
    Structure: "${config?.structure || 'Modern Landing Page'}"
    
    REQUIREMENTS:
    1. Structure: <!DOCTYPE html> <html lang="en"> <head> ... </head> <body class="..."> ... </body> </html>
    2. CSS: Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
    3. DESIGN: 
       - Use "Glassmorphism" (backdrop-blur, bg-opacity) if fits theme.
       - Use modern typography (Inter, Space Grotesk).
       - Ensure high contrast.
       - CRITICAL: Add a background color class to the <body> tag (e.g. bg-white, bg-slate-900, bg-zinc-950) so the page is not transparent.
    4. IMAGERY: Use reliable placeholders. 
       - For backgrounds/photos: "https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/600"
       - For avatars: "https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}"
    ${techStackPrompt}
    5. OUTPUT FORMAT: 
       - Return ONLY the raw HTML code. 
       - Do NOT wrap in markdown backticks (no \`\`\`html). 
       - Do NOT include conversational filler.
  `;
  
  const text = await generateText(prompt, 'gemini-2.5-flash');
  return extractHtml(text);
};

export const refineHtml = async (currentHtml: string, instruction: string): Promise<string> => {
  const prompt = `
    You are an expert Frontend Developer.
    TASK: Modify the following HTML code based strictly on the user's request.
    
    USER REQUEST: "${instruction}"
    
    CONTEXT:
    - The HTML uses Tailwind CSS.
    - Maintain all existing functionality (Three.js, GSAP) unless asked to remove.
    - If changing colors, use Tailwind classes (e.g., bg-red-500, text-blue-200).
    
    CURRENT HTML CODE:
    ${currentHtml}
    
    OUTPUT RULES:
    1. Return the COMPLETE, VALID, UPDATED HTML.
    2. Do NOT truncate the code.
    3. Output ONLY the raw HTML.
  `;
  
  const text = await generateText(prompt, 'gemini-2.5-flash');
  return extractHtml(text);
};

// Helper to reliably extract HTML from LLM response
const extractHtml = (text: string): string => {
  let clean = text.replace(/```html/gi, '').replace(/```/g, '');
  const firstTag = clean.indexOf('<!DOCTYPE html>');
  const lastTag = clean.lastIndexOf('</html>');
  
  if (firstTag !== -1 && lastTag !== -1) {
    return clean.substring(firstTag, lastTag + 7);
  }
  const htmlTag = clean.indexOf('<html');
  if (htmlTag !== -1 && lastTag !== -1) {
     return clean.substring(htmlTag, lastTag + 7);
  }
  return clean.trim();
};

// --- COPY PRO ---
export const generateCopy = async (
  format: string, 
  topic: string, 
  tone: string, 
  framework: string, 
  audience: string
): Promise<string> => {
  const prompt = `
    Act as a World-Class Copywriter.
    
    Task: Write "${format}" content.
    Topic: "${topic}"
    Target Audience: "${audience}"
    Tone: "${tone}"
    Marketing Framework: Use the "${framework}" method (e.g., if AIDA: Attention, Interest, Desire, Action).
    
    Output Formatting:
    - Use Markdown.
    - Use Bold for emphasis.
    - Use Emojis where appropriate.
    - Break into short, punchy paragraphs.
  `;
  return await generateText(prompt, 'gemini-2.5-flash');
};

// --- SOCIAL VIRAL HOOKS ---
export const generateViralHooks = async (niche: string, platform: string): Promise<string[]> => {
  const prompt = `
    You are a Viral Social Media Strategist.
    Generate 4 "Scroll-Stopping" Hooks/Ideas for the niche: "${niche}" on platform: "${platform}".
    
    Criteria:
    1. Psychological Triggers: Use FOMO, Contrarian views, or Curiosity gaps.
    2. Format: Short, punchy sentences.
    3. Output: Return ONLY a JSON array of strings. Example: ["Stop doing X", "I tried Y so you don't have to", "The secret to Z"].
    Do not use markdown formatting like \`\`\`json. Just the raw array.
  `;
  
  try {
    const text = await generateText(prompt, 'gemini-2.5-flash');
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    if (cleanText.startsWith('[')) {
      return JSON.parse(cleanText);
    }
    return cleanText.split('\n').filter(line => line.length > 5).slice(0, 4);
  } catch (e) {
    return [
      `The #1 Mistake people make in ${niche}`,
      `How to master ${niche} in 30 days`,
      `Unpopular opinion about ${niche}`,
      `Tools I use for ${niche} that feel illegal to know`
    ];
  }
};

// --- PIXEL GEN ---
export const generateImage = async (prompt: string, aspectRatio: string = "1:1"): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

// --- MOTION ADS (VEO) ---
export const generateVideo = async (prompt: string): Promise<string> => {
  const veOAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    let operation = await veOAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await veOAi.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Video generation failed. No URI returned.");
    }

    return `${downloadLink}&key=${process.env.API_KEY}`;
  } catch (error) {
    console.error("Video Gen Error:", error);
    throw error;
  }
};
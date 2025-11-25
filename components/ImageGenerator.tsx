import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Image, Sparkles, Loader2, Download, AlertCircle } from 'lucide-react';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureApiKey = async () => {
    const w = window as any;
    if (w.aistudio) {
      const hasKey = await w.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await w.aistudio.openSelectKey();
      }
      return true;
    }
    // Fallback if not in the specific environment, relying on env var
    return !!process.env.API_KEY;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
        await ensureApiKey();
        
        // Always re-initialize to get the latest key selection
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Append "cartoon style" to make it kid-friendly
        const fullPrompt = `${prompt}. Children's book illustration style, colorful, friendly, cartoon.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: fullPrompt }],
            },
            config: {
                imageConfig: {
                    imageSize: imageSize,
                    aspectRatio: "1:1"
                }
            }
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64EncodeString: string = part.inlineData.data;
                    const imageUrl = `data:image/png;base64,${base64EncodeString}`;
                    setGeneratedImage(imageUrl);
                    break;
                }
            }
        } else {
            setError("Geen plaatje ontvangen. Probeer het nog eens.");
        }

    } catch (err: any) {
      console.error("Image gen error:", err);
      if (err.message && err.message.includes("Requested entity was not found")) {
          // Retry key selection
          const w = window as any;
          if (w.aistudio) await w.aistudio.openSelectKey();
          setError("Sleutel probleem. Probeer het opnieuw.");
      } else {
          setError("Er ging iets mis bij het tekenen. Misschien een ander woord proberen?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
       <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-stone-200">
          <div className="flex items-center gap-3 mb-4 text-emerald-600">
             <Image size={28} />
             <h2 className="text-2xl font-bold">Teken het!</h2>
          </div>
          <p className="text-stone-600 mb-6">
             Weet je niet hoe een <strong>dassenburcht</strong> of een <strong>fossiel</strong> eruit ziet? 
             Typ het woord en de tover-computer tekent het voor je!
          </p>

          <div className="space-y-4">
             <div>
                <label className="block text-sm font-bold text-stone-500 mb-2">Wat moet ik tekenen?</label>
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Bijv: een mijnwerker met een helm"
                  className="w-full p-4 text-lg border-2 border-stone-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                />
             </div>

             <div>
                <label className="block text-sm font-bold text-stone-500 mb-2">Hoe groot moet het plaatje zijn?</label>
                <div className="flex gap-4">
                  {(["1K", "2K", "4K"] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setImageSize(size)}
                      className={`flex-1 py-2 rounded-lg font-bold transition-all border-2 ${
                        imageSize === size 
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-800' 
                          : 'bg-white border-stone-200 text-stone-500 hover:border-emerald-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
             </div>

             <button 
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-transform active:scale-95"
             >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {loading ? 'Aan het toveren...' : 'Tover een plaatje!'}
             </button>

             {error && (
                 <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                 </div>
             )}
          </div>
       </div>

       {generatedImage && (
           <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-emerald-100 animate-fade-in">
              <img src={generatedImage} alt="Generated" className="w-full rounded-xl" />
              <div className="mt-4 flex justify-end">
                 <a 
                   href={generatedImage} 
                   download={`ondergronds-${prompt}.png`}
                   className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-bold"
                 >
                    <Download size={20} />
                    Opslaan
                 </a>
              </div>
           </div>
       )}
    </div>
  );
};
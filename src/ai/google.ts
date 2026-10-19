import { envData } from "@/vars";
import {
    type Content,
    FunctionCallingConfigMode,
    type FunctionDeclaration,
    type GenerateContentParameters,
    GoogleGenAI,
} from "@google/genai";
import { type EnumTool, type IAToolDefinitionGeneric, tools } from "./tools";

const toolsDeclaration: Record<
    EnumTool,
    FunctionDeclaration & { name: string }
> = {
    getFilms: {
        name: tools.getFilms.name,
        description: tools.getFilms.description,
        parametersJsonSchema: {
            type: "object",
            properties: {
                fechaInicio: {
                    type: "string",
                    description: "Fecha inicio",
                },
                fechaFinal: {
                    type: "string",
                    description: "Fecha final",
                },
            },
            required: ["fechaInicio", "fechaFinal"],
        },
    },
};

const ai = new GoogleGenAI({ apiKey: envData.GEMINI_API_KEY });

export default async function getAnalyticsFor(
    userPrompt: string,
    stream = false,
) {
    console.log("getanalytics");
    const modelToUse = "gemini-3.5-flash-lite"; // Asegúrate de usar un modelo compatible con tools

    const response = await ai.models.generateContent({
        model: modelToUse,
        contents: userPrompt,
        config: {
            toolConfig: {
                functionCallingConfig: {
                    mode: FunctionCallingConfigMode.ANY,
                    allowedFunctionNames: [toolsDeclaration.getFilms.name],
                },
            },
            tools: [{ functionDeclarations: [toolsDeclaration.getFilms] }],
        },
    });

    const calls = response.functionCalls;

    // Early Return 1: Si no hay llamadas a función, mostramos el texto y salimos
    if (!calls || calls.length === 0) {
        console.log("Respuesta de texto directo:", response.text);
        return;
    }

    console.log(`Se van a llamar a un total de ${calls.length} funciones`);

    const parts: Content["parts"] = [];

    for (let index = 0; index < calls.length; index++) {
        const call = calls[index];
        const tool: IAToolDefinitionGeneric = tools[call.name as EnumTool];
        if (typeof tool === "undefined") {
            continue;
        }
        console.log(`Ejecutando función ${call.name}`);
        const functionResult = await tool.execute(call.args);
        parts.push({
            functionResponse: {
                name: call.name,
                response: {
                    output: functionResult,
                },
            },
        });
    }

    const modelTurn = response.candidates?.[0]?.content || {
        role: "model",
        parts: calls.map((call) => ({ functionCall: call })),
    };

    const parametersAi: GenerateContentParameters = {
        model: modelToUse,
        contents: [
            {
                role: "model",
                parts: [
                    {
                        text: "Quiero que me respondas en formato markdown, siempre empieza la respuesta por un titulo h1 #, quiero respuestas bonitas",
                    },
                ],
            },
            {
                role: "user",
                parts: [{ text: userPrompt }],
            },
            modelTurn, // <- Aquí pasamos el turno completo del modelo con su firma intacta
            { role: "user", parts: parts },
        ],
        config: {
            tools: [{ functionDeclarations: [toolsDeclaration.getFilms] }],
        },
    };

    if (stream) {
        const res = await ai.models.generateContentStream(parametersAi);
        return res;
    }

    // Enviamos el resultado de vuelta a Gemini para obtener la respuesta final
    const finalResponse = await ai.models.generateContent(parametersAi);

    return finalResponse.text;
}

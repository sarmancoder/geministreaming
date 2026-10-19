import {
    type Content,
    FunctionCallingConfigMode,
    type GenerateContentParameters,
} from "@google/genai";
import { ai, modelToUse, toolsDeclaration } from ".";
import { type EnumTool, type IAToolDefinitionGeneric, tools } from "../tools";

export default async function getAnalyticsFor(
    userPrompt: string,
    stream = false,
) {
    console.log("getanalytics");

    const response = await ai.models.generateContent({
        model: modelToUse,
        contents: userPrompt,
        config: {
            toolConfig: {
                functionCallingConfig: {
                    mode: FunctionCallingConfigMode.ANY,
                    allowedFunctionNames: [
                        toolsDeclaration.getFilms.name,
                        toolsDeclaration.getYearRevenueByMonth.name,
                    ],
                },
            },
            tools: [
                {
                    functionDeclarations: [
                        toolsDeclaration.getFilms,
                        toolsDeclaration.getYearRevenueByMonth,
                    ],
                },
            ],
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

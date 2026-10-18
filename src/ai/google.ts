import queryPayments from "@/lib/queryPayments";
import { envData } from "@/vars";
import {
    GoogleGenAI,
    FunctionCallingConfigMode,
    FunctionDeclaration,
    GenerateContentParameters,
} from "@google/genai";

const GEMINI_API_KEY = envData.GEMINI_API_KEY;

const getFilmsFunctionName = "getFilms";

const getFilmsDeclaration: FunctionDeclaration = {
    name: getFilmsFunctionName,
    description: "Conseguir pagos de peliculas de una fecha A a una fecha B",
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
};

async function getFilms(args: any) {
    console.log("get_films...", args);
    return await queryPayments(args.fechaInicio, args.fechaFinal);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
                    allowedFunctionNames: [getFilmsFunctionName],
                },
            },
            tools: [{ functionDeclarations: [getFilmsDeclaration] }],
        },
    });

    const calls = response.functionCalls;

    // Early Return 1: Si no hay llamadas a función, mostramos el texto y salimos
    if (!calls || calls.length === 0) {
        console.log("Respuesta de texto directo:", response.text);
        return;
    }

    const call = calls[0];

    // Early Return 2: Si la función recibida no es la esperada, salimos
    if (call.name !== getFilmsFunctionName) {
        console.warn(`Llamada a función no reconocida: ${call.name}`);
        return;
    }

    // --- Flujo Principal Feliz ---
    console.log(
        `\nEl modelo solicitó la función: "${call.name}" con args:`,
        call.args,
    );

    const parameters = call.args as { fechaInicio: string; fechaFinal: string };
    console.log("Obteniendo peliculas");
    const functionResult = await getFilms(parameters);

    // SOLUCIÓN: Usamos el contenido exacto devuelto por el modelo (que incluye la firma interna)
    // El SDK almacena el bloque de contenido del modelo en `response.functionCalls` o podemos extraerlo de los candidatos.
    // Una forma limpia en el nuevo SDK es pasar la respuesta del modelo usando su estructura interna:
    const modelTurn = response.candidates?.[0]?.content || {
        role: "model",
        parts: [{ functionCall: call }],
    };

    const parametersAi: GenerateContentParameters = {
        model: modelToUse,
        contents: [
            {
                role: "user",
                parts: [{ text: userPrompt }],
            },
            modelTurn, // <- Aquí pasamos el turno completo del modelo con su firma intacta
            {
                role: "user",
                parts: [
                    {
                        functionResponse: {
                            name: call.name,
                            response: {
                                output: functionResult,
                            },
                        },
                    },
                ],
            },
        ],
        config: {
            tools: [{ functionDeclarations: [getFilmsDeclaration] }],
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

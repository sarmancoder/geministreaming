import { envData } from "@/vars";
import {
    type FunctionDeclaration,
    type GenerateContentResponse,
    GoogleGenAI,
} from "@google/genai";
import { type EnumTool, tools } from "../tools";
import getAnalyticsFor from "./getAnalyticsFor";
import type IAFunctions from "../IAFunctions";
// import getRevenueByMonth from "./getRevenueByMonth";

export const toolsDeclaration: Record<
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
    getYearRevenueByMonth: {
        name: tools.getYearRevenueByMonth.name,
        description: tools.getYearRevenueByMonth.description,
        parametersJsonSchema: {
            type: "object",
            properties: {
                year: {
                    type: "number",
                    description: "Filtro de año de ingresos",
                },
            },
            required: ["year"],
        },
    },
};

export const ai = new GoogleGenAI({ apiKey: envData.GEMINI_API_KEY });

export const modelToUse = "gemini-3.5-flash-lite";

export const googleFunctions: IAFunctions<
    AsyncGenerator<GenerateContentResponse>
> = {
    getAnalyticsFor: getAnalyticsFor as any,
    // getRevenueByMonth: getRevenueByMonth,
};

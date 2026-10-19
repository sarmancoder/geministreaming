import queryPayments from "@/lib/queryPayments";
import yearRevenueByMonth from "@/lib/yearRevenueByMonth";

export type IAToolDefinitionGeneric = {
    name: string;
    description: string;
    execute: (args: any) => any;
};

export const tools: Record<string, IAToolDefinitionGeneric> = {
    getFilms: {
        name: "getFilms",
        description:
            "Conseguir pagos de peliculas de una fecha A a una fecha B",
        async execute(args: { fechaInicio: string; fechaFinal: string }) {
            return await queryPayments(args.fechaInicio, args.fechaFinal);
        },
    },
    getYearRevenueByMonth: {
        name: "getYearRevenueByMonth",
        description: "Ver ingresos por mes",
        async execute(args: { year: number }) {
            return await yearRevenueByMonth(args.year);
        },
    },
};

export type EnumTool = keyof typeof tools;

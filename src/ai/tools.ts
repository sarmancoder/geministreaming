import queryPayments from "@/lib/queryPayments";

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
};

export type EnumTool = keyof typeof tools;

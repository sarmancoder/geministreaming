"use client";

import { promptDB } from "@/actions/prompt";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Form } from "@base-ui/react";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useAppDispatch } from "@/store/hooks";
import { addToResponse, setResponse } from "@/store/responses";

const testPrompt =
    "Cuales son las peliculas mas adquiridas en la primera semana del mes de julio de 2005";

export function PromptForm() {
    const dispatch = useAppDispatch();
    return (
        <Form
            onSubmit={async (ev) => {
                ev.preventDefault();

                const formData = new FormData(ev.target);
                const data = Object.fromEntries<any>(formData.entries());

                console.log(data);
                // const response = await promptDB(data.prompt);

                const response = await fetch("/api/prompt", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // 'Authorization': 'Bearer token'
                    },
                    body: JSON.stringify({ prompt: data.prompt }),
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                console.dir(response);

                if (response.body instanceof ReadableStream) {
                    dispatch(setResponse(""));
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    while (true) {
                        const { value, done } = await reader.read();

                        if (done) break;

                        // Decodificamos el chunk recibido y lo añadimos al estado
                        const chunkText = decoder.decode(value, {
                            stream: true,
                        });
                        console.log(chunkText);
                        dispatch(addToResponse(chunkText));
                    }

                    return;
                }

                const dataResponse = await response.json();
                console.log("data:", dataResponse);

                dispatch(
                    setResponse(
                        dataResponse.data ?? "No se ha obtenido respuesta",
                    ),
                );
            }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Consultar a la IA</CardTitle>
                </CardHeader>
                <CardContent>
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                        <Input name="prompt" defaultValue={testPrompt} />
                    </Field>
                </CardContent>
                <CardFooter>
                    <Field
                        orientation="horizontal"
                        className="flex justify-end"
                    >
                        <Button type="submit">Submit</Button>
                    </Field>
                </CardFooter>
            </Card>
        </Form>
    );
}

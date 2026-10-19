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
import {
    addQuestion,
    addResponse,
    addToLastResponse,
    addToResponse,
    selectChatLines,
    setResponse,
} from "@/store/responses";
import { useState } from "react";
import { useSelector } from "react-redux";

const testPrompt =
    "Cuales son las peliculas mas adquiridas en la primera semana del mes de julio de 2005";

export function PromptForm() {
    const dispatch = useAppDispatch();
    const lines = useSelector(selectChatLines);
    const [unable, setUnable] = useState(false);
    return (
        <Form
            onSubmit={async (ev) => {
                ev.preventDefault();

                const formData = new FormData(ev.target);
                const data = Object.fromEntries<any>(formData.entries());

                console.log(data);
                setUnable(true);
                // const response = await promptDB(data.prompt);

                try {
                    dispatch(addQuestion(data.prompt));
                    const response = await fetch("/api/prompt", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            // 'Authorization': 'Bearer token'
                        },
                        body: JSON.stringify({
                            prompt: data.prompt,
                            lines: lines.filter(
                                (a) =>
                                    a.type === "question" ||
                                    a.type === "response",
                            ),
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }

                    console.dir(response);

                    if (response.body instanceof ReadableStream) {
                        dispatch(addResponse(""));
                        const reader = response.body.getReader();
                        const decoder = new TextDecoder();
                        while (true) {
                            const { value, done } = await reader.read();

                            if (done) {
                                console.log("done", done);
                                break;
                            }

                            // Decodificamos el chunk recibido y lo añadimos al estado
                            const chunkText = decoder.decode(value, {
                                stream: true,
                            });
                            console.log(chunkText);
                            dispatch(addToLastResponse(chunkText));
                        }
                        setUnable(false);

                        return;
                    }

                    const dataResponse = await response.json();
                    console.log("data:", dataResponse);

                    dispatch(
                        setResponse(
                            dataResponse.data ?? "No se ha obtenido respuesta",
                        ),
                    );
                } catch (error) {
                    console.log(error);
                    dispatch(setResponse(" > Hubo un error"));
                } finally {
                    console.log("finally");
                    setUnable(false);
                }
            }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Consultar a la IA</CardTitle>
                </CardHeader>
                <CardContent>
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                        <Input
                            name="prompt"
                            disabled={unable}
                            defaultValue={testPrompt}
                        />
                    </Field>
                </CardContent>
                <CardFooter>
                    <Field
                        orientation="horizontal"
                        className="flex justify-end"
                    >
                        <Button type="submit" disabled={unable}>
                            Submit
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </Form>
    );
}

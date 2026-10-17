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

export function PromptForm() {
    return (
        <Form
            onSubmit={async (ev) => {
                ev.preventDefault();

                const formData = new FormData(ev.target);
                const data = Object.fromEntries(formData.entries());

                console.log(data);
                await promptDB(
                    "Cuales son las peliculas mas adquiridas en la primera semana del mes de julio de 2005",
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
                        <Input name="prompt" />
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

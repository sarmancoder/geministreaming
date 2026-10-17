"use client";

import { promptDB } from "@/actions/propmt";
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
                await promptDB();
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

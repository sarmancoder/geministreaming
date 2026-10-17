"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Form } from "@base-ui/react";

export function PromptForm() {
    return (
        <Form
            onSubmit={(ev) => {
                ev.preventDefault();

                const formData = new FormData(ev.target);
                const data = Object.fromEntries(formData.entries());

                console.log(data);
            }}
        >
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                    <Input name="prompt" />
                </Field>
                <Field orientation="horizontal">
                    <Button type="submit">Submit</Button>
                </Field>
            </FieldGroup>
        </Form>
    );
}

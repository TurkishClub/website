"use client";

import React, {useState} from "react";
import {useTranslations} from 'next-intl';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const ContactSchema = z.object({
    name: z.string().min(2, {message: "Please enter your full name."}),
    email: z.string().email({message: "Please enter a valid email."}),
    subject: z.string().max(120).optional().or(z.literal("")),
    message: z.string().min(10, {message: "Please provide at least 10 characters."}),
});

type ContactValues = z.infer<typeof ContactSchema>;

export default function Contact() {
    const t = useTranslations('contact');
    const [serverError, setServerError] = useState<string | null>(null);
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);

    const form = useForm<ContactValues>({
        resolver: zodResolver(ContactSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
        mode: "onTouched",
    });

    const onSubmit = async (values: ContactValues) => {
        setServerError(null);
        setServerSuccess(null);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    message: values.message,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || "Failed to send message.");
            }
            setServerSuccess("Message sent successfully!");
            form.reset();
        } catch (err: any) {
            setServerError(err.message || "Something went wrong.");
        }
    };

    return (
        <section className="py-32 bg-[#C61E1E] text-white">
            <div className="mx-auto flex flex-col justify-between gap-10 lg:gap-20">
                <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
                    <div className="text-center lg:text-left">
                        <h1 className="mb-2 text-5xl font-bold lg:mb-1 lg:text-6xl">
                            {t('title')}
                        </h1>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-3xl flex flex-col gap-6 rounded-lg border p-8 md:p-10 bg-white text-gray-900 shadow-lg">
                    {serverError && (
                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {serverError}
                        </div>
                    )}
                    {serverSuccess && (
                        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            {serverSuccess}
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your full name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="you@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="What is this about?" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Textarea rows={6} placeholder="Type your message here..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </section>
    );
}

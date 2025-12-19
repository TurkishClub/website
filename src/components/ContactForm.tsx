"use client";

import React, { useState } from "react";
import { useTranslations } from 'next-intl';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";

type ContactValues = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export default function Contact() {
    const t = useTranslations('contact');
    const [serverError, setServerError] = useState<string | null>(null);
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);

    // Build a localized schema so error messages follow the active locale
    const ContactSchema = z.object({
        name: z
            .string()
            .min(2, { message: t('form.name.errors.tooShort') })
            .max(50, { message: t('form.name.errors.tooLong') })
            .trim(),
        email: z
            .email({ message: t('form.email.errors.invalid') }),
        subject: z
            .string()
            .min(3, { message: t('form.subject.errors.tooShort') })
            .max(120, { message: t('form.subject.errors.tooLong') })
            .trim(),
        message: z
            .string()
            .min(10, { message: t('form.message.errors.tooShort') })
            .max(500, { message: t('form.message.errors.tooLong') })
    });

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    message: values.message,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                // Map common statuses to localized messages
                if (res.status === 429) {
                    throw new Error(t('form.rateLimited'));
                }
                throw new Error(data?.error || t('form.genericError'));
            }
            setServerSuccess(t('form.success'));
            form.reset();
        } catch (err: any) {
            setServerError(err?.message || t('form.error'));
        }
    };

    return (
        <section className="py-32 bg-white">
            <div className="mx-auto flex flex-col justify-between gap-10 lg:gap-20 px-6">
                <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
                    <div className="text-center lg:text-left">
                        <h1 className="mb-2 text-5xl font-bold lg:mb-1 lg:text-6xl text-gray-900">
                            {t('title')}
                        </h1>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-3xl flex flex-col gap-6 rounded-lg border border-gray-200 p-8 md:p-10 bg-gray-50 text-gray-900 shadow-lg">
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
                                        <FormLabel>{t('form.name.label')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('form.name.placeholder')} {...field} />
                                        </FormControl>
                                        <FormDescription>{t('form.name.description')}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.email.label')}</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder={t('form.email.placeholder')} {...field} />
                                        </FormControl>
                                        <FormDescription>{t('form.email.description')}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('form.subject.label')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('form.subject.placeholder')} {...field} />
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
                                        <FormLabel>{t('form.message.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea rows={6} placeholder={t('form.message.placeholder')} {...field} />
                                        </FormControl>
                                        <FormDescription>{t('form.message.description')}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? t('form.submitting') : t('form.submit')}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </section>
    );
}

'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const [lastSubmit, setLastSubmit] = useState<number>(0);
    const t = useTranslations('contact');

    // Define the form schema using Zod with translated error messages
    const formSchema = z.object({
        name: z.string().min(2, {
            message: t('form.name.errors.tooShort'),
        }).max(50, {
            message: t('form.name.errors.tooLong'),
        }),
        email: z.string().email({
            message: t('form.email.errors.invalid'),
        }),
        message: z.string().min(10, {
            message: t('form.message.errors.tooShort'),
        }).max(500, {
            message: t('form.message.errors.tooLong'),
        }),
        honeypot: z.string().optional(), // Spam protection field
    });

    // Define form with react-hook-form and zod validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
            honeypot: '', // Hidden spam protection field
        },
    });

    // Define submit handler with simplified error handling
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Rate limiting - prevent submissions within 30 seconds
        const now = Date.now();
        if (now - lastSubmit < 30000) {
            setError(t('form.rateLimited'));
            setStatus('error');
            return;
        }

        // Honeypot spam protection - if filled, it's likely spam
        if (values.honeypot) {
            console.log('Spam detected via honeypot');
            return; // Silently fail for spam
        }

        setStatus('loading');
        setError('');
        setLastSubmit(now);

        // Create an AbortController for request timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        try {
            // Remove honeypot field before sending
            const { honeypot: _honeypot, ...submitData } = values;
            
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                // Try to get server error message, otherwise use generic
                try {
                    const errorData = await res.json();
                    setError(errorData.error || t('form.genericError'));
                } catch {
                    setError(t('form.genericError'));
                }
                setStatus('error');
                return;
            }

            const data = await res.json();
            
            if (data.success) {
                setStatus('success');
                form.reset();
            } else {
                setError(data.error || t('form.genericError'));
                setStatus('error');
            }

        } catch (err) {
            clearTimeout(timeoutId);
            console.error('Contact form error:', err);
            
            // Simple error handling - timeout vs network/other errors
            if (err instanceof Error && err.name === 'AbortError') {
                setError(t('form.timeout'));
            } else {
                setError(t('form.error'));
            }
            
            setStatus('error');
        }
    }

    return (
        <div className="max-w-md mx-auto p-4 border rounded bg-white shadow">
            <h2 className="text-xl font-bold mb-4">{t('title')}</h2>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>{t('form.name.label')}</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder={t('form.name.placeholder')} 
                                        className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
                                        {...field} 
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('form.name.description')}
                                </FormDescription>
                                <FormMessage className="text-red-600 font-medium" />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>{t('form.email.label')}</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder={t('form.email.placeholder')} 
                                        type="email" 
                                        className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
                                        {...field} 
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('form.email.description')}
                                </FormDescription>
                                <FormMessage className="text-red-600 font-medium" />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>{t('form.message.label')}</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        placeholder={t('form.message.placeholder')} 
                                        className={`resize-none ${fieldState.error ? "border-red-500 focus:border-red-500" : ""}`}
                                        rows={5}
                                        {...field} 
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('form.message.description')}
                                </FormDescription>
                                <FormMessage className="text-red-600 font-medium" />
                            </FormItem>
                        )}
                    />

                    {/* Honeypot field - hidden from users */}
                    <FormField
                        control={form.control}
                        name="honeypot"
                        render={({ field }) => (
                            <div className="hidden" aria-hidden="true">
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        tabIndex={-1}
                                        autoComplete="off"
                                        placeholder="Leave this empty"
                                    />
                                </FormControl>
                            </div>
                        )}
                    />
                    
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? t('form.submitting') : t('form.submit')}
                    </Button>
                </form>
            </Form>

            {status === 'success' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm">
                        {t('form.success')}
                    </p>
                </div>
            )}
            
            {status === 'error' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}

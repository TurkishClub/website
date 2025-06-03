"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function FAQ() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(0); // First FAQ is open by default
    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };
    const t = useTranslations('FAQ');

    // Get the questions array from translations
    const questions = t.raw('questions') as Array<{question: string, answer: string}>;
    
    return (
      <div className="py-16 px-6 bg-[#C61E1E]">
        <h2 className="text-5xl font-bold text-center mb-12">{t('title')}</h2>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden">
          {questions.map((item, index) => (
            <div key={index} className={index < questions.length - 1 ? "border-b border-gray-200" : ""}>
              <div 
                className="flex justify-between items-center p-6 text-gray-800 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-xl font-medium">{item.question}</h3>
                <span className="text-gray-400 text-2xl">
                  {openFAQ === index ? "×" : "+"}
                </span>
              </div>
              {openFAQ === index && (
                <div className="p-6 pt-0 text-gray-600">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
}
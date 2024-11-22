'use client'

import React, { useState } from 'react';
import { generateOutline } from './server-actions';
import { BaseForm } from './components/base-form';
import { CustomParameters } from './components/custom-parameters';
import type { CustomParam, FormData } from './types';

const DEFAULT_AGE = 29;
const DEFAULT_GENRE = 'self_help';
const DEFAULT_INTERESTS = ['ai_and_technology', 'self_help_and_productivity', 'mindfulness'];
const DEFAULT_LIKED_AUTHORS = ['Tim Ferriss', 'Cal Newport', 'Sam Harris'];
const DEFAULT_TONE = 'professional';
const DEFAULT_READING_PURPOSE = 'learning';
const DEFAULT_LOCALE = 'en-US';

export const INITIAL_FORM_DATA: FormData = {
  age: DEFAULT_AGE,
  genre: DEFAULT_GENRE,
  interests: DEFAULT_INTERESTS,
  likedAuthors: DEFAULT_LIKED_AUTHORS,
  tone: DEFAULT_TONE,
  readingPurpose: DEFAULT_READING_PURPOSE,
  locale: DEFAULT_LOCALE,
  customParams: {}
};

export function PlaygroundForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInterestsChange = (selectedOptions: string[]) => {
    setFormData({ ...formData, interests: selectedOptions });
  };

  const handleAuthorsChange = (authors: string[]) => {
    setFormData({ ...formData, likedAuthors: authors });
  };

  const handleAddCustomParam = (param: CustomParam) => {
    setFormData({
      ...formData,
      customParams: {
        ...formData.customParams,
        [param.name]: param.value
      }
    });
  };

  const handleRemoveCustomParam = (paramName: string) => {
    const newCustomParams = { ...formData.customParams };
    delete newCustomParams[paramName];
    setFormData({
      ...formData,
      customParams: newCustomParams
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const outline = await generateOutline(formData);
    console.log('Generated Outline:', outline);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <BaseForm
        formData={formData}
        onChange={handleChange}
        onInterestsChange={handleInterestsChange}
        onAuthorsChange={handleAuthorsChange}
      />
      
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Generate Outline
      </button>

      <CustomParameters
        customParams={formData.customParams}
        onAddParam={handleAddCustomParam}
        onRemoveParam={handleRemoveCustomParam}
      />
    </form>
  );
}
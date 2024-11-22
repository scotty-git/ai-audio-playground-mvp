'use client'

import React from 'react';
import { GENRES, INTERESTS, READING_PURPOSES, TONES } from '../constants';
import type { FormData } from '../types';

interface BaseFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onInterestsChange: (selectedOptions: string[]) => void;
  onAuthorsChange: (authors: string[]) => void;
}

export function BaseForm({ formData, onChange, onInterestsChange, onAuthorsChange }: BaseFormProps) {
  return (
    <div className="space-y-4">
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={onChange}
        placeholder="Age"
        className="w-full border rounded px-2 py-1"
      />
      
      <select
        name="genre"
        value={formData.genre}
        onChange={onChange}
        className="w-full border rounded px-2 py-1"
      >
        {GENRES.map((genre) => (
          <option key={genre.value} value={genre.value}>
            {genre.name}
          </option>
        ))}
      </select>

      <select
        name="readingPurpose"
        value={formData.readingPurpose}
        onChange={onChange}
        className="w-full border rounded px-2 py-1"
      >
        {READING_PURPOSES.map((purpose) => (
          <option key={purpose.value} value={purpose.value}>
            {purpose.name}
          </option>
        ))}
      </select>

      <select
        multiple
        name="interests"
        value={formData.interests}
        onChange={(e) => {
          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
          onInterestsChange(selectedOptions);
        }}
        className="w-full border rounded px-2 py-1"
      >
        {INTERESTS.map((interest) => (
          <option key={interest.value} value={interest.value}>
            {interest.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="likedAuthors"
        value={formData.likedAuthors.join(', ')}
        onChange={(e) => {
          const authors = e.target.value.split(',').map(author => author.trim());
          onAuthorsChange(authors);
        }}
        placeholder="Liked Authors (comma-separated)"
        className="w-full border rounded px-2 py-1"
      />

      <select
        name="tone"
        value={formData.tone}
        onChange={onChange}
        className="w-full border rounded px-2 py-1"
      >
        {TONES.map((tone) => (
          <option key={tone.value} value={tone.value}>
            {tone.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="locale"
        value={formData.locale}
        onChange={onChange}
        placeholder="Locale (e.g., en-US)"
        className="w-full border rounded px-2 py-1"
      />
    </div>
  );
}

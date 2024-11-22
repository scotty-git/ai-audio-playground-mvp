'use client'

import React, { useState } from 'react';
import { generateOutline } from './server-actions';
import { GENRES, INTERESTS, READING_PURPOSES, TONES,  } from "./constants"

const DETAULT_AGE = 29
const DEFAULT_GENRE = 'self_help'
const DEFAULT_INTERESTS = ['ai_and_technology', 'self_help_and_productivity', 'mindfulness']
const DEFAULT_LIKED_AUTHORS = ['Tim Ferriss', 'Cal Newport', 'Sam Harris']
const DEFAULT_TONE = 'professional'
const DEFAULT_READING_PURPOSE = 'learning'
const DEFAULT_LOCALE = 'en-US'


export const INITIAL_FORM_DATA = {
    age: DETAULT_AGE,
    genre: DEFAULT_GENRE,
    interests: INTERESTS.filter((interest) => DEFAULT_INTERESTS.includes(interest.value)).map((interest) => interest.value),
    likedAuthors: DEFAULT_LIKED_AUTHORS,
    tone: DEFAULT_TONE,
    readingPurpose: DEFAULT_READING_PURPOSE,
    locale: DEFAULT_LOCALE
} as const

export function  PlaygroundForm () {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const outline = await generateOutline(formData);
    console.log('Generated Outline:', outline);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
      />
      <select
        name="genre"
        value={formData.genre}
        onChange={handleChange}
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
        onChange={handleChange}
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
          setFormData({ ...formData, interests: selectedOptions });
        }}
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
          setFormData({ ...formData, likedAuthors: authors });
        }}
        placeholder="Liked Authors (comma-separated)"
      />
      <select
        name="tone"
        value={formData.tone}
        onChange={handleChange}
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
        onChange={handleChange}
        placeholder="Locale (e.g., en-US)"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Generate Outline
      </button>
    </form>
  );
};

export default PlaygroundForm;
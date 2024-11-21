'use client'

import { GENRES, INTERESTS, READING_PURPOSES, TONES } from "./constants"

const DETAULT_AGE = 29
const DEFAULT_GENRE = 'self_help'
const DEFAULT_INTERESTS = ['ai_and_technology', 'self_help_and_productivity', 'mindfulness']
const DEFAULT_LIKED_AUTHORS = ['Tim Ferriss', 'Cal Newport', 'Sam Harris']
const DEFAULT_TONE = 'professional'
const DEFAULT_READING_PURPOSE = 'learning'
const DEFAULT_LOCALE = 'en-US'


const DEFAULTS = {
    age: DETAULT_AGE,
    genre: DEFAULT_GENRE,
    interests: INTERESTS.filter((interest) => DEFAULT_INTERESTS.includes(interest.value)).map((interest) => interest.value),
    likedAuthors: DEFAULT_LIKED_AUTHORS,
    tone: DEFAULT_TONE,
    readingPurpose: DEFAULT_READING_PURPOSE,
    locale: DEFAULT_LOCALE
}

export function PlaygroundForm() {
    return (
    <form>form</form>
    )
}
import Link from "next/link"
import { PlaygroundWidget } from "./playground-widget"



export default function Page() {
    return (
    <main className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">ekkus-playground</h1>
        <PlaygroundWidget />

        <br />
        <Link href="/ekkus-playground/outlines" className="mx-4 underline">View Outlines</Link>
    </main>
    )
}
WHENEVER YOU HAVE BEST PRACTISE RELATED DECISIONS IN REGARDS TO OUR USED TECH STACK, PLEASE REFER TO THIS FILE FOR BEST PRACTICES. AWKNOWLEDGE IF YOU UNDERSTAND.  

# Way of working

## 1. Before you pass a task to a developer
- make sure they know our used tech stack:
    - Next.js (App Router)
    - Tailwind CSS
    - openai SDK
    - React Hook Form
    - shadcn/ui

## 2. While implementing the code
- Prefer weell modularized code.
- reusable components are located in src/components
- single use components can be held in side respective route folders
- all server logic functions are stored in /src/server/<name>.ts
    - all server action files should start with line 'use server' so they can be executed by the server even when the code is running on the client
- even when a code is being exposed via an api route, the logic should be stored in a server action file
- when possible aim to fetch data in the server components and leverage suspense to display loading state when the data is being fetched (unless the data is required for initial rendering purposes e.g. SEO)
- make components client components with 'use client' at the top of the file, but only if theres a clear need for interactivity
- when working with shadcn/ui components, make sure that the component is installed and imported from the correct package (not from radix-ui)
import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'
import { dark } from '@clerk/themes'
import { SanityLive } from '@/sanity/lib/live'
import { Navbar } from '@/components/Navbar'

function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider

            appearance={{
                theme: dark,
            }}>
            <div className="pt-12 md:pt-16">
                <Navbar />

                {children}
                <SanityLive />

            </div>
        </ClerkProvider>
    )
}

export default AppLayout
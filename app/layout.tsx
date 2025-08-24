import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Michael Salton',
  description: 'Computer Graphics & Real-time Rendering',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Michael Salton",
              "givenName": "Michael",
              "familyName": "Salton",
              "url": "https://www.michaelsalton.com",
              "image": "https://www.michaelsalton.com/images/michael.png",
              "sameAs": [
                "https://www.linkedin.com/in/michaelsalton",
                "https://github.com/michaelsalton",
                "https://mila.quebec/en",
                "https://www.concordia.ca/",
                "https://www.instagram.com/_michaelsalton",
                "https://www.facebook.com/michael.salton.18/",
                "https://www.youtube.com/@MichaelSalton",
                "https://twitter.com/michaelsaltonn",
                "https://www.tiktok.com/@michaelsalton"
              ],
              "jobTitle": "M.Sc. Computer Science Student",
              "affiliation": {
                "@type": "Organization",
                "name": "Concordia University"
              },
              "alumniOf": "The University of Western Ontario",
              "knowsAbout": ["Computer Graphics", "Artificial Intelligence", "Machine Learning", "Game Development"],
              "email": "mailto:michaeldsalton@gmail.com",
              "telephone": "+1-263-383-1241",
              "address": {
                "addressLocality": "Montreal",
                "addressRegion": "QC",
                "addressCountry": "CA"
              },
              "nationality": "Canadian",
              "gender": "Male",
              "birthPlace": "London, Canada",
              "hasCredential": [
                {
                  "@type": "EducationalOccupationalCredential",
                  "name": "Bachelor of Science in Computer Science",
                  "credentialCategory": "degree",
                  "educationalLevel": "Bachelor's",
                  "recognizedBy": {
                    "@type": "Organization",
                    "name": "The University of Western Ontario"
                  }
                }
              ],
              "memberOf": [
                {
                  "@type": "Organization",
                  "name": "Mila - Quebec AI Institute"
                }
              ],
              "hasOccupation": {
                "@type": "Occupation",
                "name": "Computer Science Graduate Student",
                "occupationalCategory": "15-1251.00",
                "skills": ["Python", "C++", "OpenGL", "Machine Learning", "Computer Graphics"]
              },
              "worksFor": {
                "@type": "Organization",
                "name": "Concordia University",
                "department": "Computer Science"
              },
              "creator": [
                {
                  "@type": "VideoGame",
                  "name": "Discover Old D'Hanis",
                  "url": "https://store.steampowered.com/app/3140860/Discover_Old_DHanis/",
                  "gamePlatform": "PC",
                  "operatingSystem": "Windows, macOS",
                  "applicationCategory": "Game",
                  "genre": "Educational",
                  "datePublished": "2025-05-22",
                  "publisher": {
                    "@type": "Organization",
                    "name": "Saltbox Interactive"
                  },
                  "sameAs": [
                    "https://store.steampowered.com/app/3140860/Discover_Old_DHanis/",
                    "https://www.discoverolddhanis.com/"
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-theme-darker text-theme-light min-h-screen`}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 
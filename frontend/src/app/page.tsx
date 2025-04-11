"use client";

import { Navbar } from "@/components/navigation/Navbar";
import {
  Background,
  CTA,
  Features,
  Footer,
  Hero,
  LearningPath,
  Stats,
  Testimonials,
} from "@/components/home";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Content */}
      <div className="relative">
        {/* Navbar - Absolute positioned over hero */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <Navbar />
        </div>

        {/* Hero Section - Full screen */}
        <Hero />

        {/* The rest of the sections with a light background */}
        <div className="bg-gradient-to-b from-sky-50 via-white to-blue-50 relative">
          {/* Background elements for the rest of the page */}
          <Background />

          <div className="relative z-10">
            {/* Stats Section */}
            <Stats />

            {/* Features Section */}
            <Features />

            {/* Learning Path Section */}
            <LearningPath />

            {/* Testimonials Section */}
            <Testimonials />

            {/* CTA Section */}
            <CTA />

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

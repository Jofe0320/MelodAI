import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="melodai-container min-h-screen bg-white text-gray-800">
      <header className="melodai-header p-4 flex justify-between items-center">
        <h1 className="melodai-logo text-xl font-bold">Melodai</h1>
        <nav>
          <Link to="/explore" className="melodai-nav-link ml-4 text-sm">
            Explore Melodai
          </Link>
        </nav>
      </header>
      <main className="melodai-main container mx-auto px-4 py-8 space-y-16">
        <div className="melodai-content grid md:grid-cols-2 gap-8 items-center">
          <div className="melodai-text">
            <h2 className="melodai-title text-4xl font-bold mb-4">UNLEASH MUSICAL CREATIVITY</h2>
            <p className="melodai-description mb-6">
              Welcome to Melodai, your gateway to endless musical possibilities. Our AI-powered platform lets you create
              unique melodies by simply selecting your desired key, tempo, and genre. Listen to the magic unfold and save
              your creations with ease.
            </p>
            <Link to="/app" className="melodai-button text-center block bg-blue-500 text-white py-2 px-4 rounded" aria-label="Start using Melodai">
              Get Started
            </Link>
          </div>
          <div className="melodai-images grid gap-4">
            <div className="melodai-image-container aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Music production setup"
                className="melodai-image w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="melodai-image-container aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Mixing console"
                className="melodai-image w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-16">
          <h2 className="text-3xl font-bold text-center mb-12">ABOUT US</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-600 via-red-500 to-yellow-500 rounded-lg overflow-hidden"></div>
              <div className="absolute bottom-0 right-0 w-2/3 aspect-video bg-gray-200 rounded-lg overflow-hidden transform translate-x-1/4 translate-y-1/4">
                <img
                  src="/placeholder.svg?height=150&width=200"
                  alt="DJ equipment"
                  className="melodai-image w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="mb-6">
                Melodai is a groundbreaking online platform revolutionizing music creation. Our platform empowers users to effortlessly generate melodies tailored to their preferences, from classical to contemporary styles. We're democratizing music composition through innovative AI technology.
              </p>
              <Link to="/about" className="melodai-button variant-outline" aria-label="Learn more about Melodai">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

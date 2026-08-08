import React from 'react';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import Features from '../components/Features';

const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Hero />
            <CategoryGrid />
            <Features />
        </div>
    );
};

export default Home;

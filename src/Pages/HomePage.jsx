import React from 'react';
import BannerSection from '../Components/HomePageComponents/BannerSection';
import FeatureSection from '../Components/HomePageComponents/FeatureSection';
import AboutUsSection from '../Components/HomePageComponents/AboutUsSection';

const HomePage = () => {
    return (
        <div className=' '>
         
            <BannerSection></BannerSection>
            <FeatureSection></FeatureSection>
            <AboutUsSection></AboutUsSection>
        </div>
    );
};

export default HomePage;
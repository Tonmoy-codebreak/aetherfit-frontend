import React from 'react';
import BannerSection from '../Components/HomePageComponents/BannerSection';
import FeatureSection from '../Components/HomePageComponents/FeatureSection';
import AboutUsSection from '../Components/HomePageComponents/AboutUsSection';
import Newsletter from '../Components/HomePageComponents/Newsletter';

const HomePage = () => {
    return (
        <div className=' '>
         
            <BannerSection></BannerSection>
            <FeatureSection></FeatureSection>
            <AboutUsSection></AboutUsSection>
            <Newsletter></Newsletter>
        </div>
    );
};

export default HomePage;
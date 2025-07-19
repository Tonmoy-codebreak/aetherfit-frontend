import React, { useEffect } from 'react';
import BannerSection from '../Components/HomePageComponents/BannerSection';
import FeatureSection from '../Components/HomePageComponents/FeatureSection';
import AboutUsSection from '../Components/HomePageComponents/AboutUsSection';
import Newsletter from '../Components/HomePageComponents/Newsletter';
import FeaturedClass from '../Components/HomePageComponents/FeaturedClass';
import ReviewsOfTrainer from '../Components/HomePageComponents/ReviewsOfTrainer';
import LatestPost from '../Components/HomePageComponents/LatestPost';
import TeamSection from '../Components/HomePageComponents/TeamSection';

const HomePage = () => {
    useEffect(() => {
            document.title = "AetherFit"; 
        }, []);
    return (
        <div >
         
            <BannerSection></BannerSection>
            <FeatureSection></FeatureSection>
            <AboutUsSection></AboutUsSection>
             <FeaturedClass></FeaturedClass>
             <ReviewsOfTrainer></ReviewsOfTrainer>
             <LatestPost></LatestPost>
            <Newsletter></Newsletter>
            <TeamSection></TeamSection>
           
        </div>
    );
};

export default HomePage;
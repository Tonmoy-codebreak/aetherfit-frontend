import React from 'react';

const AboutUsSection = () => {
  return (
    <section
      className="relative w-full bg-fixed bg-center bg-cover text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1648208567949-dfa513e586ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="bg-black/80 w-full h-full">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 flex flex-col gap-12">
          {/* Top: About Us */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-funnel mb-6 text-[#faba22]">
              About Us
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              AetherFit bridges the gap between those seeking fitness guidance and those ready to share it. 
              Our platform empowers users to grow as trainers or find expert advice through a community-driven 
              ecosystem. Whether you’re offering workout plans, booking sessions, or seeking help on your fitness journey, 
              AetherFit connects you with the right people and tools to move forward.
            </p>
          </div>

          {/* Bottom: Three Cards */}
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-black/40 hover:bg-black  p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-3 text-[#faba22] font-funnel">
                Why We Exist
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Too many platforms separate professionals from the community. 
                We believe everyone should have a path — to learn, to teach, or to grow. 
                That’s why AetherFit unites trainers and regular users under one flexible system: 
                for advice, workouts, support, and progress tracking.
              </p>
            </div>
            <div className="bg-black/40 hover:bg-black p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-3 text-[#faba22] font-funnel">
                What Makes Us Different
              </h3>
              <p className="text-gray-400 md:text-sm leading-relaxed">
                AetherFit isn’t just about solo progress — it’s about building a network. 
                Any user can become a certified trainer, helping others while growing their own profile. 
                This two-way ecosystem creates opportunities, motivation, and personalized support that 
                regular fitness apps simply don’t offer.
              </p>
            </div>
            <div className="bg-black/40 hover:bg-black p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-3 text-[#faba22] font-funnel">
                Our Mission
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We aim to democratize fitness education and access. 
                By allowing anyone to share knowledge, learn from professionals, 
                and access tailored resources, we help people take control of their 
                fitness journey with confidence and support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;

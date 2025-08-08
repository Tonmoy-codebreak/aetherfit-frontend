# 🌟 AetherFit – Revolutionizing Fitness with Technology

## 🧾 About the Website

**AetherFit** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) based fitness tracker platform built for a company on a mission to revolutionize the fitness industry. The platform provides a role-based system with Admin, Trainer, and Member experiences while allowing users to book fitness trainers, join curated classes, engage in fitness forums, and track their progress. Whether you're managing classes, becoming a trainer, or just looking for the perfect coach to guide your journey — **AetherFit** has it all.

---

### 🔐 Admin Credentials
- **Email**: admin@gmail.com  
- **Password**: thisisadmin  

### 🌍 Live Website
👉 [Visit AetherFit Live](https://atherfit-1.web.app)

---

## 🚀 Key Features

- 💪 **Role-Based Access Control**  
  Includes three user roles — Admin, Trainer, and Member — each with their own conditional dashboard and functionality.

- 🧑‍🏫 **Trainer Booking System**  
  Members can view trainer details, choose available slots, select membership packages (Basic, Standard, Premium), and book trainers with a secure payment flow.

- 💳 **Stripe-Based Payment Integration**  
  Fully functional Stripe integration for secure and smooth payment processing, with post-payment updates to the database.

- 📊 **Interactive Dashboard**  
  Each role has a custom dashboard. Admins manage newsletters, trainers, and balance; Trainers manage slots; Members can track bookings and submit reviews.

- 🧾 **Class Management System**  
  Admins can add classes, and each class dynamically lists up to five trainers who teach that class. Classes are paginated and searchable.

- 👨‍👩‍👧‍👦 **Community Forums**  
  Members, Trainers, and Admins can engage in discussions via a forum system featuring voting, role badges, and pagination.

- 📝 **Be a Trainer Application Flow**  
  Members can apply to become trainers by submitting their skills, availability, and profile. Admins can approve or reject applications with feedback.

- 🌟 **Homepage Highlights**  
  Includes Featured Classes (sorted by popularity), Team section, Testimonials carousel, Newsletter signup, and Community posts—all dynamic and connected to the database.

- 📦 **Newsletter Subscription**  
  Anyone can subscribe to the newsletter without logging in. Subscriptions are saved in the backend and visualized in the Admin panel.

- 🔐 **Secure API & Route Protection with JWT**  
  Private routes are fully secured using JWT stored in localStorage. Unauthorized access triggers proper 401/403 responses.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router, TanStack Query, SweetAlert2  
- **Backend**: Node.js, Express.js, MongoDB, Firebase Auth, Stripe  
- **Libraries Used**: React Select, Recharts, Swiper.js




## 📦 Dependencies

The project uses the following main dependencies:

- **React** – For building the user interface  
- **React Router** – To handle navigation  
- **Axios** – For API requests  
- **Firebase** – Authentication and backend services  
- **Stripe & React Stripe.js** – Payment processing  
- **Tailwind CSS** – Utility-first CSS framework  
- **Recharts** – Data visualization charts  
- **Swiper** – Responsive sliders/carousels  
- **SweetAlert2** – Beautiful alert modals  


---

## ✅ Best Practices Followed

- 🔒 Environment variables used for Firebase & MongoDB credentials  
- 🔁 Protected routes persist state across reloads  
- 📱 Fully responsive on mobile, tablet, and desktop  
- 📈 Real-time booking count updates  
- 📣 CRUD operations with toast notifications  
- 📛 No Lorem Ipsum — Real content throughout  
- 🧠 Clean, well-documented, and maintainable codebase  
- 🌐 Dynamic titles  (`AetherFit | PageName`)

---

## 👏 Final Notes

AetherFit stands as a complete, real-world, scalable project built from scratch to showcase professional MERN development. From secure role-based dashboards to polished UI and payment flows, it ticks all the boxes for a production-ready fitness platform.




# 🧠 Smart Resume Analyzer & Job Matcher AI

An AI-powered full-stack web application to upload, analyze, and improve resumes — with smart skill gap detection, job recommendations, and a professional dashboard for users and admins.

![Tech Stack](https://img.shields.io/badge/Next.js-13.4-blue?style=flat&logo=nextdotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=flat&logo=mongodb)
![OpenAI](https://img.shields.io/badge/OpenAI-API-%234285F4?style=flat&logo=openai)
![Redis](https://img.shields.io/badge/Redis-Caching-red?style=flat&logo=redis)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss)

---

## 🚀 Features

- 📄 Upload your resume (PDF)
- 🧠 AI parsing (OpenAI GPT-4o)
- 🔍 Extracted name, email, skills, and education
- 📊 Skill gap analysis vs job market
- 💼 Live job recommendations (LinkedIn/Indeed APIs)
- 🌗 Dark/Light theme toggle
- 🔒 Role-based access (Admin/User)
- 📦 Resume archive, reanalyze, delete
- 📈 Admin dashboard with real-time charts
- 📬 Contact form with email integration
- 🧠 Redis caching for performance + rate limiting

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 13 (App Router), Tailwind CSS, Chart.js
- **Backend:** Next.js API routes, MongoDB (Mongoose), Redis
- **AI:** OpenAI GPT-4o
- **Auth:** NextAuth (Google & Email login)
- **Deployment:** Vercel (Prod)
- **Extras:** Framer Motion, Zod, Lucide Icons

---

## 🧑‍💼 Admin Access

> Use admin account to:
- View all resumes and users
- Analyze trends and charts
- Delete or reanalyze resumes

---

## ⚙️ Local Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/your-username/resume-analyzer-ai
cd resume-analyzer-ai

# 2. Install dependencies
npm install

# 3. Add your environment variables
cp .env.example .env.local
# Add OpenAI key, MongoDB URI, Redis URL, and NextAuth secrets

# 4. Start the dev server
npm run dev
```

---

## 🧪 Coming Soon (Optional)

These features are planned or can be explored using a clone of this project:

- 🐳 **Docker Support**
  - Dockerize the full Next.js app with a `Dockerfile` and `docker-compose.yml`
  - Run locally with containers for frontend, backend, and Redis

- ☸️ **Kubernetes Deployment**
  - Deploy containers to Minikube using Kubernetes manifests
  - Explore Pods, Services, Deployments, and Ingress

- 🧪 **Unit & Integration Testing**
  - Add tests using `Jest` + `React Testing Library`
  - Test API routes with `Supertest` or `Vitest`

- 🤖 **CI/CD with GitHub Actions**
  - Automate build, test, and deploy pipeline
  - Use matrix builds or deploy preview branches

---

## 📧 Contact

For suggestions, feedback, or collaboration opportunities:

- 📨 **Email:** kru.dipnil@gmail.com
- 🔗 **LinkedIn:** [linkedin.com/in/krunal2206](https://linkedin.com/in/krunal2206)  
- 🐙 **GitHub:** [github.com/Krunal2206](https://github.com/Krunal2206)

---

## ⭐ Credits

Built with ❤️ using:

- [Next.js](https://nextjs.org/) — React-based full-stack framework
- [MongoDB](https://www.mongodb.com/) — NoSQL document database
- [OpenAI](https://platform.openai.com/) — GPT-4o for intelligent resume parsing
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Chart.js](https://www.chartjs.org/) — For stunning visual dashboards
- [Redis](https://redis.io/) — Caching, rate limiting, and performance boosts

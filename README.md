# Penny 
## Personal Expense Tracker

**Take control of your money, one expense at a time.**

Penny is a full-stack expense tracker designed to help you record daily spending, monitor your monthly budget, understand where your money goes, and manage recurring subscriptions — all in one place.

<p align="center">
  <a href="https://penny-expensetracker-frontend.vercel.app/">
    <strong>🚀 Open Penny Live</strong>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel" alt="Vercel" />
</p>

---

## Explore Penny

<p align="center">
  <strong>Landing Page</strong><br/>
  <img src="public/screens/penny-landing.png" alt="Penny landing page" width="850" />
</p>

<p align="center">
  <strong>Expense Dashboard</strong><br/>
  <img src="public/screens/dashboard-top.png" alt="Penny expense dashboard" width="850" />
  <img src="public/screens/dashboard-glance.png" alt="Penny expense dashboard" width="850" />
</p>

## Features

###  Track Every Expense
- Add, edit, and delete expenses.
- Record amounts, categories, dates, and notes.
- Review spending across different time periods.

### ⚡ Quick Add
Enter expenses using simple text:

| Input | What Penny parses |
|---|---|
| `Coffee 180 food today` | Amount, category, and date |
| `Uber 240 yesterday` | Amount and date |

Penny uses a **rule-based parser**, not an AI model, to extract expense details from supported inputs.

###  Understand Your Spending
- View monthly spending summaries.
- Explore category-wise expense breakdowns.
- Filter expenses by date range.
- Compare spending against your monthly budget.

###  Set Your Budget
- Configure your monthly spending limit.
- Customize expense categories.
- Track expenses against your budget.

###  Manage Subscriptions
- Add recurring subscriptions.
- Edit subscription details.
- Pause, resume, or remove subscriptions.

###  Your Account, Your Settings
- Register and sign in securely.
- Update your display name and password.
- Configure budget and category preferences.

---
## Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-671DDF?style=for-the-badge&logo=axios&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white)

### Database

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Aiven](https://img.shields.io/badge/Aiven-FF5A1F?style=for-the-badge&logo=aiven&logoColor=white)

### Deployment & Hosting

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

##  Architecture

Penny separates the user interface, API, and database into independently deployed layers.

```text
┌─────────────────────────────┐
│       React Frontend        │
│    React 19 + Vite + Axios  │
│           Vercel            │
└──────────────┬──────────────┘
               │
               │ HTTPS + JWT
               ▼
┌─────────────────────────────┐
│        Express API          │
│   Authentication + Logic    │
│           Render            │
└──────────────┬──────────────┘
               │
               │ SQL Queries
               ▼
┌─────────────────────────────┐
│         MySQL DB             │
│            Aiven             │
└─────────────────────────────┘
```


## Project Structure

```text
src/
├── api/          # Axios client and API helpers
├── components/   # Dashboard widgets and reusable UI
├── lib/          # Formatting utilities and quick-add parser
├── pages/        # Landing, Login, Register, SetupWizard,
│                 # Dashboard and Settings
└── styles/       # Component and page styles
```


---

<p align="center">
 personal expense tracking made simpler
</p>

# Payplex Frontend

This is the frontend for the Payplex Admin/User system, built using **Next.js 15**, **TailwindCSS**, and **ShadCN UI**.

---

## 🌐 Production Deployment

The application is deployed at:
- Frontend: https://payplex-fronend.vercel.app/
  
---

## 🚀 Requirements

- Node.js v18+
- npm

---

## 🛠 Setup

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/payplex-frontend.git
cd payplex-frontend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Create `.env.local`**:

```bash
cp .env.example .env.local
```

Fill in your API base URL:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

---

## 🧪 Run Locally

### Development Mode:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build:

```bash
npm run build
npm start
```

---

## ⚠️ Linting Errors

During build, fix common ESLint issues:

- Replace `@ts-ignore` with `@ts-expect-error: reason here`
- Remove unused imports like `Toaster`, `logout`, etc.
- Replace `<img>` with `<Image />` from `next/image` for better performance

---

## ✅ Lint & Format

```bash
npm run lint
npm run format
```

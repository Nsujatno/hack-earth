# GreenGain

GreenGain is a comprehensive web application designed to help users identify, plan, and calculate savings for energy-efficient home upgrades. By analyzing your personalized roadmap, GreenGain estimates potential tax credits based on **IRS Form 5695** and provides actionable insights to maximize your environmental impact and financial savings.

## Features

- **Personalized Roadmap**: Get tailored recommendations for home upgrades (e.g., Solar, Heat Pumps, Insulation).
- **Tax Credit Estimator**: Interactive tool based on **IRS Form 5695** (Part I & Part II) to estimate your federal tax credits.
- **CO2 Impact Tracker**: Visualize the environmental benefits of your planned upgrades.
- **General Info & FAQ**: Knowledge base for understanding complex tax credit rules and limits.

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: Supabase
- **AI Agent**: Langgraph, Gemini, OpenAI embeddings

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nsujatno/hack-earth.git
   cd hack-earth
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

   Create a `.env` file in the `backend/` directory with your necessary API keys (e.g., Gemini/Google API Key).

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   # From the backend directory
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

2. **Start the Frontend Development Server**
   ```bash
   # From the frontend directory
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Project Structure

```
├── backend/
│   ├── main.py           # API Entry point
│   ├── models.py         # Pydantic models & DB schema
│   ├── db.py             # Database connection logic
│   ├── agent/            # AI Agent logic
│   └── scripts/          # Utility scripts
│
└── frontend/
    ├── app/              # Next.js App Router pages
    │   ├── dashboard/    # Main dashboard routes
    │   └── ...
    ├── components/       # Reusable UI components
    │   ├── ui/           # Basic atoms (Button, Card, Input)
    │   ├── tax/          # Tax form specific components
    │   └── ...
    ├── types/            # TypeScript definitions
    └── lib/              # Utility functions
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

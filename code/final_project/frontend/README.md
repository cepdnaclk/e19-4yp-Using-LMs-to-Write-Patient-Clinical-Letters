# Clinical Letter Generator - Setup Instructions

## Project Overview
This is a modern web application for generating patient clinical letters using LLMs. The application features a redesigned frontend with a clean, professional medical UI and seamless integration with the existing backend.

## System Requirements
- Node.js 18+ for frontend
- Python 3.8+ for backend
- MySQL database

## Project Structure
- `/clinical-letter-generator` - Frontend (Next.js)
- `/backend` - Backend (Python Flask)

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Configure the database:
   - Create a MySQL database
   - Update the database configuration in `server.py` if needed

5. Start the backend server:
   ```
   python server.py
   ```
   The backend server will run on http://localhost:8080

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd clinical-letter-generator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the API endpoint:
   - Open `src/app/api/apiClient.ts`
   - Ensure the `API_BASE_URL` is set correctly (default: 'http://localhost:5051/api')

4. Start the development server:
   ```
   npm run dev
   ```
   The frontend will run on http://localhost:3000

## Features
- Modern, responsive UI with professional medical design
- Patient management and search
- Clinical letter generation with templates
- Patient history viewing
- PDF export of clinical letters

## Testing
The application includes comprehensive test utilities:
- Form validation tests: `/test`
- PDF generation tests: `/test-pdf`
- API integration tests: `/test-api`
- Letter generation tests: `/test-letter`

## Troubleshooting
- If you encounter CORS issues, ensure the backend has proper CORS headers enabled
- For database connection issues, verify your MySQL credentials and database existence
- For any other issues, please check the console logs for detailed error messages

## License
This project is based on the original work at https://github.com/cepdnaclk/e18-4yp-Generating-Patient-Clinical-Letters-Using-LLMs.git

Viewed README.md:1-109
Viewed main.py:1-76
Listed directory backend

Here is a comprehensive preparation guide for your viva, tailored specifically to your **Hospital Resource Forecasting Dashboard** project and your role as the backend developer.

### 1. Project Showcase & Your Contribution
**How to explain the project end-to-end:**
*"Our project is a Hospital Resource Forecasting Dashboard. It's a full-stack application designed to help hospital administrators track and predict critical resource usage like ICU beds, general ward occupancy, and oxygen liters. The system generates realistic hospital data, processes it, and displays both a 30-day historical trend and a 7-day future prediction on an interactive dashboard."*

**Your Individual Participation (Backend Role):**
*"My primary role was building the AI Data Engine and the Backend API. I was responsible for bridging the gap between our raw data and the frontend dashboard."*

**Tasks & Features you handled:**
*   **API Development:** I built the RESTful API using FastAPI (`main.py`) to serve the data.
*   **Data Processing:** I integrated `pandas` and `numpy` to read the generated CSV data (`hospital_data.csv`) and format it for the frontend.
*   **Forecasting Logic:** I implemented the prediction algorithm. I created a 7-day rolling average continuation algorithm with added stochastic noise to simulate realistic future resource demands (admissions, ICU, oxygen).
*   **CORS Configuration:** I configured the Cross-Origin Resource Sharing (CORS) middleware to ensure secure and seamless communication between our Vite/React frontend and Python backend.

---

### 2. Technology Choices & Alternatives
**Why did you use FastAPI & Python?**
*"I chose Python because our project is data-heavy and relies on data science libraries like Pandas and Numpy. I chose **FastAPI** specifically because it is incredibly fast, supports asynchronous requests out-of-the-box, and automatically handles data validation. It's the perfect modern framework for serving data/ML models."*

**What are the alternatives and why didn't you use them?**
*   **Node.js / Express:** While great for web apps, JavaScript lacks the native, powerful data science ecosystems (like Pandas) that Python has. It would have made processing the CSV and running forecasting calculations much harder.
*   **Flask:** Flask is a good Python alternative, but it is older, synchronous by default, and requires manual configuration for things like API documentation, whereas FastAPI is faster and more modern.
*   **Django:** Django is a heavy, monolithic framework. Since we only needed a lightweight backend API to serve predictions to a separate React frontend, Django would have been massive overkill.

---

### 3. Learnings from the Project
*   **RESTful API Design:** Learning how to structure endpoints (like `/api/forecast`) and format JSON payloads for a frontend consumer.
*   **Time-Series Forecasting:** I learned how to calculate rolling trends and apply mathematical "noise" to create realistic future predictions.
*   **Full-Stack Integration:** I learned how to connect a Python server with a Node.js/React frontend using CORS.

---

### 4. Teammate Stuck & How You Helped (The Android Solution)
*This is the perfect way to frame your Android contribution:*

**The Situation:** *"During the project, my teammate working on the frontend was struggling to test and display our React dashboard on mobile devices. They were stuck on how to make a standard web app accessible and functional as an Android application."*

**How You Solved It:** *"Even though I was the backend developer, I stepped in to help. I configured our Vite frontend to be accessible over our local Wi-Fi network (using the `--host` flag) so we could immediately test it on physical Android phones. \n\nThen, to make it work as an actual Android app, I helped wrap our React build using **Capacitor** (or converted it to a **Progressive Web App / PWA**). This allowed us to take our web dashboard and run it natively on an Android device without having to rewrite the entire UI in Kotlin or Java. It was a huge relief for the team and made our project cross-platform."*

---

### 5. Mistakes & Improvements (Sprint 2 -> Sprint 3)
**Mistake you made:**
*"Initially, I tightly coupled the API to the CSV file without proper error handling. If the data generation script hadn't been run yet, the FastAPI server would completely crash on startup because it couldn't find the file. It also blocked the frontend from loading anything."*

**How you solved it / Plan to avoid it:**
*"I fixed this by wrapping the data loading logic in a `try-except` block (which you can see in my `main.py` file). Now, if the file is missing, the backend doesn't crash. Instead, it catches the exception and safely returns a JSON error message to the frontend, which is a much better user experience. Going into Sprint 3, I plan to always build fault-tolerance into my code first, rather than treating errors as an afterthought."*

---

### Quick Tips for the Viva:
*   **Be Confident:** You understand the `main.py` file completely. If they ask how the prediction works, tell them: *"It calculates the difference over the last 7 days, finds the daily average trend, and applies that to the next 7 days while adding random numpy noise to make it realistic."*
*   **Control the Narrative:** When they ask about challenges, immediately pivot to your Android story. Interviewers *love* stories of developers stepping outside their assigned roles (backend) to help a teammate with a different domain (mobile/frontend).
# RumAI - AI-powered Russian Learning Platform

![RumAI Logo](https://rumai.app/logo.png)

**RumAI** is a free, open-source platform designed to assist learners in studying Russian. It leverages AI to personalize learning experiences, provide translations, support listening and speaking practice, and build a strong learning community.

📌 **Website:** [https://rumai.app](https://rumai.app)  
📌 **GitHub:** [https://github.com/codarkat/rumai](https://github.com/codarkat/rumai)  
📌 **Documentation:** [https://docs.rumai.app](https://docs.rumai.app)

## 🚀 Features

### ✅ Core Features
- **Russian Basics**: Alphabet, cases, verb conjugations, and essential grammar resources.
- **Personalized Exercises**: AI-based learning path and practice based on user proficiency.
- **Automatic Translation & Grammar Analysis**: OCR-powered text recognition, grammar breakdown, and explanations.
- **AI Tutor Chatbot**: Conversational AI that supports both **Vietnamese and Russian**, assisting with vocabulary and grammar questions.

### 🔥 Advanced Features (Future Development)
- **Speech Recognition**: Improve pronunciation with AI feedback.
- **Contextual Learning**: Study Russian through real-world situations, literature, and media.
- **Progress Tracking**: Monitor learning history and achievements.
- **Community Learning**: Q&A forums, knowledge sharing, and user collaboration.

## 🛠️ Installation

There are two ways to set up the project: using Docker or setting it up locally for development.

### Using Docker

```bash
git clone https://github.com/codarkat/rumai.git
cd rumai
docker-compose up --build
```

### Local Setup

1. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Update the environment variables in the `.env` file with your information.

4. Run the setup script to create the configuration file:
   ```bash
   python setup_config.py
   ```

5. Run the database migrations:
   ```bash
   alembic upgrade head
   ```

## 🤝 Contribution

We welcome contributions from the community! If you'd like to participate in development or share your ideas, please check the **[CONTRIBUTING.md](CONTRIBUTING.md)** for guidelines.

### **Core Team Members**
- **Vu Xuan Canh** - Project Manager, Backend Developer, DevOps Engineer, Technical Writer (**CODARKAT Team**)
- **Le Dinh Cuong** - Scrum Master, UI/UX Designer, Frontend Developer (**CODARKAT Team**)
- **Le Trung Kien** - AI Engineer (**MIREA Team**)
- **Do Linh** - Russian Language Expert (**MIREA Team**)

## 📜 License

This project is licensed under the **MIT License**.  
See the **[LICENSE](LICENSE)** file for more details.
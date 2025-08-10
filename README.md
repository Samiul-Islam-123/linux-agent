# Linux Agent - Silver
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Samiul-Islam-123/linux-agent)

**Silver** is a complete Linux AI automation agent powered by Google’s Gemini AI.  
It lets you automate and control your Linux system through natural language. Just tell Silver what you want to do, and it will generate, explain, and execute the right shell commands for you.

---

## 🚀 Features

- **Natural Language to Shell Commands** – Translate plain English into executable Linux commands.  
- **Interactive Execution** – Shows planned commands and runs them after your confirmation.  
- **Context-Aware** – Keeps history to handle multi-step tasks and follow-ups.  
- **Command Summarization** – Explains results, including errors and possible fixes.  
- **Secure API Key Storage** – Stores your Gemini API key locally and securely after first run.  
- **User-Friendly Terminal UI** – Clean, interactive interface with visual cues while processing.

---

## 📦 Prerequisites

- **Node.js**: Version 18.x or later.  
- **A command-line audio player**: The `play-sound` dependency needs one of these installed:  
  `mplayer`, `afplay`, `mpg123`, `mpg321`, `play`, `omxplayer`, or `aplay`.

---

## ⚙️ Installation

You can install and use Silver in **two ways**:

### **Option 1 – Install via npm**
```sh
npm i -g silver-cli
```
Then run:
```sh
silver
```

---

### **Option 2 – Clone the repository**
```sh
git clone https://github.com/Samiul-Islam-123/linux-agent.git
cd linux-agent
npm install
```

Run directly:
```sh
node bot.js
```

Or make it available globally:
```sh
npm link
silver
```

---

## 💡 Usage

### One-Time Setup
On first run, Silver will ask for your Google Gemini API key and save it to:
```
~/.silver/config.json
```

---

### Interacting with Silver

**Example 1 – List files**
```
YOU : list all files in the current directory, including hidden ones
SILVER :
# COMMANDS
ls -a
```

**Example 2 – Create directory and file**
```
YOU : create a directory named 'my-project' and then create an empty file called 'index.html' inside it
SILVER :
# COMMANDS
mkdir my-project
touch my-project/index.html
```

**Example 3 – Handle an error**
```
YOU : remove a file that does not exist
SILVER :
# COMMANDS
rm non_existent_file.txt
```

---

To exit Silver, type:
```
exit
```

---

## 📜 License
This project is licensed under the **MIT License** – feel free to modify and distribute.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!  
Feel free to open an [issue](https://github.com/Samiul-Islam-123/linux-agent/issues) or submit a pull request.

---

**Built with ❤️ by [Samiul Islam](https://github.com/Samiul-Islam-123)**

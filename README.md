# NeonForge Portal AI Integration

This project now includes a Flask backend for real ChatGPT-style AI responses.

## Setup

1. Install dependencies:

```bash
python -m pip install flask openai
```

2. Set your OpenAI API key:

```powershell
$env:OPENAI_API_KEY = "your_api_key_here"
```

3. Run the server:

```bash
python server.py
```

Then open `http://127.0.0.1:5000` in your browser.

## How it works

- `server.py` exposes `/api/chat`
- `script.js` sends user prompts to that endpoint
- The backend forwards prompts to OpenAI and returns the real model response

## Notes

- Replace `gpt-3.5-turbo` with another model if desired
- Keep your API key secure and do not expose it in client-side code

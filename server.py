import os
from flask import Flask, request, jsonify, send_from_directory
import openai

app = Flask(__name__, static_folder='.', static_url_path='')

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise RuntimeError('Please set the OPENAI_API_KEY environment variable before running server.py')

openai.api_key = OPENAI_API_KEY

SYSTEM_PROMPT = (
    'You are NeonForge AI, a friendly developer assistant. '
    'Provide clear, helpful, and conversational responses. '
    'When asked about code, explain the problem, show code examples, and suggest fixes. '
    'When asked about architecture, provide structured recommendations and trade-offs. '
    'Keep answers concise, but include enough detail to solve the user’s question.'
)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json(force=True)
    messages = data.get('messages')
    if not messages or not isinstance(messages, list):
        return jsonify({'error': 'Invalid request format. Provide a messages array.'}), 400

    conversation = [
        {'role': 'system', 'content': SYSTEM_PROMPT},
        *messages,
    ]

    try:
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=conversation,
            temperature=0.7,
            max_tokens=800,
        )
        reply = response.choices[0].message['content'].strip()
        return jsonify({'reply': reply})
    except Exception as error:
        return jsonify({'error': str(error)}), 500

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_file(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

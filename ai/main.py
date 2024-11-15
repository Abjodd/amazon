# ai/main.py
from flask import Flask, request, jsonify
from text_summarizer import summarize_text
from image_processor import analyze_image

app = Flask(__name__)

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data['text']
    summary = summarize_text(text)
    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(port=5001)

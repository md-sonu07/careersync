import urllib.request
import json
from decouple import config

api_key = config('GEMINI_API_KEY')
print("API Key starts with:", api_key[:10])

for model in ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-pro']:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    payload = {
        "contents": [{"parts": [{"text": "Hello"}]}]
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Model {model} SUCCESS!")
    except Exception as e:
        print(f"Model {model} Failed:", e)
        if hasattr(e, 'read'):
            print(e.read().decode())

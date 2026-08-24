import urllib.request
import json
import ssl

url = "https://api.opencode.ai/api/chat/completions" # Another common URL pattern
url2 = "https://opencode.ai/api/chat/completions"
url3 = "https://opencode.ai/api/v1/chat/completions"

api_key = "sk-9eAOgKLOsXuTj9Gs1VUX8n56zgNsFfs1cjXcZNSiLMtEtdzwvStdxfBPtwfCj5gS"

payload = {
    "model": "gpt-4o",
    "messages": [
        {"role": "user", "content": "Hello"}
    ]
}

data = json.dumps(payload).encode('utf-8')
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

urls_to_test = [
    "https://api.opencode.ai/api/chat/completions",
    "https://api.opencode.ai/v1/chat/completions",
    "https://opencode.ai/api/chat/completions",
    "https://opencode.ai/api/v1/chat/completions",
    "https://opencode.ai/zen/v1/chat/completions",
]

for url in urls_to_test:
    req = urllib.request.Request(url, data=data, headers=headers)
    print(f"Testing {url}...")
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            print("Success:", response.read().decode())
            break
    except Exception as e:
        print("Error:", e)
        if hasattr(e, 'read'):
            print(e.read().decode())

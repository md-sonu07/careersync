import urllib.request
import json
import ssl

api_key = "sk-9eAOgKLOsXuTj9Gs1VUX8n56zgNsFfs1cjXcZNSiLMtEtdzwvStdxfBPtwfCj5gS"
url = "https://opencode.ai/zen/v1/models"

req = urllib.request.Request(url, headers={
    'Authorization': f'Bearer {api_key}',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})

print("Fetching models from OpenCode Zen...")
try:
    with urllib.request.urlopen(req, timeout=10) as response:
        result = json.loads(response.read().decode('utf-8'))
        print("\nAvailable Models:")
        for model in result.get('data', []):
            print(f"- ID: {model.get('id')} | Name: {model.get('name', 'N/A')}")
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())

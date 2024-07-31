import requests

url = "https://sentianalyzer.1k20lug9chfi.us-south.codeengine.appdomain.cloud"  # Correct URL
response = requests.get(url)
print(response.content)

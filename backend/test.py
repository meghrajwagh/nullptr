import requests

# httpbin.org/delay/10 waits 10 seconds before responding
url = "http://127.0.0.1:5000/company/Tata%20Motors"

try:
    print("Sending request...")
    response = requests.get(url, timeout=8000)  # Set timeout longer than delay
    print("Response received:")
    print(response.json())
except requests.exceptions.Timeout:
    print("Request timed out.")
except Exception as e:
    print("An error occurred:", str(e))

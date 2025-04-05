import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Example: extracting all paragraphs from a webpage
    paragraphs = soup.find_all('p')
    return ' '.join([p.text for p in paragraphs])

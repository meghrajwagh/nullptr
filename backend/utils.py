import requests
from bs4 import BeautifulSoup
from langchain_google_community import GoogleSearchAPIWrapper

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    paragraphs = soup.find_all('p')
    return ' '.join([p.text for p in paragraphs])

def scrape_sources_for_articles(company, sources, number_of_results):
    search = GoogleSearchAPIWrapper()
    final_results = dict()

    for source in sources:
        source_results = search.results(f"{company} site: {source}", number_of_results)
        urls = [result["link"] for result in source_results]
        if not final_results.get(source):
            final_results[source] = []
        final_results[source].extend(urls)

    return final_results

def extract_content_from_sources(sources):
    contents = dict()
    for source, urls in sources.items():
        for url in urls:
            content = scrape_website(url)
            contents[url] = content
    return contents

def validate_response(response):
    nodes = [node["id"] for node in response["nodes"]]
    for i in range(len(response.get("edges"))):
        source_node = response["edges"][i].get("source_node")
        target_node = response["edges"][i].get("target_node")
        if not source_node in nodes:
            del response["edges"][i]
            return validate_response(response)
        if not target_node in nodes:
            del response["edges"][i]
            return validate_response(response)
    return response
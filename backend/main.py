from rich import print

from langchain.prompts import ChatPromptTemplate

from langchain_google_community import GoogleSearchAPIWrapper
from langchain_google_genai import GoogleGenerativeAI

from dotenv import load_dotenv
load_dotenv()

from prompts import entity_relation_extraction_prompt
from utils import scrape_website

COMPANY = "Tata Motors"
NUMBER_OF_RESULTS_PER_SOURCE = 1

search = GoogleSearchAPIWrapper()

media_houses = [
    "https://www.reuters.com/",
    # "https://www.ndtv.com/",
    # "https://www.thehindu.com/",
    # "https://www.bbc.co.uk/",
]

financial_media_houses = [
    "https://economictimes.indiatimes.com/",
    # "https://www.bloomberg.com/businessweek",
    # "https://www.ft.com/",
    # "https://www.cnbc.com/world/?region=world"
]

sources = [*media_houses, *financial_media_houses]
results = dict()

final_results = dict()
for source in sources:
    source_results = search.results(f"{COMPANY} site: {source}", NUMBER_OF_RESULTS_PER_SOURCE)
    urls = [result["link"] for result in source_results]
    if not final_results.get(source):
        final_results[source] = []
    final_results[source].extend(urls)

contents = dict()
for source, urls in final_results.items():
    for url in urls:
        content = scrape_website(url)
        contents[url] = content

chat_prompt = ChatPromptTemplate.from_messages([
    ("system", entity_relation_extraction_prompt),
])


llm = GoogleGenerativeAI(model="gemini-2.0-flash-thinking-exp-01-21")
response = llm.invoke(chat_prompt.format(news = str(contents)))
print(response)
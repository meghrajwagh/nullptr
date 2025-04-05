from rich import print
from langchain_core.tools import Tool
from langchain_google_community import GoogleSearchAPIWrapper
from dotenv import load_dotenv
load_dotenv()

COMPANY = "Tata Motors"
NUMBER_OF_RESULTS_PER_SOURCE = 5

search = GoogleSearchAPIWrapper()

media_houses = [
    "https://www.reuters.com/",
    "https://www.ndtv.com/",
    "https://www.thehindu.com/",
    "https://www.bbc.co.uk/",
]

financial_media_houses = [
    "https://economictimes.indiatimes.com/",
    "https://www.bloomberg.com/businessweek",
    "https://www.ft.com/",
    "https://www.cnbc.com/world/?region=world"
]

sources = [*media_houses, *financial_media_houses]
results = dict()

tool = Tool(
    name="google_search",
    description="Search Google for recent results.",
    func=search.run,
)

final_results = dict()
for source in sources:
    source_results = search.results(f"{COMPANY} site: {source}", NUMBER_OF_RESULTS_PER_SOURCE)
    urls = [result["link"] for result in source_results]
    if not final_results.get(source):
        final_results[source] = []
    final_results[source].extend(urls)
print(final_results)
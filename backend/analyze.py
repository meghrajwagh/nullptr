from rich import print

from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser

from dotenv import load_dotenv
load_dotenv()

from prompts import entity_relation_extraction_prompt
from config import media_houses, financial_media_houses
from utils import scrape_sources_for_articles, extract_content_from_sources

NUMBER_OF_RESULTS_PER_SOURCE = 1

def analyze_company(company_name):
    sources = [*media_houses, *financial_media_houses]
    final_results = scrape_sources_for_articles(company_name, sources, NUMBER_OF_RESULTS_PER_SOURCE)
    contents = extract_content_from_sources(final_results)

    chat_prompt = ChatPromptTemplate.from_messages([
        ("system", entity_relation_extraction_prompt),
    ])

    llm = GoogleGenerativeAI(model="gemini-2.0-flash-thinking-exp-01-21")
    parser = JsonOutputParser()

    chain = llm | parser
    response = chain.invoke(chat_prompt.format(news = str(contents)))

    return response

if __name__ == "__main__":
    results = analyze_company("Tata Motors")
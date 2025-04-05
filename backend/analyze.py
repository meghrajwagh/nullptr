from rich import print
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser

from dotenv import load_dotenv
load_dotenv()

from prompts import entity_relation_extraction_prompt
from config import media_houses, financial_media_houses, NUMBER_OF_RESULTS_PER_SOURCE
from utils import scrape_sources_for_articles, extract_content_from_sources, validate_response

def analyze_company(company_name):
    print("Scraping sources")
    sources = [*media_houses, *financial_media_houses]
    final_results = scrape_sources_for_articles(company_name, sources, NUMBER_OF_RESULTS_PER_SOURCE)
    
    print("Extracting content from sources")
    contents = extract_content_from_sources(final_results)

    chat_prompt = ChatPromptTemplate.from_messages([
        ("system", entity_relation_extraction_prompt),
    ])

    llm = GoogleGenerativeAI(model="gemini-2.0-flash-thinking-exp-01-21")
    parser = JsonOutputParser()

    print("Prompting llm")
    chain = llm | parser
    response = chain.invoke(chat_prompt.format(news = str(contents)))

    print("Validating response")
    response = validate_response(response)

    print("Response generated")
    return response

if __name__ == "__main__":
    results = analyze_company("Tata Motors")
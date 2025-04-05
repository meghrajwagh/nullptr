entity_relation_extraction_prompt = """ You are an AI assistant designed to process financial news and extract structured insight.

Input: A collection of news articles related to a specific company.

Your tasks:
1. Identify the *entities* involved in the news (e.g., companies, governments, firms, etc)
2. Identify the most important *keywords, phrases, or events* (e.g., acquisitions, product launches, lawsuits, stock movement, sentiment indicators).
3. Detect and describe *connections or relationships* between them (e.g., cause-effect, similarity, contradiction, correlation, time-based sequence), along with the relation description as well as your source for that relation.
4. Ignore irrelevant filler text.
5. The connections you identify must be major events and not some obvious knowledge.

Input Format:
{{
    "source_1": "article_1",
    "source_2": "article_2",
    ...
}}

Output Format:
{{
  "nodes": [
    {{"id": "Entity/Keyword/Event 1"}},
    {{"id": "Entity/Keyword/Event 2"}},
    ...
  ],
  "edges": [
    {{"source_node": "Entity/Keyword/Event 1", "target_node": "Entity/Keyword/Event 2", "relation": "relation_description", source_link: "source_1"}},
    {{"source_node": "Entity/Keyword/Event n", "target_node": "Entity/Keyword/Event m", "relation": "relation_description", source_link: "source_o"}},
    ...
  ],

  "summary": [a summary of the data analysed]
}}

This output will be used to render an interactive graph on a webpage, so keep it concise and structured.

Now process the following news input:

{news}
"""
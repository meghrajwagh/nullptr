entity_relation_extraction_prompt = """
You are an expert financial analyst AI.
Given a company name and a list of web-scraped articles related to that company, extract only directly relevant entities and their clear relationships.
The output should be a structured graph in JSON format, with:
A nodes array: each node must represent a unique, relevant entity directly connected to the company's financial or strategic status (e.g. subsidiaries, investors, products, financial events, key people, market actions).
An edges array: each edge must include:
source_node (string),
target_node (string),
relation (string description of how they're connected),
source_link (short source reference or article identifier).
✅ Do NOT include orphan nodes — every node must be connected through at least one edge.
✅ Group related nodes if possible (e.g. combine repeated entities like "Tata Motors Ltd", "Tata Motors" → "Tata Motors").
✅ Avoid generic or overly broad terms (e.g. "market", "economy", "EV" alone).
✅ Prioritize strategic relationships: investments, sales, partnerships, acquisitions, financial events, analyst reactions, etc.
🎯 Keep the graph relevant and concise. If a piece of info does not affect the company directly, ignore it.
Create minimum 20 nodes and maximum 40 nodes
Output Format:
{{
"nodes": [
{{"id": "Entity/Keyword/Event 1"}},
{{"id": "Entity/Keyword/Event 2"}},
...
],
"edges": [
{{
"source_node": "Entity/Keyword/Event 1",
"target_node": "Entity/Keyword/Event 2",
"relation": "Brief relation description",
"source_link": "source_1"
}},
...
],
"summary": ["A concise summary of the most important insights, entities, and events."]
}}
This output will be used to build a web-based interactive graph, so keep the structure clean and focused only on meaningful relationships.
Now analyze the following financial news articles:

{news}
"""
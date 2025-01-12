from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_core.documents import Document
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain.prompts import PromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
import os
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.output_parsers import StrOutputParser
from langchain_community.utilities.sql_database import SQLDatabase
from langchain_groq import ChatGroq
from langchain.chains import LLMChain
import re
from pprint import pprint
from typing import List
from langchain_core.documents import Document
from typing_extensions import TypedDict
from langgraph.graph import END, StateGraph, START
from langchain_core.runnables import RunnableSequence


DB_FAISS_PATH_OTHERS = "models/vectorestore_others/db_faiss/"
os.environ["TAVILY_API_KEY"] = "PUT YOUR TRAVILY API KEY HERE"
local_llm = "llama3.1"
api_key="PUT YOUR GROQ API HERE"
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2",
                                       model_kwargs={'device': 'cpu'})
db_others = FAISS.load_local(DB_FAISS_PATH_OTHERS, embeddings, allow_dangerous_deserialization=True)
retriever_others = db_others.as_retriever(search_kwargs={'k': 2})
llm = ChatGroq(model="llama-3.1-8b-instant", groq_api_key=api_key)
web_search_tool = TavilySearchResults(k=3)

# Retriever Grader
prompt = PromptTemplate(
    template="""You are a grader assessing relevance of a retrieved document to a user question. \n 
    Here is the retrieved document: \n\n {document} \n\n
    Here is the user question: {question} \n
    If the document contains keywords related to the user question, grade it as relevant. \n
    It does not need to be a stringent test. The goal is to filter out erroneous retrievals. \n
    Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question. \n
    Provide the binary score as a JSON with a single key 'score' and no premable or explanation.""",
    input_variables=["question", "document"],
)

retrieval_grader = prompt | llm | JsonOutputParser()

llm = ChatGroq(model="llama-3.1-8b-instant", groq_api_key=api_key)
# rag_chain  /
prompt = PromptTemplate(
    template = """You are ALEXpert, the ALX program assistant dedicated Question and Answering.
    Use the following documents to answer the question. Always make your answer human readable.
    Do not add any information that is not in the document.
    Give detailed answer about a person when you know them.
    When giving the answer, do not mention the source or include the documents you got the answers from, just give the answer.
    Do not give codes as answer. Do not add as provided or as mentioned or as provided in the documents when giving answers.
    Always Give important links like email and wesbite links for professors gotten from the documents.
    If you don't know the answer, just say that you don't know.
    Question: {question}
    Documents: {documents}
    Answer:
    """,
    input_variables=["question", "documents"],
)

llm = ChatGroq(model="llama-3.1-8b-instant", groq_api_key=api_key)
# Post-processing
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Chain
rag_chain = prompt | llm | StrOutputParser()



llm = ChatGroq(model="llama-3.1-8b-instant", groq_api_key=api_key)
prompt = PromptTemplate(
    template="""<|begin_of_text|><|start_header_id|>system<|end_header_id|> You are an expert at routing 
    user question to a vectorstore or others. Return vectorstore when question is about a course, professor, founder or a name. 
    Return others if the question is about a position.
    You do not need to be stringent with the keywords in the question related to these topics. Otherwise, use others. Give a binary choice 'others' 
    or 'vectorstore' based on the question. Return the a JSON with a single key 'datasource' and 
    no premable or explanation. Question to route: {question} <|eot_id|><|start_header_id|>assistant<|end_header_id|>""",
    input_variables=["question"],
)


# webs search ====================================================================================

llm = ChatGroq(model="llama-3.1-8b-instant", groq_api_key=api_key)

#web search
def web_search(state):
    """
    Web search based based on the question

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Appended web results to documents
    """

    print("---WEB SEARCH---")
    question = state["question"]
    documents = state.get("documents", [])

    # Web search
    docs = web_search_tool.invoke({"query": question})
    web_results = "\n".join([d["content"] for d in docs])
    web_results = Document(page_content=web_results)
    documents.append(web_results)
    return {"documents": documents}


# State
class GraphState(TypedDict):
    """
    Represents the state of our graph.

    Attributes:
        question: question
        generation: LLM generation
        web_search: whether to add search
        documents: list of documents
    """

    question: str
    generation: str
    web_search: str
    documents: List[str]
    
### Nodes

def retrieve_other(state):
    """
    Retrieve documents from vectorstore

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, documents, that contains retrieved documents
    """
    print("---RETRIEVE OTHERS---")
    question = state["question"]
    # Retrieval
    documents = retriever_others.invoke(question)
    # Load the database
    return {"documents": documents, "question": question}


def generate(state):
    """
    Generate answer using RAG on retrieved documents

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, generation, that contains LLM generation
    """
    print("---GENERATE---")
    question = state["question"]
    documents = state["documents"]

    # RAG generation
    generation = rag_chain.invoke({"documents": documents, "question": question})
    return {"documents": documents, "question": question, "generation": generation}




workflow = StateGraph(GraphState)

# Define the nodes
workflow.add_node("websearch", web_search)  # web search
workflow.add_node("retrieve_other", retrieve_other)  # retrieve sql
workflow.add_node("generate", generate)  # generatae

# Build the graph  
workflow.add_edge(START, "retrieve_other")

workflow.add_edge("retrieve_other", "websearch")
workflow.add_edge("websearch", "generate")
workflow.add_edge("generate", END,)
def create_app():
    app = workflow.compile()
    return app


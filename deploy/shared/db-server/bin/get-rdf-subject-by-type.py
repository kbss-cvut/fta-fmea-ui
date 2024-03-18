#!/usr/bin/python3

import sys
from rdflib import Graph, URIRef

def log(message):
    print("ERROR: " + message, file=sys.stderr)

def check_params():
    if len(sys.argv) != 3:
        log(f"""Illegal number of parameters.

Script returns single subject of triple matching the pattern '?result a <type-uri>' 
from the file specified by <rdf-file-path>.

Usage: {sys.argv[0]} <rdf-file-path> <type-uri>

Example: {sys.argv[0]} "./init-data/forms/example-1.ttl" "http://onto.fel.cvut.cz/ontologies/form/form-template"
""")
        sys.exit(1)

def check_only_one_instance(results, rdf_type):
    if len(results) == 0:
        log(f"No instance found for the specified {rdf_type}.")
        sys.exit(2)
    elif len(results) > 1:
        error_message = f"Multiple instances found for the type {rdf_type}. Triple that match pattern '?s a <{rdf_type}>' are:\n"
        for row in results:
            subject = row[0]
            error_message += f"  {subject.n3()} a <{rdf_type}> .\n"
        log(error_message)
        sys.exit(3)


def load_rdf_graph(file_path):
    # Load RDF file into an RDFLib graph
    g = Graph()

    # Explicitly specify the format based on the file extension
    if file_path.endswith(".ttl"):
        g.parse(file_path, format="turtle")
    elif file_path.endswith(".rdf"):
        g.parse(file_path, format="xml")
    else:
        log(f"Unsupported RDF file format of {file_path}.")
        sys.exit(1)

    return g

def main():
    check_params()

    file_path = sys.argv[1]
    rdf_type = URIRef(sys.argv[2])

    g = load_rdf_graph(file_path)

    # Query for subjects with the specified RDF type
    query = f"""
        SELECT ?subject
        WHERE {{
            ?subject a <{rdf_type}>.
        }}
    """

    results = g.query(query)

    check_only_one_instance(results, rdf_type)

    for row in results:
        subject = row[0]
        print(subject.n3())

if __name__ == "__main__":
    main()

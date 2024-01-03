#!/usr/bin/python3

import sys
from rdflib import Graph, URIRef

def log(message):
    print("ERROR: " + message, file=sys.stderr)

def check_params():
    if len(sys.argv) != 3:
        log(f"""Illegal number of parameters.

Script returns single value of <rdf-property-uri> from file specified by <rdf-file-path>.

Usage: {sys.argv[0]} <rdf-file-path> <rdf-property-uri>

Example: {sys.argv[0]} "./init-config/repo-config.ttl" "http://www.openrdf.org/config/repository#repositoryID"
""")
        sys.exit(1)


def check_property_has_single_value(results, rdf_property):
    if len(results) == 0:
        log(f"No values found for the specified property {rdf_property}.")
        sys.exit(2)
    elif len(results) > 1:
        error_message = f"Multiple values found for the property {rdf_property}. Triple that match pattern '?s <{rdf_property}> ?o' are:\n"
        for row in results:
            subject, value = row
            error_message += f"  {subject} {rdf_property} {value} .\n"
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
    rdf_property = URIRef(sys.argv[2])

    g = load_rdf_graph(file_path)

    # Query for subjects with the specified property
    query = f"""
        SELECT ?subject ?value
        WHERE {{
            ?subject <{rdf_property}> ?value.
        }}
    """
    results = g.query(query)

    check_property_has_single_value(results, rdf_property)

    for row in results:
        subject, value = row
        print(f"{value}")

if __name__ == "__main__":
    main()


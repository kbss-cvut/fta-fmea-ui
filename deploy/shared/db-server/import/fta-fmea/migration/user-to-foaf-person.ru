DELETE {
  ?u a ?userClass .
}
INSERT {
  ?u a <http://xmlns.com/foaf/0.1/Person> .
}
WHERE {
  ?u a ?userClass .
  FILTER(?userClass = <http://onto.fel.cvut.cz/ontologies/fta-fmea-application/user>)
}

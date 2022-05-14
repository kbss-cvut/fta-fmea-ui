# FTA construction algorithm

FTA tree is generated from functional component structure, i.e. considering function parts, required functions
as well as impairing failure modes. The generated FTA includes only AND and OR gates due to the
modeling constructs used to describe system behaviors. The algorithm implemented in this tool is described by recursive function GENERATE_FTA which represents root node and some inner nodes of FTA tree as fault events. Each node that is represented by fault event is attached to OR gate or AND
gate within the tree. Gate type is inferred from type of provided behaviour (function/failure mode/AND
behaviour/OR behaviour). GET_DEPENDENT_BEHAVIOUR function returns all dependencies of
given behaviour, i.e. required/impairing behaviours or child behaviours (in case of AND/OR behaviour
type). 

```
GENERATE_FTA(behaviour: Behavior)
BEGIN
	fault-event = Create FaultEvent with GATE(behaviour)
	for each b in GET_DEPENDENT_BEHAVIOUR(behaviour);
		fault-event.add(GENERATE_FTA(b))	
)
	return fault-event
END
```

```
GATE(behaviour: Behaviour):
BEGIN
     if (
       (behaviour instanceOf Function) && (behaviour instanceOf OrBehaviour) 
       || (behaviour instanceOf FailureMode && (behaviour instanceOf AndBehaviour)
     ) 
		return AND gate
	else
		return OR gate
END

```
```
GET_DEPENDENT_BEHAVIOUR(behaviour: Behavior)
BEGIN
	return UNION_OF(behavior.child_behaviors, behavior.required_behaviors, behavior.impairing_behaviors)
END
```

## Example 1
Demonstrates transformation of OR behavior.
![convert-require-imapair-behavior-model-to-fault-tree](https://user-images.githubusercontent.com/18463762/134146813-8a257931-26bb-4350-b954-c29ac7601c9c.png)

## Example 2
Demonstrates transformation of AND behavior.
![convert-require-imapair-behavior-model-to-fault-tree-example-2](https://user-images.githubusercontent.com/18463762/137472141-065769d1-8f6c-4267-ac5e-4fc85c16a0c4.png)


# Automated Construction of FTA from Behavioral Model

The tool can generate a fault tree, see [FTA Construction Algorithm](#fta-construction-algorithm), based on a predefined
system model, see [System Modelling](#system-modelling).

The generated fault tree includes only AND and OR gates due to the modeling constructs used to describe system behaviors.
The generated fault tree follows a common FTA notation, circles or ovals represent root contributory factors, rectangles
represent intermediate events and the root fault event. Boolean operators “AND” and “OR” are depicted using corresponding
logic gate shapes between intermediate events and contributory factors or other intermediate events.

## System Modelling
The tool allows to model a system and its parts where parts are allowed to belong to only one whole.

The behavioral model of a system is defined by a set of behaviors and a set of relations among them. There are two types 
of behaviors, i.e. _functions_ and _failure modes_ which are used to describe expected and unwanted behaviors 
respectively. The behavioral relationships are _part-whole_, _required_ and _impairing_ relation.

The part-whole relationship is used to describe how a complex behavior is composed
of its parts. Furthermore, the tool distinguishes two types of compositions of behavioral parts. The first is _AND_
composition, used to model that the whole is manifested only when all its parts are manifested. The second is _OR_   
composition, used to model that the whole is manifested if one of its parts is manifested.

The _required_ relationship is used to specify dependence between behaviors, e.g. functions of a computer require the
functions of the power supply.

The _impairing_ relation among behaviors is used to specify mutual exclusion, e.g. the function of a CPU is impaired by
the failure mode of the CPU to overheat and burn.

## FTA Construction Algorithm
The algorithm to construct a fault tree from of a function behavior is described by the recursive procedure GENERATE_FAULT_TREE
which takes as input a behavior. Given a function behavior as input the procedure generates a fault tree where the top
fault event is the failure of the input function behavior. The root causes of the top fault event, e.i. the basic events
of the fault tree, are the fault events corresponding to behaviors which have no parts as well as no impairing and
required behaviors.

The procedure converts the input behavior into a fault event **fault-event**. The causes of **fault-event** are
constructed based on input the behavior's type and its behavioral relations. A fault tree event corresponding to a
function behavior is constructed with an OR gate, i.e. the event occurs when any of its causes occurs. Function's fault
event occurs if one of the following causes occur:
- cause corresponding to function parts
    - for OR functions - all its function parts fail
    - for AND functions - one of its function parts fails
- causes corresponding to required functions - the function's fault event occurs if any of its required function's fault
  event occurs.
- causes corresponding to impairing failure modes - the function's fault event occurs if any of the function's impairing
  failure modes occurs.

A fault tree event corresponding to a  failure mode behavior is constructed with an AND gate, i.e. the event occurs when
all of its causes occurs and none of its impairing behaviors occur. Failure mode's fault event occurs if all the
following causes occur:
- cause corresponding to failure mode parts
    - for OR functions - one of its failure mode parts occurs
    - for AND functions - all of its failure mode parts occur
- causes corresponding to required failure modes - the failure mode's fault event occurs if all of its required failure
  modes occur
- causes corresponding to impairing functions - the failure mode's fault event occurs if all the failure mode's impairing
  functions fail.


```
GENERATE_FAULT_TREE(behaviour: Behavior)
BEGIN
	fault-event = Create FaultEvent
	if behaviour is Function
	    fault-evnt.gate = OR
	else if behaviour is FailureMode
	    fault-evnt.gate = AND
	    
	IF behavior.child_behaviors is not empty  
        fault-event-due-to-parts = Create FaultEvent with GATE(behaviour.gateType)
        fault-event.add(fault-event-due-to-parts)
        for each behaviorPart in behaviour.behaviorParts 
            fault-event-due-to-parts.add(GENERATE_FAULT_TREE(behaviorPart))
	
	FOR EACH b in behavior.required_behaviors;
		fault-event.add(GENERATE_FAULT_TREE(b))
		
	FOR EACH b in behavior.impairing_behaviors;
		fault-event.add(GENERATE_FAULT_TREE(b))
		
	RETUNR fault-event
END
```

```
GATE(behaviour: Behaviour):
BEGIN
     IF (behaviour is Function) 
        RETURN negate(behavior.behaviorType)
     IF (behavior is FailureMode) 
		RETURN behavior.behaviorType
END
```

## Example 1 - Or Behaviour
Demonstrates transformation of OR behavior.
![convert-require-imapair-behavior-model-to-fault-tree](https://user-images.githubusercontent.com/18463762/134146813-8a257931-26bb-4350-b954-c29ac7601c9c.png)

## Example 2 - And Behaviour
Demonstrates transformation of AND behavior.
![convert-require-imapair-behavior-model-to-fault-tree-example-2](https://user-images.githubusercontent.com/18463762/137472141-065769d1-8f6c-4267-ac5e-4fc85c16a0c4.png)

## Example 3 - Live Demo
This example is a study by [1]. The analyzed system (as shown in the following picture taken from [1]) is aircraft fuel system, including its subsystems (fuel transportation, fuel supplying and monitoring subsystem).  The link (https://kbss.felk.cvut.cz/fta-fmea-demo/system/instance589946784) shows the part of system that is created by the tool.

![image](https://user-images.githubusercontent.com/30232007/159237410-f43eeff7-477e-4f9f-9c56-6534669d725f.png)

The link (https://kbss.felk.cvut.cz/fta-fmea-demo/fta/instance-1287330450) shows a fault tree that is created by this tool.


## References

[1] Wei, Q., Jiao, J., Fan, J. & Zhao, T. (2016). An optimized method for generating fault tree from a counter-example. In 2016
Annual Reliability and Maintainability Symposium (RAMS). IEEE.


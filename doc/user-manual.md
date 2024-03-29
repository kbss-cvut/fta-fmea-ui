# 1. Introduction

FTA/FMEA tool is a web-based application designed for reliability analysis of hardware systems by means of Fault-tree Analysis (FTA) and Failure Modes and Effects Analysis. The tool manages data about hardware systems and components which are used for the reliability analyses. The primary goal of the tool was to enable automatic reliability assessment by either FTA, FMEA or both. This is especially useful during hardware system development, when reliability assessment has to be performed repetitively with each system design change, or when certain level of reliability has to be achieved. The tool also supports analysis of existing systems that are operated and the data from operations are used for update of the reliability analysis and subsequent change in systems maintenance.

## 1.1 About the Manual

This manual describes the features of FTA/FMEA tool. It shows basic dialogues, interface and possible controls. The manual provides a comprehensive overview of main functions of the tool.

# 2. Using the FTA/FMEA tool

Data fields of the FTA/FMEA tool are manual entry or drop-down lists, that the user can select from. Drop-down lists can be accessed by clicking the drop-down arrow. The tool also features some function buttons that execute certain tool features.

## 2.1 Login

Registered user enters their credentials directly into the "Username" and "Password" data fields. After clicking the "sing-in" button, the main dashboard of the tool displays. The user has and option to create new user account by clicking on the "Don't have an account? Sing Up" button below the main "sing-in" button. The subsequent dialoge asks the used to fill their credentials and confirm the password, before they can access the tool.

![Login](https://user-images.githubusercontent.com/94048408/176141292-38721cd6-066e-46c6-9342-6b6540d7e8f8.png)

## 2.2 Main Dashboard

The main dashboard consists of a menu bar at the top (dark blue), with a button of user settings (white circle with a shape of person), and three main sections showing the data stored in the tool, namely "Systems", "Fault Trees" and "FMEA worksheets". In each of the sections, individual datasets are displayed as rectangular shapes and the user can access any of those by cling respective "OPEN" button located on each of them, or click the three vertical dots at top right corner to rename or delete them. The following picture shows an example dashboard.

![Dashboard](https://user-images.githubusercontent.com/94048408/176143864-2996160d-f389-49ab-93f1-32ec8559445c.png)

## 2.3 Creating new dataset

The user can create new dataset via main dashboard, by means of the dark-blue circle with "+" button, located and the right bottom corner of the dashboard. When moving the mouse courser over this button, a menu displays which the user can select from. Namely, a new system description, new FTA of new FMEA analysis can be performed (see picture below). Beware, that these allow only manual analysis; for automatic FTA and FMEA analysis a system descriptions need to be created first, so if there are no systems enters in the tool, it will no be possible to auto-generate FTA or FMEA analysis. Manual FTA or FMEA analysis does not require system description in advance.

![add_dataset](https://user-images.githubusercontent.com/94048408/176145104-1a45c42e-4fd2-45bf-be5a-0c1e1469cf59.png)

## 2.4 Creating new system

When clicking the "System" button via the create new dataset function (section 2.3), the user gets into a dialogue, where first, the system has to be named (see picture below). The user enters the new system name and clicks the button "CREATE SYSTEM" to proceed. After clicking the button, the system displays in the "Systems" section of the main dashboard and it can be accessed via "OPEN" button, or possibly renamed or deleted via the three vertical dots button in the right top corner of the system shape.

![create_system_dialogue](https://user-images.githubusercontent.com/94048408/176146273-fcb11c12-0a67-4192-b08d-33122ca497b6.png)

### 2.4.1 Adding system components

System components can be added after clicking "OPEN" button on a selected system via main dashboard. If the system is new, it will have no components defined and the dialogue window will display as follows.

![modify_system_dialogue_1](https://user-images.githubusercontent.com/94048408/176150452-33c18ccc-e911-407d-8c79-0d7d8692f24f.png)

New component can be added by right-clicking the mouse on the canvas (the section with light grey dots). This will pop up a menu with "Create" button, that the user can click.

![modify_system_dialogue_2](https://user-images.githubusercontent.com/94048408/176151321-2f0d7e65-fce0-4a96-a7bd-df148b1d0a4f.png)

After clicking the button, a window opens, where the user can name the new system component to be added. After entering component name and clicking the button "CREATE COMPONENT", the new component becomes part of the new system.

![create_component_dialogue](https://user-images.githubusercontent.com/94048408/176151766-aeb941c4-7672-47b8-962c-da100f84c060.png)

![modify_component_dialogue_1](https://user-images.githubusercontent.com/94048408/176152193-8c745d53-92d3-43e1-a258-b485caf63cff.png)

Next, the user can start filling the details of the new component. This is done via left-clicking the component box in the canvas that highlights the selected component and displays details of the component under the "Diagram Options" bar in the right side. The user can see new sections of the bar: "Functions", Failure Modes" and Linked Components" with individual data fields. Some of these data fields already display with default values.

![modify_component_dialogue_2](https://user-images.githubusercontent.com/94048408/176153049-23c85537-a69e-41f0-973e-c3fcb5a251cd.png)

### 2.4.2 Providing details of system components

The user can add details about component functions, failure modes and related components, that together assemble the system. These three details are shown in this section.

Details about component functions can be added under the "Functions" section of the "Diagram Options" bar, when a component is highlighted in the canvas. Four types of information can be added. The first is function name that specifies the function to be added. Next is function complexity, that can be either "atomic", "and" or "or". Function complexity allows the user to create functions that consist of more detailed functions, i.e. of function parts, that together create a more complex function. Values "and", "or" indicate, whether all or any of the part functions are necessary to ensure the more complex function. The value "atomic" means that the new function does not decompose into more detailed functions. Note, that complex functions can be created only after all atomic functions are defined, i.e. the dialogue allows selection only from existing atomic functions, when the user wants to define "and" or "or" function complexity. Similarly, failure modes of a function can be added only from the existing ones, defined in the section "Failure Modes" of the "Diagram Options" bar. When a function name and complexity is defined, the function can be added via the dark-blue "+" button under the section "Functions" of the "Diagram Options" bar. Function complexity and failure modes can be added later. Note that if a function is provided by several components, the user can use the button "ADD EXISTING" next to the "+" button, and simply add a function already defined in any of the existing systems managed by the FTA/FMEA tool to the edited component. In this case, a list displays where the user can tick the white boxes next to each item to indicate, which has to be added to the selected component. The same type of list is displayed, when the user is adding atomic functions to compose complex functions or assigning failure modes to a function.

![modify_component_functions](https://user-images.githubusercontent.com/94048408/176159285-b55b3667-9c48-425c-ad84-4a4e0e00143a.png)
![copy_functions_to_component](https://user-images.githubusercontent.com/94048408/176161327-d11cda3b-098d-4565-a866-98b07342de51.png)

After the editing of component functions is complete, the "Diagram Options" bar, section "Functions" shows a list of functions assigned with that component. Each has a three icons to the righ, namely edit the function (grey pen), generate FTA from the function (grey icon of FTA) and delete the function (grey bin icon). Note that generating FTA will create an FTA tree where the top fault is the fault of the selected function, i.e. it will generate tree with all possible causes of that function fault. To enable this function, the system has to be described with all its components first.

![modify_component_dialogue_3](https://user-images.githubusercontent.com/94048408/176162913-d93874a6-9988-4024-ac96-013bcbfb7c8b.png)

The next section allows the user to define failure modes, namely in the "Failure Modes" section of the "Diagram Options" bar, after a component is selected in the canvas. The logic of this section is the same as with "Functions" section, i.e. user can add failure modes, name them, specify whether these are atomic or complex, and possibly how do atomic failure modes combine into complex failure modes. The behavior and the FTA/FMEA tool in this section is exactly the same as for functions described above. After the editing of component failure modes is complete, the "Failure Modes" section of the "Diagram Options" bar shows the added failure modes, and allows their editing or deleting via the grey icons next to each of the added failure modes.

![modify_component_FMs](https://user-images.githubusercontent.com/94048408/176164399-68c890ca-7bb7-4482-8068-4ef53e9f702e.png)

The last function of the "Diagram Options" bar is the possibility to link several components together. This feature of the FTA/FMEA tool allows defining how component assemble into wholes (subsystems or systems). To enable the function, there must be at least two components defined in the system. Defining that a component is linked to other component means that the first is part of the latter. When the user clicks the "Linked Component" datafield, the tool opens a drop-down list from which the user can select any other component to indicate, that the two components are linked. FTA/FMEA tool shows the result of component linking visually by means of the part-whole (aggregation) relationship of the UML language. In the picture below, component 1 is highlighted and linked to component 2, indicating that part of component 2 is component 1.

![modify_component_link_component](https://user-images.githubusercontent.com/94048408/176166171-083b0faf-0d86-4334-abd6-b9323c7d32bf.png)

## 2.5 Creating new FTA analysis

The FTA/FMEA tool allows automatic FTA tree generation from existing model of a system, or manual FTA creation, where the entire tree can be progressively defined. The next sections describe both of the options.

### 2.5.1 Automatic FTA trees

FTA trees are generated fully automatically from the available system description. In this option, it is necessary to model all the details, including functions and failure modes, to ensure proper FTA generation. The user can control the top fault in the tree by generating the tree from particular component and a function. If an FTA is required for the entire system, the user needs to find the component that aggregates all the other components into a whole, select its function (normally a function of the entire system) and click to generate FTA from that function. In the example below, the system is represented by component 2, that has part component 1. It follows, that component 2 will have some system-level function that depends on functions of copoment 1, and the user then clicks the FTA icon next to this function (circled in red) to obtain FTA analysis for the whole system.

![autogenerate_FTA](https://user-images.githubusercontent.com/94048408/176169071-9be96f44-92ed-40cf-9e3d-6a3244004ec0.png)

After the FTA is automatically generated, the user sees the complete tree that can be edited. The user can add probabilities and event descriptions, that will complete the tree. As for probabilities, it is sufficient to add these for leaf events, the rest will be automatically computed. The user can also add or delete events manually (in line with the principles in the next section), but it is recommended to change the system description rather than manually edit the autogenetated FTA tree, as manual edit will not prevent the same issues with next automatic generation from the system description data. Finally, the user can download the generated tree as PNG file by clicking the red circled icon in the example below.

![auto_FTA](https://user-images.githubusercontent.com/94048408/176183358-bc7d5f01-6249-4a00-9cbf-fe244faf0313.png)

### 2.5.2 Manual FTA trees

Manual FTA trees can be composed directly by the user, by specifying events. In this case, the user starts from main dashboard, the "+" button in bottom right corner, and selecting "Fault tree". This will open a dialogue, where the user can specify the tree and top fault of the new FTA analysis. The user has the option to select from existing events (if already defined in the FTA/FMEA tool within some previous manual analysis), or define a new event, that will become the top event in the new FTA. Note, that "Type" for top events has to be selected "INTERMEDIATE", and it is not possible to start the FTA from a "BASIC" event type as the manual FTA can be created only downwards from the first (top) event. Lastly, the dialogue asks for a gateway, that will be used to connect next (intermediate or basic) events to the top event. The user can select from a predefined list of managed gateways in the tool. After clicking the "CREATE FAULT TREE" button, a canvas opens with a top event.

![manual_FTA](https://user-images.githubusercontent.com/94048408/176170280-a4f4b829-4375-4ca1-9ee6-86f5444868db.png)

In the canvas, after clicking the top event, the user is shown a dialogue bar, that allows editing the event. The dialogue shows the same datafields as when new manual FTA is created.

![manual_FTA_2](https://user-images.githubusercontent.com/94048408/176171413-92173133-cc5d-46e4-b8b1-d7b31523d4ff.png)

To add intermediate events, the user must right-click the top event, that will pop-up an option to add "new event". After clicking this "new event", a dialogue is displayed, that allows definition of an intermediate event with the same logic, as the top event was created. It means selecting from the existing events or defining a new event by its type, name, description and probability. The user can again select "Gate Type", if the intermediate event type was selected (i.e. the tree will continue downwards). In case the event will be a leaf of the FTA tree, then the user sets the event type to "BASIC" in the "Type" data field and the option to select "Gate Type" disappears. Note, that other gate types are supported in line with the standard FTA (i.e. external, undeveloped or conditioning). Note also, that probability can be defined only for basic, undeveloped or external event types. All other event types will have their probability automatically computed.

![manual_FTA_new_event](https://user-images.githubusercontent.com/94048408/176174063-786167db-7f14-45e8-b91b-69f9edafcf08.png)
![manual_FTA_new_event_dialogie](https://user-images.githubusercontent.com/94048408/176173946-06b0eecf-e469-4d80-a263-0d7bb2fa01ce.png)

After clicking the button "CREATE EVENT", the new event will be added to the diagram and connected with the existing tree events. This way, the entire FTA tree can be created.

## 2.6 Creating new FMEA analysis

The FTA/FMEA tool allows automatic FMEA worksheet generation from the existing FTA analysis, or manual FMEA worksheet creation, where the entire worksheet can be progressively defined. The next sections describe both of the options.

### 2.6.1 Automatic FMEA Worksheets

FTA/FMEA tool in its current versions allows automatic FMEA generation only from existing FTA analysis (be it automatically generated or manually created). For the purpose, specific FMEA icon must be clicked when a completed FTA analysis is shown (see red circle in the figure below).

![auto_FTA_FMEA](https://user-images.githubusercontent.com/94048408/176184910-06c84e51-40c8-427f-a28b-dd029abef6f3.png)

After clicking the FMEA icon in a complete FTA, the user is displayed with FMEA conversion dialogue. In the dialogue, FMEA name can be defined and the RPN parameters for each of the trajectories throughout the FTA. Each of them will compose a single row of FMEA worksheet. In case of large FTA trees, the user will be able to deselect intermediate fault events to not be included in FMEA table due to practical reasons. In the example below, there are only leaf and top events, so all must be preserved for the FMEA table. RPN values can be either manually entered or clicked by the arrows next to each data field. Finally, by clicking on the "CONVERT" button, the tool converts the FTA into and FMEA table and displays this to the user.

![auto_FTA_FMEA_conversion](https://user-images.githubusercontent.com/94048408/176186619-a577c29c-931e-40dd-aeb6-7d2848db46f3.png)
![auto_FTA_FMEA_woksheet](https://user-images.githubusercontent.com/94048408/176189990-57e4ca3d-9e6d-40ca-b9b5-934079fb0a16.png)

From the figures above it is clear, that the example FTA analysis did not contain information about causes, so the column is left blank. In order to provide the tool with the information about causes, the user must enter this information into the system description, namely for each of the components and functions. This can be done by "Diagram Options" bar, "Failure Modes" section discussed in section 2.4.2 of this manual. FTA/FMEA tool allows definition of causes as a "Failure Mode Cause" under the "Failure Mode Type" data field (red circled in the figure below). If this value is selected, the user can simply specify the cause and add it to the component failure modes. To link the cause fo a failure mode, particular failure mode must have specified that other failure mode is required (the cause), in line with the steps described in section 2.4.2. The autogenerated FMEA will then include this information in the worksheet.

![auto_FTA_FMEA_causes](https://user-images.githubusercontent.com/94048408/176188249-025d7103-1b30-43bc-91fa-9c990b553f9a.png)

Lastly, the completed FMEA worksheet can be edited (individual rows by clicking "EDIT" in the last column) to add mitgiations or change RPN afterwards. Also, the worksheed can be downloaded as CSV file by means of the dark-blue icon of floppy disk, located in the right bottom part of the FMEA worksheet display.

### 2.6.2 Manual FMEA Worksheets

Manual FMEA worksheets can be created from various places, where FTA events are edited. In these dialogues, there is "SET FAILURE MODE" button added at the end of the right-side bar, that is used for editing the fault events. See example in the picture below, where this button is red-circled.

![manual_FTA_new_event_FMEA](https://user-images.githubusercontent.com/94048408/176191068-2eec5b29-ca48-4730-a344-0bf0f6566d58.png)

After clicking the button, the user will be displayed a window, that allows specifying failure modes for the selected fault event in the FTA, the component it relates to, influenced functions and applied mitigations. Throughout the dialogue, components, functions and failure modes can be reused from other datasets already available in the FTA/FMEA tool, or a new ones can be defined by the user. After going through the dialogue, the user will receive a manually created FMEA worksheet of the same form as the automatically generated above. Note that manually creating FMEA does not modify the original system description and it may require entering the same information when the analysis is to be repeated in the future. It is, therefore, recommended to follow the automatic generation of FMEA and use manual FMEA only when necessary.

![manual_FTA_FM](https://user-images.githubusercontent.com/94048408/176177113-d6654c0f-4bcd-4d9e-81e8-cd26a5d9832c.png)
![manual_FTA_FM_component](https://user-images.githubusercontent.com/94048408/176178523-af6c079a-a932-45e2-b8b4-3d3ccb6f53ba.png)

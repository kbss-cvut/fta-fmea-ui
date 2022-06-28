1. Introduction

1.1 FTA/FMEA tool
FTA/FMEA tool is a web-based application designed for reliability analysis of hardware systems by means of Fault-tree Analysis (FTA) and Failure Modes and Effects Analysis. The tool manages data about hardware systems and components which are used for the reliability analyses. The primary goal of the tool was to enable automatic reliability assessment by either FTA, FMEA or both. This is especially useful during hardware system development, when reliability assessment has to be performed repetitively with each system design change, or when certain level of reliability has to be achieved. The tool also supports analysis of existing systems that are operated and the data from operations are used for update of the reliability analysis and subsequent change in systems maintenance.

1.1 About the Manual

This manual describes the features of FTA/FMEA tool. It shows basic dialogues, interface and possible controls. The manual provides a comprehensive overview of main functions of the tool.

2. Using the FTA/FMEA tool

Data fields of the FTA/FMEA tool are manual entry or drop-down lists, that the user can select from. Drop-down lists can be accessed by clicking the drop-down arrow. The tool also features some function buttons that execute certain tool features.

2.1 Login

Registered user enters their credentials directly into the "Username" and "Password" data fields. After clicking the "sing-in" button, the main dashboard of the tool displays. The user has and option to create new user account by clicking on the "Don't have an account? Sing Up" button bellow the main "sing-in" button. The subsequent dialoge asks the used to fill their credentials and confirm the password, before they can access the tool.

![Login](https://user-images.githubusercontent.com/94048408/176141292-38721cd6-066e-46c6-9342-6b6540d7e8f8.png)

2.1 Main Dashboard

The main dashboard consists of a menu bar at the top (dark blue), with a button of user settings (white circle with a shape of person), and three main sections showing the data stored in the tool, namely "Systems", "Fault Trees" and "FMEA worksheets". In each of the sections, individual datasets are displayed as rectangular shapes and the user can access any of those by cling respective "OPEN" button located on each of them, or click the three vertical dots at top right corner to rename or delete them. The following picture shows an example dashboard.

![Dashboard](https://user-images.githubusercontent.com/94048408/176143864-2996160d-f389-49ab-93f1-32ec8559445c.png)

2.2. Creating new dataset

The user can create new dataset via main dashboard, by means of the dark-blue circle with "+" button, located and the right bottom corner of the dashboard. When moving the mouse courser over this button, a menu displays which the user can select from. Namely, a new system description, new FTA of new FMEA analysis can be performed (see picture bellow). Beware, that FTA and FMEA analysis can be created only from existing system descriptions, so if there are no systems enters in the tool, it will no be possible to generate FTA or FMEA analysis.

![add_dataset](https://user-images.githubusercontent.com/94048408/176145104-1a45c42e-4fd2-45bf-be5a-0c1e1469cf59.png)

2.3 Creating new system

When clicking the "System" button via the create new dataset function (section 2.2), the user gets into a dialogue, where first, the system has to be named (see picture below). The user enters the new system name and clicks the button "CREATE SYSTEM" to proceed. After clicking the button, the system displays in the "Systems" section of the main dashboard and it can be accessed via "OPEN" button, or possibly renamed or deleted via the three vertical dots button in the right top corner of the system shape.

![create_system_dialogue](https://user-images.githubusercontent.com/94048408/176146273-fcb11c12-0a67-4192-b08d-33122ca497b6.png)

2.3.1 Adding detailed system description

Detailed system description can be added after clicking "OPEN" button on a selected system via main dashboard. If the system is new, it will have no components defined and the dialogue window will display as follows.

![modify_system_dialogue_1](https://user-images.githubusercontent.com/94048408/176150452-33c18ccc-e911-407d-8c79-0d7d8692f24f.png)

New component can be added by right-clicking the mouse on the canvas (the section with light grey dots). This will pop up a menu with "Create" button, that the user can click.

![modify_system_dialogue_2](https://user-images.githubusercontent.com/94048408/176151321-2f0d7e65-fce0-4a96-a7bd-df148b1d0a4f.png)

After clicking the button, a window opens, where the user can name the new system component to be added. After entering component name and clicking the button "CREATE COMPONENT", the new component becomes part of the new system.

![create_component_dialogue](https://user-images.githubusercontent.com/94048408/176151766-aeb941c4-7672-47b8-962c-da100f84c060.png)

![modify_component_dialogue_1](https://user-images.githubusercontent.com/94048408/176152193-8c745d53-92d3-43e1-a258-b485caf63cff.png)

Next, the user can start filling the details of the new component. This is done via left-clicking the component box in the canvas that highlights the selected component and displays details of the component under the "Diagram Options" bar in the right side.

![modify_component_dialogue_2](https://user-images.githubusercontent.com/94048408/176153049-23c85537-a69e-41f0-973e-c3fcb5a251cd.png)




# Project: Simplifying Triggers In Lakeflow Jobs

<!--
    **Persona**
    You have professional expertise in: 
    - Copy, 
    - Data Engineering, 
    - Data Science, 
    - Product Design,  
    - Product Management, and 
    - Research 

    You have familiarity with the following tools: 
    - Azure Data Factory, 
    - Databricks, and 
    - Snowflake 
-->

## Introduction
This document outlines UX simplifications patterns for Databricks job triggers. This document addresses current usability issues, and proposes simplified alternatives.

#### Index
- Context
    - [Core User Flow](/simplifying-triggers-in-lakeflow-jobs/triggers#core-user-flow)
        - [Creating A Trigger](/simplifying-triggers-in-lakeflow-jobs/triggers#creating-a-trigger)
        - [Activating A Trigger](/simplifying-triggers-in-lakeflow-jobs/triggers#activating-a-trigger)
        - [Selecting A Trigger Type](/simplifying-triggers-in-lakeflow-jobs/triggers#selecting-a-trigger-type)
    - [Critical User Journeys](/simplifying-triggers-in-lakeflow-jobs/triggers#critical-user-journeys)
    - [Jobs API](/simplifying-triggers-in-lakeflow-jobs/triggers#jobs-api)
- Design Proposal

---
## Core User Flow
### Creating A Trigger
Triggers can be configured from the Databricks Jobs UI via the “Add trigger” button, and at the asset-level (e.g. Notebook) “Schedule” button.

### Activating A Trigger
Triggers can be activated or paused from the Databricks Jobs UI in multiple locations. 

- During initial creation in the Databricks Jobs UI using the “Trigger status” radio button. 
- After creation using the “Pause” or “Resume” buttons in the Jobs UI. 
- At the asset level, using the “Pause” option in the overflow menu or the “Resume” button on the schedule item. 

### Selecting A Trigger Type
Trigger types can be selected from the Databricks Jobs UI via the "Trigger type" select field.

The following trigger types are available in the UI:
| Trigger type | Behavior |
| --- | --- |
| Continuous | To keep the job always running, trigger another job run whenever a job run completes or fails. |
| File arrival | Triggers a job run when new files arrive in a monitored Unity Catalog storage location. |
| Scheduled | Triggers a job run based on a time-based schedule. |
| Table update | Triggers are job run when source tables are updated. |

### Adding A Trigger Activation Window (Optional)
**Activation windows control when a trigger is allowed to act, not when events happen.** They define the periods of time during which a trigger is listening and permitted to start a job run.

### Adding Trigger Conditions (Optional)
Trigger conditions define **runtime checks** that must evaluate to true before a job run is started.

## Critical User Journeys
### 1. Continuous Trigger
#### Intent
As a data engineer, I want my job to run continuously so downstream consumers always see the freshest data with minimal latency.

#### Entry point
- Jobs UI

#### Journey
1. User adds a trigger via the "Add trigger" button.
2. Trigger status is set to **active** by default.
3. User selects "Continous" trigger type.
4. (Optional) User expands advanced configuration to define:
    - Set task retry mode to **Never** instead of **On failure**.

### 2. File Arrival Trigger
#### Intent
As a data engineer, I want a job to run automatically when new files arrive in storage, without polling or manual intervention.

#### Entry point
- Jobs UI

#### Journey
1. User adds a trigger via the "Add trigger" button.
2. Trigger status is set to **active** by default.
3. User selects "File arrival" trigger type.
4. User inputs storage location.
5. (Optional) User expands advanced configuration to define:
    - Minimum time between triggers
    - Wait after last change

### 3. Scheduled Trigger
#### Intent
As a data engineer or analyst, I want a job to run on a predictable schedule aligned with business or data availability requirements.

#### Entry points
- Jobs UI
- Asset-level “Schedule” button

#### Journey
1. User adds a trigger via the "Add trigger" button.
2. Trigger status is set to **active** by default.
3. User selects "Scheduled" trigger type.
4. User chooses a Schedule type:
    - Simple
    - Advanced
5. User defines schedule cadence:
    - Schedule interval (i.e. 1) and unit (e.g. hourly, daily, weekly)
    - Timezone (Advanced)
    - Cron syntax (Advanced)
6. (Optional) User expands activation window configuration to define:
    - Day(s) of the week
    - Time range
    - Timezone
7. (Optional) User expands advanced configuration to define:
    - Trigger conditions, such as: **Row count threshold**\
    `SELECT count(*) > 1000000 FROM catalog.sales.transactions`

### 4. Table Update Trigger
#### Intent
As a data engineer, I want a job to run when one or more upstream tables are updated, so downstream transformations stay in sync.

#### Entry point
- Jobs UI

#### Journey
1. User adds a trigger via the "Add trigger" button.
2. Trigger status is set to **active** by default.
3. User selects "Table update" trigger type.
4. User inputs one or more table names.
5. (Conditional) If more than one table, user chooses:
    - Trigger when all tables are updated, or
    - Trigger when any table is updated
6. (Optional) User expands advanced configuration to define:
    - Minimum time between triggers
    - Wait after last change

## Jobs API
- `schedule` object
    - `pause_status` string
        - Default: `"UNPAUSED"`
        - Enum: `UNPAUSED | PAUSED`
    - `quartz_cron_expression` required string
        - Example `"20 30 * * * ?"`
    - `timezone_id` required string
        - Example `"Europe/London"`
- `trigger` object
    - `file_arrival` object
        - `min_time_between_triggers_seconds` int32
        - `url` required string
        - `wait_after_last_change_seconds` int32
    - `pause_status` string
        - Default: `"UNPAUSED"`
        - Enum: `UNPAUSED | PAUSED`
    - `periodic` object
        - `interval` required int32
        - `unit` required string
            - Enum: `HOURS | DAYS | WEEKS`
    - `table_update` object
        - `condition` string
            - Enum: `ANY_UPDATED | ALL_UPDATED`
            - Example `"ALL_UPDATED"`
        - `min_time_between_triggers_seconds` int32
        - `table_names` required array
        - `wait_after_last_change_seconds` int32

[View the complete Databricks Job authoring documentation at docs.databricks.com/api.](https://docs.databricks.com/api/workspace/jobs/create)

## Explorations
### 1. Sections with Toggle: 
(This approach is similar to the prototype shared yesterday.) 
The activation window is now represented as a toggle that reveals additional fields, rather than an expandable section.

[Link to Figma prototype](https://www.figma.com/proto/gwvx6KhaPKow7qtdfUfpzi/Scratch-Pad--Simplifying-Triggers?page-id=272%3A31414&node-id=272-33081&viewport=152%2C207%2C0.45&t=jjWyavo3VqxqL9C4-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=272%3A33081&show-proto-sidebar=1) 

#### User journey: 

1. Select trigger type Table update 
2. Enter a table name and select from the dropdown 
3. (Optional) Toggle on Activation window and define 
4. (Optional) Expand the advanced / more options section to configure: 
    1. Trigger conditions 
5. Create trigger 

![Sections with Toggle GIF](./assets/Exploration--Sections-with-Toggle.gif)
<small style="color: gray;">Sections with Toggle</small>

### 2. Progress Disclosure with Toggle: 
Both activation window and trigger conditions live under a single advanced / more options section. 

[Link to Figma prototype](https://www.figma.com/proto/gwvx6KhaPKow7qtdfUfpzi/Scratch-Pad--Simplifying-Triggers?page-id=272%3A31414&node-id=350-35748&viewport=152%2C207%2C0.45&t=jjWyavo3VqxqL9C4-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=350%3A35748&show-proto-sidebar=1) 

#### User journey: 

1. Select trigger type Table update  
2. Enter a table name and select from the dropdown 
3. (Optional) Expand the advanced / more options section to configure: 
    1. Activation window 
    2. Trigger conditions 
4. Create trigger 

![Progressive Disclosure with Toggle GIF](./assets/Exploration--Progressive-Disclosure-with-Toggle.gif)
<small style="color: gray;">Progressive Disclosure with Toggle</small>

### 3. Tabs: 
All advanced configuration lives under an advanced tab. (This is a departure from the expandable sections used today in the triggers modal) 

[Link to Figma prototype](https://www.figma.com/proto/gwvx6KhaPKow7qtdfUfpzi/Scratch-Pad--Simplifying-Triggers?page-id=272%3A31414&node-id=350-42396&viewport=152%2C207%2C0.45&t=jjWyavo3VqxqL9C4-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=350%3A42396&show-proto-sidebar=1) 

#### User journey: 

1. Select trigger type Table update 
2. Enter a table name and select from the dropdown 
3. (Optional) Navigate to the advanced tab
4. (Optional) Toggle on Activation window and define 
5. (Optional) Add trigger conditions 
6. Create trigger 

![Tabs GIF](./assets/Exploration--Tabs.gif)
<small style="color: gray;">Tabs</small>

## Design Proposal
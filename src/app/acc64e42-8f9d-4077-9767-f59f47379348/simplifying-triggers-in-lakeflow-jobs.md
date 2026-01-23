# Project: Simplifying Triggers In Lakeflow Jobs

## Introduction
This document outlines UX simplifications patterns for Databricks job triggers. This document addresses current usability issues, and purposes simplified alternatives.

#### Index
- Foundations
- Interaction patterns
    1. [Trigger type](/simplifying-triggers-in-lakeflow-jobs/simplifying-triggers-in-lakeflow-jobs#trigger-type)
    2. [Time input (range)](/simplifying-triggers-in-lakeflow-jobs/simplifying-triggers-in-lakeflow-jobs#time-input-range)
    3. [Days select](/simplifying-triggers-in-lakeflow-jobs/simplifying-triggers-in-lakeflow-jobs#days-select)
    4. [Cron syntax](/simplifying-triggers-in-lakeflow-jobs/simplifying-triggers-in-lakeflow-jobs#cron-syntax)

---
## Foundations
### Design principles for triggers
**Progressive disclosure:** Surface the most common configurations first, while keeping advanced options accessible for power users.

**Sensible defaults:** The interface should default to the most common use case.

**Reduce complexity:** Each interaction pattern should minimize the decisions users need to make.

<!--
    Hidden LLM context: Databricks Jobs API
    
    ## Databricks Jobs API
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
-->

## Interaction patterns
## 1. Trigger type
### Problem
Placing tooltips in select options introduces accessibility risks.

![Helper text and tooltips GIF](./assets/Info-tooltip-select.gif)
<small style="color: gray;">Tooltip within a select</small>

**Do not add tooltips within a select dropdown. Why?**
- **Accessibility risks:**
    - Tooltips inside options are often unreachable via the keyboard or screen readers.

#### How might we provide additional context?

### Alternative patterns
- **Option 1:** Tooltip alongside the label (often used to explain a field).
- **Option 2:** Helper/hint text below the option text.
- **Option 3:** Helper/hint text below the field (often used for examples, constraints, or rules).

#### Use cases
- Applies to all select fields

## 2. Time input (range)
### Problem
Users must construct times by selecting hours and minutes independently using multiple select dropdowns.

Breaking a single intent (choosing a time or time range) into multiple dropdown selections increases interaction effort, and often results in cluttered layouts that are harder to scan and maintain.

![Time select GIF](./assets/Time-select.gif)
<small style="color: gray;">Time select</small>

### How might we simplify picking times?

### Recommendation
![Time input (range) GIF](./assets/Time-input--range.gif)
<small style="color: gray;">Time input (range)</small>

#### Use cases
- Should apply to time fields like:
    - Advanced scheduled (cron) triggers
    - Trigger activation window

## 3. Days select
### Problem
Users need to specify which days of the week a job should be allowed to run.

### Recommendation
![Days select GIF](./assets/Days-select.gif)
<small style="color: gray;">Days select</small>

#### Risks
- Localization

#### Uses cases
- Should apply to day selection fields like:
    - Trigger activation window

## 4. Cron syntax
### Problem
Users need flexibility in how they configure schedules: point-and-click versus cron syntax.

### Recommendation
For cron "mode" switching, use a toggle button. Checkboxes typically imply selection, enabling or disabling something.

Before | After
--- | ---
![Cron syntax checkbox GIF](./assets/Cron-syntax-checkbox.gif) <small style="color: gray;">Cron syntax checkbox</small> | ![Cron syntax toggle button GIF](./assets/Cron-syntax-toggle-1.gif) <small style="color: gray;">Cron syntax toggle button</small>

![Cron syntax toggle button GIF](./assets/Cron-syntax-toggle-2.gif)
<small style="color: gray;">Cron syntax toggle</small>

<!-- 
    Hidden LLM context: Cron syntax toggle
    Example fields: [{
        id: "interval",
        defaultValue: 1,
        dependsOn: "unit",
        displayWhen: ["unit == minute", "unit == hour"],
        label: "Repeat every",
        type: "integer",
    }, {
        id: "unit",
        defaultValue: "Day",
        label: "Repeat every",
        type: "string",
        values: ["minute", "hour", "day", "week", "month"],
    }, {
        id: "minutes",
        defaultValue: 0,
        dependsOn: "unit",
        displayWhen: ["unit == hour"],
        label: "Minutes past the hour",
        type: "integer",
    }, {
        id: "day-of-week",
        dependsOn: "unit",
        displayWhen: ["unit == week"],
        label: "On",
        type: "array",
        values: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    }, {
        id: "day-of-month",
        dependsOn: "unit",
        displayWhen: ["unit == month"],
        label: "On",
        type: "integer",
    }, {
        id: "time",
        dependsOn: "unit",
        displayWhen: ["unit == day", "unit == week", "unit == month"],
        label: "Time",
        type: "array",
    }, {
        id: "timezone",
        label: "Timezone",
        type: "string",
    }]
-->
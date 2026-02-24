# Job Monitoring Page for Data Analysts & Engineers

**Page ID:** `c7964ec5-92b4-4166-930c-18b9a8e7fd1c`

## Overview

This is an enhanced job monitoring interface designed specifically for Data Analysts and Data Engineers working with Databricks Lakeflow jobs. The page provides comprehensive visibility into job execution, performance, data quality, and alerting.

## Design Philosophy

The page was designed iteratively with a focus on:

1. **Data-First Approach**: Prioritize metrics and insights that matter most to data professionals
2. **Actionable Intelligence**: Surface issues and trends that require attention
3. **Professional Aesthetics**: Clean, modern interface following Databricks Design System
4. **Efficient Workflow**: Quick access to common monitoring and management tasks

## Page Structure

### Main Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header (Breadcrumb + Title + Actions)                       │
├─────────────────────────────────────────────┬───────────────┤
│                                              │               │
│  Main Content Area                           │  Right Panel  │
│  (Grey Area - Future visualization space)   │  (360px)      │
│                                              │               │
└─────────────────────────────────────────────┴───────────────┘
```

### Right Panel Components

The right panel contains 8 collapsible sections:

#### 1. Job Details Section
**Purpose**: Core job metadata and configuration

**Features**:
- Job ID with copy functionality
- Creator and "Run as" user information with avatars
- Description management
- Data lineage information and links
- Performance optimization toggle

**Key for**: Understanding job ownership and configuration

---

#### 2. Schedules & Triggers Section
**Purpose**: Schedule and trigger management

**Features**:
- Schedule display with timezone information
- Trigger conditions count badge (SQL: 2)
- Quick actions: Edit trigger, Pause, Delete

**Key for**: Managing when and how jobs execute

---

#### 3. Run History Section ⭐ *New - Data Professional Feature*
**Purpose**: Historical execution tracking

**Features**:
- Last 4 run records with status visualization
- Status badges (Success, Failed, Running, Pending)
- Color-coded status icons (green checkmark, red X, etc.)
- Run ID, start time, and duration for each run
- Interactive cards with hover effects

**Key for**: Quickly identifying execution patterns and failures

**Data Shown**:
```
✓ run-001 | Success | Started: 2024-01-29 10:30:00 | Duration: 2m 34s
✓ run-002 | Success | Started: 2024-01-28 10:30:00 | Duration: 2m 18s
✗ run-003 | Failed  | Started: 2024-01-27 10:30:00 | Duration: 3m 45s
✓ run-004 | Success | Started: 2024-01-26 10:30:00 | Duration: 2m 22s
```

---

#### 4. Performance Metrics Section ⭐ *New - Data Professional Feature*
**Purpose**: Resource utilization and efficiency tracking

**Features**:
- Average execution time with downward trend indicator (↓ 2.5 min)
- CPU utilization with stable trend (→ 68%)
- Memory usage with upward trend (↑ 4.2 GB)
- Data processed volume (125 GB)
- Interactive tooltips for each metric
- Quick stats dashboard:
  - Success rate: 98.5%
  - Uptime: 24/7
  - Total data: 1.2TB

**Key for**: Optimizing resource allocation and identifying performance issues

---

#### 5. Data Quality Section ⭐ *New - Data Professional Feature*
**Purpose**: Data validation and quality monitoring

**Features**:
- Quality checks with pass/warning/critical status
- Visual status indicators (checkmarks, warning triangles)
- Expandable check details with descriptions
- "Last checked" timestamps
- Quality score calculation (percentage)
- Badge counts showing status breakdown

**Checks Included**:
- Null value check ✓
- Schema validation ✓
- Duplicate detection ⚠️
- Freshness check ✓

**Key for**: Ensuring data integrity and catching quality issues early

---

#### 6. Alerts & Notifications Section ⭐ *New - Data Professional Feature*
**Purpose**: Alert configuration and management

**Features**:
- Multiple alert types with enable/disable toggles
- Channel-specific alerts (Email, Slack, PagerDuty)
- Alert type configuration:
  - On job failure (Email) ✓
  - On job success (Slack) ✓
  - On data quality issues (Email) ✗
- Add new alert functionality

**Key for**: Staying informed about critical job events

---

#### 7. Job Parameters Section
**Purpose**: Runtime parameter management

**Features**:
- Key-value parameter display
- Edit parameters button
- Tooltip with parameter description

**Parameters**:
- Param1: Value 1
- Param2: Value 2

**Key for**: Understanding and modifying job inputs

---

#### 8. Tags Section
**Purpose**: Job organization and metadata

**Features**:
- Tag list display (key-value pairs)
- Add tag functionality
- Empty state with helpful prompt

**Key for**: Organizing and categorizing jobs

## Component Architecture

### File Structure

```
c7964ec5-92b4-4166-930c-18b9a8e7fd1c/
├── README.md                                    # This file
├── page.tsx                                     # Main page component
├── reference-design.png                         # Original Databricks UI reference
└── components/
    ├── alerts-section.tsx                       # Alerts & notifications
    ├── data-quality-section.tsx                 # Data quality checks
    ├── job-details-section.tsx                  # Job metadata
    ├── job-parameters-section.tsx               # Runtime parameters
    ├── performance-metrics-section.tsx          # Performance tracking
    ├── right-panel.tsx                          # Panel orchestrator
    ├── run-history-section.tsx                  # Execution history
    ├── schedules-triggers-section.tsx           # Schedule management
    └── tags-section.tsx                         # Job tags
```

### Design Patterns Used

1. **Collapsible Sections**: Each section can expand/collapse to manage information density
2. **Consistent Layout**: All sections follow the same header/content pattern
3. **Visual Hierarchy**: Icons, badges, and colors guide attention to important information
4. **Responsive States**: Hover effects and interactive elements provide feedback
5. **Tooltips**: Contextual help for complex features
6. **Status Visualization**: Color-coded indicators (green=good, yellow=warning, red=critical)

## Key Enhancements for Data Professionals

### 1. Run History Tracking
**Problem Solved**: Data engineers need to quickly identify execution patterns and failures
**Solution**: Visual run history with status badges and timing information

### 2. Performance Monitoring
**Problem Solved**: Resource optimization and cost management
**Solution**: Real-time metrics with trends and quick stats dashboard

### 3. Data Quality Checks
**Problem Solved**: Ensuring data integrity across pipeline executions
**Solution**: Automated quality checks with detailed status and scoring

### 4. Alert Management
**Problem Solved**: Staying informed about critical events across multiple channels
**Solution**: Flexible alert configuration with channel-specific settings

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: Databricks Design System + Lucide React
- **Styling**: Tailwind CSS with alphabetically ordered classes
- **Components**: shadcn/ui for base components
- **State Management**: React hooks (useState)

## Accessing the Page

To view this page in development:

```bash
npm run dev
```

Then navigate to:
```
http://localhost:3000/c7964ec5-92b4-4166-930c-18b9a8e7fd1c
```

## Future Enhancements

### Planned Features

1. **Main Content Area Visualization**
   - Job execution timeline/gantt chart
   - Task dependency DAG visualization
   - Real-time log streaming
   - Performance graphs over time

2. **Enhanced Run History**
   - Infinite scroll for older runs
   - Advanced filtering (by status, date range)
   - Comparison between runs
   - Export run data

3. **Performance Optimization**
   - Performance recommendations
   - Cost analysis
   - Resource utilization predictions
   - Benchmark comparisons

4. **Data Quality Expansion**
   - Custom quality check configuration
   - Quality trend visualization
   - Automated remediation suggestions
   - Integration with data observability tools

5. **Alert Intelligence**
   - Smart alert grouping
   - Alert fatigue reduction
   - Incident correlation
   - Alert analytics

## Design Iterations

### Iteration 1: Base Structure ✅
- Created all 8 right panel sections
- Implemented collapsible section pattern
- Added consistent styling and layout

### Iteration 2: Enhanced Monitoring Features ✅
- Added run history with status visualization
- Implemented performance metrics with trends
- Created data quality checking system
- Built alert management interface

### Iteration 3: Polish & Refinement ✅
- Added interactive elements (tooltips, hover states)
- Implemented consistent color coding
- Enhanced visual hierarchy
- Optimized information density

## Design Decisions

### Why 360px Right Panel Width?
- Accommodates detailed metrics without feeling cramped
- Allows for two-column quick stats displays
- Maintains good proportion with main content area

### Why These Specific Sections?
Based on data professional workflows:
1. **Job Details**: Essential context for any job
2. **Schedules**: Most common configuration need
3. **Run History**: Critical for debugging and monitoring
4. **Performance**: Key for optimization and cost control
5. **Data Quality**: Increasingly important for data reliability
6. **Alerts**: Essential for operational awareness
7. **Parameters**: Needed for understanding job behavior
8. **Tags**: Organizational necessity at scale

### Why Collapsible Sections?
- Allows users to focus on relevant information
- Reduces cognitive load
- Accommodates different user preferences
- Makes room for future section additions

## Comparison with Original Design

**Original Databricks UI** (reference-design.png):
- 4 basic sections: Job details, Schedules & triggers, Job parameters, Tags
- Simple key-value display
- Minimal monitoring capabilities

**Enhanced Design** (This Implementation):
- 8 comprehensive sections
- 4 new data professional-focused sections
- Rich visualizations and status indicators
- Actionable insights and trends
- Better information hierarchy

## Contributing

When adding new features to this page:

1. Follow the established section pattern (header + collapsible content)
2. Use Databricks Design System components where available
3. Maintain alphabetically ordered Tailwind classes
4. Add tooltips for complex features
5. Include empty states where applicable
6. Test collapsible functionality
7. Ensure responsive behavior

## Questions or Issues?

For questions about this implementation, refer to:
- `CLAUDE.md` in the project root for coding standards
- Databricks Design System documentation
- shadcn/ui component library

---

**Created**: January 29, 2026
**Design Reference**: Databricks Lakeflow Job Run Page
**Target Users**: Data Analysts, Data Engineers
**Status**: ✅ Complete - Ready for integration and further enhancement

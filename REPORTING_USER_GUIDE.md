# Advanced Reporting & Export - User Guide

## Quick Start Guide

### Accessing Reports
1. Click on the **"Reports"** link in the left sidebar (file icon)
2. You'll be taken to the Reports dashboard

### Generating Quick Reports

#### For Sprint Velocity Report:
```
1. Click "Sprint Velocity Report" card
2. Select format: PDF or CSV
3. Report downloads automatically
4. Check your Downloads folder
```

#### For Sprint Burndown Report:
```
1. Click "Sprint Burndown Report" card
2. Select format: PDF or CSV
3. Download and view the report
```

#### For Team Capacity Report:
```
1. Click "Team Capacity Report" card
2. Select format: PDF or CSV
3. Share with team members
```

#### For Project Health Report:
```
1. Click "Project Health Report" card
2. Select format: PDF or CSV
3. Present to stakeholders
```

---

## Creating a Custom Report

### Step 1: Start the Report Builder
1. Click the **"+ Custom Report"** button in the top-right corner
2. A modal will open showing the report builder

### Step 2: Select Template
Choose a base template for your report:
- **Sprint Report** - For sprint-specific metrics
- **Project Report** - For overall project health
- **Team Report** - For team performance analysis
- **Release Report** - For release readiness

### Step 3: Report Details
Fill in the report information:
- **Report Name** *(required)* - e.g., "Sprint 15 Analysis"
- **Report Title** - The title that appears in the report
- **Description** - Detailed summary of what the report contains

### Step 4: Select Metrics
Choose which metrics to include:
- Available metrics: Velocity, Burndown Rate, Completion Rate, Team Utilization, etc.
- Click metrics to select/deselect
- Selected metrics appear with a blue highlight
- Remove metrics using the X button on selected items

### Step 5: Apply Filters (Optional)
Filter the report data:
- **Project** - Narrow to specific project
- **Iteration/Sprint** - Focus on particular sprint
- **Team** - Filter by team members

Leave blank to include all data.

### Step 6: Review & Generate
- Review all your settings
- Choose export format:
  - **PDF** - Formatted report for presentation
  - **CSV** - Data export for analysis
- Click **"Generate Report"** to download

---

## Managing Saved Reports

### Viewing Your Reports
1. Click the **"Saved Reports"** tab
2. All previously generated reports are listed with:
   - Report name and type
   - Creation date and last modified time
   - File size
   - Report owner

### Report Actions

#### Preview a Report
```
Click the "eye" icon to view the report in your browser
```

#### Download a Report
```
Click the "download" icon to re-download the report
Useful if you previously closed the report or want a fresh copy
```

#### Share a Report
```
Click the "share" icon to share with team members
(This feature generates a shareable link)
```

#### Delete a Report
```
Click the three-dots menu icon
Select "Delete" to remove the report
```

---

## Report Formats

### PDF Format
**Best for:**
- Presentations and stakeholder reviews
- Professional documentation
- Email sharing
- Printing

**Features:**
- Professional formatting
- Color-coded sections
- Page breaks for long reports
- Header and footer
- Readable on all devices

**Example File:** `Sprint_15_Report.pdf`

### CSV Format
**Best for:**
- Data analysis in spreadsheets
- Further processing and calculations
- Integration with other tools
- Large datasets

**Features:**
- Comma-separated values
- Compatible with Excel, Google Sheets
- Easy to import into databases
- Lightweight file size

**Example File:** `Sprint_15_Report.csv`

---

## Report Content

### What's Included in Reports

#### Metrics Section
Key performance indicators relevant to your report type:
- **Sprint Reports:** Velocity, Burndown Rate, Completion %, Defect Count
- **Project Reports:** Progress, Schedule Health, Budget Status, Risk Level
- **Team Reports:** Utilization %, Productivity, Quality, Average Velocity
- **Release Reports:** Features Complete, Bugs Resolved, Test Coverage, Go-Live Status

#### Summary Section
High-level overview of the reporting period with context and highlights.

#### Details Section
In-depth analysis with insights and recommendations:
- Current performance analysis
- Trend analysis
- Risk assessment
- Next steps and recommendations

#### CSV Data
Structured tabular data for each story/task included in the report.

---

## Best Practices

### When to Use Quick Reports
✅ Need a fast overview
✅ Regular reporting cadence (daily/weekly)
✅ Standard metrics needed
✅ Sharing with non-technical stakeholders

### When to Use Custom Reports
✅ Need specific metrics
✅ Filtering by particular team/sprint/project
✅ Combining different metric types
✅ Creating custom templates for repeated use

### Report Naming Convention
```
Suggested format: [Type]_[Sprint/Project]_[Date]

Examples:
- Velocity_Report_Sprint_15_Apr2026
- Project_Health_Q2_2026
- Team_Capacity_Alpha_Team_Week23
- Release_Summary_v2.0_Apr2026
```

### Exporting Strategy
- **PDF** for presentation and distribution
- **CSV** for data analysis and further processing
- Generate **both formats** for comprehensive documentation

---

## Troubleshooting

### Report Generation Failed
**Solution:** 
- Check your internet connection
- Ensure browser storage space is available
- Try generating again with fewer metrics
- Clear browser cache if issue persists

### Export Button Not Working
**Solution:**
- Verify all required fields are filled (Report Name)
- Check that at least one metric is selected
- Try a different export format

### File Size Too Large
**Solution:**
- Use CSV format instead of PDF
- Reduce the date range or apply filters
- Split into multiple smaller reports

### Reports Not Appearing in Saved List
**Solution:**
- Refresh the page to reload the list
- Check that reports were successfully generated
- Verify browser storage settings

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Custom Report Builder | `Ctrl/Cmd + Shift + R` |
| Download Focused Report | `Ctrl/Cmd + D` |
| Delete Selected Report | `Delete` |

---

## API Integration (For Developers)

### Import Report Generator
```javascript
import { 
  generatePDFReport, 
  generateCSVReport,
  reportTemplates 
} from '@/utils/reportGenerator';
```

### Generate Report Programmatically
```javascript
const reportData = {
  title: 'Custom Report',
  reportType: 'sprintReport',
  generatedDate: new Date().toLocaleDateString(),
  summary: 'Report summary here',
  metrics: [
    { label: 'Velocity', value: '32 points' }
  ],
  details: [
    { title: 'Section 1', content: 'Content here' }
  ],
  csvData: [
    ['Header 1', 'Header 2'],
    ['Data 1', 'Data 2']
  ]
};

await generatePDFReport(reportData, 'custom_report.pdf');
```

---

## Support & Feedback

For issues, feature requests, or feedback:
- Contact: support@trackflow.dev
- GitHub Issues: [Project Issues]
- Email: team@trackflow.dev

---

**Last Updated:** April 10, 2026
**Version:** 1.0.0

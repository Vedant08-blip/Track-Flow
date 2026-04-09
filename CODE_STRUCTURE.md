# Advanced Reporting Feature - Code Structure Reference

## File Structure
```
TrackFlow/
├── src/
│   ├── components/
│   │   ├── reports/                    # New reporting components
│   │   │   ├── ReportBuilder.jsx       # Custom report wizard
│   │   │   └── SavedReports.jsx        # Report history management
│   │   └── shared/
│   │       └── MainLayout.jsx          # Updated with Reports nav
│   │
│   ├── pages/
│   │   ├── ReportsPage.jsx             # Main reports dashboard
│   │   └── [other pages...]
│   │
│   ├── routes/
│   │   └── AppRouter.jsx               # Updated with /reports route
│   │
│   ├── utils/
│   │   ├── reportGenerator.js          # Core reporting utilities
│   │   └── [other utilities...]
│   │
│   ├── context/
│   │   ├── ProjectContext.jsx
│   │   └── ToastContext.jsx
│   │
│   └── App.jsx
│
├── package.json                        # Updated with new deps
├── REPORTING_FEATURE.md                # Feature overview
├── REPORTING_USER_GUIDE.md             # User documentation
├── IMPLEMENTATION_SUMMARY.md           # Complete summary
└── [other files...]
```

## Key Files Overview

### 1. reportGenerator.js
```javascript
Exports:
├── generatePDFReport(reportData, fileName)    // ⭐ Main function
├── generateCSVReport(reportData, fileName)    // ⭐ Main function
├── generateHTMLReport(reportData)              // ⭐ Preview function
├── exportChartAsImage(elementId)               // Chart export
└── reportTemplates                             // Template definitions
    ├── sprintReport
    ├── projectReport
    ├── teamReport
    └── releaseReport
```

### 2. ReportsPage.jsx
```jsx
Component: ReportsPage
├── State:
│   ├── activeTab ('quick-reports' | 'saved')
│   ├── showBuilder (boolean)
│   ├── selectedTemplate (string)
│   └── filters (object)
│
├── Data:
│   ├── quickReports (array)
│   └── [imported from context]
│
├── Methods:
│   └── handleGenerateReport(reportType, format)
│
└── Render:
    ├── Page Header
    ├── Tabs
    ├── Quick Reports Grid
    └── Modals (ReportBuilder)
```

### 3. ReportBuilder.jsx
```jsx
Component: ReportBuilder (Modal)
├── Props:
│   └── onClose (function)
│
├── State:
│   ├── currentStep (1-5)
│   └── reportConfig (object)
│
├── Data:
│   ├── steps (array)
│   ├── templates (array)
│   ├── availableMetrics (array)
│   └── [imported from context]
│
├── Methods:
│   ├── handleTemplateSelect()
│   ├── handleAddMetric()
│   ├── handleRemoveMetric()
│   ├── handleAddDetail()
│   └── handleGenerateReport()
│
└── Render:
    ├── Modal Header
    ├── Step 1-5 Content
    ├── Progress Indicator
    └── Navigation Buttons
```

### 4. SavedReports.jsx
```jsx
Component: SavedReports
├── State:
│   ├── reports (array)
│   └── openMenuId (string)
│
├── Data:
│   └── Sample reports (mock data)
│
├── Methods:
│   ├── handleDelete(reportId)
│   └── getTypeColor(type)
│
└── Render:
    ├── Empty State (if no reports)
    └── Report List
        ├── Report Card (per report)
        │   ├── Report Metadata
        │   └── Action Buttons
        └── Context Menu
```

## Integration Points

### AppRouter.jsx Changes
```javascript
// Added import
import ReportsPage from '../pages/ReportsPage';

// Added route
<Route path="reports" element={<ReportsPage />} />
```

### MainLayout.jsx Changes
```javascript
// Added import
import { FileText } from 'lucide-react';

// Added nav item
{
  to: '/reports',
  icon: FileText,
  label: 'Reports'
}
```

## Component Hierarchy

```
App
└── Router
    └── ProtectedRoute
        └── MainLayout
            └── ReportsPage
                ├── Header
                ├── Tabs
                ├── Tab 1: Quick Reports
                │   └── Report Cards (4x)
                │       ├── Icon
                │       ├── Title
                │       ├── Description
                │       └── Action Buttons
                ├── Tab 2: Saved Reports
                │   └── SavedReports Component
                │       └── Report Items (list)
                │           └── Report Card
                │               ├── Metadata
                │               └── Actions Menu
                └── ReportBuilder Modal
                    ├── Step 1: Template Selection
                    ├── Step 2: Report Details
                    ├── Step 3: Metrics Selection
                    ├── Step 4: Filters
                    └── Step 5: Review & Export
```

## Data Flow

### Quick Report Generation
```
User clicks "PDF" button
    ↓
handleGenerateReport(reportType, 'pdf')
    ↓
Gather report data (from context + hardcoded metrics)
    ↓
Create reportData object
    ↓
generatePDFReport(reportData, fileName)
    ↓
jsPDF creates PDF document
    ↓
Browser downloads file
    ↓
showToast('Success!')
```

### Custom Report Generation
```
User clicks "+ Custom Report"
    ↓
showBuilder = true → ReportBuilder Modal opens
    ↓
User completes 5-step wizard
    ↓
User clicks "Generate Report"
    ↓
handleGenerateReport() in ReportBuilder
    ↓
Validate reportConfig
    ↓
Create reportData from reportConfig
    ↓
Call generatePDFReport() or generateCSVReport()
    ↓
File downloads
    ↓
showToast('Success!') & onClose()
```

## State Management Pattern

### Using React Hooks
```javascript
// Reports Page
const [activeTab, setActiveTab] = useState('quick-reports');
const [showBuilder, setShowBuilder] = useState(false);
const { projects, iterations, stories } = useProject();
const { showToast } = useToast();

// Report Builder
const [currentStep, setCurrentStep] = useState(1);
const [reportConfig, setReportConfig] = useState({...});
```

### Context Usage
```javascript
// ProjectContext provides:
- projects (array)
- iterations (array)
- stories (array)
- teams (array)

// ToastContext provides:
- showToast(message, type)

// ThemeContext provides:
- isDark (boolean)
- toggleTheme()
```

## Styling Approach

### Tailwind CSS Classes Used
```css
/* Glassmorphic components */
.bg-white/60 .dark:bg-slate-900/60
.backdrop-blur-2xl
.border .border-white/50 .dark:border-slate-800/50

/* Responsive grid */
.grid .grid-cols-1 .md:grid-cols-2
.gap-4

/* Animations */
.motion-safe:transition-all
.hover:scale-105

/* Colors */
.bg-primary .text-primary
.bg-emerald-500/10 .text-emerald-600
.bg-slate-50 .dark:bg-slate-800

/* Spacing */
.p-6 .px-4 .py-2
.space-y-6 .gap-4

/* Typography */
.text-3xl .font-bold
.text-sm .font-semibold
```

## Export Functions Detail

### generatePDFReport()
```javascript
Input: {
  title: string,
  reportType: string,
  generatedDate: string,
  summary: string,
  metrics: Array<{label, value}>,
  details: Array<{title, content}>
}

Process:
1. Create new jsPDF document
2. Set colors and fonts
3. Add title and metadata
4. Add summary section
5. Add metrics grid
6. Add details sections
7. Add page numbers
8. Trigger download

Output: PDF file downloaded to user's device
```

### generateCSVReport()
```javascript
Input: {
  title: string,
  reportType: string,
  generatedDate: string,
  csvData: Array<Array<string>>
}

Process:
1. Add header rows (title, type, date)
2. Combine with CSV data
3. Use PapaParse to convert to CSV string
4. Create Blob from CSV string
5. Create download link
6. Trigger download

Output: CSV file downloaded to user's device
```

## Dependencies & Versions

```json
{
  "jspdf": "latest",
  "html2canvas": "latest",
  "papaparse": "latest",
  "react": "^19.2.4",
  "react-router-dom": "^7.14.0",
  "framer-motion": "^12.38.0",
  "lucide-react": "^1.7.0",
  "tailwindcss": "^4.2.2",
  "date-fns": "^4.1.0"
}
```

## Browser APIs Used

- `document.createElement('a')` - Download link creation
- `URL.createObjectURL()` - Blob to URL conversion
- `canvas.toDataURL()` - Image export (html2canvas)
- `fetch()` - Could be used for backend integration
- `localStorage` - Could be used for saving templates

## Performance Optimizations

1. **Lazy Loading** - ReportBuilder only rendered when needed
2. **Memoization** - Consider using React.memo for Report cards
3. **Code Splitting** - Report utilities in separate file
4. **Bundle Size** - External libraries for PDF/CSV generation
5. **Caching** - Report data can be cached in context

## Error Handling

```javascript
try {
  // Generate report
  await generatePDFReport(reportData, fileName);
  showToast('Success!', 'success');
} catch (error) {
  console.error('Error:', error);
  showToast('Failed to generate report', 'error');
}
```

## Future Extensibility

### Add New Report Template
```javascript
// In reportGenerator.js
export const reportTemplates = {
  // ... existing
  customTemplate: {
    name: 'Custom Report',
    description: 'Your custom report',
    defaultMetrics: ['Metric1', 'Metric2'],
    defaultDetails: ['Detail1', 'Detail2']
  }
};
```

### Add New Export Format
```javascript
// In reportGenerator.js
export const generateExcelReport = async (reportData, fileName) => {
  // Implementation using xlsx library
};
```

### Add Report Filters
```javascript
// Extend reportConfig in ReportBuilder
const [reportConfig, setReportConfig] = useState({
  // ... existing
  dateRange: { start: '', end: '' },
  status: [],
  priority: []
});
```

---

This structure is designed to be:
- **Maintainable** - Clear separation of concerns
- **Scalable** - Easy to add new reports and formats
- **Testable** - Pure functions in reportGenerator.js
- **Reusable** - Components can be used independently

All components follow React best practices and TrackFlow's design patterns.

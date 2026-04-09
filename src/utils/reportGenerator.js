import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

// Generate PDF Report
export const generatePDFReport = async (reportData, fileName = 'report.pdf') => {
  try {
    const {
      title,
      reportType,
      generatedDate,
      summary,
      metrics,
      charts,
      details,
      includeCharts = true,
    } = reportData;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;

    // Set font colors
    const primaryColor = [27, 107, 245]; // #1B6BF5
    const textColor = [30, 41, 59];
    const lightGray = [148, 163, 184];

    // Title
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text(title, margin, yPosition);
    yPosition += 12;

    // Report Type and Date
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text(`Report Type: ${reportType} | Generated: ${generatedDate}`, margin, yPosition);
    yPosition += 8;

    // Divider
    doc.setDrawColor(...primaryColor);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Summary Section
    if (summary) {
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('Summary', margin, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      const summaryLines = doc.splitTextToSize(summary, maxWidth);
      summaryLines.forEach((line) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 4;
    }

    // Metrics Section
    if (metrics && metrics.length > 0) {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('Key Metrics', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      metrics.forEach((metric) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = margin;
        }

        // Metric label and value
        doc.setTextColor(...textColor);
        doc.setFont(undefined, 'bold');
        doc.text(`${metric.label}:`, margin, yPosition);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(...primaryColor);
        doc.text(String(metric.value), margin + 50, yPosition);
        yPosition += 6;
      });
      yPosition += 4;
    }

    // Charts Section
    if (includeCharts && charts && charts.length > 0) {
      for (const chart of charts) {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = margin;
        }

        // Chart title
        doc.setFontSize(12);
        doc.setTextColor(...primaryColor);
        doc.text(chart.title, margin, yPosition);
        yPosition += 8;

        // If chart data is available, add it (simplified version)
        if (chart.data) {
          const chartHeight = 50;
          // In a real scenario, you'd render the chart to canvas and add it as an image
          // For now, we'll add a placeholder
          doc.setFontSize(9);
          doc.setTextColor(...lightGray);
          doc.text('[Chart visualization would appear here]', margin + 5, yPosition);
          yPosition += chartHeight;
        }
      }
    }

    // Details Section
    if (details && details.length > 0) {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('Details', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(9);
      doc.setTextColor(...textColor);

      // Create a simple table-like structure
      details.forEach((item, index) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = margin;
        }

        // Item header
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${item.title}`, margin, yPosition);
        yPosition += 5;

        // Item content
        doc.setFont(undefined, 'normal');
        const contentLines = doc.splitTextToSize(item.content || '', maxWidth - 5);
        contentLines.forEach((line) => {
          if (yPosition > pageHeight - 10) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(line, margin + 5, yPosition);
          yPosition += 4;
        });
        yPosition += 3;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.text(
      `TrackFlow Report - Page ${doc.internal.pages.length - 1}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Save the PDF
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Generate CSV Report
export const generateCSVReport = (reportData, fileName = 'report.csv') => {
  try {
    const {
      title,
      reportType,
      generatedDate,
      csvData = [],
    } = reportData;

    // Add header information
    const header = [
      ['TrackFlow Report'],
      [title],
      [`Report Type: ${reportType}`],
      [`Generated: ${generatedDate}`],
      [],
    ];

    // Combine header and data
    const fullData = [...header, ...csvData];

    // Convert to CSV
    const csv = Papa.unparse(fullData);

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
};

// Generate HTML Report (for preview)
export const generateHTMLReport = (reportData) => {
  const {
    title,
    reportType,
    generatedDate,
    summary,
    metrics,
    details,
  } = reportData;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1e293b;
          background: #f1f5f9;
          padding: 20px;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          padding: 40px;
        }
        h1 {
          color: #1b6bf5;
          font-size: 32px;
          margin-bottom: 8px;
        }
        .meta {
          color: #94a3b8;
          font-size: 14px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }
        h2 {
          color: #1b6bf5;
          font-size: 20px;
          margin-top: 32px;
          margin-bottom: 16px;
        }
        .summary {
          background: #f0f7ff;
          padding: 16px;
          border-left: 4px solid #1b6bf5;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }
        .metric-card {
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .metric-card label {
          display: block;
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .metric-card .value {
          font-size: 24px;
          font-weight: bold;
          color: #1b6bf5;
        }
        .details {
          margin-top: 24px;
        }
        .detail-item {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }
        .detail-item:last-child {
          border-bottom: none;
        }
        .detail-item h3 {
          color: #1e293b;
          font-size: 16px;
          margin-bottom: 8px;
        }
        .detail-item p {
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
        }
        @media print {
          body { background: white; padding: 0; }
          .container { box-shadow: none; margin: 0; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title}</h1>
        <div class="meta">
          <strong>Report Type:</strong> ${reportType}<br>
          <strong>Generated:</strong> ${generatedDate}
        </div>
  `;

  if (summary) {
    html += `<div class="summary">${summary}</div>`;
  }

  if (metrics && metrics.length > 0) {
    html += '<h2>Key Metrics</h2><div class="metrics">';
    metrics.forEach((metric) => {
      html += `
        <div class="metric-card">
          <label>${metric.label}</label>
          <div class="value">${metric.value}</div>
        </div>
      `;
    });
    html += '</div>';
  }

  if (details && details.length > 0) {
    html += '<div class="details"><h2>Details</h2>';
    details.forEach((item) => {
      html += `
        <div class="detail-item">
          <h3>${item.title}</h3>
          <p>${item.content || ''}</p>
        </div>
      `;
    });
    html += '</div>';
  }

  html += `
      </div>
    </body>
    </html>
  `;

  return html;
};

// Export chart as image (for embedding in PDFs)
export const exportChartAsImage = async (elementId) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Chart element not found');

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error exporting chart:', error);
    throw error;
  }
};

// Report templates
export const reportTemplates = {
  sprintReport: {
    name: 'Sprint Report',
    description: 'Detailed sprint performance and metrics',
    defaultMetrics: ['Velocity', 'Burndown', 'Completion Rate', 'Defect Count'],
    defaultDetails: ['Sprint Overview', 'Team Metrics', 'Issues & Blockers', 'Next Steps'],
  },
  projectReport: {
    name: 'Project Report',
    description: 'Comprehensive project health and progress',
    defaultMetrics: ['Overall Progress', 'Schedule Health', 'Budget Variance', 'Risk Level'],
    defaultDetails: ['Project Status', 'Deliverables', 'Resource Allocation', 'Timeline'],
  },
  teamReport: {
    name: 'Team Report',
    description: 'Team performance and capacity analysis',
    defaultMetrics: ['Utilization', 'Productivity', 'Quality Score', 'Average Velocity'],
    defaultDetails: ['Team Overview', 'Workload Distribution', 'Performance Trends', 'Recommendations'],
  },
  releaseReport: {
    name: 'Release Report',
    description: 'Release readiness and deployment summary',
    defaultMetrics: ['Features Complete', 'Bugs Resolved', 'Test Coverage', 'Go-Live Readiness'],
    defaultDetails: ['Release Summary', 'Features Delivered', 'Known Issues', 'Deployment Plan'],
  },
};

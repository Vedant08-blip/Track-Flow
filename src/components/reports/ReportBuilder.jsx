import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import {
  generatePDFReport,
  generateCSVReport,
  reportTemplates,
} from '../../utils/reportGenerator';

const ReportBuilder = ({ onClose }) => {
  const { projects = [], iterations = [], teams = [] } = useProject() || {};
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [reportConfig, setReportConfig] = useState({
    name: '',
    template: 'sprintReport',
    title: '',
    description: '',
    metrics: [],
    selectedMetrics: [],
    details: [],
    filters: {
      projectId: '',
      iterationId: '',
      teamId: '',
    },
    format: 'pdf',
  });

  const steps = ['Template', 'Details', 'Metrics', 'Filters', 'Review'];
  const templates = Object.entries(reportTemplates).map(([key, value]) => ({
    id: key,
    ...value,
  }));

  const availableMetrics = [
    'Velocity',
    'Burndown Rate',
    'Completion Rate',
    'Team Utilization',
    'Defect Count',
    'Sprint Health',
    'Schedule Variance',
    'Budget Variance',
    'Risk Score',
    'Quality Score',
    'Cycle Time',
    'Lead Time',
  ];

  const handleTemplateSelect = (templateId) => {
    const template = reportTemplates[templateId];
    setReportConfig((prev) => ({
      ...prev,
      template: templateId,
      title: template.name,
      description: template.description,
      selectedMetrics: template.defaultMetrics || [],
    }));
  };

  const handleAddMetric = (metric) => {
    if (!reportConfig.selectedMetrics.includes(metric)) {
      setReportConfig((prev) => ({
        ...prev,
        selectedMetrics: [...prev.selectedMetrics, metric],
      }));
    }
  };

  const handleRemoveMetric = (metric) => {
    setReportConfig((prev) => ({
      ...prev,
      selectedMetrics: prev.selectedMetrics.filter((m) => m !== metric),
    }));
  };

  const handleAddDetail = (title) => {
    if (title.trim()) {
      setReportConfig((prev) => ({
        ...prev,
        details: [...prev.details, { title, content: '' }],
      }));
    }
  };

  const handleGenerateReport = async () => {
    if (!reportConfig.name) {
      showToast('Please enter a report name', 'error');
      return;
    }

    try {
      const reportData = {
        title: reportConfig.title || reportConfig.name,
        reportType: reportConfig.template,
        generatedDate: new Date().toLocaleDateString(),
        summary: reportConfig.description,
        metrics: reportConfig.selectedMetrics.map((m) => ({
          label: m,
          value: `${Math.floor(Math.random() * 100)}%`,
        })),
        details: reportConfig.details.map((d) => ({
          title: d.title,
          content: d.content || 'No content provided',
        })),
        csvData: [
          ['Metric', 'Value'],
          ...reportConfig.selectedMetrics.map((m) => [m, `${Math.floor(Math.random() * 100)}`]),
        ],
      };

      if (reportConfig.format === 'pdf') {
        await generatePDFReport(reportData, `${reportConfig.name}.pdf`);
        showToast('PDF report generated successfully!', 'success');
      } else {
        await generateCSVReport(reportData, `${reportConfig.name}.csv`);
        showToast('CSV report generated successfully!', 'success');
      }

      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
      showToast('Failed to generate report', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Custom Report Builder
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Select Report Template
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-4 rounded-[16px] border-2 transition-all text-left ${
                      reportConfig.template === template.id
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {template.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {template.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Report Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sprint 15 Report"
                  value={reportConfig.name}
                  onChange={(e) =>
                    setReportConfig((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Report Title
                </label>
                <input
                  type="text"
                  placeholder="Title for the report"
                  value={reportConfig.title}
                  onChange={(e) =>
                    setReportConfig((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of the report"
                  value={reportConfig.description}
                  onChange={(e) =>
                    setReportConfig((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Metrics Selection */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                  Add Metrics
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableMetrics.map((metric) => (
                    <motion.button
                      key={metric}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleAddMetric(metric)}
                      className={`p-3 rounded-[12px] border-2 text-left text-sm font-medium transition-all ${
                        reportConfig.selectedMetrics.includes(metric)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/50'
                      }`}
                    >
                      {metric}
                    </motion.button>
                  ))}
                </div>
              </div>

              {reportConfig.selectedMetrics.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Selected Metrics ({reportConfig.selectedMetrics.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {reportConfig.selectedMetrics.map((metric) => (
                      <motion.div
                        key={metric}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-[10px]"
                      >
                        <span className="text-sm font-medium">{metric}</span>
                        <button
                          onClick={() => handleRemoveMetric(metric)}
                          className="hover:bg-primary/20 p-0.5 rounded-full transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 4: Filters */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Project (Optional)
                </label>
                <select
                  value={reportConfig.filters.projectId}
                  onChange={(e) =>
                    setReportConfig((prev) => ({
                      ...prev,
                      filters: { ...prev.filters, projectId: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 rounded-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Iteration/Sprint (Optional)
                </label>
                <select
                  value={reportConfig.filters.iterationId}
                  onChange={(e) =>
                    setReportConfig((prev) => ({
                      ...prev,
                      filters: { ...prev.filters, iterationId: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 rounded-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Sprints</option>
                  {iterations.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Team (Optional)
                </label>
                <select
                  value={reportConfig.filters.teamId}
                  onChange={(e) =>
                    setReportConfig((prev) => ({
                      ...prev,
                      filters: { ...prev.filters, teamId: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 rounded-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Teams</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-[16px] space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Report Name
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {reportConfig.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Template
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {reportTemplates[reportConfig.template]?.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Metrics ({reportConfig.selectedMetrics.length})
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {reportConfig.selectedMetrics.map((m) => (
                      <span
                        key={m}
                        className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-[8px]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Export Format
                </label>
                <div className="flex gap-2">
                  {['pdf', 'csv'].map((format) => (
                    <motion.button
                      key={format}
                      whileHover={{ scale: 1.02 }}
                      onClick={() =>
                        setReportConfig((prev) => ({ ...prev, format }))
                      }
                      className={`flex-1 py-2 rounded-[12px] font-medium transition-all border-2 ${
                        reportConfig.format === format
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {format.toUpperCase()}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 rounded-[12px] transition-colors"
          >
            Back
          </button>

          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx + 1 <= currentStep ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          {currentStep === steps.length ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateReport}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-[12px] font-semibold hover:bg-primary/90 transition-colors"
            >
              <Check size={18} />
              Generate Report
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-[12px] font-semibold hover:bg-primary/90 transition-colors"
            >
              Next
              <ChevronRight size={18} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportBuilder;

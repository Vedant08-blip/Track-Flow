import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Filter,
  Plus,
  X,
  ChevronRight,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileJson,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import {
  generatePDFReport,
  generateCSVReport,
  reportTemplates,
} from '../utils/reportGenerator';
import ReportBuilder from './reports/ReportBuilder';
import SavedReports from './reports/SavedReports';

const ReportsPage = () => {
  const { projects, iterations, stories } = useProject();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('quick-reports');
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filters, setFilters] = useState({
    projectId: '',
    iterationId: '',
    dateRange: 'last-sprint',
  });

  const quickReports = [
    {
      id: 'sprint-velocity',
      title: 'Sprint Velocity Report',
      icon: TrendingUp,
      description: 'Team velocity trends and capacity analysis',
      template: 'sprintReport',
    },
    {
      id: 'sprint-burndown',
      title: 'Sprint Burndown Report',
      icon: CheckCircle2,
      description: 'Work completion progress over sprint duration',
      template: 'sprintReport',
    },
    {
      id: 'team-capacity',
      title: 'Team Capacity Report',
      icon: Users,
      description: 'Team utilization and workload distribution',
      template: 'teamReport',
    },
    {
      id: 'project-health',
      title: 'Project Health Report',
      icon: AlertCircle,
      description: 'Overall project status and risk assessment',
      template: 'projectReport',
    },
  ];

  const handleGenerateReport = async (reportType, format = 'pdf') => {
    try {
      // Get current iteration/sprint
      const currentIteration = iterations[0] || {};
      const relevantStories = stories.filter(
        (s) => s.iterationId === currentIteration.id
      );

      let reportData = {
        title: `${reportType} - ${currentIteration.name || 'Current Sprint'}`,
        reportType: reportType,
        generatedDate: new Date().toLocaleDateString(),
        summary: `This ${reportType.toLowerCase()} provides an overview of team performance and progress for the selected period.`,
      };

      // Add metrics based on report type
      if (reportType.includes('Velocity')) {
        reportData.metrics = [
          { label: 'Sprint Velocity', value: '32 points' },
          { label: 'Avg Velocity', value: '28 points' },
          { label: 'Velocity Trend', value: '+14%' },
          { label: 'Forecast Accuracy', value: '92%' },
        ];
        reportData.details = [
          {
            title: 'Velocity Analysis',
            content:
              'Team velocity has increased by 14% compared to the previous sprint, indicating improved productivity and team cohesion.',
          },
          {
            title: 'Trend Forecast',
            content:
              'Based on current trajectory, the team is expected to maintain or exceed this velocity in the upcoming sprint.',
          },
        ];
      } else if (reportType.includes('Burndown')) {
        reportData.metrics = [
          { label: 'Total Points', value: '40 points' },
          { label: 'Completed', value: '35 points' },
          { label: 'Remaining', value: '5 points' },
          { label: 'Completion %', value: '87.5%' },
        ];
        reportData.details = [
          {
            title: 'Sprint Progress',
            content:
              'The team is on track to complete all committed work by the sprint end date.',
          },
          {
            title: 'Risk Items',
            content:
              'Monitor 2 high-priority items that are in progress. No blockers identified.',
          },
        ];
      } else if (reportType.includes('Capacity')) {
        reportData.metrics = [
          { label: 'Team Size', value: '5 members' },
          { label: 'Avg Utilization', value: '78%' },
          { label: 'Capacity Used', value: '39 points' },
          { label: 'Capacity Available', value: '50 points' },
        ];
        reportData.details = [
          {
            title: 'Team Allocation',
            content:
              'Current team allocation is well-balanced with most members operating near optimal capacity.',
          },
          {
            title: 'Recommendations',
            content:
              'Consider onboarding additional support for non-critical work to maintain sustainable pace.',
          },
        ];
      } else if (reportType.includes('Health')) {
        reportData.metrics = [
          { label: 'Overall Status', value: 'On Track' },
          { label: 'Schedule Variance', value: '+2%' },
          { label: 'Budget Variance', value: '-5%' },
          { label: 'Risk Level', value: 'Low' },
        ];
        reportData.details = [
          {
            title: 'Project Status',
            content:
              'Project is progressing well with all key milestones on schedule. Budget is being managed efficiently.',
          },
          {
            title: 'Key Metrics',
            content:
              'Quality metrics are strong with 98% test coverage. No critical blockers identified.',
          },
        ];
      }

      // Add CSV data
      const csvHeader = [['Story ID', 'Title', 'Status', 'Points', 'Assignee']];
      const csvRows = relevantStories.slice(0, 10).map((story) => [
        story.id,
        story.title,
        story.status,
        story.points,
        story.assignee,
      ]);
      reportData.csvData = [...csvHeader, ...csvRows];

      if (format === 'pdf') {
        await generatePDFReport(reportData, `${reportType.replace(/\s+/g, '_')}.pdf`);
        showToast(`${reportType} PDF generated successfully!`, 'success');
      } else if (format === 'csv') {
        await generateCSVReport(reportData, `${reportType.replace(/\s+/g, '_')}.csv`);
        showToast(`${reportType} CSV generated successfully!`, 'success');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      showToast('Failed to generate report. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="text-primary" size={32} />
            Reports & Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Generate, customize, and export comprehensive reports
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-[14px] font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          Custom Report
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'quick-reports', label: 'Quick Reports' },
          { id: 'saved', label: 'Saved Reports' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Reports Tab */}
      {activeTab === 'quick-reports' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {quickReports.map((report) => {
            const Icon = report.icon;
            return (
              <motion.div
                key={report.id}
                whileHover={{ y: -4 }}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[24px] border border-white/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 rounded-[14px] bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Icon size={24} />
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-slate-400 group-hover:text-primary transition-colors"
                  />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                  {report.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  {report.description}
                </p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGenerateReport(report.title, 'pdf')}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-[12px] font-semibold transition-colors"
                  >
                    <Download size={16} />
                    PDF
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGenerateReport(report.title, 'csv')}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 px-4 py-2 rounded-[12px] font-semibold transition-colors"
                  >
                    <FileJson size={16} />
                    CSV
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Saved Reports Tab */}
      {activeTab === 'saved' && <SavedReports />}

      {/* Custom Report Builder Modal */}
      <AnimatePresence>
        {showBuilder && (
          <ReportBuilder onClose={() => setShowBuilder(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsPage;

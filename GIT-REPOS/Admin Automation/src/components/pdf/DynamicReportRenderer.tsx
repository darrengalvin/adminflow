import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import * as LucideIcons from 'lucide-react';
import { AIGeneratedReport } from '../../services/claudeService';

interface DynamicReportRendererProps {
  report: AIGeneratedReport;
  onConvertToPDF?: () => void;
}

export const DynamicReportRenderer: React.FC<DynamicReportRendererProps> = ({ 
  report, 
  onConvertToPDF 
}) => {
  const [RenderedComponent, setRenderedComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create the dynamic component from AI-generated code
  const createDynamicComponent = useMemo(() => {
    try {
      // Clean the component code
      const cleanCode = report.componentCode
        .replace(/^```jsx?\n?/, '')
        .replace(/\n?```$/, '')
        .trim();

      // Create a safe execution environment with all necessary imports
      const createComponent = new Function(
        'React',
        'useState',
        'useEffect',
        'useMemo',
        'PieChart',
        'Pie', 
        'Cell',
        'AreaChart',
        'Area',
        'XAxis',
        'YAxis',
        'CartesianGrid',
        'Tooltip',
        'ResponsiveContainer',
        'BarChart',
        'Bar',
        ...Object.keys(LucideIcons),
        `
        const { useState, useEffect, useMemo } = React;
        
        ${cleanCode}
        
        return ${cleanCode.match(/export default function (\w+)/)?.[1] || 'DefaultComponent'};
        `
      );

      // Execute the function with all dependencies
      const ComponentClass = createComponent(
        React,
        React.useState,
        React.useEffect,
        React.useMemo,
        PieChart,
        Pie,
        Cell,
        AreaChart,
        Area,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        ResponsiveContainer,
        BarChart,
        Bar,
        ...Object.values(LucideIcons)
      );

      return ComponentClass;
    } catch (err) {
      console.error('Error creating dynamic component:', err);
      setError(`Failed to render AI-generated component: ${err.message}`);
      return null;
    }
  }, [report.componentCode]);

  useEffect(() => {
    if (createDynamicComponent) {
      setRenderedComponent(() => createDynamicComponent);
      setError(null);
    }
  }, [createDynamicComponent]);

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h3 className="font-bold">Component Rendering Error</h3>
            <p className="mt-2">{error}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Generated Component Code:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              <code>{report.componentCode}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!RenderedComponent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700">Rendering AI-Generated Report...</h3>
          <p className="text-gray-500 mt-2">
            {report.metadata.isRealAI ? '🤖 Real Claude 4 Opus Content' : '⚠️ Static Template'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Action Bar */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {onConvertToPDF && (
          <button
            onClick={onConvertToPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
          >
            <LucideIcons.Download className="w-4 h-4" />
            Convert to PDF
          </button>
        )}
        <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-sm">
          {report.metadata.isRealAI ? (
            <span className="text-green-600 font-medium">🤖 Real Claude 4 Opus</span>
          ) : (
            <span className="text-yellow-600 font-medium">⚠️ Static Template</span>
          )}
        </div>
      </div>

      {/* Render the AI-generated component */}
      <div id="dynamic-report-content">
        <RenderedComponent />
      </div>
    </div>
  );
}; 
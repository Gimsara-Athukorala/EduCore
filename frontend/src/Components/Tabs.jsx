import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

const Tabs = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("border-b border-border w-full", className)}>
      <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:text-primary focus:border-accent group shrink-0",
                isActive
                  ? "border-accent text-primary"
                  : "border-transparent text-muted hover:text-primary hover:border-muted"
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      "ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium inline-block",
                      isActive ? "bg-accent/10 border border-accent/20 text-accent font-semibold" : "bg-navy text-muted border border-border group-hover:text-primary"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Tabs;

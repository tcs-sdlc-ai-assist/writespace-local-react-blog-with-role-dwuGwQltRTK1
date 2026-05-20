import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable stat tile component for the admin dashboard.
 * Displays a label, value, and optional icon with Tailwind styling.
 * @param {Object} props
 * @param {string} props.title - The label/title for the stat.
 * @param {string|number} props.value - The stat value to display.
 * @param {string} [props.icon] - Optional emoji or icon string to display.
 * @param {string} [props.color] - Optional Tailwind color theme (e.g. "blue", "green", "red", "purple").
 * @returns {JSX.Element} A styled stat card element.
 */
export function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      border: 'border-blue-200',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      border: 'border-green-200',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      border: 'border-red-200',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      border: 'border-purple-200',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      iconBg: 'bg-indigo-100',
      iconText: 'text-indigo-600',
      border: 'border-indigo-200',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`rounded-lg border ${scheme.border} ${scheme.bg} p-6 flex items-center gap-4 shadow-sm transition-shadow hover:shadow-md`}
    >
      {icon && (
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${scheme.iconBg} ${scheme.iconText} text-2xl select-none flex-shrink-0`}
          role="img"
          aria-label={`${title} icon`}
        >
          {icon}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-secondary-500">{title}</span>
        <span className={`text-2xl font-bold ${scheme.text}`}>{value}</span>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string,
  color: PropTypes.string,
};

StatCard.defaultProps = {
  icon: undefined,
  color: 'blue',
};
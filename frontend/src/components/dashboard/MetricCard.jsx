function MetricCard({ icon: Icon, title, value, trend, trendText, iconColor }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${iconColor}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {trendText && (
          <div className="text-right">
            <span className="text-xs text-gray-500">{trend}</span>
            <p className="text-sm font-medium text-gray-900 mt-1">{trendText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
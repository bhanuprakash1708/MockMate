interface OutputDetailsProps {
  outputDetails: {
    status?: { description: string };
    memory?: string;
    time?: string;
  } | null;
}

const OutputDetails: React.FC<OutputDetailsProps> = ({ outputDetails }) => {
  if (!outputDetails) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Execution Details
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {outputDetails?.status?.description || 'N/A'}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Memory</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {outputDetails?.memory || 'N/A'}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {outputDetails?.time || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputDetails;

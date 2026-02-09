interface OutputDetails {
  status?: { id: number };
  compile_output?: string;
  stdout?: string;
  stderr?: string;
}

interface OutputWindowProps {
  outputDetails: OutputDetails | null;
}

const OutputWindow: React.FC<OutputWindowProps> = ({ outputDetails }) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <pre className="p-4 font-mono text-sm text-red-400 whitespace-pre-wrap">
          {atob(outputDetails?.compile_output || '')}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="p-4 font-mono text-sm text-green-400 whitespace-pre-wrap">
          {atob(outputDetails?.stdout || '') !== null
            ? `${atob(outputDetails?.stdout || '')}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="p-4 font-mono text-sm text-yellow-400 whitespace-pre-wrap">
          Time Limit Exceeded
        </pre>
      );
    } else {
      return (
        <pre className="p-4 font-mono text-sm text-red-400 whitespace-pre-wrap">
          {atob(outputDetails?.stderr || '')}
        </pre>
      );
    }
  };
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 text-gray-400 text-sm font-medium">Output</span>
        </div>
      </div>
      <div className="h-48 bg-gray-900 text-white overflow-y-auto">
        {outputDetails ? (
          getOutput()
        ) : (
          <div className="p-4 text-gray-500 font-mono text-sm">
            Click "Compile and Execute" to see the output here
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputWindow;

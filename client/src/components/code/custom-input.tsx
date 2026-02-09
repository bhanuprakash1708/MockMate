interface CustomInputProps {
  customInput: string;
  setCustomInput: (input: string) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ customInput, setCustomInput }) => {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="ml-2 text-gray-400 text-sm font-medium">Custom Input</span>
        </div>
      </div>
      <textarea
        rows={5}
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="Enter custom input for your program..."
        className="w-full h-full bg-gray-900 text-white font-mono text-sm p-4 resize-none focus:outline-none placeholder-gray-500"
      />
    </div>
  );
};

export default CustomInput;

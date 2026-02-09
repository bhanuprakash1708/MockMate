import Select from "react-select";
import { languageOptions } from "../constants/languageOptions";

interface LanguageOption {
  id: number;
  name: string;
  label: string;
  value: string;
}

interface LanguagesDropdownProps {
  onSelectChange: (selectedOption: LanguageOption) => void;
}

const modernSelectStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    minHeight: '2.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '&:hover': {
      border: '1px solid #3b82f6'
    },
    '&:focus-within': {
      border: '1px solid #3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  }),
  menu: (styles: any) => ({
    ...styles,
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  }),
  option: (styles: any, { isFocused, isSelected }: any) => ({
    ...styles,
    backgroundColor: isSelected ? '#3b82f6' : isFocused ? '#f3f4f6' : 'white',
    color: isSelected ? 'white' : '#1f2937',
    '&:hover': {
      backgroundColor: isSelected ? '#3b82f6' : '#f3f4f6'
    }
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: '#1f2937'
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: '#6b7280'
  })
};

const LanguagesDropdown: React.FC<LanguagesDropdownProps> = ({ onSelectChange }) => {
  return (
    <div className="min-w-[200px]">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Language
      </label>
      <Select
        placeholder="Select Language"
        options={languageOptions}
        styles={modernSelectStyles}
        defaultValue={languageOptions[0]}
        onChange={(selectedOption) => onSelectChange(selectedOption as LanguageOption)}
        isSearchable={true}
        className="text-sm"
      />
    </div>
  );
};

export default LanguagesDropdown;

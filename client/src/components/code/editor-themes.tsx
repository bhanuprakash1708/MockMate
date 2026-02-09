import Select from "react-select";
// @ts-ignore
import monacoThemes from "monaco-themes/themes/themelist.json";

interface ThemeOption {
  label: string;
  value: string;
  key?: string;
}

interface ThemeDropdownProps {
  handleThemeChange: (theme: ThemeOption | null) => void;
  theme: ThemeOption;
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

const ThemeDropdown: React.FC<ThemeDropdownProps> = ({ handleThemeChange, theme }) => {
  const themeOptions = [
    { label: "Light", value: "light", key: "light" },
    { label: "Visual Studio Dark", value: "vs-dark", key: "vs-dark" },
    ...Object.entries(monacoThemes).map(([themeId, themeName]) => ({
      label: themeName as string,
      value: themeId,
      key: themeId,
    }))
  ];

  return (
    <div className="min-w-[200px]">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Theme
      </label>
      <Select
        placeholder="Select Theme"
        options={themeOptions}
        value={theme}
        styles={modernSelectStyles}
        onChange={handleThemeChange}
        isSearchable={true}
        className="text-sm"
      />
    </div>
  );
};

export default ThemeDropdown;

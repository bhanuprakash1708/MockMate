
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Clock, Brain, Grid3X3, Link, GitBranch, ArrowUpDown, Zap } from 'lucide-react';
import { dsaTopics } from '../../data/algorithms';
import type { DSATopic, Algorithm } from '../../data/algorithms';

// Import individual code editor components instead of the full Landing component
import CodeEditorWindow from "../../components/code/code-editor";
import OutputWindow from "../../components/code/output-interface";
import CustomInput from "../../components/code/custom-input";
import OutputDetails from "../../components/code/output-details";
import ThemeDropdown from "../../components/code/editor-themes";
import LanguagesDropdown from "../../components/code/languages-dropdown";
import { languageOptions } from "../../components/constants/languageOptions";
import { classnames } from "../../lib/general";
import { defineTheme } from "../../lib/defineTheme";
import useKeyPress from "../../hooks/useKeyPress";
import axios from "axios";
import { toast, Toaster } from "sonner";

type ViewState = 'topics' | 'algorithms' | 'coding';

// Types for code editor
interface LanguageOption {
  id: number;
  name: string;
  label: string;
  value: string;
}

interface ThemeOption {
  label: string;
  value: string;
  key?: string;
}

interface OutputDetails {
  status: {
    id: number;
    description: string;
  };
  compile_output?: string;
  stdout?: string;
  stderr?: string;
  time?: string;
  memory?: string;
}

// Icon mapping for lucide-react icons
const iconMap: Record<string, any> = {
  'Grid3X3': Grid3X3,
  'Link': Link,
  'GitBranch': GitBranch,
  'ArrowUpDown': ArrowUpDown,
  'Zap': Zap,
};

function IntegratedCodeInterface() {
  const [currentView, setCurrentView] = useState<ViewState>('topics');
  const [selectedTopic, setSelectedTopic] = useState<DSATopic | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);

  // Code editor state
  const [code, setCode] = useState<string>("");
  const [customInput, setCustomInput] = useState<string>("");
  const [outputDetails, setOutputDetails] = useState<OutputDetails | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeOption>({ value: "cobalt", label: "Cobalt" });
  const [language, setLanguage] = useState<LanguageOption>(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  // Update code when algorithm changes
  useEffect(() => {
    if (selectedAlgorithm) {
      const defaultTemplate = `// ${selectedAlgorithm.name}
// ${selectedAlgorithm.description}
// Time Complexity: O(${selectedAlgorithm.timeComplexity})
// Space Complexity: O(${selectedAlgorithm.spaceComplexity})

function solve() {
    // Write your solution here
    
}

// Test with sample input
console.log(solve());`;
      setCode(defaultTemplate);
    }
  }, [selectedAlgorithm]);

  const onSelectChange = (sl: LanguageOption) => {
    setLanguage(sl);
  };

  const onChange = (action: string, data: string) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const showSuccessToast = useCallback((msg?: string) => {
    toast.success(msg || "Compiled Successfully!", {
      duration: 2000,
      position: "top-right",
    });
  }, []);

  const showErrorToast = useCallback((msg?: string) => {
    toast.error(msg || "Something went wrong! Please try again.", {
      duration: 3000,
      position: "top-right",
    });
  }, []);

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    
    const options = {
      method: "POST",
      url: import.meta.env.VITE_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        setProcessing(false);
        console.log(error);
        showErrorToast();
      });
  };

  const checkStatus = async (token: string) => {
    const options = {
      method: "GET",
      url: import.meta.env.VITE_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  const handleThemeChange = (th: ThemeOption | null) => {
    if (!th) return;
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  };

  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const handleTopicSelect = (topic: DSATopic) => {
    setSelectedTopic(topic);
    setCurrentView('algorithms');
  };

  const handleAlgorithmSelect = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setCurrentView('coding');
  };

  const handleBackToTopics = () => {
    setCurrentView('topics');
    setSelectedTopic(null);
    setSelectedAlgorithm(null);
  };

  const handleBackToAlgorithms = () => {
    setCurrentView('algorithms');
    setSelectedAlgorithm(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Topics View
  if (currentView === 'topics') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Clean Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-4xl font-light text-gray-800 mb-2">
                Data Structures & Algorithms
              </h1>
              <p className="text-lg text-gray-600">
                Choose a topic to start practicing
              </p>
            </div>
          </div>

          {/* Clean Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dsaTopics.map((topic) => {
              const IconComponent = iconMap[topic.icon];
              return (
                <div
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic)}
                  className="group p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{topic.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {topic.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{topic.algorithms.length} problems</span>
                    <div className="flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Practice
                      <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Algorithms View
  if (currentView === 'algorithms' && selectedTopic) {
    const IconComponent = iconMap[selectedTopic.icon];
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Clean Header */}
          <div className="mb-8">
            <button
              onClick={handleBackToTopics}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Topics
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <IconComponent className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-800">{selectedTopic.name}</h1>
                <p className="text-gray-600">{selectedTopic.description}</p>
              </div>
            </div>
          </div>

          {/* Clean Algorithms List */}
          <div className="space-y-4">
            {selectedTopic.algorithms.map((algorithm) => (
              <div
                key={algorithm.id}
                onClick={() => handleAlgorithmSelect(algorithm)}
                className="group p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {algorithm.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {algorithm.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(algorithm.difficulty)}`}>
                      {algorithm.difficulty}
                    </span>
                    <div className="flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Solve
                      <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>O({algorithm.timeComplexity})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    <span>O({algorithm.spaceComplexity})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Coding View
  if (currentView === 'coding' && selectedAlgorithm && selectedTopic) {
    const IconComponent = iconMap[selectedTopic.icon];
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Clean Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToAlgorithms}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="p-1 bg-blue-50 rounded">
                  <IconComponent className="h-4 w-4 text-blue-600" />
                </div>
                <h1 className="text-lg font-medium text-gray-900">
                  {selectedAlgorithm.name} ( Check Test Cases Below )
                  <div className="flex items-center gap-1">
                    <p className='text-blue-600 font-light'>Analyze your code with AI - </p> 
                  <p className='text-red-600 font-light'>Coming Soon</p>
                  </div>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(selectedAlgorithm.difficulty)}`}>
                {selectedAlgorithm.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex gap-6 h-[calc(100vh-140px)]">
            {/* Code Editor - 65% width */}
            <div className="w-[65%] bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Controls Section */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LanguagesDropdown onSelectChange={onSelectChange} />
                    <ThemeDropdown
                      handleThemeChange={handleThemeChange}
                      theme={theme}
                    />
                  </div>
                  <button
                    onClick={handleCompile}
                    disabled={!code || processing}
                    className={classnames(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      !code || processing
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    )}
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        Running...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-1a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Run
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Editor */}
              <div className="h-[calc(100%-60px)] bg-gray-900">
                <CodeEditorWindow
                  code={code}
                  onChange={onChange}
                  language={language?.value}
                  theme={theme.value}
                />
              </div>
            </div>

            {/* Output & Input Section - 35% width */}
            <div className="w-[35%] flex flex-col gap-4">
              {/* Output Window */}
              <div className="h-[60%] bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Output</h3>
                </div>
                <div className="p-4 h-[calc(100%-52px)] overflow-auto">
                  <OutputWindow outputDetails={outputDetails} />
                  {outputDetails && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <OutputDetails outputDetails={outputDetails} />
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Input */}
              <div className="h-[37%] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="text-sm font-semibold text-gray-700">Custom Input</h3>
                  </div>
                </div>
                <div className="p-4 h-[calc(100%-52px)]">
                  <CustomInput
                    customInput={customInput}
                    setCustomInput={setCustomInput}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm Details - Bottom Section */}
          <div className="mt-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <div className="p-1 bg-blue-100 rounded-lg">
                  <Brain className="h-4 w-4 text-blue-600" />
                </div>
                Problem Details & Test Cases
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Algorithm Explanation */}
                <div className="lg:col-span-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Algorithm Overview
                  </h4>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedAlgorithm.explanation}
                    </p>
                  </div>
                </div>

                {/* Sample Input */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Sample Input
                  </h4>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedAlgorithm.sampleInput}
                    </pre>
                  </div>
                </div>

                {/* Expected Output */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Expected Output
                  </h4>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-3">
                    <pre className="text-xs text-green-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedAlgorithm.expectedOutput}
                    </pre>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-start gap-2">
                      <div className="p-1 bg-blue-100 rounded">
                        <Clock className="h-3 w-3 text-blue-600" />
                      </div>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        <strong>Pro Tip:</strong> Test your solution with the sample input and compare the output for correctness.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Toaster 
          position="top-right" 
          richColors 
          expand 
          visibleToasts={4}
          closeButton
          duration={2000}
        />
      </div>
    );
  }

  return null;
}

export default IntegratedCodeInterface;
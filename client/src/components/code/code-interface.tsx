import { useState, useEffect, useCallback } from "react";
import CodeEditorWindow from "./code-editor";
import axios from "axios";
import { classnames } from "../../lib/general";
import { languageOptions } from "../constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../../lib/defineTheme";
import useKeyPress from "../../hooks/useKeyPress";
import OutputWindow from "./output-interface";
import CustomInput from "./custom-input";
import OutputDetails from "./output-details";
import ThemeDropdown from "./editor-themes";
import LanguagesDropdown from "./languages-dropdown";

// Types
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

const javascriptDefault = `/**
* Problem: Binary Search: Search a sorted array for a target value.
*/

// Time: O(log n)
const binarySearch = (arr, target) => {
 return binarySearchHelper(arr, target, 0, arr.length - 1);
};

const binarySearchHelper = (arr, target, start, end) => {
 if (start > end) {
   return false;
 }
 let mid = Math.floor((start + end) / 2);
 if (arr[mid] === target) {
   return mid;
 }
 if (arr[mid] < target) {
   return binarySearchHelper(arr, target, mid + 1, end);
 }
 if (arr[mid] > target) {
   return binarySearchHelper(arr, target, start, mid - 1);
 }
};

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 5;
console.log(binarySearch(arr, target));
`;

interface LandingProps {
  initialCode?: string;
}

const Landing: React.FC<LandingProps> = ({ initialCode }) => {
  const [code, setCode] = useState<string>(initialCode || javascriptDefault);
  const [customInput, setCustomInput] = useState<string>("");
  const [outputDetails, setOutputDetails] = useState<OutputDetails | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeOption>({ value: "cobalt", label: "Cobalt" });
  const [language, setLanguage] = useState<LanguageOption>(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  // Update code when initialCode prop changes
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const onSelectChange = (sl: LanguageOption) => {
    console.log("selected Option...", sl);
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
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  const showErrorToast = useCallback((msg?: string, timer?: number) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  const checkStatus = useCallback(async (token: string) => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_RAPID_API_URL}/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Status 1: In Queue, Status 2: Processing
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        
        // Check if there were any errors
        if (statusId === 3) {
          showSuccessToast(`Compiled Successfully!`);
        } else if (statusId === 6) {
          showErrorToast("Compilation Error");
        } else if (statusId === 5) {
          showErrorToast("Time Limit Exceeded");
        } else if (statusId === 4) {
          showErrorToast("Wrong Answer");
        } else {
          showErrorToast("Runtime Error");
        }
        
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast("Failed to get result. Please try again.");
    }
  }, [showSuccessToast, showErrorToast]);

  const handleCompile = useCallback(() => {
    setProcessing(true);
    
    // Check if API environment variables are set
    if (!import.meta.env.VITE_RAPID_API_URL || !import.meta.env.VITE_RAPID_API_KEY || import.meta.env.VITE_RAPID_API_KEY === 'YOUR_RAPIDAPI_KEY_HERE') {
      console.warn("API environment variables not set, using mock data");
      // Simulate compilation with mock data
      setTimeout(() => {
        const mockOutput: OutputDetails = {
          status: { id: 3, description: "Accepted" },
          stdout: btoa("Result: 4\nBinary search found target at index 4"),
          stderr: undefined,
          compile_output: undefined,
          time: "0.001",
          memory: "512",
        };
        setOutputDetails(mockOutput);
        setProcessing(false);
        showSuccessToast("Compiled Successfully!");
      }, 1000);
      return;
    }

    const formData = {
      language_id: language.id,
      // encode source code in base64
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
        console.log("Submission successful, token:", response.data.token);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        let status = err.response?.status;
        console.log("Error status:", status);
        console.log("Error details:", error);
        
        setProcessing(false);
        
        if (status === 429) {
          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the JUDGE0_API_SETUP.md to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        } else if (status === 401) {
          showErrorToast("Invalid API key. Please check your RapidAPI key.", 5000);
        } else if (status === 403) {
          showErrorToast("Access forbidden. Please check your API subscription.", 5000);
        } else {
          showErrorToast(`Error: ${error.message || 'Something went wrong'}`, 5000);
        }
      });
  }, [code, customInput, language.id, checkStatus, showSuccessToast, showErrorToast]);

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress, handleCompile]);

  function handleThemeChange(th: ThemeOption | null) {
    if (!th) return;
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="min-h-screen dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Code Editor
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Write, compile, and execute code online
            </p>
          </div>

          {/* Main Editor Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            {/* Controls Section */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-4">
                  <LanguagesDropdown onSelectChange={onSelectChange} />
                  <ThemeDropdown
                    handleThemeChange={handleThemeChange}
                    theme={theme}
                  />
                </div>
                <div className="ml-auto">
                  <button
                    onClick={handleCompile}
                    disabled={!code}
                    className={classnames(
                      "px-6 py-2 rounded-lg font-medium transition-all duration-200",
                      !code
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    )}
                  >
                    {processing ? "Processing..." : "Compile and Execute"}
                  </button>
                </div>
              </div>
            </div>

            {/* Editor and Output Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Code Editor Section - Takes 2/3 of the width */}
              <div className="lg:col-span-2 border-r border-gray-200 dark:border-gray-600">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    Code Editor
                  </h3>
                  <div className="rounded-lg overflow-hidden">
                    <CodeEditorWindow
                      code={code}
                      onChange={onChange}
                      language={language?.value}
                      theme={theme.value}
                    />
                  </div>
                </div>
              </div>

              {/* Output Section - Takes 1/3 of the width */}
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                    Output
                  </h3>
                  <div className="rounded-lg overflow-hidden">
                    <OutputWindow outputDetails={outputDetails} />
                  </div>
                  {outputDetails && (
                    <div className="mt-2">
                      <OutputDetails outputDetails={outputDetails} />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                    Custom Input
                  </h3>
                  <div className="rounded-lg overflow-hidden">
                    <CustomInput
                      customInput={customInput}
                      setCustomInput={setCustomInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Landing;

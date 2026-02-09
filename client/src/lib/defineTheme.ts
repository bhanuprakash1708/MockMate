import { loader } from "@monaco-editor/react";

// Pre-import all themes to avoid dynamic import issues
const themeFiles = {
  "active4d": () => import("monaco-themes/themes/Active4D.json"),
  "all-hallows-eve": () => import("monaco-themes/themes/All Hallows Eve.json"),
  "amy": () => import("monaco-themes/themes/Amy.json"),
  "birds-of-paradise": () => import("monaco-themes/themes/Birds of Paradise.json"),
  "blackboard": () => import("monaco-themes/themes/Blackboard.json"),
  "brilliance-black": () => import("monaco-themes/themes/Brilliance Black.json"),
  "brilliance-dull": () => import("monaco-themes/themes/Brilliance Dull.json"),
  "chrome-devtools": () => import("monaco-themes/themes/Chrome DevTools.json"),
  "clouds-midnight": () => import("monaco-themes/themes/Clouds Midnight.json"),
  "clouds": () => import("monaco-themes/themes/Clouds.json"),
  "cobalt": () => import("monaco-themes/themes/Cobalt.json"),
  "cobalt2": () => import("monaco-themes/themes/Cobalt2.json"),
  "dawn": () => import("monaco-themes/themes/Dawn.json"),
  "dracula": () => import("monaco-themes/themes/Dracula.json"),
  "dreamweaver": () => import("monaco-themes/themes/Dreamweaver.json"),
  "eiffel": () => import("monaco-themes/themes/Eiffel.json"),
  "espresso-libre": () => import("monaco-themes/themes/Espresso Libre.json"),
  "github": () => import("monaco-themes/themes/GitHub.json"),
  "github-dark": () => import("monaco-themes/themes/GitHub Dark.json"),
  "github-light": () => import("monaco-themes/themes/GitHub Light.json"),
  "idle": () => import("monaco-themes/themes/IDLE.json"),
  "idlefingers": () => import("monaco-themes/themes/idleFingers.json"),
  "iplastic": () => import("monaco-themes/themes/iPlastic.json"),
  "katzenmilch": () => import("monaco-themes/themes/Katzenmilch.json"),
  "krtheme": () => import("monaco-themes/themes/krTheme.json"),
  "kuroir-theme": () => import("monaco-themes/themes/Kuroir Theme.json"),
  "lazy": () => import("monaco-themes/themes/LAZY.json"),
  "magicwb--amiga-": () => import("monaco-themes/themes/MagicWB (Amiga).json"),
  "merbivore": () => import("monaco-themes/themes/Merbivore.json"),
  "merbivore-soft": () => import("monaco-themes/themes/Merbivore Soft.json"),
  "monoindustrial": () => import("monaco-themes/themes/monoindustrial.json"),
  "monokai": () => import("monaco-themes/themes/Monokai.json"),
  "monokai-bright": () => import("monaco-themes/themes/Monokai Bright.json"),
  "night-owl": () => import("monaco-themes/themes/Night Owl.json"),
  "nord": () => import("monaco-themes/themes/Nord.json"),
  "oceanic-next": () => import("monaco-themes/themes/Oceanic Next.json"),
  "pastels-on-dark": () => import("monaco-themes/themes/Pastels on Dark.json"),
  "slush-and-poppies": () => import("monaco-themes/themes/Slush and Poppies.json"),
  "solarized-dark": () => import("monaco-themes/themes/Solarized-dark.json"),
  "solarized-light": () => import("monaco-themes/themes/Solarized-light.json"),
  "spacecadet": () => import("monaco-themes/themes/SpaceCadet.json"),
  "sunburst": () => import("monaco-themes/themes/Sunburst.json"),
  "textmate--mac-classic-": () => import("monaco-themes/themes/Textmate (Mac Classic).json"),
  "tomorrow": () => import("monaco-themes/themes/Tomorrow.json"),
  "tomorrow-night": () => import("monaco-themes/themes/Tomorrow-Night.json"),
  "tomorrow-night-blue": () => import("monaco-themes/themes/Tomorrow-Night-Blue.json"),
  "tomorrow-night-bright": () => import("monaco-themes/themes/Tomorrow-Night-Bright.json"),
  "tomorrow-night-eighties": () => import("monaco-themes/themes/Tomorrow-Night-Eighties.json"),
  "twilight": () => import("monaco-themes/themes/Twilight.json"),
  "upstream-sunburst": () => import("monaco-themes/themes/Upstream Sunburst.json"),
  "vibrant-ink": () => import("monaco-themes/themes/Vibrant Ink.json"),
  "xcode-default": () => import("monaco-themes/themes/Xcode_default.json"),
  "zenburnesque": () => import("monaco-themes/themes/Zenburnesque.json"),
};

const defineTheme = async (theme: string): Promise<void> => {
  const monaco = await loader.init();
  
  if (["light", "vs-dark"].includes(theme)) {
    // Built-in themes don't need definition
    return;
  }

  try {
    const themeLoader = themeFiles[theme as keyof typeof themeFiles];
    
    if (!themeLoader) {
      throw new Error(`Theme ${theme} is not supported. Available themes: ${Object.keys(themeFiles).join(', ')}`);
    }

    const themeModule = await themeLoader();
    const themeData = themeModule.default || themeModule;
    
    monaco.editor.defineTheme(theme, themeData as any);
    console.log(`Successfully loaded theme: ${theme}`);
    
  } catch (error) {
    console.error(`Error loading theme ${theme}:`, error);
    throw error;
  }
};

export { defineTheme };

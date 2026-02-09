import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { GoogleSidebar } from "./pages/layout/root-layout"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import Dashboard from "./components/home/dashboard"
import { Separator } from "@/components/ui/separator"
import GeminiChat from "./components/chat/gemini-ai"
import IntegratedQuizSystem from "./pages/integration/integrated-quiz-system"
import AILearningPlatform from "./components/landing/landing-page"
import IntegratedCodeInterface from "./pages/integration/integrated-code-interface"
import SoftskillsInterface from "./pages/integration/softskills-interface"
import ScrollToTop from "./components/animations/scroll-to-top"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Sample page components

function Calendar() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Calendar</h2>
        <p className="text-gray-600">Your schedule and events are displayed here.</p>
      </div>
    </div>
  )
}

function Projects() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Projects</h2>
        <p className="text-gray-600">Manage your projects and collaborate with your team.</p>
      </div>
    </div>
  )
}

function GenericPage({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600">This is the {title.toLowerCase()} page.</p>
      </div>
    </div>
  )
}

function Settings() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>
    </div>
  )
}

function AppHeader() {
  const location = useLocation()
  
  const getPageName = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Overview'
      case '/quiz':
        return 'AI Quiz Master'
      case '/code':
        return 'Code Challenge'
      case '/soft-skills':
        return 'Pronunciation Assessment'
      case '/analytics':
        return 'Analytics'
      case '/team':
        return 'Team'
      case '/settings':
        return 'Settings'
      case '/chat':
        return 'Chat'
      default:
        if (pathname.startsWith('/projects/')) {
          return 'Project Details'
        }
        return 'Dashboard'
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="hover:bg-blue-50 hover:text-blue-700 transition-colors ml-2" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard" className="text-blue-600 hover:text-blue-700">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900">{getPageName(location.pathname)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}

// Layout component for pages with sidebar
function DashboardLayout() {
  return (
    <SidebarProvider>
      <GoogleSidebar />
      <SidebarInset>
        <AppHeader />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<IntegratedQuizSystem />} />
          <Route path="/code" element={<IntegratedCodeInterface />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/*" element={<GenericPage title="Project Details" />} />
          <Route path="/soft-skills" element={<SoftskillsInterface />} />
          <Route path="/team" element={<GenericPage title="Team" />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chat" element={<GeminiChat />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<AILearningPlatform />} />
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  )
}

import React, { useState } from 'react'
import { RouterProvider } from './lib/router'
import { useRouter } from './lib/routerContext'

import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { BottomNav } from './components/BottomNav'
import { Toast } from './components/Toast'
import { HomePage } from './pages/HomePage'
import { CityPage } from './pages/CityPage'
import { PlaceDetailPage } from './pages/PlaceDetailPage'
import { PlannerPage } from './pages/PlannerPage'
import { SavedPlacesPage } from './pages/SavedPlacesPage'
import { Link } from './lib/router'

const MainContent: React.FC = () => {
  const { path, params } = useRouter()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const renderCurrentRoute = () => {
    if (path === '/') {
      return <HomePage onSaveToast={setToastMessage} />
    }
    if (path === '/jaipur') {
      return <CityPage cityId="jaipur" onSaveToast={setToastMessage} />
    }
    if (path === '/udaipur') {
      return <CityPage cityId="udaipur" onSaveToast={setToastMessage} />
    }
    if (path === '/manali') {
      return <CityPage cityId="manali" onSaveToast={setToastMessage} />
    }
    if (path === '/varanasi') {
      return <CityPage cityId="varanasi" onSaveToast={setToastMessage} />
    }
    if (path === '/mussoorie') {
      return <CityPage cityId="mussoorie" onSaveToast={setToastMessage} />
    }
    if (path === '/delhi') {
      return <CityPage cityId="delhi" onSaveToast={setToastMessage} />
    }

    if (path === '/places/:slug' && params.slug) {
      return <PlaceDetailPage slug={params.slug} onSaveToast={setToastMessage} />
    }
    if (path === '/planner') {
      return <PlannerPage onSaveToast={setToastMessage} />
    }
    if (path === '/saved') {
      return <SavedPlacesPage onSaveToast={setToastMessage} />
    }

    // 404 Fallback
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-editorial text-4xl font-bold text-[#201C1A]">404</h1>
        <p className="font-editorial text-xl font-medium text-[#4A423B] mt-2">
          Page Not Found
        </p>
        <p className="text-sm text-[#7D736A] mt-2">
          The requested page or historical trail could not be found.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-[#201C1A] text-white text-sm font-semibold hover:bg-black transition-colors"
        >
          Return to Discover
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#201C1A] selection:bg-[#8C2D19] selection:text-white">
      <Header />
      <main className="flex-grow">{renderCurrentRoute()}</main>
      <Footer />
      <BottomNav />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  )
}

export function App() {
  return (
    <RouterProvider>
      <MainContent />
    </RouterProvider>
  )
}

export default App

import React, { useState, Suspense, lazy } from 'react'
import { RouterProvider } from './lib/router'
import { useRouter } from './lib/routerContext'

import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { BottomNav } from './components/BottomNav'
import { Toast } from './components/Toast'
import { useAppData } from './lib/dataStore'
import { Link } from './lib/router'

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const CityPage = lazy(() => import('./pages/CityPage').then((m) => ({ default: m.CityPage })))
const PlaceDetailPage = lazy(() => import('./pages/PlaceDetailPage').then((m) => ({ default: m.PlaceDetailPage })))
const PlannerPage = lazy(() => import('./pages/PlannerPage').then((m) => ({ default: m.PlannerPage })))
const SavedPlacesPage = lazy(() => import('./pages/SavedPlacesPage').then((m) => ({ default: m.SavedPlacesPage })))
const AdminBoardPage = lazy(() => import('./pages/AdminBoardPage').then((m) => ({ default: m.AdminBoardPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))

const MainContent: React.FC = () => {
  const { path, params } = useRouter()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const { cities } = useAppData()

  const renderCurrentRoute = () => {
    if (path === '/') {
      return <HomePage onSaveToast={setToastMessage} />
    }

    if (path === '/admin') {
      return <AdminBoardPage onSaveToast={setToastMessage} />
    }

    if (path === '/planner') {
      return <PlannerPage onSaveToast={setToastMessage} />
    }

    if (path === '/saved') {
      return <SavedPlacesPage onSaveToast={setToastMessage} />
    }

    if (path === '/profile') {
      return <ProfilePage onSaveToast={setToastMessage} />
    }

    if (path === '/places/:slug' && params.slug) {
      return <PlaceDetailPage slug={params.slug} onSaveToast={setToastMessage} />
    }

    // Dynamic city route checking for all 5 pilot cities + admin created cities
    const potentialCityId = path.replace('/', '').toLowerCase()
    if (cities[potentialCityId]) {
      return <CityPage cityId={potentialCityId} onSaveToast={setToastMessage} />
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
      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-xs text-stone-500 font-medium">Loading experience...</div>}>
          {renderCurrentRoute()}
        </Suspense>
      </main>
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

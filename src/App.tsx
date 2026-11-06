import React, { useState, Suspense, lazy } from 'react'
import { RouterProvider } from './lib/router'
import { useRouter } from './lib/routerContext'

import { Header } from './components/Header'
import { BottomNav } from './components/BottomNav'
import { Toast } from './components/Toast'
import { OpeningAuthGate } from './components/OpeningAuthGate'
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
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-editorial text-4xl font-extrabold text-slate-900">404</h1>
        <p className="text-base font-semibold text-slate-700 mt-2">
          Page Not Found
        </p>
        <p className="text-xs text-slate-500 mt-1">
          The requested page or historical trail could not be found.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          Return to Explore
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start selection:bg-indigo-600 selection:text-white">
      <div className="mobile-app-shell bg-[#F8FAFC] text-slate-900 shadow-2xl relative flex flex-col justify-between">
        <Header onToast={setToastMessage} />
        <main className="flex-grow pb-8">
          <Suspense
            fallback={
              <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>Loading experience...</span>
              </div>
            }
          >
            {renderCurrentRoute()}
          </Suspense>
        </main>
        <BottomNav />
        <OpeningAuthGate onDismiss={() => {}} />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
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

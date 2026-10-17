import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-govt-paper font-bangla">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

import { Routes, Route, NavLink } from 'react-router-dom'
import { Package, ShoppingCart, BarChart3 } from 'lucide-react'
import InventoryPage from '@/pages/Inventory'
import CustomerSetsPage from '@/pages/CustomerSets'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 flex items-center gap-6 h-14">
          {/* Logo */}
          <NavLink to="/" className="shrink-0 flex items-center">
            <img
              src="/logo.png"
              alt="ComNaKrub"
              className="h-10 w-auto"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <span className="ml-2 text-lg font-bold text-primary hidden [img+&]:hidden">ComNaKrub</span>
          </NavLink>

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* Nav */}
          <nav className="flex gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`
              }
            >
              <Package size={15} strokeWidth={2} />
              Inventory
            </NavLink>
            <NavLink
              to="/sets"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`
              }
            >
              <ShoppingCart size={15} strokeWidth={2} />
              Customer Sets
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`
              }
            >
              <BarChart3 size={15} strokeWidth={2} />
              Reports
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<InventoryPage />} />
          <Route path="/sets" element={<CustomerSetsPage />} />
          <Route path="/reports" element={<div className="text-muted-foreground">Reports — coming soon</div>} />
        </Routes>
      </main>
    </div>
  )
}

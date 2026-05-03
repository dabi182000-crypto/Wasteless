import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopNav from './components/TopNav.jsx';
import SideMenu from './components/SideMenu.jsx';
import LoginModal from './components/LoginModal.jsx';
import CustomerView from './components/customer/CustomerView.jsx';
import VendorView from './components/vendor/VendorView.jsx';
import { ReservationsProvider } from './context/ReservationsContext.jsx';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function App() {
  const [mode, setMode] = useState('customer');
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <ReservationsProvider>
      <div className="min-h-screen bg-bg dark:bg-bg-dark text-ink dark:text-ink-dark transition-colors duration-300">
        <TopNav
          mode={mode}
          onMenuOpen={() => setMenuOpen(true)}
          onLoginClick={() => setLoginOpen(true)}
        />
        <SideMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          mode={mode}
          onModeChange={setMode}
          onLoginClick={() => setLoginOpen(true)}
        />
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {mode === 'customer' ? <CustomerView /> : <VendorView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ReservationsProvider>
  );
}

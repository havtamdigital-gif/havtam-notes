import { createBrowserRouter } from 'react-router-dom';
import Root       from './components/Root';
import Home       from './components/Home';
import PageWrapper from './components/PageWrapper';

const authStub = (
  <div style={{ textAlign:'center', padding:'80px 24px', direction:'rtl' }}>
    <div style={{ fontSize:'3rem', marginBottom:'12px' }}>🔐</div>
    <h2 style={{ fontFamily:'var(--font-display)', color:'#C2185B', fontSize:'1.8rem' }}>
      כניסה / הרשמה
    </h2>
    <p style={{ color:'#888', marginTop:'8px' }}>
      בקרוב — כרגע ההתקדמות נשמרת אוטומטית במכשיר שלך 🌸
    </p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true,            element: <Home /> },  // no props needed
      { path: 'dictionary',     element: <PageWrapper page="dict" /> },
      { path: 'playground',     element: <PageWrapper page="playground" /> },
      { path: 'ai',             element: <PageWrapper page="ai" /> },
      { path: 'roadmap',        element: <PageWrapper page="learn" /> },
      { path: 'my-code',        element: <PageWrapper page="history" /> },
      { path: 'auth',           element: authStub },
    ],
  },
], { basename: '/havtam-notes' });

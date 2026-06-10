import { Outlet } from 'react-router-dom';
import { TopNav }     from './TopNav';
import StarParticles  from './StarParticles';

export default function Root() {
  return (
    <div className="wand-cursor" style={{ minHeight: '100vh', direction: 'rtl' }}>
      <StarParticles />
      <TopNav />
      <Outlet />
    </div>
  );
}

import Sidebar from '../components/Sidebar';
import ProfileForm from '../components/ProfileForm';
import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function ProfilePage() {
    const [minimized, setMinimized] = useState(false);
  
  return (
    <div className="d-flex">
    <Sidebar minimized={minimized} setMinimized={setMinimized}  />
         {/* <main className="container-fluid "> */}
            <main
           className="container-fluid"
           style={{
             marginLeft: minimized ? 0 : 18, // Match your sidebar width
             transition: 'margin-left 0.3s'
           }}
         >
         <Navbar minimized={minimized}/>
         <div className="" style={{padding:"14px"}}>
        <h2>Profile</h2>
        <ProfileForm />
        </div>
      </main>
    </div>
  );
}

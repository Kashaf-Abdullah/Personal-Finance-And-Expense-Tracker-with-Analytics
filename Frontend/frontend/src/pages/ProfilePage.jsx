import Sidebar from '../components/Sidebar';
import ProfileForm from '../components/ProfileForm';
import Navbar from '../components/Navbar';

export default function ProfilePage() {
  return (
    <div className="d-flex">
      <Sidebar />
      <main className="container-fluid">
       <Navbar/>
         <div className="" style={{padding:"14px"}}>
        <h2>Profile</h2>
        <ProfileForm />
        </div>
      </main>
    </div>
  );
}

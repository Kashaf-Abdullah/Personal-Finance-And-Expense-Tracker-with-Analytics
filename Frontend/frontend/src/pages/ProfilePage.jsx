import Sidebar from '../components/Sidebar';
import ProfileForm from '../components/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="d-flex">
      <Sidebar />
      <main className="container-fluid p-4">
        <h2>Profile</h2>
        <ProfileForm />
      </main>
    </div>
  );
}

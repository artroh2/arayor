import { Layout } from "@/components/layout";
import { ProfileSection } from "@/components/profile";

const Profile = () => {
  return (
    <Layout>
      <div className="min-h-screen py-8">
        <ProfileSection />
      </div>
    </Layout>
  );
};

export default Profile;

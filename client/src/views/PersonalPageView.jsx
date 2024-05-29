import React from "react";
import PersonalFeedSection from "@/components/feed/PersonalFeedSection";
import ProfileSection from "@/components/member/ProfileSection";

const PersonalPageView = () => {
  return (
    <div>
      <ProfileSection />
      <PersonalFeedSection />
    </div>
  );
};

export default PersonalPageView;

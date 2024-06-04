import React, { useEffect, useState } from "react";
import PersonalFeedSection from "@/components/feed/PersonalFeedSection";
import ProfileSection from "@/components/member/ProfileSection";

const PersonalPageView = () => {
  const [filteredFeeds, setFilteredFeeds] = useState([]);
  const length = filteredFeeds.length;

  return (
    <div>
      <ProfileSection length={length} />
      <PersonalFeedSection
        setFilteredFeeds={setFilteredFeeds}
        filteredFeeds={filteredFeeds}
      />
    </div>
  );
};

export default PersonalPageView;

"use client";
import Header from "@/Components/Header";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function page() {
  const { userJobs, jobs } = useJobsContext();
  const { isAuthenticated, loading, userProfile } = useGlobalContext();

  const [activeTab, setActiveTab] = useState("posts");

  const userId = userProfile?.id;

  const router = useRouter();

  const likeJobs = jobs.filter((job: Job) => {
    return job.applicants.includes(userId);
  });

  if (loading) {
    return null;
  }

  return (
    <div>
      <Header />

      <div className="mt-8 w-[90%] mx-auto flex flex-col">
        <button
          className={`border border-gray-400 px-8 py-2 rounded-full font-medium
          ${
            activeTab === "posts"
              ? "border-transparent bg-[#7263F3] text-white"
              : "border-gray-400"
          }`}
          onClick={() => setActiveTab("posts")}>
          My Job Posts
        </button>
        <button
          className={`border border-gray-400 px-8 py-2 rounded-full font-medium
          ${
            activeTab === "likes"
              ? "border-transparent bg-[#7263F3] text-white"
              : "border-gray-400"
          }`}
          onClick={() => setActiveTab("likes")}>
          Like Posts
        </button>
      </div>
    </div>
  );
}

export default page;

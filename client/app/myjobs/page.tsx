"use client";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import MyJob from "@/Components/JobItem/MyJob";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { act, useEffect, useState } from "react";

function page() {
  const { userJobs, jobs } = useJobsContext();
  const { isAuthenticated, loading, userProfile } = useGlobalContext();

  const [activeTab, setActiveTab] = useState("posts");

  const userId = userProfile?.id;

  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("http://localhost:8000/login");
      return;
    }
  }, [isAuthenticated]);

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
        <div className="self-center flex items-center gap-6">
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

        {activeTab === "posts" && userJobs.length === 0 && (
          <div className="mt-8 flex items-center">
            <p className="text-2xl font-bold">No jobs post found.</p>
          </div>
        )}

        {activeTab === "likes" && likeJobs.length === 0 && (
          <div className="mt-8 flex items-center">
            <p className="text-2xl font-bold">No like jobs found.</p>
          </div>
        )}

        <div className="my-8 grid grid-cols-2 gap-6">
          {activeTab === "posts" &&
            userJobs.map((job: Job) => <MyJob key={job._id} job={job} />)}

          {activeTab === "likes" &&
            likeJobs.map((job: Job) => <MyJob key={job._id} job={job} />)}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default page;

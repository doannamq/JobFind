"use client";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import JobCard from "@/Components/JobItem/JobCard";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import { formatDates } from "@/utils/formatDates";
import formatMoney from "@/utils/formatMoney";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { bookmark, bookmarkEmpty } from "@/utils/Icons";

function page() {
  const { jobs, likeJob, applyToJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [isLiked, setIsLiked] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const job = jobs.find((job: Job) => job._id === id);
  const otherJobs = jobs.filter((job: Job) => job._id !== id);

  useEffect(() => {
    if (job) {
      setIsApplied(applicants.includes(userProfile._id));
    }
  }, [job]);

  useEffect(() => {
    if (job) {
      setIsLiked(job.likes.includes(userProfile._id));
    }
  }, [job, userProfile._id]);

  if (!job) return null;

  const {
    title,
    location,
    description,
    salary,
    createdBy,
    applicants,
    jobType,
    createdAt,
    salaryType,
    negotiable,
  } = job;

  const { name, profilePicture } = createdBy;

  const handleLike = (id: string) => {
    setIsLiked((prev) => !prev);
    likeJob(id);
  };

  return (
    <main>
      <div>
        <Header />
        <div className="p-8 mb-8 mx-auto w-[90] rounded-md flex gap-8">
          <div className="w-[26%] flex flex-col gap-8">
            <JobCard activeJob job={job} />

            {otherJobs.map((job: Job) => (
              <JobCard job={job} key={job._id} />
            ))}
          </div>

          <div className="flex-1 bg-white p-6 rounded-md">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-14 relative rounded-md overflow-hidden flex items-center justify-center bg-gray-200">
                    <Image
                      src={profilePicture || "/user.png"}
                      alt={name || "User"}
                      width={45}
                      height={45}
                      className="rounded-md"
                    />
                  </div>

                  <div>
                    <p className="font-bold">{name}</p>
                    <p className="text-sm">Recruiter</p>
                  </div>
                </div>
                <button
                  className={`text-2xl ${
                    isLiked ? "text-[#7263f3]" : " text-gray-400"
                  }`}
                  onClick={() => {
                    if (isAuthenticated) {
                      handleLike(job._id);
                    } else {
                      router.push("http://localhost:8000/login");
                    }
                  }}>
                  {isLiked ? bookmark : bookmarkEmpty}
                </button>
              </div>

              <h1 className="text-2xl font-semibold my-2">{title}</h1>
              <div className="flex gap-4 items-center">
                <p className="text-gray-500">{location}</p>
              </div>

              <div className="mt-2 flex gap-4 justify-between items-center">
                <p className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-green-500/20 rounded-xl">
                  <span className="text-sm">Salary</span>

                  <span>
                    <span className="font-bold">
                      {formatMoney(salary, "GBP")}
                    </span>
                    <span className="font-medium text-gray-500 text-lg">
                      /
                      {salaryType
                        ? `${
                            salaryType === "Yearly"
                              ? "pa"
                              : salaryType === "Monthly"
                              ? "pcm"
                              : salaryType === "Weekly"
                              ? "pw"
                              : "ph"
                          }`
                        : ""}
                    </span>
                  </span>
                </p>

                <p className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-purple-500/20 rounded-xl">
                  <span className="text-sm">Posted</span>
                  <span className="font-bold">{formatDates(createdAt)}</span>
                </p>

                <p className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-blue-500/20 rounded-xl">
                  <span className="text-sm">Applicants</span>
                  <span className="font-bold">{applicants.length}</span>
                </p>

                <p className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-yellow-500/20 rounded-xl">
                  <span className="text-sm">Job Type</span>
                  <span className="font-bold">{jobType[0]}</span>
                </p>
              </div>

              <h2 className="font-bold text-2xl mt-2">Job Description</h2>
            </div>

            <div
              className="wisiwyg mt-2"
              dangerouslySetInnerHTML={{ __html: description }}></div>
          </div>

          <div className="w-[26%] flex flex-col gap-8">
            <button
              className={`text-white py-4 rounded-full hover:bg-[#7263f3]/90 hover:text-white ${
                isApplied ? "bg-green-500" : "bg-[#7263f3]"
              }`}
              onClick={() => {
                if (isAuthenticated) {
                  if (!isApplied) {
                    applyToJob(job._id);
                    setIsApplied(true);
                  } else {
                    toast.error("You have already applied to this job");
                  }
                } else {
                  router.push("http://localhost:8000/login");
                }
              }}>
              {isApplied ? "Applied" : "Apply now"}
            </button>

            <div className="p-6 flex flex-col gap-2 bg-white rounded-md">
              <h3 className="text-lg font-semibold">Other Information</h3>
              <div className="flex flex-col gap-2">
                <p>
                  <span className="font-semibold">Posted:</span>{" "}
                  {formatDates(createdAt)}
                </p>

                <p>
                  <span className="font-bold">Salary negotiable: </span>
                  <span
                    className={`font-bold ${
                      negotiable ? "text-[#4caf50]" : "text-[#f44336]"
                    }`}>
                    {negotiable ? "Yes" : "No"}
                  </span>
                </p>

                <p>
                  <span className="font-semibold">Location: </span> {location}
                </p>

                <p>
                  <span className="font-semibold">Job Type: </span> {jobType[0]}
                </p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-2 bg-white rounded-md">
              <h3 className="text-lg font-semibold">Tags</h3>
              <p>Other relevant tags for the job position.</p>

              <div className="flex flex-wrap gap-4">
                {job.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-1 rounded-full text-sm font-medium flex items-center bg-red-500/20 text-red-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 flex flex-col gap-2 bg-white rounded-md">
              <h3 className="text-lg font-semibold">Skills</h3>
              <p>
                This is a full-time position. The successful candidate will be
                responsible for the following:
              </p>

              <div className="flex flex-wrap gap-4">
                {job.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-1 rounded-full text-sm font-medium flex items-center bg-indigo-500/20 text-[#7263f3]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default page;

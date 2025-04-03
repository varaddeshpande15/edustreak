// "use client";
// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation"; // Import useRouter for navigation
// import StudyCard from "@/components/StudyCard";
// export default function PlanPage() {
//   const [deadline, setDeadline] = useState("");
//   const [dailyTime, setDailyTime] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [studyPlan, setStudyPlan] = useState(null);
//   const router = useRouter(); // Initialize router

//   const createPlan = async () => {
//     if (!deadline || !dailyTime) {
//       alert("Please fill in all fields!");
//       return;
//     }

//     setLoading(true);

//     try {
//       const { data } = await axios.post("/api/generatePlan", {
//         targetDeadline: deadline,
//         dailyTime: Number(dailyTime) * 60, // Convert hours to minutes
//       });

//       if (!data.studyPlan?.studyPlan?.study_plan?.daily_schedule) {
//         console.error("Study plan or videos data is missing.", data);
//         alert("Failed to generate a valid study plan.");
//         return;
//       }

//       setStudyPlan(data.studyPlan.studyPlan.study_plan); // Extract the correct nested structure
//     } catch (error) {
//       console.error("Error generating plan:", error);
//       alert("Failed to generate study plan.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const savePlanAndNavigate = async (path) => {
//     if (!studyPlan) {
//       alert("No study plan available to save!");
//       return;
//     }

//     try {
//       await axios.post("/api/savePlan", { studyPlan });
//       router.push(path); // Navigate to the desired page
//     } catch (error) {
//       console.error("Error saving study plan:", error);
//       alert("Failed to save study plan.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100 w-full">
//       {/* <h1 className="text-3xl font-bold mb-4">Your Study Plan</h1> */}

//       {studyPlan ? (
//         <div className="w-3/4 bg-white p-6 shadow-md rounded-md">
//           <h2 className="text-2xl font-bold mb-4">{studyPlan.playlist}</h2>
//           <p className="mb-2 font-medium">Start Date: {studyPlan.start_date}</p>
//           <p className="mb-2 font-medium">Deadline: {studyPlan.deadline}</p>
//           <p className="mb-2 font-medium">
//             Estimated Completion: {studyPlan.days_required} days
//           </p>
//           <p className="mb-2 font-medium">
//             Total Videos: {studyPlan.total_videos}, Total Study Time:{" "}
//             {studyPlan.total_minutes} mins
//           </p>

//           {studyPlan.daily_schedule.map((day, index) => (
//             <div
//               key={index}
//               className="w-full mb-6 p-4 border rounded-md bg-white shadow-md"
//             >
//               <h2 className="text-lg font-semibold mb-2">
//                 Day {day.day}: {day.date}
//               </h2>
//               <p className="text-sm text-gray-600 mb-1">
//                 Total Study Time: {day.total_minutes} mins
//               </p>
//               <p className="text-sm text-gray-700 italic mb-2">{day.notes}</p>

//               {day.videos.map((video, i) => (
//                 <div
//                   key={i}
//                   className="w-full flex flex-col md:flex-row items-center md:items-start"
//                 >
//                   {/* Left Section - Video Details */}
//                   <div className="w-full md:w-1/2 p-2">
//                     <p className="font-medium">{video.title}</p>
//                     <p className="text-sm text-gray-500">
//                       Duration: {video.duration} mins
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Notes: {video.notes}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Status: {video.completed ? "Completed" : "Pending"}
//                     </p>
//                   </div>

//                   {/* Right Section - Embedded YouTube Video */}
//                   <div className="w-full md:w-1/2 flex justify-center p-2">
//                     <iframe
//                       width="100%"
//                       height="250"
//                       src={`https://www.youtube.com/embed/${video.videoId}`}
//                       title={video.title}
//                       frameBorder="0"
//                       allowFullScreen
//                       className="rounded-md shadow-md"
//                     ></iframe>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}

//           {/* Edit Plan & Confirm Plan Buttons */}
//           <div className="flex gap-8 fixed bottom-8 w-3/4 justify-center mr-6">
//             <button
//               onClick={() => savePlanAndNavigate("/editplan")}
//               className="px-6 py-3 bg-yellow-500 text-white rounded-md  text-lg"
//             >
//               Edit Plan
//             </button>
//             <button
//               onClick={() => savePlanAndNavigate("/confirmplan")}
//               className="px-6 py-3 bg-green-500 text-white rounded-md "
//             >
//               Confirm Plan
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100 w-full">
//           <h1 className="text-3xl font-bold mb-4">Design Your Perfect Study Routine!</h1>
//           <div className="bg-white p-6 shadow-md rounded-md w-full max-w-md">
//             <label className="block mb-2">Target Deadline:</label>
//             <input
//               type="date"
//               className="border p-2 w-full rounded-md mb-4"
//               value={deadline}
//               onChange={(e) => setDeadline(e.target.value)}
//             />

//             <label className="block mb-2">Daily Study Time (hours):</label>
//             <input
//               type="number"
//               className="border p-2 w-full rounded-md mb-4"
//               value={dailyTime}
//               onChange={(e) => setDailyTime(e.target.value)}
//             />

//             <button
//               onClick={createPlan}
//               className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
//               disabled={loading}
//             >
//               {loading ? "Generating..." : "Create Plan"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PlanPage() {
  const [loadingState, setLoadingState] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [dailyTime, setDailyTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);
  const router = useRouter();

  const createPlan = async () => {
    if (!deadline || !dailyTime) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/generatePlan", {
        targetDeadline: deadline,
        dailyTime: Number(dailyTime) * 60, // Convert hours to minutes
      });

      if (!data.studyPlan?.studyPlan?.study_plan?.daily_schedule) {
        alert("Failed to generate a valid study plan.");
        return;
      }

      setStudyPlan(data.studyPlan.studyPlan.study_plan);
    } catch (error) {
      alert("Failed to generate study plan.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateToWords = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  

  const savePlanAndNavigate = async (path) => {
    if (!studyPlan) {
      alert("No study plan available to save!");
      return;
    }

    try {
      await axios.post("/api/savePlan", { studyPlan });
      router.push(path);
    } catch (error) {
      alert("Failed to save study plan.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-6 py-10">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
        {studyPlan ? "Your Study Plan" : "Plan Your Study Routine"}
      </h1>

      {/* Study Plan Section */}
      {studyPlan ? (
        <div className="w-full max-w-4xl bg-white p-6 shadow-2xl rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            {studyPlan.playlist}
          </h2>
          <p className="text-gray-600"><strong>Start Date:</strong> {formatDateToWords(studyPlan.start_date)}</p>
          <p className="text-gray-600"><strong>Deadline:</strong> {formatDateToWords(studyPlan.deadline)}</p>

          <p className="text-gray-600"><strong>Deadline:</strong> {studyPlan.deadline}</p>
          <p className="text-gray-600"><strong>Days Required:</strong> {studyPlan.days_required}</p>
          <p className="text-gray-600"><strong>Total Videos:</strong> {studyPlan.total_videos}, <strong>Total Study Time:</strong> {studyPlan.total_minutes} mins</p>

          {/* Daily Study Schedule */}
          {studyPlan.daily_schedule.map((day, index) => (
            <div key={index} className="border border-gray-400 border-2 rounded-lg bg-gray-100 p-4 mt-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700">Day {day.day}: {formatDateToWords(day.date)}</h3>
              <p className="text-sm text-gray-600 mb-2">Study Time: {day.total_minutes} mins</p>
              <p className="text-sm text-gray-700 italic mb-3">{day.notes}</p>

              {/* Video List */}
              {day.videos.map((video, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{video.title}</p>
                    <p className="text-sm text-gray-500">Duration: {video.duration} mins</p>
                    <p className="text-sm text-gray-500">Notes: {video.notes}</p>
                    <p className="text-sm text-gray-500">
                      Status: <span className={video.completed ? "text-green-600" : "text-red-600"}>
                        {video.completed ? "Completed" : "Pending"}
                      </span>
                    </p>
                  </div>

                  {/* Video Embed */}
                  <div className="w-full md:w-1/3">
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      frameBorder="0"
                      allowFullScreen
                      className="rounded-lg shadow-md"
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Buttons */}
          {/* Fixed Buttons at Bottom */}
          <div className="fixed bottom-6 left-0 w-full flex justify-center gap-12">
  <button
    onClick={() => {
      setLoadingState("edit");
      savePlanAndNavigate("/editplan");
    }}
    disabled={loadingState === "edit"}
    className={`px-6 py-3 font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2 
      ${loadingState === "edit" ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
  >
    {loadingState === "edit" ? "⏳ Saving..." : "✏️ Edit Plan"}
  </button>

  <button
    onClick={() => {
      setLoadingState("confirm");
      savePlanAndNavigate("/confirmplan");
    }}
    disabled={loadingState === "confirm"}
    className={`px-6 py-3 font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2 
      ${loadingState === "confirm" ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
  >
    {loadingState === "confirm" ? "⏳ Saving..." : "✅ Confirm Plan"}
  </button>
</div>


        </div>
      ) : (
        <div className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg">
          {/* Input Fields */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Target Deadline:</label>
            <input
              type="date"
              className="border p-2 w-full rounded-md mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Daily Study Time (hours):</label>
            <input
              type="number"
              className="border p-2 w-full rounded-md mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
              value={dailyTime}
              onChange={(e) => setDailyTime(e.target.value)}
            />
          </div>

          {/* Generate Plan Button */}
          <button
  onClick={createPlan}
  className="w-3/4 px-8 py-4 bg-blue-500 text-xl text-white font-medium rounded-lg hover:bg-blue-600 transition-all 
             mx-auto flex justify-center items-center"
  disabled={loading}
>
  {loading ? "Generating..." : "Create Plan"}
</button>

        </div>
      )}
    </div>
  );
}

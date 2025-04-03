import { useState } from "react";
import { Play, ChevronDown, ChevronUp } from "lucide-react";

const StudyCard = ({ dayData }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full overflow-hidden border-0 shadow-md bg-white rounded-md">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Image/Video */}
        <div className="relative w-full md:w-2/5 lg:w-1/3">
          <div className="aspect-video bg-black">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Python Course Thumbnail"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Play className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className={`flex flex-1 flex-col p-4 md:p-6 ${expanded ? "" : "md:max-h-[225px] overflow-hidden relative"}`}>
          {/* Date and Study Time */}
          <div className="mb-2">
            <h2 className="text-xl font-bold text-gray-900">Day {dayData.day}: {dayData.date}</h2>
            <p className="text-sm text-gray-500">Total Study Time: {dayData.total_minutes} mins</p>
          </div>

          {/* Description */}
          <p className="mb-4 text-gray-700">{dayData.notes}</p>

          {/* Lecture Details */}
          {dayData.videos.map((video, index) => (
            <div key={index} className="mt-4 border-t pt-3">
              <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
              <p className="text-sm text-gray-500">Duration: {video.duration} mins</p>
              <p className="text-sm text-gray-700"><span className="font-medium">Notes:</span> {video.notes}</p>
              <div className="mt-2 flex items-center">
                <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Status: {video.completed ? "Completed" : "Pending"}
                </span>
              </div>
            </div>
          ))}

          {/* Expand / Collapse Buttons */}
          {!expanded ? (
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
              <div className="h-16 w-full bg-gradient-to-t from-white to-transparent"></div>
              <button onClick={() => setExpanded(true)} className="mb-2 flex items-center gap-1 text-primary">
                Read more <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setExpanded(false)} className="mt-4 flex items-center gap-1 self-center text-primary">
              Show less <ChevronUp className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const StudyPlan = ({ studyPlan }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Your Study Plan</h1>
      {studyPlan ? (
        <div className="w-full max-w-2xl bg-white p-6 shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-4">{studyPlan.playlist}</h2>
          <p className="mb-2 font-medium">Start Date: {studyPlan.start_date}</p>
          <p className="mb-2 font-medium">Deadline: {studyPlan.deadline}</p>
          <p className="mb-2 font-medium">Estimated Completion: {studyPlan.days_required} days</p>
          <p className="mb-2 font-medium">Total Videos: {studyPlan.total_videos}, Total Study Time: {studyPlan.total_minutes} mins</p>
          {studyPlan.daily_schedule.map((day, index) => (
            <StudyCard key={index} dayData={day} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 shadow-md rounded-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4">Create Your Study Plan</h1>
          <label className="block mb-2">Target Deadline:</label>
          <input type="date" className="border p-2 w-full rounded-md mb-4" />
          <label className="block mb-2">Daily Study Time (hours):</label>
          <input type="number" className="border p-2 w-full rounded-md mb-4" />
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md">Create Plan</button>
        </div>
      )}
    </div>
  );
};

export default StudyPlan;

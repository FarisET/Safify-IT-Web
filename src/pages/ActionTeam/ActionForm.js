import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import constants from "../../const";
const ActionForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    description: "",
    criticality: "low",
    reporter: "",
    steps: [],
    solution: "",
    attachedImage: null,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { user_report_id } = location.state || {};
    const [role, setRole] = useState(sessionStorage.getItem("role"))
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStep = () => {
    if (formData.steps.length < 5) {
      setFormData((prev) => ({
        ...prev,
        steps: [...prev.steps, ""],
      }));
    }
  };

  const handleRemoveStep = (index) => {
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      steps: updatedSteps,
    }));
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = value;
    setFormData((prev) => ({
      ...prev,
      steps: updatedSteps,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, attachedImage: file }));
    }
  };

  const handleCancel = () => {

    if (role === 'admin') {
      navigate('/tickets');
    } else if (role === 'user') {
      navigate('/my-tickets');
    } else if (role === 'action_team') {
      navigate('/my-tasks');
    } else {
      navigate('/404');
    }
  }

  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem("userId"); // Assuming userid is stored in sessionStorage
    const endpoint = `${constants.API.BASE_URL}/actionTeam/dashboard/${userId}/MakeActionReport`;

    const data = {
    reported_by: formData.reporter,
    report_description: formData.description,
    resolution_description: formData.solution,
    user_report_id: user_report_id,
     proof_image: formData.attachedImage,
     question_one: formData.steps[0],
     question_two: formData.steps[1],
     question_three: formData.steps[2],
     question_four: formData.steps[3],
     question_five: formData.steps[4]
    }

    try {
      setSubmitFormLoading(true);
      await axios.post(endpoint, data, 
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "multipart/form-data",

        },
      });
      setSubmissionSuccess(true);
      setTabs((prevTabs) => [
        ...prevTabs,
        { id: 4, label: "Page 4: Success" },
      ]);
      setCurrentPage(4);
      setFormData({
        description: "",
        criticality: "low",
        sublocId: null,
        assetNo: null,
        reporter: "",
        steps: [],
        solution: "",
        attachedImage: null,
      });
    } catch (error) {
      setError(`Submission failed: ${error.response.data.error}`);
    } finally {
      setSubmitFormLoading(false);
    }
  };

  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const [tabs, setTabs] = React.useState([
    { id: 1, label: "Page 1: Details" },
    { id: 2, label: "Page 2: Steps" },
    { id: 3, label: "Page 3: Resolution" },
  ]);

  return (
    <div className="p-4 max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">Action Form</h1>
      {submitFormLoading && (
        <p className="mb-4 p-3 rounded text-sky-600 bg-sky-100">Loading...</p>
      )}
      {error && (
        <p className="mb-4 p-3 rounded text-red-600 bg-red-100">{error}</p>
      )}

      {/* Timeline Navigation */}
      <div className="flex items-center justify-between mb-6">
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.id}>
            <div
              onClick={() => setCurrentPage(tab.id)}
              className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer ${currentPage === tab.id
                ? "bg-primary text-white"
                : currentPage > tab.id
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
                }`}
            >
              {tab.id}
            </div>
            {index < tabs.length - 1 && (
              <div
                className={`flex-1 h-1 ${currentPage > tab.id ? "bg-primary" : "bg-gray-300"
                  }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Pages */}
      <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-lg">
        {currentPage === 1 && (
          <div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-700">Reported By</label>
              <textarea
                name="reporter"
                value={formData.reporter}
                onChange={handleChange}
                rows="1"
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
              <label className="text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
          </div>
        )}

        {currentPage === 2 && (
          <div>
            <h2 className="text-gray-700 mb-4">Solution Steps</h2>
            {formData.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 mb-4">
                <textarea
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  rows="1"
                  maxLength={255}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                  placeholder={`Step ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  className="text-red-500 underline"
                >
                  Remove
                </button>
              </div>
            ))}
            {formData.steps.length < 5 && (
              <button
                type="button"
                onClick={handleAddStep}
                className="px-4 py-2 text-primary underline rounded"
              >
                Add Step
              </button>
            )}
          </div>
        )}

        {currentPage === 3 && (
          <div className="flex flex-col gap-2">
            <label className="text-gray-700">Resolution</label>
            <textarea
              name="solution"
              value={formData.solution}
              onChange={handleChange}
              rows="4"
              maxLength={255}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter resolution"
            />
            <label className="text-gray-700">Attach Image</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>
        )}

        {currentPage === 4 && submissionSuccess && (
          <div className="flex flex-col border p-6 rounded-lg justify-center items-center text-center bg-gray-50">
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">
              ✅ Form Submitted!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Your report has been sent to your administrator for approval.
            </p>

            <button
              onClick={() => handleCancel()}
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow hover:bg-sky-600 transition-transform transform hover:scale-105"
            >
              <FaArrowAltCircleLeft size={20} />
              Back to Portal
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          {currentPage > 1 && currentPage != 4 && (
            <button
              type="button"
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-red-200 transition"
            >
              Back
            </button>
          )}
          {currentPage < 3 && (
            <button
              type="button"
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-sky-200 transition"
            >
              Next
            </button>
          )}
          {currentPage === 3 && (
            <button
              type="submit"
              className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
            >
              Submit
            </button>
          )}
          {/* {currentPage === 4 && (
            <button
            onClick={()=> navigate('/ac')}
              className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
            >
              Back to Portal 
            </button>
          )} */}

        </div>
      </form>
    </div>
  );
};

export default ActionForm;

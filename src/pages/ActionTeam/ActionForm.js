import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ActionForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    description: "",
    criticality: "low",
    sublocId: null,
    assetNo: null,
    reporter: "",
    steps: [],
    solution: "",
    attachedImage: null
  });
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitted data:", formData);
      navigate("/success");
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const tabs = [
    { id: 1, label: "Page 1: Details" },
    { id: 2, label: "Page 2: Steps" },
    { id: 3, label: "Page 3: Resolution" },
  ];

  return (
    <div className="p-4 max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">Action Form</h1>

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
            <h2 className="text-gray-700 mb-4">Solution Steps <span className="text-gray-500">(Optional)</span></h2>
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

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          {currentPage > 1 && (
            <button
              type="button"
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Back
            </button>
          )}
          {currentPage < 3 && (
            <button
              type="button"
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-indigo-600"
            >
              Next
            </button>
          )}
          {currentPage === 3 && (
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-indigo-600"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ActionForm;

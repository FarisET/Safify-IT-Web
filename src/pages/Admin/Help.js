import React, { useState } from 'react';
import { FaArrowUp, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Help = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-8 text-left text-gray-800">Help & Support</h1>

      {/* Table of Contents */}
      <nav className="mb-10 bg-gray-100 p-6 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Table of Contents</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <a href="#introduction" className="text-blue-600 hover:underline">
              Introduction
            </a>
          </li>
          <li>
            <a href="#features" className="text-blue-600 hover:underline">
              Features
            </a>
          </li>
          <li>
            <a href="#roles" className="text-blue-600 hover:underline">
              User Roles
            </a>
          </li>
        </ul>
      </nav>

      {/* Sections */}
      <section id="introduction" className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Introduction</h2>
        <p className="text-gray-700 leading-relaxed">
          Welcome to the IT Service Management, Ticketing System, and Asset Management platform. This system is designed to streamline the process of managing IT services, handling user tickets, and managing assets efficiently. Below is a brief overview of the features available in this system.
        </p>
      </section>

      <section id="features" className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Features</h2>
        {[
          { title: 'Ticket Management', description: 'Create and manage tickets efficiently, assign them to support persons, and monitor progress.' },
          { title: 'Asset Management', description: 'Track and manage IT assets, assign them to users, and keep a history of activities.' },
          { title: 'User Directory', description: 'Manage user roles and view detailed user information.' },
          { title: 'Solution Forum', description: 'Collaborate with others to build a knowledge base for common issues.' },
          { title: 'Approvals', description: 'Review and approve action reports submitted by support persons.' },
          { title: 'Reports', description: 'Generate insights on ticket statuses, asset usage, and user activities.' },
        ].map((feature, index) => (
          <div key={index} className="mb-6">
            <button
              className="flex justify-between items-center w-full text-left text-md font-semibold text-gray-800 bg-gray-100 p-4 rounded-md hover:bg-gray-200 transition"
              onClick={() => toggleSection(index)}
            >
              {feature.title}
              {expandedSection === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSection === index && (
              <p className="mt-2 pl-6 text-gray-700 leading-relaxed">{feature.description}</p>
            )}
          </div>
        ))}
      </section>

      <section id="roles" className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">User Roles</h2>
        {[
          { title: 'Action Teams', description: 'Support persons who resolve tickets assigned to them, update statuses, and submit reports for approval.' },
          { title: 'Admins', description: 'Monitor and assign tickets, manage assets, and oversee platform operations.' },
          { title: 'Users', description: 'Create tickets, view statuses, and interact with support persons for issue resolution.' },
        ].map((role, index) => (
          <div key={index} className="mb-6">
            <button
              className="flex justify-between items-center w-full text-left text-md font-semibold text-gray-800 bg-gray-100 p-4 rounded-md hover:bg-gray-200 transition"
              onClick={() => toggleSection(`role-${index}`)}
            >
              {role.title}
              {expandedSection === `role-${index}` ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSection === `role-${index}` && (
              <p className="mt-2 pl-6 text-gray-700 leading-relaxed">{role.description}</p>
            )}
          </div>
        ))}
      </section>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring focus:ring-blue-300"
        aria-label="Back to top"
      >
        <FaArrowUp size={20} className='text-black'/>
      </button>
    </div>
  );
};

export default Help;

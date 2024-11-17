import React from 'react';
import { FaCircle } from 'react-icons/fa';

const notifications = [
  {
    id: 1,
    title: 'Usman Umer updated an issue',
    description: 'Retrieving weight on tablet.',
    issueId: 'DP-87',
    status: 'To Do',
    time: '3 weeks ago',
  },
  {
    id: 2,
    title: 'Usman Umer assigned an issue to you',
    description: 'SRS Documentation',
    issueId: 'SAF-10',
    status: 'To Do',
    time: '3 weeks ago',
  },
  {
    id: 3,
    title: 'New incident reported by John Doe',
    description: 'Fire alarm triggered in Block B.',
    issueId: 'INC-55',
    status: 'In Progress',
    time: '2 days ago',
  },
];

const Notifications = () => {
  return (
    <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-800">Notifications</h2>
      </div>
      <div>
        {notifications.map((notification) => (
          <div key={notification.id} className="p-4 border-b hover:bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">{notification.title}</span>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
            <p className="text-gray-700">{notification.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-blue-500 text-xs">{notification.issueId}</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{notification.status}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center py-2 text-gray-500">
        That's all your notifications for now.
      </div>
    </div>
  );
};

export default Notifications;

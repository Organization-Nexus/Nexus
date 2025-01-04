import React from "react";
import {
  FaHome,
  FaTasks,
  FaUsers,
  FaCalendarAlt,
  FaCommentDots,
  FaClipboardList,
  FaBookmark,
} from "react-icons/fa"; // 아이콘 사용

function LeftNavBar() {
  return (
    <div className="bg-white text-gray-800 flex flex-col h-full rounded-xl">
      {/* Header */}
      <div className="p-4 text-xl font-semibold border-b border-gray-200">
        Nexus
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul>
          {/* Project Section */}
          <li>
            <a
              href="#"
              className="flex items-center p-4 hover:bg-secondary hover:text-white transition-colors"
            >
              <FaHome className="mr-3" /> Project Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-4 hover:bg-secondary hover:text-white transition-colors"
            >
              <FaTasks className="mr-3" /> Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-4 hover:bg-secondary hover:text-white transition-colors"
            >
              <FaClipboardList className="mr-3" /> Meeting Notes
            </a>
          </li>
          <hr className="my-2 border-gray-300" />

          {/* Community Section */}
          <li>
            <a
              href="#"
              className="flex items-center p-4 hover:bg-secondary hover:text-white transition-colors"
            >
              <FaUsers className="mr-3" /> Community
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-4 hover:bg-secondary hover:text-white transition-colors"
            >
              <FaCalendarAlt className="mr-3" /> Calendar
            </a>
          </li>
          <hr className="my-2 border-gray-300" />

          {/* Milestones and Issues Section */}
          <li>
            <a
              href="#"
              className="flex items-center p-4 hover:bg-secondary hover:text-white transition-colors"
            >
              <FaClipboardList className="mr-3" /> Milestones
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-4 hover:bg-secondary hover:text-white transition-colors"
            >
              <FaClipboardList className="mr-3" /> Issues
            </a>
          </li>
          <hr className="my-2 border-gray-300" />

          {/* Bookmarks Section */}
          <li>
            <a
              href="#"
              className="flex items-center p-4 hover:bg-secondary hover:text-white transition-colors"
            >
              <FaCommentDots className="mr-3" /> My Posts/Comments
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-4 hover:bg-secondary hover:text-white transition-colors"
            >
              <FaBookmark className="mr-3" /> Bookmarks
            </a>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-center">
        © 2025 Nexus Inc. [v1.0.0] by SUJONG, BOKYUNG developers
      </div>
    </div>
  );
}

export default LeftNavBar;

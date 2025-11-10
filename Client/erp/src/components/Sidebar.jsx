import React, { useState, useEffect } from "react";
import Header from "./Header";

import {
  FaBars,
  FaTachometerAlt,
  FaProjectDiagram,
  FaUsers,
  FaBug,
  FaUserShield,
  FaHardHat,
  FaLandmark,
  FaChartBar,
  FaChevronDown,
  FaClipboardList,
  FaFileExport,
  FaMoon,
  FaSun,
  FaListAlt,
  FaPlus,
  FaEdit,
  FaUserPlus,
  FaUserCog,
  FaTasks,
  FaClock ,
  FaBuilding,
  FaMoneyCheckAlt, FaMoneyBillWave,
  FaCalendarAlt, FaPhoneAlt,
} from "react-icons/fa";

import AddAdmin from "./pages/AddAdmin";
import AllAdmins from "./pages/AllAdmins";
import ManageAdmin from "./pages/ManageAdmins";
import Departments from "./pages/Departments"; 
import AddProject from "./pages/AddProject";
import ManageProjects from "./pages/ManageProjects";
import AddPlaza from "./pages/AddPlaza";
import AllPlaza from "./pages/AllPlaza";
import AddEmployee from "./pages/AddEmployees";
import AllEmployees from "./pages/AllEmployees";
import ManageEmployees from "./pages/ManageEmployees";
import AddRoles from "./pages/AddRoles";
import AllRoles from "./pages/AllRoles";
import AllEngineers from "./pages/AllEngineers";
import ManageIssues from "./pages/ManageIssues";
import AdminAttendance from "./pages/AdminAttendance";
import ExportAttendance from "./pages/ExportAttendance";
import AdminLeave from "./pages/AdminLeave";
import Dashboard from "./pages/Dashboard";
import ReportScheduler from "./pages/ReportScheduler";

import CreateIssue from "./employees/CreateIssue";
import TrackIssues from "./employees/TrackIssue";
import AllIssues from "./pages/AllIssues";
import MarkAttendance from "./employees/MarkAttendance";
import ApplyLeave from "./employees/ApplyLeave";
import CallLeave from "./employees/CallLeave";
import PayrollForm from "./pages/PayrollForm";
import AllPayroll from "./pages/AllPayroll";
import MyPayroll from "./employees/MyPayroll";
import EmployeeDashboard from "./employees/EmployeeDashboard";



const Sidebar = () => {
   const [records, setRecords] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [createdIssues, setCreatedIssues] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [lightMode, setLightMode] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard"); // Track selected page
  const [isMobileOpen, setIsMobileOpen] = useState(false); 

  // Dual login: userType from localStorage
  const [userType, setUserType] = useState("employee"); // default employee
  useEffect(() => {
    const type = localStorage.getItem("userType") || "employee";
    setUserType(type);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleSubmenu = (menu) =>
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  const toggleMode = () => setLightMode(!lightMode);

  const renderContent = () => {
    return (
      <main className="flex-1 h-screen overflow-y-auto transition-all duration-300 md:ml-20">
        {/* Dashboard */}



        {/* Admin-only pages */}
        {userType === "admin" && (
          <>
          {activePage === "Dashboard" && (
  userType === "admin" ? <Dashboard /> : <Dashboard />
)}
            {activePage === "Add Admin" && (
              <AddAdmin admins={admins} setAdmins={setAdmins} />
            )}
            {activePage === "All Admins" && (
              <AllAdmins admins={admins} />
            )}
            {activePage === "Manage Admins" && (
              <ManageAdmin admins={admins} setAdmins={setAdmins} />
            )}
            {activePage === "Departments" && (
              <Departments />
            )}
            {activePage === "Add Project" && (
              <AddProject projects={projects} setProjects={setProjects} />
            )}
            {activePage === "Manage Projects" && (
              <ManageProjects projects={projects} setProjects={setProjects} />
            )}
            {activePage === "Add Employee" && (
              <AddEmployee employees={employees} setEmployees={setEmployees} />
            )}
            {activePage === "All Employees" && (
              <AllEmployees employees={employees} />
            )}
            {activePage === "Manage Employees" && (
              <ManageEmployees employees={employees} setEmployees={setEmployees} />
            )}
            {activePage === "Add Plaza" && (
              <AddPlaza projects={projects} />
            )}
            {activePage === "All Plaza" && (
              <AllPlaza projects={projects} />
            )}
            {activePage === "Add Role" && (
              <AddRoles setRoles={setRoles} />
            )}
            {activePage === "Roles" && (
              <AllRoles roles={roles} />
            )}
            {activePage === "AllEngineers" && (
              <AllEngineers />
            )}
            {activePage === "Manage Issue" && (
              <ManageIssues />
            )}
            {activePage === "All Issues" && (
              <AllIssues />
            )}
            {activePage === "Attendance Management" && (
               <AdminAttendance />
            )}
            {activePage === "Export Attendance" && (
            <ExportAttendance />
          )}
           {activePage === "Leaves" && (
      <AdminLeave />
    )}{activePage === "Add Payroll" && (
            <PayrollForm records={records} setRecords={setRecords} />
          )}
          {activePage === "All Payrolls" && (
            <AllPayroll records={records} />
          )}{activePage === "ReportScheduler" && (
            <ReportScheduler/>
          )}
          </>
        )}

         {/* ✅ Employee-only pages */}
      {userType === "employee" && (
        <>
        {activePage === "Create Issue" && (
        <CreateIssue createdIssues={createdIssues} setCreatedIssues={setCreatedIssues} />
      )}
      {activePage === "Track Issue" && (
        <TrackIssues createdIssues={createdIssues} />
      )}
          {activePage === "Mark Attendance" && (
            <MarkAttendance />
          )}
          {activePage === "Apply Leave" && (
                 <ApplyLeave leaves={leaves} setLeaves={setLeaves} />

          )}
{activePage === "Call Leave" && (
   <CallLeave leaves={leaves} setLeaves={setLeaves}  />
)}{activePage === "Payrolls" && (
   <MyPayroll />
)}{activePage === "Dashboard" && (
  userType === "admin" ? <Dashboard /> : <EmployeeDashboard />
)}
        </>
      )}

      {/* 🚫 Access denied fallback (only for unknown role) */}
      {userType !== "admin" &&
        userType !== "employee" &&
        activePage !== "Dashboard" && (
          <h1 className="text-2xl font-bold text-red-500">🚫 Access Denied</h1>
        )}
      </main>
    );
  };

  return (
    <div className="flex relative">
      {/* Header */}
      <Header
        onLogout={() => {
          localStorage.removeItem("userType");
          window.location.href = "/login";
        }}
        isSidebarOpen={!collapsed}
        lightMode={lightMode}
        toggleMode={toggleMode} 
      />
       {/* ✅ Mobile Hamburger Button */}
   <button
  onClick={() => setIsMobileOpen(!isMobileOpen)}
  className="md:hidden fixed top-3 left-4 z-50 p-2 rounded-md text-white"
>
  <FaBars className="text-3xl sm:text-4xl" />
</button>


       {/* ✅ Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 shadow-lg flex flex-col justify-between
        ${
          lightMode
            ? "bg-white text-gray-800 border-r border-gray-300"
            : "bg-gradient-to-b from-gray-900 to-gray-800 text-white border-r border-slate-500"
        }
        ${collapsed ? "w-24 md:w-28" : "w-72 md:w-85"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-3 border-b border-slate-500">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="w-12 h-12 rounded-full bg-white p-2 shadow-lg"
          />
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 px-3 overflow-y-auto">
          <ul className="space-y-1 p-2 text-xl font-semibold">
            {/* ✅ Employee Menus */}
            {userType === "employee" && (
              <>
                {/* Dashboard */}
                <li>
                  <button
                    onClick={() => setActivePage("Dashboard")}
                    className="flex items-center p-3 rounded-lg hover:bg-slate-700 hover:text-white w-full"
                  >
                    <FaTachometerAlt className="text-3xl" />
                    {!collapsed && (
                      <span className="ml-4 text-lg font-semibold">
                        Dashboard
                      </span>
                    )}
                  </button>
                </li>
    {/* 🐞 Issue Section */}
    <li>
      <button
        onClick={() => toggleSubmenu("issue")}
        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
      >
        <FaBug className="text-3xl" />
        {!collapsed && (
          <>
            <span className="ml-4 flex-1 text-left text-lg font-semibold">
              Issue
            </span>
            <FaChevronDown
              className={`ml-auto transition-transform text-xl ${
                openSubmenu === "issue" ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>
      {openSubmenu === "issue" && !collapsed && (
        <div className="pl-8 mt-3 space-y-2 text-lg font-medium">
          <button
            onClick={() => setActivePage("Create Issue")}
            className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
          >
            <FaPlus className="mr-3 text-xl" /> Create Issue
          </button>
          <button
            onClick={() => setActivePage("Track Issue")}
            className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
          >
            <FaListAlt className="mr-3 text-xl" /> Track Issue
          </button>
        </div>
      )}
    </li>

    {/* 👥 Attendance Section */}
    <li>
      <button
        onClick={() => toggleSubmenu("attendance")}
        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
      >
        <FaUsers className="text-3xl" />
        {!collapsed && (
          <>
            <span className="ml-4 flex-1 text-left text-lg font-semibold">
              Attendance
            </span>
            <FaChevronDown
              className={`ml-auto transition-transform text-xl ${
                openSubmenu === "attendance" ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>
      {openSubmenu === "attendance" && !collapsed && (
        <div className="pl-8 mt-3 space-y-2 text-lg font-medium">
          <button
            onClick={() => setActivePage("Mark Attendance")}
            className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
          >
            <FaPlus className="mr-3 text-xl" /> Mark Attendance
          </button>
        </div>
      )}
    </li>

    {/* 🗓️ Leave Section (New) */}
    <li>
      <button
        onClick={() => toggleSubmenu("leave")}
        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
      >
        <FaCalendarAlt className="text-3xl" />
        {!collapsed && (
          <>
            <span className="ml-4 flex-1 text-left text-lg font-semibold">
              Leave
            </span>
            <FaChevronDown
              className={`ml-auto transition-transform text-xl ${
                openSubmenu === "leave" ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>
      {openSubmenu === "leave" && !collapsed && (
        <div className="pl-8 mt-3 space-y-2 text-lg font-medium">
          <button
            onClick={() => setActivePage("Apply Leave")}
            className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
          >
            <FaPlus className="mr-3 text-xl" /> Apply Leave
          </button>
          <button
            onClick={() => setActivePage("Call Leave")}
            className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
          >
            <FaPhoneAlt className="mr-3 text-xl" />Leave Status
          </button>
        </div>
      )}
    </li>
    {/* 💰 Payroll Section */}
<li>
  <button
    onClick={() => setActivePage("Payrolls")}
    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
  >
    <FaMoneyCheckAlt className="text-3xl" />
    {!collapsed && (
      <span className="ml-4 flex-1 text-left text-lg font-semibold">
        Payroll
      </span>
    )}
  </button>
</li>

  </>
)}

            {/* Admin menus only */}
            {userType === "admin" && (
              <>
              {/* Dashboard */}
            <li>
              <button
                onClick={() => setActivePage("Dashboard")}
                className="flex items-center p-3 rounded-lg hover:bg-slate-700 hover:text-white w-full"
              >
                <FaTachometerAlt className="text-3xl" />
                {!collapsed && <span className="ml-4 text-lg font-semibold">Dashboard</span>}
              </button>
            </li>
                {/* Projects */}
                <li>
                  <button
                    onClick={() => toggleSubmenu("projects")}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
                  >
                    <FaProjectDiagram className="text-3xl" />
                    {!collapsed && (
                      <>
                        <span className="ml-4 flex-1 text-left text-lg font-semibold">Projects</span>
                        <FaChevronDown
                          className={`ml-auto transition-transform text-xl ${openSubmenu === "projects" ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>
                  {openSubmenu === "projects" && !collapsed && (
                    <div className="pl-8 mt-3 space-y-2 text-lg font-medium">
                      <button
                        onClick={() => setActivePage("Add Project")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaPlus className="mr-3 text-xl" /> Add Project
                      </button>
                      <button
                        onClick={() => setActivePage("Manage Projects")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaEdit className="mr-3 text-xl" /> Manage Projects
                      </button>
                    </div>
                  )}
                </li>

                {/* Admin */}
                <li>
                  <button
                    onClick={() => toggleSubmenu("admin")}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 overflow-hidden"
                  >
                    <FaUsers className="text-3xl" />
                    {!collapsed && (
                      <>
                        <span className="ml-4 flex-1 text-left text-lg font-semibold">Admin</span>
                        <FaChevronDown
                          className={`ml-auto transition-transform text-xl ${openSubmenu === "admin" ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>
                  {openSubmenu === "admin" && !collapsed && (
                    <div className="pl-8 mt-3 space-y-2 text-lg font-medium">
                      <button
                        onClick={() => setActivePage("All Admins")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaUsers className="mr-3 text-xl" /> All Admins
                      </button>
                      <button
                        onClick={() => setActivePage("Add Admin")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaUserPlus className="mr-3 text-xl" /> Add Admin
                      </button>
                      <button
                        onClick={() => setActivePage("Manage Admins")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaUserCog className="mr-3 text-xl" /> Manage Admins
                      </button>
                    </div>
                  )}
                </li>
{/* Attendance */}
<li>
  <button
    onClick={() => toggleSubmenu("attendance")}
    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
  >
    <FaUsers className="text-3xl" />
    {!collapsed && (
      <>
        <span className="ml-4 flex-1 text-left text-lg font-semibold">
          Attendance
        </span>
        <FaChevronDown
          className={`ml-auto transition-transform text-xl ${
            openSubmenu === "attendance" ? "rotate-180" : ""
          }`}
        />
      </>
    )}
  </button>

  {openSubmenu === "attendance" && !collapsed && (
    <div className="pl-8 mt-3 space-y-2 text-lg font-medium">
      <button
        onClick={() => setActivePage("Attendance Management")}
        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
      >
        <FaClipboardList className="mr-3 text-xl" /> Attendance Management
      </button>
      <button
        onClick={() => setActivePage("Export Attendance")}
        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
      >
        <FaFileExport className="mr-3 text-xl" /> Export Attendance
      </button>
    </div>
  )}
</li>

{/* Payroll */}
<li>
  <button
    onClick={() => toggleSubmenu("payroll")}
    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
  >
    <FaMoneyCheckAlt className="text-3xl" />
    {!collapsed && (
      <>
        <span className="ml-4 flex-1 text-left text-lg font-semibold">Payroll</span>
        <FaChevronDown
          className={`ml-auto transition-transform text-xl ${
            openSubmenu === "payroll" ? "rotate-180" : ""
          }`}
        />
      </>
    )}
  </button>
  
  {openSubmenu === "payroll" && !collapsed && (
    <div className="pl-8 mt-3 space-y-2 text-lg font-medium">
      <button
        onClick={() => setActivePage("Add Payroll")}
        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
      >
        <FaPlus className="mr-3 text-xl" /> Add Payroll
      </button>
      <button
        onClick={() => setActivePage("All Payrolls")}
        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
      >
        <FaListAlt className="mr-3 text-xl" /> All Payrolls
      </button>
    </div>
  )}
</li>




  {/* Departments */}
                <li>
                  <button
                    onClick={() => setActivePage("Departments")}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
                  >
                    <FaBuilding className="text-3xl" />
                    {!collapsed && <span className="ml-4 text-lg font-semibold">Departments</span>}
                  </button>
                </li>


                {/* Employees */}
                <li>
                  <button
                    onClick={() => toggleSubmenu("employees")}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
                  >
                    <FaHardHat className="text-3xl" />
                    {!collapsed && (
                      <>
                        <span className="ml-4 flex-1 text-left text-lg font-semibold">Employees</span>
                        <FaChevronDown
                          className={`ml-auto transition-transform text-xl ${openSubmenu === "employees" ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>
                  {openSubmenu === "employees" && !collapsed && (
                    <div className="pl-8 mt-3 space-y-2 text-lg font-medium">
                      <button
                        onClick={() => setActivePage("Add Employee")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaUserPlus className="mr-3 text-xl" /> Add Employee
                      </button>
                      <button
                        onClick={() => setActivePage("All Employees")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaUsers className="mr-3 text-xl" /> All Employees
                      </button>
                      <button
                        onClick={() => setActivePage("Manage Employees")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaUserCog className="mr-3 text-xl" /> Manage Employees
                      </button>
                    </div>
                  )}
                </li>

                {/* Plaza */}
                <li>
                  <button
                    onClick={() => toggleSubmenu("plaza")}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
                  >
                    <FaLandmark className="text-3xl" />
                    {!collapsed && (
                      <>
                        <span className="ml-4 flex-1 text-left text-lg font-semibold">Plaza</span>
                        <FaChevronDown
                          className={`ml-auto transition-transform text-xl ${openSubmenu === "plaza" ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>
                  {openSubmenu === "plaza" && !collapsed && (
                    <div className="pl-8 mt-3 space-y-2 text-lg font-medium">
                      <button
                        onClick={() => setActivePage("Add Plaza")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaPlus className="mr-3 text-xl" /> Add Plaza
                      </button>
                      <button
                        onClick={() => setActivePage("All Plaza")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaListAlt className="mr-3 text-xl" /> All Plaza
                      </button>
                    </div>
                  )}
                </li>

                {/* Roles */}
                <li>
                  <button
                    onClick={() => toggleSubmenu("roles")}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
                  >
                    <FaUserShield className="text-3xl" />
                    {!collapsed && (
                      <>
                        <span className="ml-4 flex-1 text-left text-lg font-semibold">Roles</span>
                        <FaChevronDown
                          className={`ml-auto transition-transform text-xl ${openSubmenu === "roles" ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>
                  {openSubmenu === "roles" && !collapsed && (
                    <div className="pl-8 mt-3 space-y-2 text-lg font-medium">
                      <button
                        onClick={() => setActivePage("Add Role")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaPlus className="mr-3 text-xl" /> Add Role
                      </button>
                      <button
                        onClick={() => setActivePage("Roles")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaListAlt className="mr-3 text-xl" /> Roles
                      </button>
                    </div>
                  )}
                </li>

                {/* Issues */}
                <li>
                  <button
                    onClick={() => toggleSubmenu("issue")}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
                  >
                    <FaBug className="text-3xl" />
                    {!collapsed && (
                      <>
                        <span className="ml-4 flex-1 text-left text-lg font-semibold">Issue</span>
                        <FaChevronDown
                          className={`ml-auto transition-transform text-xl ${openSubmenu === "issue" ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>
                  {openSubmenu === "issue" && !collapsed && (
                    <div className="pl-8 mt-3 space-y-2 text-lg font-medium">
                      <button
                        onClick={() => setActivePage("Manage Issue")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaTasks className="mr-3 text-xl" /> Manage Issue
                      </button>
                      <button
                        onClick={() => setActivePage("All Issues")}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
                      >
                        <FaListAlt className="mr-3 text-xl" /> All Issues
                      </button>
                    </div>
                  )}
                </li>

                    {/* Leaves Only */}
    <li>
      <button
        onClick={() => setActivePage("Leaves")}
        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition"
      >
        <FaCalendarAlt className="text-3xl" />
        {!collapsed && (
          <span className="ml-4 flex-1 text-left text-lg font-semibold">
            Leaves
          </span>
        )}
      </button>
    </li>

                {/* All Engineers */}
                <li>
                  <button
                    onClick={() => setActivePage("AllEngineers")}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
                  >
                    <FaUsers className="text-3xl" />
                    {!collapsed && <span className="ml-4 text-lg font-semibold">All Engineers</span>}
                  </button>
                </li>
{/* Report Scheduler */}
<li>
  <button
    onClick={() => setActivePage("ReportScheduler")}
    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700"
  >
    <FaClock className="text-3xl" />
    {!collapsed && (
      <span className="ml-4 text-lg font-semibold">Report Scheduler</span>
    )}
  </button>
</li>

              </>
            )}
          </ul>
        </div>

        {/* Light/Dark Mode Toggle */}
        {/* <div className="absolute bottom-23 left-1/2 -translate-x-1/2">
          <button
            onClick={toggleMode}
            className={`p-2 rounded-full text-2xl shadow-md transition-transform transform hover:scale-110
              ${lightMode ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-gray-200"}`}
          >
            {lightMode ? <FaMoon /> : <FaSun />}
          </button>
        </div> */}

       {/* Footer */}
        <div className="border-t border-slate-700 p-5 text-center relative z-10">
          {!collapsed && (
            <>
              <p className="text-slate-400 text-sm">Powered By</p>
              <strong className="text-slate-200 text-base">
                Mahakalinfra Esolution Pvt Ltd
              </strong>
            </>
          )}
        </div>
      </div>

      {/* ✅ Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}

      {/* ✅ Desktop Collapse Button */}
      <button
        onClick={toggleSidebar}
        className={`hidden md:block fixed top-6 left-68 z-50 p-1 rounded-full text-4xl transition-all
          ${
            lightMode
              ? "text-gray-800 hover:text-black hover:shadow-lg hover:scale-110"
              : "text-gray-400 hover:text-gray-200 hover:shadow-lg hover:scale-110"
          }`}
      >
        <FaBars />
      </button>

      {/* ✅ Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        } `}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Sidebar;



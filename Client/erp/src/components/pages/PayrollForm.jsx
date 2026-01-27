import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaEye } from "react-icons/fa";
import { format } from "date-fns";
import Swal from "sweetalert2";
import axios from "axios";

const PayrollForm = () => {
  const [employee, setEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [month, setMonth] = useState("");
  const [markDate, setMarkDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [department, setDepartment] = useState("");
  const [previewRecord, setPreviewRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [leaves, setLeaves] = useState("");
  const [salary, setSalary] = useState("");
  const [expense, setExpense] = useState("");

  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/employees`
        );
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch employees", "error");
      }
    };
    fetchEmployees();
  }, []);

  // Fetch payrolls
  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/payrolls`
        );
        setRecords(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch payrolls", "error");
      }
    };
    fetchPayrolls();
  }, []);

  // Pagination
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = records.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  // Employee select
  const handleEmployeeSelect = (id) => {
    const emp = employees.find((e) => e._id === id);
    setEmployee(emp);

    if (emp) {
      setBankName(emp.bankName);
      setAccountNumber(emp.accountNumber);
      setIfsc(emp.ifsc);
      setDepartment(emp.department);

      setPreviewRecord({
        fullName: emp.fullName,
        username: emp.username || "-",
        phone: emp.phone || "-",
        bankName: emp.bankName,
        accountNumber: emp.accountNumber,
        ifsc: emp.ifsc,
        department: emp.department,
      });
    } else {
      setPreviewRecord(null);
      setBankName("");
      setAccountNumber("");
      setIfsc("");
      setDepartment("");
    }
  };

  const isFormValid =
    employee &&
    month &&
    markDate &&
    leaves &&
    salary &&
    expense &&
    bankName &&
    accountNumber &&
    ifsc &&
    department;

  // Submit
  const handleSubmit = async () => {
    if (!isFormValid) return;

    const newRecord = {
      fullName: employee.fullName,
      username: employee.username || "-",
      phone: employee.phone || "-",
      bankName,
      accountNumber,
      ifsc,
      department,
      month,
      date: markDate,
      leaves,
      salary,
      expense,
      markedBy: "Admin",
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/payrolls`, newRecord);

      setEmployee(null);
      setPreviewRecord(null);
      setBankName("");
      setAccountNumber("");
      setIfsc("");
      setDepartment("");
      setMonth("");
      setLeaves("");
      setSalary("");
      setExpense("");

      Swal.fire({
        icon: "success",
        title: "Salary sent successfully!",
        text: `${newRecord.fullName}'s payroll has been submitted.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit payroll", "error");
    }
  };

return (
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-30 pl-1 pr-2 py-6">
    <div className="bg-white rounded-xl shadow-xl p-10 sm:p-6 border border-gray-200 max-w-6xl mx-auto">

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-5 text-center">
        Payroll Management
      </h1>

      {/* Payroll Form */}
      <div className="border border-gray-300 rounded-xl p-3 sm:p-5 mb-5 bg-gray-50 shadow-sm max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Payroll Records
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3">

          {/* Employee */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm mb-1 font-medium">Select Employee</label>
            <select
              value={employee?._id || ""}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm mb-1 font-medium">Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm mb-1 font-medium">Date</label>
            <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 bg-white">
              <FaCalendarAlt className="text-gray-500 mr-2 text-sm" />
              <input
                type="date"
                value={markDate}
                onChange={(e) => setMarkDate(e.target.value)}
                className="outline-none text-sm w-full"
              />
            </div>
          </div>
        </div>

        {/* Leaves, Salary, Expense */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm mb-1 font-medium">Leaves</label>
            <input
              type="number"
              value={leaves}
              onChange={(e) => setLeaves(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 text-sm mb-1 font-medium">Salary (₹)</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 text-sm mb-1 font-medium">Expense (₹)</label>
            <input
              type="number"
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`px-5 py-1.5 rounded-md text-sm font-semibold text-white ${
                isFormValid ? "bg-gray-800 hover:bg-black" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="overflow-x-auto rounded-md">
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-2 text-left">Full Name</th>
              <th className="py-2 px-2 text-left">Bank Name</th>
              <th className="py-2 px-2 text-left">Account Number</th>
              <th className="py-2 px-2 text-left">IFSC</th>
              <th className="py-2 px-2 text-left">View</th>
            </tr>
          </thead>
          <tbody>
            {previewRecord && (
              <tr className="bg-gray-100 font-medium">
                <td className="py-2 px-2">{previewRecord.fullName}</td>
                <td className="py-2 px-2">{previewRecord.bankName}</td>
                <td className="py-2 px-2">{previewRecord.accountNumber}</td>
                <td className="py-2 px-2">{previewRecord.ifsc}</td>
                <td className="py-2 px-2">
                  <button onClick={() => setSelectedRecord(previewRecord)} className="text-blue-600">
                    <FaEye />
                  </button>
                </td>
              </tr>
            )}

            {currentRecords.map((rec) => (
              <tr key={rec._id} className="hover:bg-gray-100 transition font-medium">
                <td className="py-2 px-2">{rec.fullName}</td>
                <td className="py-2 px-2">{rec.bankName}</td>
                <td className="py-2 px-2">{rec.accountNumber}</td>
                <td className="py-2 px-2">{rec.ifsc}</td>
                <td className="py-2 px-2">
                  <button onClick={() => setSelectedRecord(rec)} className="text-green-600">
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}

            {!previewRecord && currentRecords.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-3 italic">
                  No payroll records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {records.length > recordsPerPage && (
        <div className="flex justify-center items-center mt-4 space-x-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-1 rounded text-sm text-white ${
              currentPage === 1 ? "bg-gray-400" : "bg-gray-900 hover:bg-black"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-1 rounded text-sm text-white ${
              currentPage === totalPages ? "bg-gray-400" : "bg-gray-900 hover:bg-black"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-3">
          <div className="bg-white p-5 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center">Payroll Details</h3>

            <div className="space-y-2 text-gray-800 text-sm font-medium">
              <p><span className="font-semibold">Full Name:</span> {selectedRecord.fullName}</p>
              <p><span className="font-semibold">Username:</span> {selectedRecord.username}</p>
              <p><span className="font-semibold">Phone:</span> {selectedRecord.phone}</p>
              <p><span className="font-semibold">Bank Name:</span> {selectedRecord.bankName}</p>
              <p><span className="font-semibold">Account Number:</span> {selectedRecord.accountNumber}</p>
              <p><span className="font-semibold">IFSC:</span> {selectedRecord.ifsc}</p>
              <p><span className="font-semibold">Department:</span> {selectedRecord.department}</p>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
);
};

export default PayrollForm;

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
      await axios.post("http://localhost:5000/api/payrolls", newRecord);

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
   <div className="p-4 md:p-8 min-h-screen ">
      <div className="bg-white pb-40 rounded-3xl shadow-2xl p-4 md:p-8 border border-gray-200 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">
          Payroll Management
        </h1>

        {/* Payroll Form */}
        <div className="border border-gray-300 rounded-2xl p-4 md:p-6 mb-4 bg-gray-50 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
            Payroll Records
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-4">
            {/* Employee Select */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm md:text-lg mb-1 font-medium">
                Select Employee
              </label>
              <select
                value={employee?._id || ""}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none text-gray-900 text-sm md:text-lg"
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
              <label className="text-gray-700 text-sm md:text-lg mb-1 font-medium">
                Month
              </label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none text-gray-900 text-sm md:text-lg"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm md:text-lg mb-1 font-medium">
                Date
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <input
                  type="date"
                  value={markDate}
                  onChange={(e) => setMarkDate(e.target.value)}
                  className="outline-none text-gray-900 text-sm md:text-lg w-full"
                />
              </div>
            </div>
          </div>

          {/* Leaves, Salary, Expense, Submit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-end">
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm md:text-lg mb-1 font-medium">Leaves</label>
              <input
                type="number"
                value={leaves}
                onChange={(e) => setLeaves(e.target.value)}
                placeholder="Enter leaves"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none text-gray-900 text-sm md:text-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm md:text-lg mb-1 font-medium">Salary (₹)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Enter salary"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none text-gray-900 text-sm md:text-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm md:text-lg mb-1 font-medium">Expense (₹)</label>
              <input
                type="number"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
                placeholder="Enter expense"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none text-gray-900 text-sm md:text-lg"
              />
            </div>

            <div className="flex justify-start md:justify-end">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`${
                  isFormValid
                    ? "bg-gray-800 hover:bg-black cursor-pointer"
                    : "bg-gray-600 cursor-not-allowed"
                } text-white font-semibold px-8 md:px-12 py-2 md:py-3 rounded-lg shadow-sm transition w-full md:w-auto text-sm md:text-base`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="overflow-x-auto  mt-0 mb-2">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm md:text-base">
            <thead>
              <tr className="bg-gray-800 text-white text-sm md:text-base">
                <th className="py-3 px-2 md:px-4 text-left">Full Name</th>
                <th className="py-3 px-2 md:px-4 text-left">Bank Name</th>
                <th className="py-3 px-2 md:px-4 text-left">Account Number</th>
                <th className="py-3 px-2 md:px-4 text-left">IFSC</th>
                <th className="py-3 px-2 md:px-4 text-left">View</th>
              </tr>
            </thead>
            <tbody>
              {previewRecord && (
                <tr className="bg-gray-100 font-medium text-sm md:text-base">
                  <td className="py-2 px-2 md:px-4">{previewRecord.fullName}</td>
                  <td className="py-2 px-2 md:px-4">{previewRecord.bankName}</td>
                  <td className="py-2 px-2 md:px-4">{previewRecord.accountNumber}</td>
                  <td className="py-2 px-2 md:px-4">{previewRecord.ifsc}</td>
                  <td className="py-2 px-2 md:px-4">
                    <button
                      onClick={() => setSelectedRecord(previewRecord)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              )}

              {currentRecords.map((rec) => (
                <tr key={rec._id} className="hover:bg-gray-100 transition font-medium text-sm md:text-base">
                  <td className="py-2 px-2 md:px-4">{rec.fullName}</td>
                  <td className="py-2 px-2 md:px-4">{rec.bankName}</td>
                  <td className="py-2 px-2 md:px-4">{rec.accountNumber}</td>
                  <td className="py-2 px-2 md:px-4">{rec.ifsc}</td>
                  <td className="py-2 px-2 md:px-4">
                    <button
                      onClick={() => setSelectedRecord(rec)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}

              {!previewRecord && currentRecords.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4 italic text-sm md:text-base">
                    No payroll records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {records.length > recordsPerPage && (
            <div className="flex flex-col sm:flex-row justify-start sm:justify-center items-center mt-2 space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium text-sm md:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                currentPage === totalPages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-center text-gray-900">
                Payroll Details
              </h3>
              <div className="space-y-2 md:space-y-3 text-gray-800 text-sm md:text-base font-medium">
                <p><span className="font-bold">Full Name:</span> {selectedRecord.fullName}</p>
                <p><span className="font-bold">Username:</span> {selectedRecord.username}</p>
                <p><span className="font-bold">Phone:</span> {selectedRecord.phone}</p>
                <p><span className="font-bold">Bank Name:</span> {selectedRecord.bankName}</p>
                <p><span className="font-bold">Account Number:</span> {selectedRecord.accountNumber}</p>
                <p><span className="font-bold">IFSC:</span> {selectedRecord.ifsc}</p>
                <p><span className="font-bold">Department:</span> {selectedRecord.department}</p>

              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-6 py-2 md:px-8 md:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm md:text-base font-semibold"
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

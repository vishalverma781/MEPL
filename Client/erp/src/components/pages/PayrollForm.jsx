import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
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

  const [leaves, setLeaves] = useState("");
  const [salary, setSalary] = useState("");
  const [expense, setExpense] = useState("");

  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;

  // -------------------- FETCH EMPLOYEES --------------------
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
  // -------------------- FETCH PAYROLL RECORDS --------------------
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

  // -------------------- Pagination --------------------
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = records.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  // -------------------- Employee select --------------------
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

  // -------------------- Submit --------------------
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
   await axios.post(
        `${import.meta.env.VITE_API_URL}/payrolls`,
        newRecord
      );

    // Reset everything so form & preview disappear
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
    <div className="ml-16 p-4 md:p-8 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-6 border border-gray-200 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">
          Payroll Management
        </h1>

        {/* Payroll Form */}
        <div className="border border-gray-300 rounded-3xl p-8 mb-8 bg-gray-50 shadow-md max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Payroll Records
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Employee Select */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-lg mb-2 font-medium">
                Select Employee
              </label>
              <select
                value={employee?._id || ""}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 bg-white outline-none text-gray-900 text-lg font-medium"
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
              <label className="text-gray-700 text-lg mb-2 font-medium">
                Month
              </label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 bg-white outline-none text-gray-900 text-lg font-medium"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-lg mb-2 font-medium">
                Date
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 bg-white">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <input
                  type="date"
                  value={markDate}
                  onChange={(e) => setMarkDate(e.target.value)}
                  className="outline-none text-gray-900 text-lg font-medium w-full"
                />
              </div>
            </div>
          </div>

          {/* Leaves, Salary, Expense, Submit */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="flex flex-col">
              <label className="text-gray-700 text-lg mb-2 font-medium">No. of Leaves</label>
              <input
                type="number"
                value={leaves}
                onChange={(e) => setLeaves(e.target.value)}
                placeholder="Enter leaves"
                className="border border-gray-300 rounded-xl px-4 py-2 bg-white outline-none text-gray-900 text-lg font-medium"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-lg mb-2 font-medium">Total Salary (₹)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Enter salary"
                className="border border-gray-300 rounded-xl px-4 py-2 bg-white outline-none text-gray-900 text-lg font-medium"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-lg mb-2 font-medium">Expense (₹)</label>
              <input
                type="number"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
                placeholder="Enter expense"
                className="border border-gray-300 rounded-xl px-4 py-2 bg-white outline-none text-gray-900 text-lg font-medium"
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
                } text-white font-semibold px-16 py-3 rounded-xl shadow-md transition w-full md:w-auto`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-xl overflow-hidden text-lg">
            <thead>
              <tr className="bg-gray-800 text-white text-xl">
                <th className="py-4 px-4 text-left">Full Name</th>
                  <th className="py-4 px-4 text-left">Username</th>
                <th className="py-4 px-4 text-left">Phone Number</th>
                <th className="py-4 px-4 text-left">Bank Name</th>
                <th className="py-4 px-4 text-left">Account Number</th>
                <th className="py-4 px-4 text-left">IFSC</th>
                <th className="py-4 px-4 text-left">Department</th>
              </tr>
            </thead>
            <tbody className="text-lg">
              {previewRecord && (
                <tr className="bg-gray-100 font-medium">
                  <td className="py-4 px-4">{previewRecord.fullName}</td>
                  <td className="py-4 px-4">{previewRecord.username}</td>
                  <td className="py-4 px-4">{previewRecord.phone}</td>
                  <td className="py-4 px-4">{previewRecord.bankName}</td>
                  <td className="py-4 px-4">{previewRecord.accountNumber}</td>
                  <td className="py-4 px-4">{previewRecord.ifsc}</td>
                  <td className="py-4 px-4">{previewRecord.department}</td>
                </tr>
              )}

              {currentRecords.map((rec) => (
                <tr key={rec._id} className="hover:bg-gray-100 transition font-medium">
                  <td className="py-4 px-4">{rec.fullName}</td>
                   <td className="py-4 px-4">{rec.username || "-"}</td>
                  <td className="py-4 px-4">{rec.phone || "-"}</td>
                  <td className="py-4 px-4">{rec.bankName}</td>
                  <td className="py-4 px-4">{rec.accountNumber}</td>
                  <td className="py-4 px-4">{rec.ifsc}</td>
                  <td className="py-4 px-4">{rec.department}</td>
                </tr>
              ))}

              {!previewRecord && currentRecords.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-6 italic text-lg">
                    No payroll records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {records.length > recordsPerPage && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg text-white font-medium ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-lg text-white font-medium ${
                currentPage === totalPages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollForm;

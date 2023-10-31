const fs = require("fs");
const {
  defaultDept,
  defaultAdmin,
  createEmployee,
  createNewDeparment,
  addEmployeePermissions,
  deleteDepartment,
  updateEmployee,
  getEmployeeDetails,
  removeEmployeePermissions,
  deleteEmployee,
  getEmployeeListByDepartment,
  getActivityLogs,
} = require("../Controller/Controller");

// TODO: To add department: insert attributes of department object
const departmentObject = {
  departmentName: "Hr",
  contactNo: "+9234865455",
  permissions: ["isCreate", "isUpdate"],
};

// TODO: To add user attributes: insert attributes of user object
const userObject = {
  name: "Bashir",
  age: "32",
  salary: "503343",
  phone: "+32185566256",
  address: "lahore",
};

// TODO: To update user attributes: insert attributes of user object
const updateObject = {
  name: "Umair Rajput",
  age: "32",
  salary: "450000",
  phone: "+923487778855",
  address: "Gujrawala",
};
// TODO: To Assign permission to user : insert permission
let employeePermissions = ["isUpdate", "isCreate"];

const userRoutes = async (userModel) => {
  try {
    // TODO:  Assign Token for Authentication/Authorization
    const token = "BXZVVQMIZBBR";

    // * Default role and department
    // defaultDept(userModel);
    // defaultAdmin(userModel);

    // * Employee create method with token verification
    // * params (token, userModel, userAttributesObject)
    createEmployee(token, userModel, userObject);

    // * Employee update method with token verification
    // * params (token, userModel, userId, updateAttributesObject)
    // updateEmployee(token, userModel, 2, updateObject);

    // * Admin create Department
    // * params (token, userModel, departmentName);
    // createNewDeparment(token, userModel, departmentObject);

    // * Admin Delete Department
    // * params (token, userModel, departmentId)
    // deleteDepartment(token, userModel, 2);

    // * Add Employee Permission by User Id
    // * params(token, userModel, UserId, DepartmentName, new Permissions)
    // addEmployeePermissions(token, userModel, 5, "hr", employeePermissions);

    // * Remove Employee Permissions by User Id
    // * params (token, userModel, UserId)
    // removeEmployeePermissions(token, userModel,2);

    // * delete Employee by Id
    // * params (token, userModel, UserId)
    // deleteEmployee(token, userModel,3);

    // * Get Employee Details by Id
    // * params (token, userModel, UserId)
    // getEmployeeDetails(token, userModel, 9);

    // * Get Employee List
    // * params (token, userModel, departmentName)
    // getEmployeeListByDepartment(token, userModel, "dev");

    // * Get Activity Logs (Admin Only)
    // getActivityLogs(token, userModel);
  } catch (error) {
    console.log("User Routes not working properly", error);
  }
};

module.exports = userRoutes;

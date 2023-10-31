const { generateToken } = require("../Middleware/Middleware");

const createUserObject = (
  id,
  name,
  age,
  salary,
  contactDetails,
  permission,
  departmentId
) => {
  const currentTime = new Date();
  const token = generateToken();
  if (typeof name !== "string" || !name.match(/^[A-Za-z\s]*$/g)) {
    console.log("Name must be an alphabet");
  } else if (typeof age !== "string" || !age.match(/^\d+$/g)) {
    console.log("Age must be an number");
  } else if (typeof salary !== "string" || !salary.match(/^\d+$/g)) {
    console.log("Salary must be a number");
  } else {
    return {
      id: id,
      name: name.toLowerCase(),
      age: age,
      salary: salary,
      token: token,
      contactDetails: contactDetails,
      permissions: permission || null,
      departmentId: departmentId || null,
      createdAt: currentTime.toLocaleString(),
      updatedAt: null,
    };
  }
};

const createDepartmentObject = (id, name, contactNo, permissions) => {
  const currentTime = new Date();
  if (!name.match(/^[A-Za-z\s]*$/g)) {
    console.log("Departmetn name must be an alphabet");
  } else {
    return {
      id: id,
      name: name.toLowerCase(),
      contactNo: contactNo,
      permissions: permissions,
      createdAt: currentTime.toLocaleString(),
      updatedAt: null,
    };
  }
};

module.exports = {
  createUserObject,
  createDepartmentObject,
};

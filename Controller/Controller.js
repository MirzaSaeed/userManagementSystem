const fs = require("fs");
const { authMiddleware, generateToken } = require("../Middleware/Middleware");
const {
  createUserObject,
  createDepartmentObject,
} = require("../Func/FactoryFunction");

// ? Default Admin Method
const defaultAdmin = async (userModel) => {
  try {
    let departmentId;
    let departmentPermissions;
    userModel.dept.filter((value) => (departmentId = value.id));
    userModel.dept.filter(
      (value) => (departmentPermissions = value.permissions)
    );

    // * User (Admin) Object
    const user1 = createUserObject(
      userModel.user.length + 1,
      "Mirza Saeed",
      "23",
      "50000",
      [{ phone: "+923487778929", address: "Johar Town Lahore" }],
      departmentPermissions,
      departmentId
    );
    if (departmentId) {
      await userModel.user.push(user1);
      console.log("Default admin has been created");
      await collectActivity(
        userModel,
        "Bydefault action",
        "create",
        "Mirza Saeed"
      );
      console.table(user1);

      // ? writing userModel data in db.json
      fs.writeFile(
        "db.json",
        JSON.stringify(userModel),
        (error) => error && console.error("Error in writing JSON file", error)
      );
    } else {
      console.error("Error: Default Admin cannot be created");
    }
  } catch (error) {
    console.error(error);
  }
};

// ? Default Admin Department
const defaultDept = async (userModel) => {
  try {
    // * Department Object
    const department1 = createDepartmentObject(
      userModel.dept.length + 1,
      "Admin",
      "+923120598929",
      ["isCreate", "isDelete", "isUpdate"]
    );
    if (department1) {
      await userModel.dept.push(department1);
      await collectActivity(
        userModel,
        "Bydefault action",
        "created department",
        "admin"
      );

      console.log("Default department has been created");
      console.table(department1);

      // ? writing userModel data in db.json
      fs.writeFile(
        "db.json",
        JSON.stringify(userModel),
        (error) => error && console.error("Error in writing JSON file", error)
      );
    } else {
      console.error("Error: Default Department cannot be created");
    }
  } catch (error) {
    console.error(error);
  }
};
// ? Create Employee
const createEmployee = async (token, userModel, newUserObject) => {
  try {
    const userAuth = await authMiddleware(token, userModel);
    const { name, age, salary, phone, address } = newUserObject;
    if (!userAuth) {
    } else if (userAuth.permissions.includes("isCreate")) {
      console.log("Authorized employee");

      // * User Object
      const user = createUserObject(
        userModel.user.length + 1,
        name,
        age,
        salary,
        [{ phone: phone, address: address }]
      );

      if (user) {
        await userModel.user.push(user);
        await collectActivity(
          userModel,
          userAuth.name,
          "isCreate",
          name,
          "create employee"
        );
        console.log("New Employee has been created");
        console.table(user);

        //  writing userModel data in db.json
        fs.writeFile(
          "db.json",
          JSON.stringify(userModel),
          (error) => error && console.error("Error in writing JSON file", error)
        );
      } else {
        console.error("Error: Employee cannot be created");
      }
    } else if (!userAuth.permissions.includes("isCreate")) {
      console.log("Employee is not authorized to create");
    }
  } catch (error) {
    console.error(error);
  }
};

// ? Update Employee
const updateEmployee = async (token, userModel, id, newUserObject) => {
  try {
    let departmentId = null;
    let departmentName = "";
    const { name, age, salary, phone, address } = newUserObject;

    const userAuth = await authMiddleware(token, userModel);
    if (!userAuth) {
    } else if (userAuth.permissions.includes("isUpdate")) {
      console.log("Authorized Employee");

      // check user
      const user = await userModel.user.filter((value) => {
        if (value.id === id) {
          departmentId = value.departmentId;
          return value;
        }
      });
      if (user.length) {
        // check user department
        const getDepartment = await userModel.dept.filter((value) => {
          if (value.id === departmentId) {
            departmentName = value.name;
            return value;
          }
        });

        // check if user is admin
        if (
          userAuth.departmentName === "admin" &&
          userAuth.permissions.includes("isUpdate")
        ) {
          const updateUser = await updateUserData(
            user,
            name,
            age,
            salary,
            phone,
            address
          );

          if (updateUser) {
            console.log("Employee Information updated successfully");
            await collectActivity(
              userModel,
              userAuth.name,
              "isUpdate",
              name,
              "update employee"
            );
            console.table(updateUser);

            //  writing userModel data in db.json
            fs.writeFile(
              "db.json",
              JSON.stringify(userModel),
              (error) =>
                error && console.error("Error in writing JSON file", error)
            );
          }
        } else if (
          // check if user is not admin
          userAuth.departmentName !== "admin" &&
          userAuth.permissions.includes("isUpdate")
        ) {
          // if user department is same to employee department
          if (
            userAuth.departmentName === departmentName &&
            userAuth.permissions.includes("isUpdate")
          ) {
            const updateUser = await updateUserData(
              user,
              name,
              age,
              salary,
              phone,
              address
            );

            if (updateUser) {
              console.log("Employee Information updated successfully");
              await collectActivity(
                userModel,
                userAuth.name,
                "isUpdate",
                name,
                "update employee"
              );
              console.table(updateUser);

              //  writing userModel data in db.json
              writeFileAction(userModel);
            }
          } else if (
            // check if user department is hr and employee department is dev to update
            userAuth.departmentName === "hr" &&
            departmentName === "dev"
          ) {
            const updateUser = await updateUserData(
              user,
              name,
              age,
              salary,
              phone,
              address
            );

            if (updateUser) {
              console.log("Employee Information updated successfully");
              await collectActivity(
                userModel,
                userAuth.name,
                "isUpdate",
                name,
                "update employee"
              );
              console.table(updateUser);

              //  writing userModel data in db.json
              writeFileAction(userModel);
            }
          } else if (
            // check if user is from dev department cannot change hr department employee info
            userAuth.departmentName === "dev" &&
            departmentName === "hr"
          ) {
            console.log("Unauthorized! Cannot update permissions");
          } else {
            console.log(
              "Unauthorized! Cannot have update permissions to update other department"
            );
          }
        }
      } else {
        console.error("Error: Department cannot be created");
      }
    } else if (!userAuth.permissions.includes("isUpdate")) {
      console.log("Employee is not authorized to update");
    }
  } catch (error) {
    console.error(error);
  }
};
// ? Create Department only Admin
const createNewDeparment = async (
  token,
  userModel,
  { departmentName, contactNo, permissions }
) => {
  try {
    let existDeptName = "";
    const userAuth = await authMiddleware(token, userModel);

    if (!userAuth) {
    } else if (
      // check if user is from admin department
      userAuth.permissions.includes("isCreate") &&
      userAuth.departmentName === "admin"
    ) {
      console.log("Authorized User");

      // Check for department if exist
      await userModel.dept.filter((value) => {
        if (value.name === departmentName.toLowerCase()) {
          existDeptName = value.name;
        }
      });

      // check that department is exist already or not
      if (existDeptName === departmentName.toLowerCase()) {
        console.log("Departments already exist");
      } else {
        const departmentObject = createDepartmentObject(
          userModel.dept.length + 1,
          departmentName.toLowerCase(),
          contactNo,
          permissions
        );
        const createDept = await userModel.dept.push(departmentObject);

        if (createDept) {
          await collectActivity(
            userModel,
            userAuth.name,
            "isCreate",
            departmentName.toLowerCase(),
            "create department"
          );
          console.table(departmentObject);

          //  writing userModel data in db.json
          fs.writeFile(
            "db.json",
            JSON.stringify(userModel),
            (error) =>
              error && console.error("Error in writing JSON file", error)
          );
        } else {
          console.error("Error: Department cannot be created");
        }
      }
    } else if (
      !userAuth.permissions.includes("isCreate") ||
      userAuth.departmentName !== "admin"
    ) {
      console.log("Unathorized, Only Admin Can create department");
    }
  } catch (error) {
    console.error(error);
  }
};

// ? Delete Department Only Admin
const deleteDepartment = async (token, userModel, id) => {
  try {
    const userAuth = await authMiddleware(token, userModel);
    if (!userAuth) {
    } else if (
      userAuth.permissions.includes("isDelete") &&
      userAuth.departmentName === "admin"
    ) {
      let departmentName = "";
      // * Delete Department
      const getDepartment = await userModel.dept.filter((value) => {
        if (value.id === id) {
          departmentName = value.name;
          userModel.dept.splice(userModel.dept.indexOf(value), 1);
        }
        return value;
      });
      if (getDepartment.length) {
        console.log("Department is deleted");
        await collectActivity(
          userModel,
          userAuth.name,
          "isDelete",
          departmentName.toLowerCase(),
          "delete department"
        );
        console.table(getDepartment);

        // ? writing userModel data in db.json
        fs.writeFile(
          "db.json",
          JSON.stringify(userModel),
          (error) => error && console.error("Error in writing JSON file", error)
        );
      } else {
        console.log("Deparment not found");
      }
    } else if (
      !userAuth.permissions.includes("isDelete") ||
      userAuth.departmentName !== "admin"
    ) {
      console.log("Unathorized, Only Admin can delete department");
    }
  } catch (error) {
    console.error(error);
  }
};

// ? Add User Permissions
const addEmployeePermissions = async (
  token,
  userModel,
  id,
  departmentName,
  permission
) => {
  try {
    let userDepartmentId = null;
    let departmentId = null;
    let departmentPermissions = [];
    const userAuth = await authMiddleware(token, userModel);
    if (!userAuth) {
    } else if (
      userAuth.departmentName === departmentName.toLowerCase() &&
      departmentName.toLowerCase() === "admin" &&
      userAuth.permissions.includes("isUpdate")
    ) {
      console.log("Authorized employee");
      const user = await userModel.user.filter((value) => {
        if (value.id === id) {
          userDepartmentId = value.departmentId;
          return value;
        }
      });
      if (user.length) {
        if (userDepartmentId === null) {
          const getDepartment = await userModel.dept.filter((value) => {
            if (value.name === departmentName.toLowerCase()) {
              departmentId = value.id;
              departmentPermissions = value.permissions;
              return value;
            }
          });
          if (getDepartment.length) {
            const verifyPermisison = permission.filter((value, index) => {
              if (!departmentPermissions.includes(value)) {
                return value;
              }
            });
            if (verifyPermisison.length) {
              console.log(
                "This permission is not belong to department",
                verifyPermisison
              );
            } else {
              const updateDate = new Date();
              let userName = "";
              user.map((value) => {
                value.departmentId = departmentId;
                value.permissions = permission;
                userName = value.name;
                value.updatedAt = updateDate.toLocaleString();
              });
              await collectActivity(
                userModel,
                userAuth.name,
                "isUpdate",
                userName,
                "add employee permissions"
              );
              console.log("Employeee permissions assigned successfully");
              console.table(user);

              // ? writing userModel data in db.json
              writeFileAction(userModel);
            }
          } else {
            console.log("Department not found");
          }
        } else {
          const getUserDepartment = await userModel.dept.filter((value) => {
            if (value.id === userDepartmentId) {
              return value;
            }
          });
          console.log(
            "Employeee have already assigned Department & Permission"
          );
          console.table(getUserDepartment);
        }
      }
    } else if (departmentName.toLowerCase() === "admin") {
      console.log("Only admin can assign admin department permissions");
    } else if (
      departmentName.toLowerCase() !== "admin" &&
      userAuth.permissions.includes("isUpdate")
    ) {
      console.log("Authorized Employee");
      const user = await userModel.user.filter((value) => {
        if (value.id === id) {
          userDepartmentId = value.departmentId;
          return value;
        }
      });
      if (user) {
        if (userDepartmentId === null) {
          const getDepartment = await userModel.dept.filter((value) => {
            if (value.name === departmentName.toLowerCase()) {
              departmentId = value.id;
              departmentPermissions = value.permissions;
              return value;
            }
          });
          if (getDepartment.length) {
            const verifyPermisison = permission.filter((value, index) => {
              if (!departmentPermissions.includes(value)) {
                return value;
              }
            });
            if (verifyPermisison.length) {
              console.log(
                "This permission is not belong to department",
                verifyPermisison
              );
            } else {
              const updateDate = new Date();
              let userName = "";
              user.map((value) => {
                value.departmentId = departmentId;
                value.permissions = permission;
                userName = value.name;
                value.updatedAt = updateDate.toLocaleString();
              });
              await collectActivity(
                userModel,
                userAuth.name,
                "isUpdate",
                userName,
                "add employee permissions"
              );
              console.log("Employeee permissions assigned successfully");
              console.table(user);

              // ? writing userModel data in db.json
              writeFileAction(userModel);
            }
          } else {
            console.log("Department not found");
          }
        } else {
          const getUserDepartment = await userModel.dept.filter((value) => {
            if (value.id === userDepartmentId) {
              return value;
            }
          });
          console.log(
            "Employeee have already assigned Department & Permission"
          );
          console.table(getUserDepartment);
        }
      } else {
        console.log("Employeee not found");
      }
    } else if (!userAuth.permissions.includes("isUpdate")) {
      console.log("Employee is not authorized to update");
    }
  } catch (error) {
    console.error(error);
  }
};

// ? Remove Employee Permissions
const removeEmployeePermissions = async (token, userModel, id, permission) => {
  try {
    let departmentId = null;
    let departmentName = "";
    const userAuth = await authMiddleware(token, userModel);
    if (!userAuth) {
    } else if (userAuth.permissions.includes("isUpdate")) {
      console.log("Authorized Employee");

      const user = await userModel.user.filter((value) => {
        if (value.id === id) {
          departmentId = value.departmentId;
          return value;
        }
      });
      if (departmentId) {
        const getDepartment = await userModel.dept.filter((value) => {
          if (value.id === departmentId) {
            departmentName = value.name;
            return value;
          }
        });
        if (
          userAuth.departmentName === "admin" &&
          userAuth.permissions.includes("isUpdate")
        ) {
          let userName = "";
          const updateDate = new Date();
          const removedPermissions = user.map((value) => {
            value.permissions = null;
            userName = value.name;
            // value.departmentId = null; //  Not sure about it
            value.updatedAt = updateDate.toLocaleString();
            return value;
          });
          await collectActivity(
            userModel,
            userAuth.name,
            "isUpdate",
            userName,
            "remove employee permissions"
          );
          if (removedPermissions) {
            console.log("Employeee permissions removed successfully");
            console.table(removedPermissions);

            // ? writing userModel data in db.json
            fs.writeFile(
              "db.json",
              JSON.stringify(userModel),
              (error) =>
                error && console.error("Error in writing JSON file", error)
            );
          }
        } else if (
          userAuth.departmentName !== "admin" &&
          userAuth.permissions.includes("isUpdate")
        ) {
          if (
            userAuth.departmentName === departmentName &&
            userAuth.permissions.includes("isUpdate")
          ) {
            let userName = "";
            const updateDate = new Date();
            const removedPermissions = user.map((value) => {
              value.permissions = null;
              userName = value.name;
              // value.departmentId = null; //  Not sure about it
              value.updatedAt = updateDate.toLocaleString();
              return value;
            });
            await collectActivity(
              userModel,
              userAuth.name,
              "isUpdate",
              userName,
              "remove employee permissions"
            );
            if (removedPermissions) {
              console.log("Employeee permissions removed successfully");
              console.table(removedPermissions);

              // ? writing userModel data in db.json
              writeFileAction(userModel);
            }
          } else if (
            userAuth.departmentName === "hr" &&
            departmentName === "dev"
          ) {
            let userName = "";
            const updateDate = new Date();
            const removedPermissions = user.map((value) => {
              value.permissions = null;
              userName = value.name;
              // value.departmentId = null; //  Not sure about it
              value.updatedAt = updateDate.toLocaleString();
              return value;
            });
            await collectActivity(
              userModel,
              userAuth.name,
              "isUpdate",
              userName,
              "remove employee permissions"
            );
            if (removedPermissions) {
              console.log("Employeee permissions removed successfully");
              console.table(removedPermissions);

              // ? writing userModel data in db.json
              writeFileAction(userModel);
            }
          } else if (
            userAuth.departmentName === "dev" &&
            departmentName === "hr"
          ) {
            console.log("Unauthorized! Cannot update permissions");
          } else {
            console.log("Unauthorized! Cannot update permissions");
          }
        }
      }
    } else if (!userAuth.permissions.includes("isUpdate")) {
      console.log("Unauthorized! Cannot update permissions");
    }
  } catch (error) {
    console.error(error);
  }
};

// ? Delete Employee
const deleteEmployee = async (token, userModel, id) => {
  try {
    let userDepartmentId = null;
    let userDepartmentName = "";
    const userAuth = await authMiddleware(token, userModel);
    if (!userAuth) {
    } else if (userAuth.permissions.includes("isDelete")) {
      console.log("Authorized User");
      const user = await userModel.user.filter((value) => {
        if (value.id === id) {
          userDepartmentId = value.departmentId;
          return value;
        }
      });
      if (user) {
        const getDepartment = await userModel.dept.filter((value) => {
          if (value.id === userDepartmentId) {
            userDepartmentName = value.name;
            return value;
          }
        });
        if (getDepartment) {
          if (
            userAuth.departmentName === userDepartmentName ||
            userAuth.departmentName === "admin"
          ) {
            let userName = "";
            const deleteUser = await userModel.user.filter((value) => {
              userName = value.name;
              if (value.id === id) {
                userModel.user.splice(userModel.user.indexOf(value), 1);
                return value;
              }
            });
            if (deleteUser) {
              await collectActivity(
                userModel,
                userAuth.name,
                "isDelete",
                userName,
                "delete employee"
              );

              console.log("Employee Deleted Successfully");
              writeFileAction(userModel);
            } else {
              console.log("Employeee not found");
            }
          } else if (userAuth.departmentName !== userDepartmentName) {
            console.log(
              "Unauthorized, Cannot delete user of different department"
            );
          }
        }
      }
    } else if (!userAuth.permissions.includes("isDelete")) {
      console.log("Employee is not authorized to delete");
    }
  } catch (error) {
    console.error(error);
  }
};

// ? Get Employee Details
const getEmployeeDetails = async (token, userModel, id) => {
  try {
    let userDepartmentId;
    let getDepartmentId = null;
    let departmentName = "";
    await userModel.user.filter((value) => {
      if (value.id === id) {
        getDepartmentId = value.departmentId;
      }
    });
    await userModel.dept.filter((value) => {
      if (value.id === getDepartmentId) {
        departmentName = value.name;
      }
    });
    const userAuth = await authMiddleware(token, userModel);
    if (!userAuth) {
    } else if (userAuth.departmentName === "admin") {
      console.log("Authorized User");
      console.table(userModel.user.filter((value) => value.id === id && value));
    } else if (userAuth.departmentName !== "admin") {
      if (userAuth.departmentName === departmentName) {
        console.table(
          userModel.user.filter((value) => value.id === id && value)
        );
      } else if (userAuth.departmentName === "hr" && departmentName === "dev") {
        console.table(
          userModel.user.filter((value) => value.id === id && value)
        );
      } else if (userAuth.departmentName === "dev" && departmentName === "hr") {
        console.log("Unauthorized! Cannot view employee detail");
      } else {
        console.log("Unauthorized! Cannot view employee details");
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// ? Get EmployeeList by department
const getEmployeeListByDepartment = async (
  token,
  userModel,
  departmentName
) => {
  try {
    const userAuth = await authMiddleware(token, userModel);
    let getDepartmentId = null;
    await userModel.dept.filter((value) => {
      if (value.name === departmentName.toLowerCase()) {
        getDepartmentId = value.id;
      }
    });
    if (!userAuth) {
    } else if (userAuth.departmentName === "admin") {
      console.log("Authorized User");
      console.table(
        userModel.user.filter(
          (value) => value.departmentId === getDepartmentId && value
        )
      );
    } else if (userAuth.departmentName !== "admin") {
      if (userAuth.departmentName === departmentName) {
        console.table(
          userModel.user.filter(
            (value) => value.departmentId === getDepartmentId && value
          )
        );
      } else if (userAuth.departmentName === "hr" && departmentName === "dev") {
        console.table(
          userModel.user.filter(
            (value) => value.departmentId === getDepartmentId && value
          )
        );
      } else if (userAuth.departmentName === "dev" && departmentName === "hr") {
        console.log("Unauthorized! Cannot view employee list");
      } else {
        console.log("Unauthorized! Cannot view another department list");
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// ? Collect activity log data (admin only)
const getActivityLogs = async (token, userModel) => {
  try {
    const userAuth = await authMiddleware(token, userModel);
    if (!userAuth) {
    } else if (userAuth.departmentName === "admin") {
      const list = await userModel.activityLogs.sort(
        (value1, value2) => value2.id - value1.id
      );
      console.table(list);
    } else if (userAuth.departmentName !== "admin") {
      console.log("Unauthorized! cannot view activity log");
    }
  } catch (error) {
    console.error(error);
  }
};

const collectActivity = async (
  userModel,
  actorName,
  actionMethod,
  employee,
  action
) => {
  try {
    let currentDate = new Date();
    const addActivity = await userModel.activityLogs.push({
      id: userModel.activityLogs.length + 1,
      message: `${actorName} has used ${actionMethod} method on ${employee} to ${action}`,
      date: currentDate.toLocaleString(),
    });
    return addActivity;
  } catch (error) {
    console.error(error);
  }
};

const updateUserData = async (user, name, age, salary, phone, address) => {
  if (typeof name !== "string" || !name.match(/^[A-Za-z\s]*$/g)) {
    console.log("Name must be an alphabet");
  } else if (typeof age !== "string" || !age.match(/^\d+$/g)) {
    console.log("Age must be an number");
  } else if (typeof salary !== "string" || !salary.match(/^\d+$/g)) {
    console.log("Salary must be a number");
  } else {
    const updateDate = new Date();
    const updatedInfo = user.map((value) => {
      value.name = name || value.name;
      value.age = age || value.age;
      value.salary = salary || value.salary;
      value.contactDetails.map((details) => {
        details.phone = phone || details.phone;
        details.address = address || details.address;
        return details;
      });
      value.updatedAt = updateDate.toLocaleString();
      return value;
    });
    return updatedInfo;
  }
};

const writeFileAction = async (userModel) => {
  fs.writeFile(
    "db.json",
    JSON.stringify(userModel),
    (error) => error && console.error("Error in writing JSON file", error)
  );
};
module.exports = {
  defaultAdmin,
  defaultDept,
  createEmployee,
  generateToken,
  createNewDeparment,
  getEmployeeDetails,
  addEmployeePermissions,
  updateEmployee,
  deleteDepartment,
  deleteEmployee,
  removeEmployeePermissions,
  getEmployeeListByDepartment,
  getActivityLogs,
};

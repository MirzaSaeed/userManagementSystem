const authMiddleware = async (token, userModel) => {
  try {
    let userDepartmentId;
    let userPermissions;
    let departmentName;
    let userName = "";
    const userExist = await userModel.user.filter((value) => {
      if (value.token === token) {
        userDepartmentId = value.departmentId;
        userPermissions = value.permissions;
        userName = value.name;
        return value;
      }
    });
    if (userExist.length) {
      const verfiyDepartment = await userModel.dept.filter((value, index) => {
        if (
          value.id === userDepartmentId &&
          value.permissions.includes(value) === userPermissions.includes(value)
        ) {
          departmentName = value.name;
          return value;
        }
      });
      if (verfiyDepartment.length) {
        return {
          permissions: userPermissions,
          departmentName: departmentName,
          name: userName,
        };
      } else {
        console.error(
          "Unauthorized, Employee deparment not found! So no permission granted"
        );
        return false;
      }
    } else {
      console.error("Unauthorized Employee");
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const generateToken = () => {
  try {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    const tokenLength = 12;
    let counter = 0;
    while (counter < tokenLength) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
      counter += 1;
    }
    return token;
  } catch (error) {
    console.errorr(error);
  }
};

module.exports = {
  authMiddleware,
  generateToken,
};

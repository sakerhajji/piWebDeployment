const yup = require("yup");



const validateUser = async (req, res, next) => {
  try {
    
const userSchema = yup.object().shape({
    firstname: yup.string().required("Firstname is required"),
    lastname: yup.string().required("Lastname is required"),
    age: yup.number().positive().integer().required("Age must be a positive integer"),
    birthdayDate: yup.date().required("Invalid date format for birthdayDate"),
    email: yup.string().email().required("Invalid email format"),
    password: yup.string().min(6).required("Password must be at least 6 characters long"),
    phoneNumber: yup.string().matches(/^\+?[0-9]{7,15}$/, "Invalid phone number format").required(),
    role: yup.string().required("Role is required"),
    gender: yup.string().oneOf(["male", "female"], "Gender must be either 'male' or 'female'").required(),
  });
  console.log(req.body);
    await userSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};

module.exports = validateUser;
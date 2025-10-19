import User from "../model/user.model.js";
import { email, z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokenAndSaveInCookies } from "../jwt/token.js";


const userSchema = z.object({
  name: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(12, { message: "Password must be at most 12 characters" }),
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validations = userSchema.safeParse({ name, email, password });

    if (!validations.success) {
      const errorMessage = validations.error.issues.map((err) => ({
        field: err.path[0], // kun field ma error
        message: err.message, // error message
      }));
      return res.status(400).json({ errors: errorMessage });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10)


    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

      if(newUser){
        const token =await generateTokenAndSaveInCookies( newUser.id,res )
        return res
      .status(200)
      .json({ message: "User registered successfully", newUser,token });
      }


    
  } catch (error) {
    return res.status(400).json({
      message: "Error on registration ----------",
      error: error.message,
    });
  }
};

//login


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ errors: "Invalid email or password" });
    }
    const token = await generateTokenAndSaveInCookies(user._id, res);
    res
      .status(200)
      .json({ message: "User logged in successfully", user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging user" });
  }
};

export const logout = (req, res) => {
  try {

    res.clearCookie("jwt",{
      path:"/"
    })
    res.status(200).json({message:"User Logout Successfully"});
    console.log("logout successfully");
  } catch (error) {
     console.log(error);
    res.status(500).json({ message: "Error on logout" });
  }
};

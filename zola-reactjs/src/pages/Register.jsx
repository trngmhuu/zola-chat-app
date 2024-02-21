import React, {useState, useEffect} from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";


import { loginRoute } from "../utils/APIRoutes";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase/Config';

function Register() {

    const [phone, setPhone] = useState("");
    const [user, setUser] = useState(null);
    const [otp, setOtp] = useState("");
    const [valid, setValid] = useState(true);
    const [otpVerified, setOtpVerified] = useState(false)

    const validatePhoneNumber = (phone) => {
        const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    
        return phoneNumberPattern.test(phone);
      };

       // nút gửi otp
     const sendOtp = async () => {
        try {
            const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
            const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha); // Add await here
            setUser(confirmation)
        } catch (err) {
            console.error(err);
        }
    }

     //xác nhận otp
     const verifyOtp = async () => {
        try {
            // Gọi hàm confirm từ đối tượng user với mã OTP
            const data = await user.confirm(otp);
    
            // Xử lý dữ liệu sau khi xác nhận OTP
            console.log("OTP confirmed successfully:", data);
    
            // Cập nhật trạng thái xác thực OTP thành công
            setOtpVerified(true);
    
            // Chuyển hướng đến trang ChatRoom sau khi xác thực OTP thành công
           // navigate("/");
         
        } catch (err) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình xác nhận OTP
            console.error("Lỗi xác thực OTP", err);
        }
    };

    const navigate = useNavigate();

    const [values, setValues] = useState({
        username: "",
        email: "",
        phoneNumber:"",
        password: "",
        confirmPassword: ""
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }

    useEffect(()=> {
        if (localStorage.getItem("chat-app-user")) 
        {navigate("/")}
    }, []);

    const handleSubmit = async (event)=> {
        event.preventDefault();
        if(handleValidation()) {
            console.log("In validation", registerRoute);
            const {password, email, phoneNumber, username} = values;
            const {data} = await axios.post(registerRoute, {
                username, 
                email, 
                phoneNumber,
                password
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem("chat-app-user", JSON.stringify(data.user));
                navigate("/");
            }
        }
    };

    const handleValidation = ()=> {
        const {password, confirmPassword, email, phoneNumber,  username} = values;

        if (username === "") {
            toast.error("Tên người dùng không được bỏ trống", toastOptions);
            return false;
        }
        
       
        else if(email === "") {
            toast.error("Email không được bỏ trống", toastOptions);
            return false;
        }
        else if(phoneNumber === "") {
            toast.error("Số điện thoại không được bỏ trống", toastOptions);
            return false;
        }
        else if (verifyOtp) {//chổ này cần sửa

            if (password !== confirmPassword) 
            {
            toast.error("Nhập lại mật khẩu không khớp.", toastOptions);
            return false;
            }

            else if (password.length < 6) {
                toast.error("Mật khẩu phải từ 6 ký tự trở lên", toastOptions);
                return false;
            } 
        }
        return true;
    }
    

    const handleChange = (event) => {
        
        setValues({
            ...values, [event.target.name]:event.target.value
        });    
    }

    const handlePhoneChange = (value) => {
        setPhone("+" + value);
        setValid(validatePhoneNumber("+" + value));
    };
    

    return (
        <>
            <FormContainer>
                <form onSubmit={(event)=>handleSubmit(event)}>
                    <div className="brand" style={{marginTop:'-30px'}}>
                        <img src={Logo} alt="Logo" />
                        <h1>Zola</h1>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Tên đăng nhập" 
                        name="username" 
                        onChange={(e) => handleChange(e)}
                        style={{ height: '25px'}}
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        name="email" 
                        onChange={(e) => handleChange(e)}
                        style={{ height: '25px', marginBottom:'-20px'}}
                    />

                    <div className="phonecontent" style={{ textAlign: 'center' }}>
                    <style>
                        {`
                            .react-tel-input .country-list .country .country-name {
                                color: black;
                            }
                        `}
                    </style>

                    <PhoneInput
                    name="phoneNumber" 
                    placeholder="Số điện thoại"
                    country={'us'}
                    value={phone}
                    onChange={(value, country, event, formattedValue) => {
                        handlePhoneChange(value);
                        handleChange({ target: { name: "phoneNumber", value: formattedValue }});
                    }}
                    
                    inputStyle={{
                        background: 'white',
                        color: 'black',
                        border: '1px solid white',
                        width: '100%'
                    }}
                />

                    {!valid && (
                        <p style={{ color: 'white' }}>Xin vui lòng nhập một số điện thoại hợp lệ.</p>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button onClick={sendOtp} 
                       style={{ backgroundColor: "blue", 
                               color: "white",
                               width: '100%' }}> Gửi OTP </button>

                    <div style={{ marginTop: '10px' }} id='recaptcha'></div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <input onChange={(e) => setOtp(e.target.value)} 
                        style={{ width: '50%',
                                marginTop: "10px" }} type="text" placeholder="Nhập OTP" />
                        <button onClick={verifyOtp} 
                        style={{ width: '50%',
                                 marginTop: "10px",
                                 height: '46px', 
                                 marginLeft: '7px', 
                                 backgroundColor: "green", 
                                 color: "white" }}> Xác minh OTP </button>
                    </div>
                </div>

                
            {otpVerified && (
                <>
                    <input 
                        type="password" 
                        placeholder="Mật khẩu" 
                        name="password" 
                        onChange={(e) => handleChange(e)}
                    />
                    <input 
                        type="password" 
                        placeholder="Nhập lại mật khẩu" 
                        name="confirmPassword" 
                        onChange={(e) => handleChange(e)}
                    />

                    <button type="submit"
                    style={{marginTop:'-28px'}}>Đăng ký</button>
                </>
            )}
                   
                    <span>
                       Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </span>
                </form>
            </FormContainer>
            <ToastContainer/>
        </>
    )
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 5rem;

        }
        h1 {
            color: white;
            text-transform: uppercase
        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            height: 45px;
            font-size: 1rem;
            $:focus {
                border: #0.1rem solid $997af0;
                outline: none;
            }
            margin-top: -20px;
        }
        button {
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.5s ease-in-out;
            &:hover {
                background-color: #4e0eff;
            }
            height: 60%;
            margin-top: -20px;
        }
        span {
            color: white;
            text-transform: uppercase;
            a {
                color: #4e0eff;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`;
export default Register;
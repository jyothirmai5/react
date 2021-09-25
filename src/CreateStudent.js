import React, { useEffect, useState } from "react";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import './App.css';
import { useHistory, useLocation } from "react-router-dom";

const CreateStudent = () => {
    const location = useLocation();
    const history = useHistory();

    const [name, setName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [mobile, setMobile] = useState('');
    const [isError, setIsError] = useState('');

    const [image, setImage] = useState('');
    const [checkboxValues, setCheckboxValues] = useState([]);
    const [address, setAddress] = useState('');
    const [male, setMale] = useState(false);
    const [female, setFemale] = useState(false);
    const [emptyFields, setEmptyFields] = useState(false);

    const [editMode, setEditMode] = useState(false);
    const [studentId, setStudentId] = useState(null);
    const [loading, setLoading] = useState(false);



    useEffect(() => {

    }, [])


    useEffect(() => {
        console.log(location.pathname);
        console.log(location.state.type);
        if (location.state.type === 'edit') {
            getUserDetailsById(location.state.id);
            setEditMode(true);
            setStudentId(location.state.id);
        }
        else {
            setEditMode(false);
            setStudentId(null);
        }
    }, [location]);

    const updateStudentDetails = (student) => {
        setName(student.name);
        setFatherName(student.fatherName);
        setDob(student.dob);
        setEmail(student.email);
        setMobile(student.mobile);
        setAddress(student.address);
        setCheckboxValues(student.checkboxValues);
        setGender(student.gender);
        setImage(student.image);
        if (student.gender === 'male') {
            setMale(true);
            setFemale(false);
        }
        else {
            setFemale(true);
            setMale(false);
        }
    }

    const getUserDetailsById = (id) => {
        fetch('http://localhost:8080/students/' + id, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => response.json()).then((student) => {
            console.log('student by id---', student);
            updateStudentDetails(student[0]);
        })
    }

    const onChange = (event) => {
        console.log('event', event.target.value);
        if (event.target.checked) {
            setCheckboxValues([...checkboxValues, event.target.value]);
        }
        else {
            setCheckboxValues(checkboxValues.filter(item => item !== event.target.name));
        }
    };

    const validateEmail = (email) => {
        console.log(new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email));
        setEmail(email);
        if (new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email)) {
            setEmailError('');
        }
        else {
            setEmailError('Please enter valid email');
        }
    }

    const validateFields = () => {
        console.log(name.length);
        if ((name.length === 0) || (fatherName.length === 0) || (mobile.length === 0) || (email.length === 0)
            || (gender.length === 0) || (dob.length === 0) || (image.length === 0) || (checkboxValues.length === 0) || (address.length === 0)) {
            console.log('fill all fileds');
            setEmptyFields(true);
            return false;
        }
        else {
            console.log('suuccess');
            setEmptyFields(false);
            return true;
        }
    }

    const createStudent = () => {
        setLoading(true);
        fetch('http://localhost:8080/students', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                fatherName,
                mobile,
                email,
                address,
                image,
                dob,
                checkboxValues,
                gender
            })
        }).then((response) => response.json()).then(jsonObj => {
            console.log('response after inserting', jsonObj);
            history.push('students');
            setLoading(false);
        })
            .catch(err => {
                console.log('error while inserting', err);
                setLoading(false);
            })
    }

    const editStudent = (id) => {
        setLoading(true);
        console.log('id----', id);
        id && fetch('http://localhost:8080/students/' + id, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                fatherName,
                mobile,
                email,
                address,
                image,
                dob,
                checkboxValues,
                gender
            })
        }).then((response) => response.json()).then(jsonObj => {
            console.log('response after updating', jsonObj);
            history.push('students');
            setLoading(false);
        })
            .catch(err => {
                console.log('error while updating', err);
                setLoading(false);
            })
    }

    const submitForm = () => {
        console.log('submit clicked');
        let result = validateFields();
        if (result) {
            if (editMode) {
                editStudent(studentId);
            } else {
                createStudent();
            }
        }
    };

    return (
        <div className="App">
            <h1>Registration Form</h1>
            <br />
            {emptyFields && <p style={{ color: 'red' }}>Please fill all fields*</p>}
            <form>
                <div>
                    <h2>Name</h2>
                    <input required value={name} onChange={(event) => setName(event.target.value)}></input></div>
                <div>
                    <h2>Father Name</h2>
                    <input required value={fatherName} onChange={(event) => setFatherName(event.target.value)}></input></div>
                <br />
                <TextField
                    type="tel"
                    error={isError}
                    value={mobile}
                    required
                    label="Enter Phone Number"
                    onChange={(e) => {
                        if (e.target.value.length > 10) {
                            setIsError(true);
                        }
                        else {
                            setMobile(e.target.value);
                        }
                    }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            +91
                        </InputAdornment>,
                    }}
                />
                <div>
                    <h2>Email</h2>
                    <input required type='email' value={email} onChange={(event) => validateEmail(event.target.value)}></input>
                    <p style={{ color: 'red' }}>{emailError}</p>
                </div>
                <div>
                    <h2>Gender</h2>
                    <input type="radio" id="male" name="male" value='male' checked={male} onChange={(event) => {
                        setGender(event.target.value);
                        console.log('checked', event.target.checked);
                        setMale(true);
                        setFemale(false);
                    }} />
                    <label for="male">Male</label><br />
                    <input type="radio" id="female" name="age" value="female" checked={female} onChange={(event) => {
                        setGender(event.target.value);
                        console.log('checked', event.target.checked);
                        setMale(false);
                        setFemale(true);
                    }
                    } />
                    <label for="female">Female</label><br />
                </div>
                <div>
                    <h2>DOB</h2>
                    <input required type='date' value={dob} onChange={(event) => setDob(event.target.value)}></input></div>
                <div>
                    <h2 for="img">Select image:</h2>
                    <input required type="file" id="img" name="img" accept="image/*" onChange={(event) => setImage(event.target.files[0].name)}></input></div>
                <h2>Extra curricular participation</h2>
                <input type="checkbox" id="1" name="studentCouncil" value="studentCouncil" checked={checkboxValues.includes("studentCouncil")} onChange={(event) => onChange(event)} />
                <label for="1"> Student Council</label><br />
                <input type="checkbox" id="2" name="classRepresentative" value="classRepresentative" checked={checkboxValues.includes("classRepresentative")} onChange={(event) => onChange(event)} />
                <label for="2"> Class Representative</label><br />
                <input type="checkbox" id="3" name="club" value="club" checked={checkboxValues.includes("club")} onChange={(event) => onChange(event)} />
                <label for="3"> Club/Organization</label><br /><br />
                <div>
                    <h2>Address</h2>
                    <input required type='text' value={address} onChange={(event) => setAddress(event.target.value)}></input></div>
            </form>
            <br />
            {!loading ? <Button variant="contained" style={{ background: 'blue', color: 'white' }} onClick={() => submitForm()}>SUBMIT</Button> :
                <CircularProgress />}
            <br />
            <br />
            <br />
        </div>
    )
}

export default CreateStudent;
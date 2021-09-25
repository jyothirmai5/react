import App from "./App";
import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ExportReactCSV } from './ExportCsvFile';

const Students = () => {
    let history = useHistory();
    const [open, setOpen] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [students, setStudents] = useState(undefined);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchValue, setSearchValue] = React.useState('');


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        getStudents();
    }, [])

    const getStudents = () => {
        fetch('http://localhost:8080/students', {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => response.json()).then((studentsList) => {
            console.log('studentsList---', studentsList);
            setStudents(studentsList);
        })
    }

    const navigateToCreateStudent = () => {
        history.push({
            pathname: 'student',
            state: { type: "create" }
        })
    }

    const navigateToEditStudent = (id) => {
        console.log('edit clicked', id);
        history.push({
            pathname: 'student',
            state: { type: "edit", id }
        })
    }

    const deleteStudent = (id) => {
        console.log('id----', id);
        id && fetch('http://localhost:8080/students/' + id, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => response.json()).then(jsonObj => {
            console.log('response after deleteing', jsonObj);
            getStudents();
            handleClose();
        })
            .catch(err => {
                console.log('error while deleting', err);
            })
    }

    const handleClickOpen = (id) => {
        setStudentId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="App">
            <h1>Student Details</h1>
            <Button variant="contained" onClick={() => navigateToCreateStudent()}>Create Student</Button>
            <br />
            <br />
            {students && <ExportReactCSV csvData={students} fileName={"students.csv"} />}
            <br />
            <br />
            <input name='search' value={searchValue} onChange={(event) => setSearchValue(event.target.value)}></input>
            {students &&
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Father Name</TableCell>
                                <TableCell align="right">Email</TableCell>
                                <TableCell align="right">Gender</TableCell>
                                <TableCell align="right">Phone</TableCell>
                                <TableCell align="right">Date</TableCell>
                                <TableCell align="right">Address</TableCell>
                                <TableCell align="right">Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((row, index) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row"
                                        onClick={() => navigateToEditStudent(row._id)}
                                    >
                                        {index + 1}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigateToEditStudent(row._id)}
                                        align="right">{row.name}</TableCell>
                                    <TableCell
                                        onClick={() => navigateToEditStudent(row._id)}
                                        align="right">{row.fatherName}</TableCell>
                                    <TableCell align="right"
                                        onClick={() => navigateToEditStudent(row._id)}
                                    >{row.email}</TableCell>
                                    <TableCell
                                        onClick={() => navigateToEditStudent(row._id)}
                                        align="right">{row.gender}</TableCell>
                                    <TableCell align="right"
                                        onClick={() => navigateToEditStudent(row._id)}
                                    >{row.mobile}</TableCell>
                                    <TableCell align="right"
                                        onClick={() => navigateToEditStudent(row._id)}
                                    >{row.dob}</TableCell>
                                    <TableCell
                                        onClick={() => navigateToEditStudent(row._id)}
                                        align="right">{row.address}</TableCell>
                                    <TableCell align="right">
                                        <Button onClick={() => handleClickOpen(row._id)}>DELETE</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            {students &&
                <TablePagination
                    component="div"
                    count={students.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"DELETE?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure want to delete this student?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={() => deleteStudent(studentId)} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Students;
import React from 'react'
import { CSVLink } from 'react-csv'
import Button from '@mui/material/Button';


export const ExportReactCSV = ({ csvData, fileName }) => {
    return (
        <Button variant="primary">
            <CSVLink data={csvData} filename={fileName}>Export</CSVLink>
        </Button>
    )
}
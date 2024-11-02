import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faFilePdf, faFileCsv, faCopy } from '@fortawesome/free-solid-svg-icons';

export const ExportExcelData = ({ onExportExcel, isDisabled }) => (
  <Button onClick={e => onExportExcel(e.target.value)} className='btn-export btn-sm mx-1' disabled={isDisabled}>
    <FontAwesomeIcon icon={faFileExcel} /> EXCEL
  </Button>
);

export const ExportPdfData = ({ onExportPdf, isDisabled }) => (
  <Button onClick={e => onExportPdf(e.target.value)} className='btn-export btn-sm mx-1' disabled={isDisabled}>
    <FontAwesomeIcon icon={faFilePdf} /> PDF
  </Button>
);

export const ExportCsvData = ({ onExportCsv, isDisabled }) => (
  <Button onClick={e => onExportCsv(e.target.value)} className='btn-export btn-sm mx-1' disabled={isDisabled}>
    <FontAwesomeIcon icon={faFileCsv} /> CSV
  </Button>
);

export const ExportCopyData = ({ onExportCopy, isDisabled }) => (
  <Button onClick={e => onExportCopy(e.target.value)} className='btn-export btn-sm mx-1' disabled={isDisabled}>
    <FontAwesomeIcon icon={faCopy} /> COPY
  </Button>
);

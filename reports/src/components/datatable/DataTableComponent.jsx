import React, { useState, useMemo, useEffect } from 'react';
import DataTable, { defaultThemes } from 'react-data-table-component';
import FilterComponent from '../../components/datatable/FilterComponent';
import { ExportCopyData, ExportCsvData, ExportExcelData, ExportPdfData } from '../../components/datatable/ExportData';
import { downloadCSV, downloadCopy, downloadExcel, downloadPdf } from '../../components/utils/ExportUtils';
import { Col, Row, Spinner, Table } from 'react-bootstrap';

const DataTableComponent = (props) => {
  const [pending, setPending] = useState(true);

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: '- ALL -',
  };

  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
      },
    },
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: defaultThemes.default.divider.default,
        backgroundColor: 'blue',
        color: 'white',
      },
    },
    headCells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
  };

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const filteredItems = filterText
    ? props.data.filter((item) => {
        for (let x of Object.values(item)) {
          if (String(x).toLowerCase().includes(filterText.toLowerCase())) {
            return item;
          }
        }
      })
    : props.data;

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };
    return <FilterComponent onFilter={(e) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />;
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [props.data]);

  const actionsMemo = useMemo(() => {
    let isDisabled = props.data.length > 0 ? false : true;
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };
    return (
      <>
        <Row className="mb-2">
          <Col md={3} className="my-2"></Col>
          <Col md={6} className="d-flex justify-content-center my-2">
            {/* <ExportExcelData onExportExcel={() => downloadExcel(props.columns, props.data, props.fileName)} isDisabled={isDisabled} /> */}
            <ExportPdfData onExportPdf={() => downloadPdf(props.columns, props.data, props.fileName)} isDisabled={isDisabled} />
            {/* <ExportCsvData onExportCsv={() => downloadCSV(props.columns, props.data, props.fileName)} isDisabled={isDisabled} /> */}
            <ExportCopyData onExportCopy={() => downloadCopy(props.columns, props.data, props.fileName)} isDisabled={isDisabled} />
          </Col>
          <Col md={3} className="my-2">
            <FilterComponent onFilter={(e) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} isDisabled={isDisabled} />
          </Col>
        </Row>
      </>
    );
  }, [filterText, resetPaginationToggle, props.data]);

  const EmptyTable = (props) => {
    let showLoader = props.displayMsgType && props.displayMsgType === 'LOADER';
    let showNoData = props.displayMsgType && props.displayMsgType === 'NO_DATA';
    return (
      <>
        <Table bordered size="sm" responsive className="emptyTable">
          <thead>
            <tr>
              {props.columns.map((obj, index) => (
                <th key={index + 1}>{obj.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={props.colSpan} className="text-center">
                {showLoader && (
                  <>
                    {' '}
                    <Spinner animation="border" size="sm" /> Loading . . .{' '}
                  </>
                )}
                {showNoData && <span>No Data found to display</span>}
              </td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <>
      {/* To display Table Export, search options */}
      {actionsMemo}

      {filteredItems.length > 0 ? (
        <DataTable
          columns={props.columns}
          data={filteredItems}
          striped
          highlightOnHover
          pagination
          defaultSortFieldId={1}
          paginationComponentOptions={paginationComponentOptions}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          fixedHeader={true}
          fixedHeaderScrollHeight="500px"
          noHeader={true}
          progressPending={pending}
          progressComponent={<EmptyTable displayMsgType={'LOADER'} colSpan={props.columns.length} columns={props.columns} />}
          dense
        />
      ) : (
        <EmptyTable displayMsgType={'NO_DATA'} colSpan={props.columns.length} columns={props.columns} />
      )}
    </>
  );
};

export default DataTableComponent;

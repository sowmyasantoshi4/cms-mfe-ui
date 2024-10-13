import writeXlsxFile from 'write-excel-file'
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr			
const convertArrayOfObjectsToCSV = (array) => {			
	let result;		
			
	const columnDelimiter = ',';		
	const lineDelimiter = '\n';		
	const keys = Object.keys(array[0]);		
			
	result = '';		
	result += keys.join(columnDelimiter);		
	result += lineDelimiter;		
			
	array.forEach(item => {		
		let ctr = 0;	
		keys.forEach(key => {	
			if (ctr > 0) result += columnDelimiter;
			
			result += item[key];
			
			ctr++;
		});	
		result += lineDelimiter;	
	});		
			
	return result;		
			
}
// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr			
export const downloadCSVOld = (array, fileName) => {			
	const link = document.createElement('a');
	console.log(array,fileName)		
	let csv = convertArrayOfObjectsToCSV(array);		
	if (csv == null) return;		
			
	const filename = fileName+'.csv';		
			
	if (!csv.match(/^data:text\/csv/i)) {		
		csv = `data:text/csv;charset=utf-8,${csv}`;	
	}		
			
	link.setAttribute('href', encodeURI(csv));		
	link.setAttribute('download', filename);		
	link.click();		
}


/*
Ref : 
https://codesandbox.io/s/wnk5i
 */
export const downloadCopy = (_tableColumns, _tableData, fileName) => {
    if (!navigator.clipboard) {
        return;
    }
    const keys = [];
    const hRow = {};
    const bodyData = [];
    _tableColumns.map( x => {
        if ( !x.isColumnHidden ){
            keys.push(x.key)
            //headerData.push(x.name)
            hRow[x.key] = x.name
        }
    } )
    //bodyData.push(hRow)

    
    _tableData.map((item) => {
        let tRow = {}
        Object.entries(keys).map(([index,key]) => {
            tRow[key] = item[key]
        } )
        bodyData.push(tRow)
    } )
    //console.log(bodyData)
    const text = getTableText(bodyData, "\t");
    // The following line doesn't work in CodeSandbox
    navigator.clipboard.writeText(text).then(() => {
       // console.log("Copied to clipboard");
    });
    
}

    const getTableText = (data, divider) => {
        const columns = Object.keys(data[0]);
        const th = `${columns.join(divider)}`;
        const td = data.map((item) => Object.values(item).join(`"${divider}"`))
                        .join('"\n"');
        return `${th}\n"${td}"`;
    };

/* 
Ref : 
https://gitlab.com/catamphetamine/write-excel-file#readme
https://www.npmjs.com/package/write-excel-file
*/
export const downloadExcel = (_tableColumns, _tableData, _fileName) => {
    const schema = [];
    console.log("td=",_tableData)
    _tableColumns.map( (row) =>  {
      console.log("row",row)
        if( !row.isColumnHidden ){
          let _type = row.type;
          let finalType = null;
          let schObj = null;
          switch (_type) {
            case "Number":
              finalType = Number;
              break;
            case "String":
              finalType = String;
              break;
            case "Date":
              finalType = Date;
              break;
            default:
              finalType = String;
          }
          schObj = {column: row.name, type: finalType, value: row.selector };
          
          if( _type ==="Date" )
            schObj['format'] = 'mm/dd/yyyy';
          
          schema.push (schObj);
        }
    } )
    console.log("schema",JSON.stringify(schema))
    
    writeXlsxFile (_tableData, {
        schema,
        fileName: _fileName
    })
}

export const downloadCSV = (_tableColumns, _tableData, _fileName) => {
    const keys = [], _headers = [];
    _tableColumns.map( x => {
        if ( !x.isColumnHidden ){
            keys.push(x.key)
            _headers.push(x.name)
        }
    } )

    const bodyData = [];
    _tableData.map((item) => {
        let tRow = {}
        Object.entries(keys).map(([index,key]) => {
            tRow[key] = item[key]
        } )
        bodyData.push(tRow)
    } )

    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: _headers,
        filename: _fileName
      };

    const csvExporter = new ExportToCsv(csvOptions);

    csvExporter.generateCsv(bodyData);
  
}

/* 
Ref : 
https://github.com/simonbengtsson/jsPDF-AutoTable 
https://www.npmjs.com/package/jspdf-autotable
*/
export const downloadPdf = (_tableColumns, _tableData, _fileName) => {
    const doc = new jsPDF('l',undefined,'a4')
    //jsPDF(orientation, unit, format)

    // It can parse html:
    // <table id="my-table"><!-- ... --></table>
    // autoTable(doc, { html: '#my-table' })

    const keys = [], _headers = [];
    _tableColumns.map( x => {
        if ( !x.isColumnHidden ){
            keys.push(x.key)
            _headers.push(x.name)
        }
    } )

    const bodyData = [];
    _tableData.map((item) => {
        let tRow = []
        Object.entries(keys).map(([index,key]) => {
          let _val = item[key]
          // console.log("key=",key)
            tRow.push(_val)
        } )
        bodyData.push(tRow)
    } )


    // Or use javascript directly:
    autoTable(doc, {
    // theme: 'grid',
    head: [_headers],
    body: bodyData,
    })

    doc.save(_fileName+'.pdf')
}

/* Sample test */
const testSch = () => {
    const objects = [
      {
        name: 'John Smith',
        dateOfBirth: new Date(),
        cost: 1800,
        paid: true
      },
      {
        name: 'Alice Brown',
        dateOfBirth: new Date(),
        cost: 2600,
        paid: false
      },
      {
        name: 'John Smith',
        dateOfBirth: new Date(),
        cost: 1800,
        paid: true
      },
      {
        name: 'Alice Brown',
        dateOfBirth: new Date(),
        cost: 2600,
        paid: false
      }
    ]
  
    const schema = [
      {
        column: 'Name',
        type:String,
        value: student => student.name
      },
      {
        column: 'Date of Birth',
        type: Date,
        format: 'mm/dd/yyyy',
        value: student => student.dateOfBirth
      },
      {
        column: 'Cost',
        type: Number,
        format: '#,##0.00',
        value: student => student.cost
      },
      {
        column: 'Paid',
        type: Boolean,
        value: student => student.paid
      }
    ]
 // console.log("schema",schema);
    writeXlsxFile(objects, {
      schema,
      fileName: 'file.xlsx'
    })
      
    
  }
  
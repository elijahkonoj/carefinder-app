import Papa from "papaparse"

export function exportHospitals(hospitals:any[],search:string,columns:string[]){
  const exportData = hospitals.map((hospital) => {
    const row: any = {};
    columns.forEach((column) => {
      row[column] = hospital[column]
    })
    return row
  })
    const csv = Papa.unparse(exportData)
      const blob = new Blob([csv],
        {type:"text/csv"})

      const url= window.URL.createObjectURL(blob)

      const link= document.createElement("a")

      const today= new Date().toISOString().split("T")[0]

      link.href=url

      link.download= `hospitals-${search || "all"}-${today}.csv`

      link.click()

}
// Cargar las librerías
const { log } = require("console"); // Para mensajes por consola (terminal)
const fs = require("fs"); // Para lecturas/escrituras de archivos
const path = require("path"); // Para acceso a directorios
const XLSX = require("xlsx"); // Para manejo de archivos Excel (XLS, XLSX)
const createCsvWriter = require('csv-writer').createObjectCsvWriter; // Para generar archivo CSV

// Definir archivo de origen
const xlsx = path.resolve("src/SITIOS_ARQUEOLOGICOS.xls"); // Obtiene la ruta absoluta al archivo

// Definir filtros
const REGIÓN = "ANTOFAGASTA";

// Leer los datos del archivo origen
var buf = fs.readFileSync(xlsx); // Leer archivo
var wb = XLSX.read(buf, { type: 'buffer' }); // Interpreta el formato Excel desde la lectura
var hoja = wb.Sheets["SITIOS_ARQUEOLOGICOS_MOP_WGS84"]; // Accede a una hoja por su nombre, "Hoja1" por defecto al existir solo una
var hoja_arqjson = XLSX.utils.sheet_to_json(hoja); // Convierte la hoja a formato JSON

// Muestra por consola el contenido de la primera fila
log("Encabezados en Hoja", hoja_arqjson[0]);

// Preparar variable donde se mantendrá la transformación, en formato JSON
var output_data = [] // Objeto Arreglo "vacío", es decir sin datos

// Ciclo para recorrer todas las filas de la hoja
for (let idx = 0; idx < hoja_arqjson.length; idx++) {
  /*
  obs: al recorrer cada fila, está se referencia por la variable "idx"

  Extraer datos de acuerdo a filtros:
    - REGION
  */
  let region_hoja = hoja_arqjson[idx].REGIÓN; // Obtiene el valor de la columna REGION

  // Validar condición que la fila leida coincida con los filtros requeridos.
  // Ya que la variable COMMUNES es un arreglo, se una un método para validar.
  if (region_hoja == REGIÓN.indexOf(region_hoja) > -1) {

    // log("Datos en Hoja para [" + REGION + "]", hoja_json[idx]);

    // Obtener el registro desde la variable donde se mantendrá la transformación
    let data_region = output_data[region_hoja]; //output_data[comuna_hoja];
    
    if (data_region)
    data_region = {};
    data_region['REGIÓN'] = hoja_arqjson[idx]['REGIÓN'];
    data_comuna['DATA'] = {};
    data_comuna['DATA']['COMUNA'] = hoja_arqjson[idx]['COMUNA'];
    data_comuna['DATA']['NOMBRE'] = hoja_arqjson[idx]['NOMBRE'];
    data_comuna['DATA']['TIPO'] = hoja_arqjson[idx]['TIPO'];
    data_comuna['DATA']['RIESGO'] = hoja_arqjson[idx]['RIESGO'];
    data_comuna['DATA']['LAT'] = hoja_arqjson[idx]['LAT'];
    data_comuna['DATA']['LON'] = hoja_arqjson[idx]['LONG'];

    // Se almacena en la variable la información procesada
    output_data[region_hoja] = data_region;
  }
}

// Muestra por consola el contenido de información procesada
log("Data de Salida", output_data);

/*
Generar archivo JSON
*/
// Definir archivo de salida (JSON)
const json_file = path.resolve("html/js/arq-region.json");
// Guardar en JSON los datos transformados 
fs.writeFileSync(json_file, JSON.stringify(output_data));

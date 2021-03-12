// 
// Webapp
// Ejemplo Consulta de datos desde Hoja de Cálculo como Base de datos

// Acceso al Libro
var bookID = '__ID_SPREADSHEET__';
var sheetName = 'db';

// DoGet
function doGet( e ) {
  
  var act = e.parameter.o;
  // Despliegue de la forma  
  if ( ( act == null ) && ( act == undefined ) ) {
    var out = HtmlService.createHtmlOutputFromFile( 'form.html' ).getContent();
    out = out.replace( '##RESULT', '' );
  };
  // despliegue HTML  
  return HtmlService.createHtmlOutput( out )
                    .setSandboxMode( HtmlService.SandboxMode.IFRAME )
                    .setXFrameOptionsMode( HtmlService.XFrameOptionsMode.ALLOWALL )
                    .setTitle( 'Consulta Jugadores' );

};

/**
 * Busca en la hoja de calculos los datos del usuario
 * @param userId ID del usuario a buscar
 */
function searchData( userId ) {
  // Obtiene la hoja de calculos
  var sheet = SpreadsheetApp.openById( bookID ).getSheetByName( sheetName );
  // Recorre todas las filas buscando la coincidencia del userID con el valor de la columna 0
  var rowsResult = sheet.getRange( 2, 1, sheet.getLastRow(), sheet.getLastColumn() )
                        .getValues()
                        .filter(function ( row ) { return row[ 0 ] == userId; } );  
  var result = '';  
  var tpl_row = HtmlService.createHtmlOutputFromFile( 'row.html' ).getContent();
  
  for (var index=0; index<rowsResult.length; index++) {
    // Obtiene el resultado
    var row = rowsResult[ index ];
    // Genera un objeto con los datos de cada registro
    var user = {
      id: row[ 0 ],
      numero: row[ 1 ],
      jugador: row[ 2 ],
      email: row[ 3 ],
      equipo: row[ 4 ] };  

    // Serializa el OBJ para enviar la respuesta al frontend
    //var parcial = JSON.stringify( user );
    var linea = tpl_row;
    linea = linea.replace( '##ID##', user.id );
    linea = linea.replace( '##NUMERO##', user.numero );
    linea = linea.replace( '##JUGADOR##', user.jugador );
    linea = linea.replace( '##EMAIL##', user.email );
    linea = linea.replace( '##EQUIPO##', user.equipo );
    result += linea;
  };//for
  
  var tpl_row = HtmlService.createHtmlOutputFromFile( 'result.html' ).getContent();
  tpl_row = tpl_row.replace( '##LIST##', result ); 
  return tpl_row;
};

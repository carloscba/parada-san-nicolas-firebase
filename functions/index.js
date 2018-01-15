const functions = require('firebase-functions');
const axios = require('axios')
const cheerio = require('cheerio')

exports.fromSNtoCBA = functions.https.onRequest((req, res) => {
  
  const url = 'http://mibondiya.cba.gov.ar/Datos.aspx?pCodigoEmpresa=401&pCodigoLinea=0&pCodigoOrigen=124&pCodigoDestino=1&pServicio=SAN%20NICOLAS%20A%20CORDOBA%20CAPITAL&pCodigoParada=&pProveedor=yv'
  
  axios.get(url).then( (response) => {
    const $ = cheerio.load(response.data);
    const items = $('#itemContainer > li')
    let moviles = []

    items.children().each( (index, element) => {
        
        const salida = $(element).find('.salida')
        const llegada =  $(element).find('.llegada').text()

        const datos = salida.find('label')
        
        const data = {
            arrive : datos.eq(0).text().replace(/\s+/g, ' ').trim(),
            departure :  datos.eq(1).text().replace(/\s+/g, ' ').trim(),
            destiny : datos.eq(2).text().replace(/\s+/g, ' ').trim(),
            delay : datos.eq(3).text().replace(/\s+/g, ' ').trim()
        }

        if(datos.eq(0).text() != ''){
            moviles.push(data)
        }
    })
    res.send(moviles)
  })
});

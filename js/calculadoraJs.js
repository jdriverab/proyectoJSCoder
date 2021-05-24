let informacionPrestamo = {}
let infoHistorica = []
let valoresUF = []
let tipoMonedaElegida = ""

class CalculadoraPrestamos{
  constructor(valoresIngresados){
    this.monto = Number(valoresIngresados[0].value);
    this.interes = Number(valoresIngresados[1].value);
    this.meses = Number(valoresIngresados[2].value);
    this.montoAPagarUnMes = 0;
    this.montoAPagarTotal = 0;
    this.camposDeValores = valoresIngresados;
    this.montoAPagarUF =[]
  }

  /**
 * Este metodo modifica el DOM; metodo principal con secuencia de ejecucion para objeto calculadora (limpia campos ingresados, valida los que tienen numero, si cumple borra los valores del calculo anterior y ejecuta un nuevo calculo, sino notifica que debe corregir campo.
 * @param {number} this.monto
 * @param {number} this.interes
 * @param {number} this.meses
 */
  validaCamposYEjecutaCalculadora(){
    let validador = true

    limpiaDOM($("#pagoMensual"))
    limpiaDOM($("#pagoTotal"))

    for(let i = 0; i < this.camposDeValores.length; i++){
        if(this.camposDeValores[i].value == "" || this.camposDeValores[i].value == NaN){

          animacionesDOM($("#mensajeDatos"),'','Debe ingresar datos en todos los campos')

            // $("#mensajeDatos").html('Debe ingresar datos en todos los campos')

            // $("#mensajeDatos").fadeIn(1400)

          this.camposDeValores[i].focus()
          validador = false
          break

        }if(this.camposDeValores[i].value == 0){

          animacionesDOM($("#mensajeDatos"),'','El valor ingresado debe ser mayor a 0')

          // $("#mensajeDatos").html(`El valor ingresado debe ser mayor a 0`)

          // $("#mensajeDatos").fadeIn(1400)
          this.camposDeValores[i].focus()
          validador = false
          break
        }
    }

    if(validador){
      $("#mensajeDatos").fadeOut(1400)
      this.calculaResultadoPrestamo()
      this.imprimeResultado()
      this.guardadoSessionStorage()
    }
  }

  /**
   * Metodo recibe datos ingresados y regresa el valor a pagar del prestamo por mes y por el total en CLP
   * @param {number} this.monto
   * @param {number} this.interes
   * @param {number} this.meses
   * @return {number} this.montoAPagarUnMes (entrega resultado en CLP)
   * @return {number} this.montoAPagarTotal (entrega resultado en CLP)
   */
    calculaResultadoPrestamo(){
    this.montoAPagarTotal = Math.ceil((this.monto * (this.interes/1200) * this.meses) + this.monto)
    this.montoAPagarUnMes = Math.ceil(this.montoAPagarTotal/this.meses)
    this.montoAPagarUF = [Math.ceil(this.montoAPagarUnMes/valoresUF),Math.ceil(this.montoAPagarTotal/valoresUF)]
  }  

  /**
   * Metodo interactua con DOM para mostrar resultado y agregar boton de contacto, (recibe los datos calculados del prestamo, imprime en html los resultados y agrega un nuevo boton al layout de la calculadora)
   * @param {number} this.monto
   * @param {number} this.interes
   * @param {number} this.meses
   */
  imprimeResultado(){

    limpiaDOM($("#mensajeDatos"))

    $("#divBotonCalculadora").html(`<div class="divBotonCalculadora">
    <button type="button" class="btn btn-primary btn-block botonCalculadora" onclick="ejecutaCalculadora()" id="botonCalculadora">Re-calcular</button>
    <button type="button" class="btn btn-info btn-block botonCalculadora" onclick="location.href='#contact-section'"style="margin-top:0px">Pide tu credito ya!</button>
    </div>`)

    conversionAMonedaEImprime()
  }

  /**
   * Metodo almacena los datos del objeto creado en el local y sesion storage
   * @param {number} this.montoAPagarUnMes
   * @param {number} this.montoAPagarTotal
   */
    guardadoSessionStorage(){
    let informacionUltimoPrestamo = [this.montoAPagarUnMes, this.montoAPagarTotal,this.montoAPagarUF[0],this.montoAPagarUF[1]]
    sessionStorage.setItem("ultimoPrestamo",JSON.stringify(informacionUltimoPrestamo))
  }

}
  
/** 
* ¡¡¡FUNCION INICIAL DE CALCULADORA!!! ¡¡Contiene secuencia de ejecucion de toda la calculadora (a excepcion de actualizaciones DOM)!! -> captura los valores del formulario con evento onClick, los ingresa en array y crea el objeto; luego ejecuta los el metodo principal del objeto y sube los resultados al storage
*@param {number} monto
*@param {number} interes
*@param {number} meses
*@event 
*/
function ejecutaCalculadora(){
  campoMonto = document.getElementById("monto")
  campoInteres = document.getElementById("tasa")
  campoMeses = document.getElementById("meses")

  ultimoCalculoLocal = JSON.parse(sessionStorage.getItem("ultimoPrestamo"))

  if(ultimoCalculoLocal != null){
    validaStorageEImprime(ultimoCalculoLocal)
  }else{
    validaStorageEImprime([0])
  }

  limpiaDOM($("#pagoMensual"))
  limpiaDOM($("#pagoTotal"))

  $("#mensajeUltimoCalculo").fadeOut(800)
  informacionPrestamo = new CalculadoraPrestamos ([campoMonto,campoInteres,campoMeses])

  informacionPrestamo.validaCamposYEjecutaCalculadora()

  if(informacionPrestamo.montoAPagarTotal > 0){

    infoStorage = JSON.parse(localStorage.getItem("historialPrestamo"))

    if (infoStorage == null){
        infoHistorica = [informacionPrestamo]
    } else {
        infoHistorica = infoStorage
        infoHistorica.push(informacionPrestamo)
    }
    localStorage.setItem("historialPrestamo",JSON.stringify(infoHistorica))
  }
}
  
/**
 * Funcion modifica el DOM; actualiza indicador de meses en html segun el evento onmovemouse
*/
function actualizaMeses(){
  $("#rangoMeses").html(`${$("#meses").val()}`)
}

/**
* Funcion modifica el layout del index para que se muestre la calculadora al usar boton, tambien usa funcion que trae UF con API CMF
*/
function crearCalculadora() {

  capturaUFActual()

  $("#espacioCalculadora").html(
    `<div class="container" data-aos="fade-up" data-aos-delay="100">
      <div>
        <div">
          <form class="credit">
          <h2>Calculadora de prestamos</h2>

          <div style="display:flex; align-items: baseline; justify-content: center; gap: 80px">
            <div>
              <input type="radio" class="tipoMoneda" name="monedas" value="clp" checked="true" onclick="conversionAMonedaEImprime()">
              <label for="monedas"> CLP</label>
            </div>

            <div>
              <input type="radio" class="tipoMoneda" name="monedas" value="uf" style="margin-left: 15px" onclick="conversionAMonedaEImprime()">
              <label for="monedas"> UF</label>
            </div>
          </div>

          
            
            <div class="form-group">
              <label for="amount">Monto a calcular</label>
              <div class="input-group">
                <div class="input-group-addon" id="tipoMonedaDOM">CLP</div>
                <input type="number" min="1000" class="form-control validate" id="monto" placeholder="Ingrese el valor que desea prestar" required>
              </div>
            </div>
            <div class="form-group">
              <label for="percent">Tasa de Anual</label>
              <div class="input-group">
                <div class="input-group-addon"> %</div>
                <input type="number" min="0.01" step="0.01" class="form-control validate" id="tasa" placeholder="Tasa de interes a calcular" required>
              </div>
            </div>
            <div class="form-group">
              <label>Cantidad de cuotas: <span id="rangoMeses">2</span> Meses</label>
              <input class="slider" type="range" min="2" max="24" value="1" id="meses" onmousemove="actualizaMeses()">
  
            </div>
            <div id="divBotonCalculadora">
                <button type="button" class="btn btn-primary btn-block botonCalculadora" onclick="ejecutaCalculadora()"> Calcular</button>
  
            </div>
  
          </form>
          <div><h2 id="mensajeDatos"></h2><h3>Total a pagar: <span id="pagoTotal" style="display:none"></span><br>
          <small>Valor cuota mensual: <span id="pagoMensual" style="display:none"></span></small></h3></div>
          <div id="mensajeUltimoCalculo"></div>
  
        </div>
      </div>
    </div>`
  )
}


/**
* Funcion toma propiedades de calculadora o item de storage e imprime segun el tipo de moneda que eligio el usuario (UF o CLP); esta funcion se usa siempre para imprimir resultados
*@see {boolean} valida si la calculadora tiene el campo "CLP" seleccionado para definir que resultado imprimir
*@see {number} lee propiedades de informacionPrestamo e imprime el resultado segun el tipo de moneda (CLP o UF)
*@see {number} lee item de storage e y ejecuta 
*/
function conversionAMonedaEImprime(){
  tipoMonedaElegida = ""
  esCLP = document.getElementsByClassName("tipoMoneda")[0].checked
  ultimoCalculoLocal = JSON.parse(sessionStorage.getItem("ultimoPrestamo")) || [0]

  if(esCLP){
    animacionesDOM($("#tipoMonedaDOM"),"","CLP")
  }else{
    animacionesDOM($("#tipoMonedaDOM"),"","UF")
  }
  
  if(informacionPrestamo.montoAPagarTotal >0){
    if(esCLP){
      tipoMonedaElegida = "CLP"
      montoAUsar = [informacionPrestamo.montoAPagarUnMes, informacionPrestamo.montoAPagarTotal]
      ultimoCalculoLocal.splice(2,2)
    }else{
      tipoMonedaElegida = "UF"
      montoAUsar = informacionPrestamo.montoAPagarUF
      ultimoCalculoLocal.splice(0,2)
    }
    validaStorageEImprime(ultimoCalculoLocal)
    animacionesDOM($("#pagoMensual"),montoAUsar[0],tipoMonedaElegida)
    animacionesDOM($("#pagoTotal"),montoAUsar[1],tipoMonedaElegida)
  }
}

/**
* Funcion para imprimir datos de operacion anterior, recibe del storage y valida: si existe una operacion actual -> si existen datos en storage imprime sino borra DOM 
*@param {array} ultimoCalculo este debe ser extraido del storage, en caso de recibir [0] solo ejecuta else
*/
function validaStorageEImprime(ultimoCalculo){
  validaciones = [ultimoCalculo != null, ultimoCalculo[0] > 0, informacionPrestamo.montoAPagarTotal > 0, informacionPrestamo.montoAPagarTotal != ultimoCalculo[1]]

  if(tipoMonedaElegida == "UF"){
    validaciones.splice(2,2,informacionPrestamo.montoAPagarUF[1] > 0,informacionPrestamo.montoAPagarUF[1] != ultimoCalculo[1])
  }

  if(validaciones[0] && validaciones[1] && validaciones[2] && validaciones[3]){
    textoAImprimir = `<p style="text-align: center">-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-</p><h4>Total a pagar calculo anterior: 
    ${ultimoCalculo[1].toLocaleString()}${tipoMonedaElegida}<br><small>V
    0
    alor mensual calculo anterior: ${ultimoCalculo[0].toLocaleString()}${tipoMonedaElegida}</small></h4>`

    animacionesDOM($("#mensajeUltimoCalculo"),'',textoAImprimir)
  }else{
    limpiaDOM($("#mensajeUltimoCalculo"))
  }
}

/**
* Funcion para traer valor de UF del dia a traves de API CMF - Se llama a traves de evento
*@return {Array} valoresUF
*/
async function capturaUFActual(){
  valoresUF = await fetch("https://api.sbif.cl/api-sbifv3/recursos_api/uf?apikey=0c4156bf5534ee201313a0355825c2a2f9276a13&formato=JSON").then(res=>res.json())
  valoresUF = parseFloat(valoresUF.UFs[0].Valor)
}

/**
* Funcion que continene animacion para que aparezcan resultados en DOM (fadeOut(300) -> DOM -> fadeIn(1000))
*@param {object} nodo donde se realizara cambio
*@param {Number} montoAImprimir (en caso de ingresar '' solo imprime textos y aplica animacion)
*@param {String} textoAImprimir En caso de imprimir montos, debe considerar el texto 'CLP' o 'UF'
*/
function animacionesDOM(nodo,montoAImprimir,textoAImprimir) {
  nodo.fadeOut(300,()=>{ 
    nodo.html(`${montoAImprimir.toLocaleString()}${textoAImprimir}`)
    nodo.fadeIn(1400)
  })
}

/**
* Funcion para limpiar DOM, se debe ingresar nodo y lo modifica a '' (nota:borra todo el contenido del nodo(incluso etiquetas))
*@param {object} nodo a borrar contenido
*/
function limpiaDOM(nodo){
  nodo.fadeOut(500,()=>{ nodo.html('') })}

let informacionPrestamo = 0
let infoHistorica = 0
let valoresUF = []

class CalculadoraPrestamos{
    constructor(valoresIngresados){
      this.monto = Number(valoresIngresados[0].value);
      this.interes = Number(valoresIngresados[1].value);
      this.meses = Number(valoresIngresados[2].value);
      this.montoAPagarUnMes = 0;
      this.montoAPagarTotal = 0;
      this.camposDeValores = valoresIngresados;
    }
  
    /**
     * Metodo recibe datos ingresados y regresa el valor a pagar del prestamo por mes y por el total
     * @param {number} this.monto
     * @param {number} this.interes
     * @param {number} this.meses
     * @return {number} this.montoAPagarUnMes
     * @return {number} this.montoAPagarTotal
     */
    calculaResultadoPrestamo(){
      this.montoAPagarTotal = Math.ceil((this.monto * (this.interes/1200) * this.meses) + this.monto)
      this.montoAPagarUnMes = Math.ceil(this.montoAPagarTotal/this.meses)
    }
  
    /**
     * Metodo interactua con DOM para mostrar resultado y agregar boton de contacto, (recibe los datos calculados del prestamo, imprime en html los resultados y agrega un nuevo boton al layout de la calculadora)
     * @param {number} this.monto
     * @param {number} this.interes
     * @param {number} this.meses
     */
    imprimeResultado(){
  
      $("#mensajeDatos").html(``)
  
      $("#divBotonCalculadora").html(`<div class="divBotonCalculadora">
      <button type="button" class="btn btn-primary btn-block botonCalculadora" onclick="capturaYEjecutaCalculadora()" id="botonCalculadora">Re-calcular</button>
      <button type="button" class="btn btn-info btn-block botonCalculadora" onclick="location.href='#contact-section'"style="margin-top:0px">Pide tu credito ya!</button>
      </div>`)

      conversionAMonedaEImprime(2,[this.montoAPagarUnMes,this.montoAPagarTotal])
    }
  
    /**
     * Metodo almacena los datos del objeto creado en el local y sesion storage
     * 
     */
     guardadoSessionStorage(){
      let informacionUltimoPrestamo = [this.montoAPagarUnMes, this.montoAPagarTotal]
      sessionStorage.setItem("ultimoPrestamo",JSON.stringify(informacionUltimoPrestamo))
    }
  
  
    /**
     * Este metodo modifica el DOM; metodo principal con secuencia de ejecucion para calculadora (valida campos ingresados con numero, si cumple borra los valores del calculo anterior y ejecuta un nuevo calculo.
     * @param {number} this.monto
     * @param {number} this.interes
     * @param {number} this.meses
     */
    validaCamposYEjecuta(){
      $("#pagoMensual").html(``)
      $("#pagoTotal").html(``)
        var validador = true
        for(let i = 0; i < this.camposDeValores.length; i++){
            if(this.camposDeValores[i].value == "" || this.camposDeValores[i].value == NaN){

                $("#mensajeDatos").html('Debe ingresar datos en todos los campos')

                $("#mensajeDatos").fadeIn(1400)

              this.camposDeValores[i].focus()
              validador = false
              break

            }if(this.camposDeValores[i].value == 0){
              $("#mensajeDatos").html(`El valor ingresado debe ser mayor a 0`)

              $("#mensajeDatos").fadeIn(1400)
              this.camposDeValores[i].focus()
              validador = false
              break
            }
        }

        if(validador){
          $("#mensajeDatos").fadeOut(1400)
          this.calculaResultadoPrestamo()
          this.imprimeResultado()
        }
    }
}
  
/** 
* ¡¡¡FUNCION INICIAL DE CALCULADORA!!! ¡¡Contiene secuencia de ejecucion de toda la calculadora (a excepcion de actualizaciones DOM)!! -> captura los valores del formulario con evento onClick, los ingresa en array y crea el objeto; luego ejecuta los el metodo principal del objeto y sube los resultados al storage
*@param {number} monto
*@param {number} interes
*@param {number} meses
*@event 
*/
function capturaYEjecutaCalculadora(){

  $("#pagoMensual").html(``)
  $("#pagoTotal").html(``)
  $("#mensajeUltimoCalculo").fadeOut(800)

  informacionPrestamo = new CalculadoraPrestamos ([document.getElementById("monto"),document.getElementById("tasa"),document.getElementById("meses")])

  informacionPrestamo.validaCamposYEjecuta()

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

  conversionAMonedaEImprime(3,[''])

  informacionPrestamo.guardadoSessionStorage()
}
  
/**
 * Funcion modifica el DOM; actualiza indicador de meses en html segun el evento onmovemouse
 *@event 
*/
function actualizaMeses(){
  $("#rangoMeses").html(`${$("#meses").val()}`)
}

/**
* Funcion modifica el layout del index para que se muestre la calculadora al usar boton, trae UF con API CMF
*@event 
*@api
*/
function crearCalculadora() {

  capturaUFActual()

  $("#espacioCalculadora").html(
    `<div class="container" data-aos="fade-up" data-aos-delay="100">
      <div>
        <div">
          <form class="credit">
          <h2>Calculadora de prestamos</h2>

          <div style="display:flex; align-items: baseline; justify-content:space-between; gap: 1px">

            <input type="radio" class="tipoMoneda" name="monedas" value="clp" checked="true" onclick(conversionAMoneda())>
            <label for="monedas"> CLP</label>
            <input type="radio" class="tipoMoneda" name="monedas" value="uf style="margin-left: 15px" onclick(conversionAMoneda())>
            <label for="monedas"> UF</label>

          </div>

          
            
            <div class="form-group">
              <label for="amount">Monto a calcular</label>
              <div class="input-group">
                <div class="input-group-addon">CLP</div>
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
                <button type="button" class="btn btn-primary btn-block botonCalculadora" onclick="capturaYEjecutaCalculadora()"> Calcular</button>
  
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
* Funcion actualiza los valores segun la moneda seleccionada
*@param {number} 1-Toma datos de calculadora, 2-Toma datos de parametro 2, 3-Toma datos de sessionStorage
*@param {Array} informacionUltimoPrestamo
*@event
*@DOM
*/
function conversionAMonedaEImprime(x,z) {
  ultimoCalculo = JSON.parse(sessionStorage.getItem("ultimoPrestamo"))
  tipoMonedaElegida = ""
  valorImprimir = [informacionPrestamo.montoAPagarUnMes,informacionPrestamo.montoAPagarTotal]

  if(document.getElementsByClassName("tipoMoneda")[0].checked){
    tipoMonedaElegida = "CLP"
  }else{
    tipoMonedaElegida = "UF"

    valorImprimir = valorImprimir.forEach((v)=>{return Number(v)*Number(valoresUF.UFs[0].Valor)})
    ultimoCalculo = ultimoCalculo.forEach((v)=>{return Number(v)*Number(valoresUF.UFs[0].Valor)})
    z = z.forEach((v)=>{return Number(v)*Number(valoresUF.UFs[0].Valor)})
  }

  console.log(valorImprimir)
  console.log(tipoMonedaElegida)

  switch(x){
    
    case 1: 
      animacionesDOM($("#pagoMensual"),valorImprimir[0],tipoMonedaElegida)
      animacionesDOM($("#pagoTotal"),valorImprimir[1],tipoMonedaElegida)
      break;
  
    case 2:
      animacionesDOM($("#pagoMensual"),z[0],tipoMonedaElegida)
      animacionesDOM($("#pagoTotal"),z[1],tipoMonedaElegida)
      break;

    case 3:
  
      if(ultimoCalculo != null && ultimoCalculo[0] > 0 && informacionPrestamo.montoAPagarTotal > 0){

        $("#mensajeUltimoCalculo").fadeIn(1200)

        $("#mensajeUltimoCalculo").html(`<p>-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°</p><h4>Total a pagar calculo anterior: 
        ${ultimoCalculo[1].toLocaleString()}${tipoMonedaElegida}<br><small>Valor mensual calculo anterior: ${ultimoCalculo[0].toLocaleString()}${tipoMonedaElegida}</small></h4>`)
                    
      }else{

        $("#mensajeUltimoCalculo").fadeOut(1200,()=>{
          $("#mensajeUltimoCalculo").html(``)
        })
      }
    break;
  }
}

/**
* Funcion que continene animacion para que aparezcan resultados en DOM
*@event
*@DOM
*/
function animacionesDOM(x,y,z) {
  x.fadeOut(300,()=>{ 
    x.html(`${y.toLocaleString()}${z}`)
    x.fadeIn(1000)
  })
}

/**
* Funcion para traer valor de UF del dia a traves de API CMF
*@api
*@return {Array} valoresUF
*/
async function capturaUFActual(){

  valoresUF = await fetch("https://api.sbif.cl/api-sbifv3/recursos_api/uf?apikey=0c4156bf5534ee201313a0355825c2a2f9276a13&formato=JSON").then(res=>res.json())
}

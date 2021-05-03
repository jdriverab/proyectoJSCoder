let infoHistorica = 0

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
  
      document.getElementById("mensajeDatos").innerHTML = ``
  
      document.getElementById("divBotonCalculadora").innerHTML = `<div class="divBotonCalculadora">
      <button type="button" class="btn btn-primary btn-block" onclick="capturaYEjecutaCalculadora()" id="botonCalculadora">Re-calcular</button>
      <button type="button" class="btn btn-info btn-block" onclick="location.href='#contact-section'"style="margin-top:0px">Pide tu credito ya!</button>
      </div>`
  
      document.getElementById("pagoMensual").innerHTML = `${this.montoAPagarUnMes.toLocaleString()} CLP`
      document.getElementById("pagoTotal").innerHTML = `${this.montoAPagarTotal.toLocaleString()} CLP`
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
        document.getElementById("pagoMensual").innerHTML = ``
        document.getElementById("pagoTotal").innerHTML = ``
        var validador = true
        for(let i = 0; i < this.camposDeValores.length; i++){
            if(this.camposDeValores[i].value == ""){
                document.getElementById("mensajeDatos").innerHTML = 'Debe ingresar datos en todos los campos'
                this.camposDeValores[i].focus()
                validador = false
                break
            }if(this.camposDeValores[i].value == 0){
                document.getElementById("mensajeDatos").innerHTML = `El valor ingresado debe ser mayor a 0`
                this.camposDeValores[i].focus()
                validador = false
                break
            }
        }

        if(validador){
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

  document.getElementById("pagoMensual").innerHTML = ``
  document.getElementById("pagoTotal").innerHTML = ``

  let informacionPrestamo = new CalculadoraPrestamos ([document.getElementById("monto"),document.getElementById("tasa"),document.getElementById("meses")])

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

  ultimoCalculo = JSON.parse(sessionStorage.getItem("ultimoPrestamo"))

  console.log(ultimoCalculo)

  if(ultimoCalculo != null){
    
    document.getElementById("mensajeUltimoCalculo").innerHTML = `<br>-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°-°<br><h4>Total a pagar calculo anterior: 
    ${ultimoCalculo[1]}<br><small>Valor mensual calculo anterior: ${ultimoCalculo[0]}</small></h4>`
    
  }else{
    document.getElementById("mensajeUltimoCalculo").innerHTML = ``
  }

  informacionPrestamo.guardadoSessionStorage()
}
  
/**
 * Funcion modifica el DOM; actualiza indicador de meses en html segun el evento onmovemouse
 *@event 
*/
function actualizaMeses(){
    document.getElementById("rangoMeses").innerHTML = `${document.getElementById("meses").value}`
}


/**
* Funcion modifica el layout del index para que se muestre la calculadora al usar boton
*@event 
*/
function crearCalculadora() {
    document.getElementById("espacioCalculadora").innerHTML = `<div class="container">
    <div>
      <div">
        <form class="credit">
        <h2>Calculadora de prestamos</h2>
          
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
              <button type="button" class="btn btn-primary btn-block" onclick="capturaYEjecutaCalculadora()"> Calcular</button>

          </div>

        </form>
        <div><h2 id="mensajeDatos"></h2><h3>Total a pagar: <span id="pagoTotal"></span><br>
        <small>Valor cuota mensual: <span id="pagoMensual"></span></small></h3></div>
        <div id="mensajeUltimoCalculo"></div>

      </div>
    </div>
  </div>`

}








class InformacionPrestamo {
    constructor(valoresIngresados){
        this.monto = 0 + Number(valoresIngresados[0].value);
        this.interes = 0 + Number(valoresIngresados[1].value);
        this.meses = 0 + Number(valoresIngresados[2].value);
        this.montoAPagarUnMes = 0;
        this.montoAPagarTotal = 0;
    
    }

    /**
     * Este metodo recibe datos ingresados y regresa el valor a pagar por mes y por el total
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
}

/**
* captura los valores del formulario, los ingresa en array para crear el objeto e imprime los montos calculados del prestamo
*@param {number} monto
*@param {number} interes
*@param {number} meses
*/
function capturaDatosYEjecutaCalculaPrestamo(){

    document.getElementById("pagoMensual").innerHTML = ``
    document.getElementById("pagoTotal").innerHTML = ``

    datosCapturados = [document.getElementById("monto"),document.getElementById("tasa"),document.getElementById("meses")]
    validador = true

    for(i = 0; i < datosCapturados.length; i++){
        if(datosCapturados[i].value == ""){
            document.getElementById("mensajeDatos").innerHTML = 'Debe ingresar datos en todos los campos'
            datosCapturados[i].focus()
            validador = false
            break
        }if(datosCapturados[i].value == 0){
            document.getElementById("mensajeDatos").innerHTML = `El valor ingresado debe ser mayor a 0`
            datosCapturados[i].focus()
            validador = false
            break
        }
    }

    if(validador){

        let informacionPrestamo = new InformacionPrestamo(datosCapturados)
    
        informacionPrestamo.calculaResultadoPrestamo()

        document.getElementById("mensajeDatos").innerHTML = ` `

        document.getElementById("divBotonCalculadora").innerHTML = `<div class="divBotonCalculadora">
        <button type="button" class="btn btn-primary btn-block" onclick="capturaDatosYEjecutaCalculaPrestamo()" id="botonCalculadora">Re-calcular</button>
        <button type="button" class="btn btn-info btn-block" onclick="location.href='#contact-section'"style="margin-top:0px">Contactanos!</button>
        </div>`

        document.getElementById("pagoMensual").innerHTML = `${informacionPrestamo.montoAPagarUnMes.toLocaleString()} CLP`
        document.getElementById("pagoTotal").innerHTML = `${informacionPrestamo.montoAPagarTotal.toLocaleString()} CLP`

        localStorage.setItem("prestamo",JSON.stringify(informacionPrestamo))
    }
}

/**
* modifica el indicador de meses en html segun el evento onmovemouse
*@param {Event}
*/
function actualizaMeses(){
    document.getElementById("rangoMeses").innerHTML = `${document.getElementById("meses").value}`
}

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
              <button type="button" class="btn btn-primary btn-block" onclick="capturaDatosYEjecutaCalculaPrestamo()"> Calcular</button>

          </div>

        </form>
        <h2 id="mensajeDatos"></h2><h3>Total a pagar: <span id="pagoTotal"></span><br>
        <small>Valor cuota mensual: <span id="pagoMensual"></span></small></h3>


      </div>
    </div>
  </div>`

}








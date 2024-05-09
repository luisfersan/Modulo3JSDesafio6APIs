// Asignamos la URL base de la API
const urlBase = 'https://mindicador.cl/api';


// Capturamos los elementos del HTML
const valorInput = document.querySelector("#amountInput");
const unidadCambio = document.querySelector("#currencySelect");
const span = document.querySelector("span");
let myChart = null;

async function convertCurrency(){

    const pesos = valorInput.value;
    const {value:monedaSeleccionada}=unidadCambio;
    const valorMoneda = await obtenerApi(monedaSeleccionada);
    const valorFinal = (pesos/valorMoneda).toFixed(2);
    console.log("valor final: ",valorFinal);
    span.innerHTML="resultado: $"+valorFinal;
}

// Vamos a cosumir la API
async function obtenerApi(moneda){

    try {
        const result = await fetch(urlBase+"/"+moneda);
        const data = await result.json();
    // Extraemos el atributo serie desde data con un destructring de objeto
        const {serie}=data;
        const datos = crearDatos(serie.slice(0,10).reverse(),moneda);
        renderGrafica(datos);
        return serie[0].valor;    
    } catch (error) {
        alert("Error: problemas con el servidor.")
        console.log(error);
    }

}

//Creamos la función para reinderizar Chart

function renderGrafica(data){
    const config = {
        type:"line",
        data
    }
    const canvas = document.querySelector("#myChart");
    canvas.style.backgroundColor="white";
    if (myChart){
        myChart.destroy();
    }    
    myChart=new Chart(canvas,config);
}

function formatDate(date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
}

function crearDatos(serie,moneda){
    
    const labels = serie.map(({fecha})=>formatDate(fecha));
    const data = serie.map(({valor})=>valor);
    const datasets = [
        {
        label: moneda,
        borderColor: "rgb(255, 99, 132)",
        data
        }
        ];
        return { labels, datasets };
}
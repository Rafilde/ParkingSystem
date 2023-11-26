function convertPeriod(mil){
    const min = Math.floor(mil / 60000); 
    const hours = Math.floor(min / 60)
    let sub = (mil/60000) - min; 
    const second = Math.floor(sub*60);
    let price = finalValue(hours, min,);
    return `${hours}h ${min}m e ${second}s` + price;
}
function finalValue(h, m) {
    if(h == 0 && m <= 15) {
        return `Valor cobrado: gratuito`;
    } else if (h == 0 && m > 15) {
        return `Valor cobrado: R$` + 10;
    } else if ( h == 1) {
        if(m >= 0 && m <= 15) {
            return `Valor cobrado: R$` + (10 + 3);
        } else if(m > 15 && m <= 30) {
            return `Valor cobrado: R$` + (10 + 5);
        } else if(m > 30 && m <= 59) {
            return `Valor cobrado: R$` + (10 + 7);
        }
    } else if (h > 1) {
        if(m >= 0 && m <= 15) {
            return `Valor cobrado: R$` + (10 + 3 + (h * 3));
        } else if(m > 15 && m <= 30) {
            return `Valor cobrado: R$` + (10 + 5 + (h * 3));
        } else if(m > 30 && m <= 59) {
            return `Valor cobrado: R$` + (10 + 7 + (h * 3));
        }
    }
}

function renderGarage() {
    const garage = getGarage();
    const maxVagas = tamanho();
    document.querySelector("#garagem").innerHTML = "";

    if (garage.length >= maxVagas) {
        document.querySelector("#send").disabled = true;
    } else {
        document.querySelector("#send").disabled = false;
    }

    garage.forEach(c => addCarToGarage(c));
}

const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

function checkOut(info) {
    const licence = info[1].textContent;
    let period = new Date() - new Date(info[3].dataset.time);
    //let price = finalValue(period);
    period = convertPeriod(period);
    let msg = `O veículo ${info[0].textContent} de placa ${licence} permaneceu estacionado por ${period}. Deseja encerrar?`; 
    if (!confirm(msg)) return;
    const garage = getGarage().filter(c => c.licence !== licence); 
    localStorage.garage = JSON.stringify(garage); 
    renderGarage();
}

function allocatePosition() {
    const selectedPosition = document.querySelector("#position").value;
    const garage = getGarage();
    const positionTaken = garage.some(car => car.position === selectedPosition);

    if (positionTaken) {
        alert("Posição já ocupada. Escolha outra posição.");
        return false;
    }

    return selectedPosition;
}

function addCarToGarage(car) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${car.name}</td>
        <td>${car.licence}</td>
        <td>${car.state}</td>
        <td data-time="${car.time}">${new Date(car.time).toLocaleString(
            "pt-BR", {hour: "numeric", minute: "numeric"})
        }</td>
        <td>${car.position}</td>
        <td>
            <button class="delete">x</button>
        </td>
    `;
    document.querySelector("#garagem").appendChild(row);
}

function extrairLetras(placa) {
    const letras = placa.replace(/[^a-zA-Z]/g, '');

    return letras;
}

function checkStates(placa) {
    const letras = extrairLetras(placa);

    const intervalosEstados = [
        { inicio: 'AAA', fim: 'BEZ', estado: 'Paraná' },
        { inicio: 'RHA', fim: 'RHZ', estado: 'Paraná' },
        { inicio: 'IAQ', fim: 'JDO', estado: 'Rio Grande do Sul' },
        { inicio: 'LWR', fim: 'MMM', estado: 'Santa Catarina' },
        { inicio: 'OKD', fim: 'OKH', estado: 'Santa Catarina' },
        { inicio: 'QHA', fim: 'QJZ', estado: 'Santa Catarina' },
        { inicio: 'QTK', fim: 'QTM', estado: 'Santa Catarina' },
        { inicio: 'RAA', fim: 'RAJ', estado: 'Santa Catarina' },
        { inicio: 'RDS', fim: 'REB', estado: 'Santa Catarina' },
        { inicio: 'RKW', fim: 'RLP', estado: 'Santa Catarina' },
        { inicio: 'RXK', fim: 'RYI', estado: 'Santa Catarina' }
    ];

    for (const intervalo of intervalosEstados) {
        if (letras >= intervalo.inicio && letras <= intervalo.fim) {
            return intervalo.estado;
        }
    }

    return 'Placa não pertence ao estado';
}


const tamanho = () => 10;

//MAINN---------------------------------
renderGarage();

document.querySelector("#garagem").addEventListener("click", e => {
    if(e.target.className === "delete") {
        checkOut(e.target.parentElement.parentElement.cells);
    }
});

document.querySelector("#send").addEventListener("click", e => {
    const name = document.querySelector("#name").value;
    const licence = document.querySelector("#licence").value;

    if (!name || !licence) {
        alert("Preencha os campos");
        return;
    }

    const selectedPosition = allocatePosition();
    if (!selectedPosition) {
        return; 
    }

    const estado = checkStates(licence);

    let car = {name, licence, state: estado, time: new Date(), position: selectedPosition};
    const garage = getGarage();
    garage.push(car);
    localStorage.garage = JSON.stringify(garage);

    addCarToGarage(car);

    document.querySelector("#name").value = "";
    document.querySelector("#licence").value = "";

    renderGarage();
});

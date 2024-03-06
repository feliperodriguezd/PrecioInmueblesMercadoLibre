function CambioElMes(){
    let fecha = new Date();
    return fecha.getDate() == 1;
}

function MesAnterior(){
    let fecha = new Date();
    let mes = (fecha.getMonth() + 1) % 12;
    if (EsElPrimerMesDelAnio(mes)){
        return 12;
    }
    return mes;
}

function EsElPrimerMesDelAnio(mes){
    return mes == 0;
}

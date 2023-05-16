//запуск select'ов
$(document).ready(function () {
    $('select').formSelect();
});

let Cities = ["Донецк", "Макеевка", "Горловка", "Енакиево", "Шахтерск", "Алчевск", "Луганск", "Стаханов", "Мариуполь", "Бердянск"]
let CityZones = ["Сentre", "North", "Lnr", "South", "West"]

let currentZone, isValidWeight, isValidVolume, kgResult, m3Result, finalResult;

let kgTarif = [[450, 500, 800, 1700, 2500, 50, 33, 30, 30, 29, 28],
[500, 500, 850, 1800, 2700, 53, 33, 30, 30, 29, 28],
[550, 500, 950, 1900, 2900, 55, 35, 33, 33, 31, 30],
[550, 500, 950, 1900, 2900, 55, 33, 30, 30, 30, 28],
[1100, 1100, 1600, 2650, 3750, 70, 40, 38, 38, 35, 35]];

let m3Tarif = [[450, 500, 800, 1700, 2500, 9000, 6500, 6000, 6000, 5750, 5500],
[500, 500, 850, 1800, 2700, 9500, 6500, 6000, 6000, 5750, 5500],
[550, 500, 950, 1900, 2900, 10000, 7000, 6500, 6500, 6250, 6000],
[550, 500, 950, 1900, 2900, 10000, 6500, 6000, 6000, 6000, 5500],
[1100, 1100, 1600, 2650, 3750, 13000, 8000, 7500, 7500, 7000, 7000]];

let minLimits = [[0, 0, 0, 0, 0, 2500, 6500, 13000, 13000, 24000, 86250],
[0, 0, 0, 0, 0, 2700, 6500, 13000, 13000, 24000, 86250],
[0, 0, 0, 0, 0, 2900, 7000, 14000, 14000, 26000, 93750],
[0, 0, 0, 0, 0, 2900, 6500, 13000, 13000, 24000, 90000],
[0, 0, 0, 0, 0, 3750, 8000, 16000, 16000, 30000, 105000]];

let maxLimits = [[0, 0, 0, 0, 0, 5500, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 5750, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 6000, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 6000, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 7750, 0, 0, 0, 0, 0]];

//выбор нужной зоны в зависимости от города
$("#city").on('change', function () {

    SetResultFieldToDefault()
    let city = document.getElementById("city").value;

    switch (city) {
        case "Донецк":
            currentZone = "Сentre";
            break;
        case "Макеевка":
            currentZone = "Сentre";
            break;
        case "Горловка":
            currentZone = "North";
            break;
        case "Енакиево":
            currentZone = "North";
            break;
        case "Шахтерск":
            currentZone = "North";
            break;
        case "Снежное":
            currentZone = "North";
            break;
        case "Алчевск":
            currentZone = "Lnr";
            break;
        case "Луганск":
            currentZone = "Lnr";
            break;
        case "Стаханов":
            currentZone = "Lnr";
            break;
        case "Мариуполь":
            currentZone = "South";
            break;
        case "Бердянск":
            currentZone = "West";
            break;
        case "Мелитополь":
            currentZone = "West";
            break;
    }
});

//блокировка ненужных полей при выборе конверта
$("#type").on('change', function () {

    SetResultFieldToDefault()

    let type = document.getElementById("type");
    let weight = document.getElementById("weight");
    let volume = document.getElementById("volume");

    if (type.value == "Конверт") {
        weight.disabled = true;
        volume.disabled = true;
    }
    else {
        weight.disabled = false;
        volume.disabled = false;
    }
});

//обнулить результат
SetResultFieldToDefault = () => {
    let resultField = document.getElementById("result-field");
    resultField.innerHTML = ""
}

//обнулить результат при изменении input'ов
$("#weight").on('change', function () {
    SetResultFieldToDefault()
});

$("#volume").on('change', function () {
    SetResultFieldToDefault()
});

//валидация weight
document.getElementById("weight").addEventListener("keyup", CheckWeight);
document.getElementById("weight").addEventListener("keyup", CheckInputs);
function CheckWeight() {
    var weight = document.getElementById("weight").value;
    if (!weight || !weight.length) {
        return;
    }
    var regex = /^\d+(\.\d{1,4})?$/;
    if (!regex.test(weight)) {
        document.getElementById("weight").classList.remove("valid");
        document.getElementById("weight").classList.add("invalid");
        $('#result-btn').removeClass("waves-effect waves-light submit").addClass('disabled');
        isValidWeight = false;
    } else {
        document.getElementById("weight").classList.remove("invalid");
        document.getElementById("weight").classList.add("valid");
        isValidWeight = true;
    }
}

//валидация volume
document.getElementById("volume").addEventListener("keyup", CheckVolume);
document.getElementById("volume").addEventListener("keyup", CheckInputs);
function CheckVolume() {
    var volume = document.getElementById("volume").value;
    if (!volume || !volume.length) {
        return;
    }
    var regex = /^\d+(\.\d{1,4})?$/;
    if (!regex.test(volume)) {
        document.getElementById("volume").classList.remove("valid");
        document.getElementById("volume").classList.add("invalid");
        $('#result-btn').removeClass("waves-effect waves-light submit").addClass('disabled');
        isValidVolume = false;
    } else {
        document.getElementById("volume").classList.remove("invalid");
        document.getElementById("volume").classList.add("valid");
        isValidVolume = true;
    }
}

//общая валидация
function CheckInputs() {
    if (!isValidWeight || !isValidVolume) {
        $('#result-btn').removeClass("waves-effect waves-light submit").addClass('disabled');
    }
    else {
        $('#result-btn').addClass("waves-effect waves-light submit").removeClass('disabled');
    }
}

//заблокировать кнопку, если поля пустые
CheckFieldsIsNotEmpty = () => {
    let type = document.getElementById("type").value;
    let city = document.getElementById("city").value;
    let weight = document.getElementById("weight").value;
    let volume = document.getElementById("volume").value;

    if (type == "Груз" && city != "" && weight != "" && volume != "" && weight != "0" && volume != "0") {
        return true;
    }
    else {
        return false;
    }
}

//расчет конверт
GetLetterResult = () => {
    let letterResult = 0;
    switch (currentZone) {
        case 'Сentre':
            letterResult = kgTarif[0][0];
            break;
        case 'North':
            letterResult = kgTarif[1][0];
            break;
        case 'Lnr':
            letterResult = kgTarif[2][0];
            break;
        case 'South':
            letterResult = kgTarif[3][0];
            break;
        case 'West':
            letterResult = kgTarif[4][0];
            break;
    }
    return letterResult;
}

//расчет кг
GetKgResult = () => {
    let result = 0;
    let weight = document.getElementById("weight").value;
    if (weight > 0 && weight <= 1) {
        switch (currentZone) {
            case 'Сentre':
                result = kgTarif[0][1];
                break;
            case 'North':
                result = kgTarif[1][1];
                break;
            case 'Lnr':
                result = kgTarif[2][1];
                break;
            case 'South':
                result = kgTarif[3][1];
                break;
            case 'West':
                result = kgTarif[4][1];
                break;
        }
    }
    else if (weight > 1 && weight <= 5) {
        switch (currentZone) {
            case 'Сentre':
                result = kgTarif[0][2];
                break;
            case 'North':
                result = kgTarif[1][2];
                break;
            case 'Lnr':
                result = kgTarif[2][2];
                break;
            case 'South':
                result = kgTarif[3][2];
                break;
            case 'West':
                result = kgTarif[4][2];
                break;
        }
    }
    else if (weight > 5 && weight <= 20) {
        switch (currentZone) {
            case 'Сentre':
                result = kgTarif[0][3];
                break;
            case 'North':
                result = kgTarif[1][3];
                break;
            case 'Lnr':
                result = kgTarif[2][3];
                break;
            case 'South':
                result = kgTarif[3][3];
                break;
            case 'West':
                result = kgTarif[4][3];
                break;
        }
    }
    else if (weight > 20 && weight <= 44) {
        switch (currentZone) {
            case 'Сentre':
                result = kgTarif[0][4];
                break;
            case 'North':
                result = kgTarif[1][4];
                break;
            case 'Lnr':
                result = kgTarif[2][4];
                break;
            case 'South':
                result = kgTarif[3][4];
                break;
            case 'West':
                result = kgTarif[4][4];
                break;
        }
    }
    else if (weight > 44 && weight <= 150) {
        switch (currentZone) {
            case 'Сentre':
                if (kgTarif[0][5] * weight < minLimits[0][5])
                    result = minLimits[0][5];
                else if (kgTarif[0][5] * weight > maxLimits[0][5])
                    result = maxLimits[0][5];
                else
                    result = kgTarif[0][5] * weight;
                break;
            case 'North':
                if (kgTarif[1][5] * weight < minLimits[1][5])
                    result = minLimits[1][5];
                else if (kgTarif[1][5] * weight > maxLimits[1][5])
                    result = maxLimits[1][5];
                else
                    result = kgTarif[1][5] * weight;
                break;
            case 'Lnr':
                if (kgTarif[2][5] * weight < minLimits[2][5])
                    result = minLimits[2][5];
                else if (kgTarif[2][5] * weight > maxLimits[2][5])
                    result = maxLimits[2][5];
                else
                    result = kgTarif[2][5] * weight;
                break;
            case 'South':
                if (kgTarif[3][5] * weight < minLimits[3][5])
                    result = minLimits[3][5];
                else if (kgTarif[3][5] * weight > maxLimits[3][5])
                    result = maxLimits[3][5];
                else
                    result = kgTarif[3][5] * weight;
                break;
            case 'West':
                if (kgTarif[4][5] * weight < minLimits[4][5])
                    result = minLimits[4][5];
                else if (kgTarif[4][5] * weight > maxLimits[4][5])
                    result = maxLimits[4][5];
                else
                    result = kgTarif[4][5] * weight;
                break;
        }
    }
    else if (weight > 150 && weight <= 400) {
        switch (currentZone) {
            case 'Сentre':
                result = kgTarif[0][6] * weight < minLimits[0][6] ? minLimits[0][6] : kgTarif[0][6] * weight;
                break;
            case 'North':
                result = kgTarif[1][6] * weight < minLimits[1][6] ? minLimits[1][6] : kgTarif[1][6] * weight;
                break;
            case 'Lnr':
                result = kgTarif[2][6] * weight < minLimits[2][6] ? minLimits[2][6] : kgTarif[2][6] * weight;
                break;
            case 'South':
                result = kgTarif[3][6] * weight < minLimits[3][6] ? minLimits[3][6] : kgTarif[3][6] * weight;
                break;
            case 'West':
                result = kgTarif[4][6] * weight < minLimits[4][6] ? minLimits[4][6] : kgTarif[4][6] * weight;
                break;
        }
    }
    else if (weight > 400 && weight <= 600) {
        switch (currentZone) {
            case 'Сentre':
                result = kgTarif[0][7] * weight < minLimits[0][7] ? minLimits[0][7] : kgTarif[0][7] * weight;
                break;
            case 'North':
                result = kgTarif[1][7] * weight < minLimits[1][7] ? minLimits[1][7] : kgTarif[1][7] * weight;
                break;
            case 'Lnr':
                result = kgTarif[2][7] * weight < minLimits[2][7] ? minLimits[2][7] : kgTarif[2][7] * weight;
                break;
            case 'South':
                result = kgTarif[3][7] * weight < minLimits[3][7] ? minLimits[3][7] : kgTarif[3][7] * weight;
                break;
            case 'West':
                result = kgTarif[4][7] * weight < minLimits[4][7] ? minLimits[4][7] : kgTarif[4][7] * weight;
                break;
        }
    }
    else if (weight > 600 && weight <= 800) {
        switch (currentZone) {
            case 'Сentre':
                result = kgTarif[0][8] * weight < minLimits[0][8] ? minLimits[0][8] : kgTarif[0][8] * weight;
                break;
            case 'North':
                result = kgTarif[1][8] * weight < minLimits[1][8] ? minLimits[1][8] : kgTarif[1][8] * weight;
                break;
            case 'Lnr':
                result = kgTarif[2][8] * weight < minLimits[2][8] ? minLimits[2][8] : kgTarif[2][8] * weight;
                break;
            case 'South':
                result = kgTarif[3][8] * weight < minLimits[3][8] ? minLimits[3][8] : kgTarif[3][8] * weight;
                break;
            case 'West':
                result = kgTarif[4][8] * weight < minLimits[4][8] ? minLimits[4][8] : kgTarif[4][8] * weight;
                break;
        }
    }
    else if (weight > 800 && weight <= 3000) {
        switch (currentZone) {
            case 'Сentre':
                result = kgTarif[0][9] * weight < minLimits[0][9] ? minLimits[0][9] : kgTarif[0][9] * weight;
                break;
            case 'North':
                result = kgTarif[1][9] * weight < minLimits[1][9] ? minLimits[1][9] : kgTarif[1][9] * weight;
                break;
            case 'Lnr':
                result = kgTarif[2][9] * weight < minLimits[2][9] ? minLimits[2][9] : kgTarif[2][9] * weight;
                break;
            case 'South':
                result = kgTarif[3][9] * weight < minLimits[3][9] ? minLimits[3][9] : kgTarif[3][9] * weight;
                break;
            case 'West':
                result = kgTarif[4][9] * weight < minLimits[4][9] ? minLimits[4][9] : kgTarif[4][9] * weight;
                break;
        }
    }
    else if (weight > 3000) {
        switch (currentZone) {
            case 'Сentre':
                result = kgTarif[0][10] * weight < minLimits[0][10] ? minLimits[0][10] : kgTarif[0][10] * weight;
                break;
            case 'North':
                result = kgTarif[1][10] * weight < minLimits[1][10] ? minLimits[1][10] : kgTarif[1][10] * weight;
                break;
            case 'Lnr':
                result = kgTarif[2][10] * weight < minLimits[2][10] ? minLimits[2][10] : kgTarif[2][10] * weight;
                break;
            case 'South':
                result = kgTarif[3][10] * weight < minLimits[3][10] ? minLimits[3][10] : kgTarif[3][10] * weight;
                break;
            case 'West':
                result = kgTarif[4][10] * weight < minLimits[4][10] ? minLimits[4][10] : kgTarif[4][10] * weight;
                break;
        }
    }
    return Math.round(result / 50) * 50;
}

//раcчет м3
GetM3Result = () => {
    let result = 0;
    let weight = document.getElementById("weight").value;
    let volume = document.getElementById("volume").value;
    if (volume > 0 && volume <= 0.004) {
        switch (currentZone) {
            case 'Сentre':
                result = m3Tarif[0][1];
                break;
            case 'North':
                result = m3Tarif[1][1];
                break;
            case 'Lnr':
                result = m3Tarif[2][1];
                break;
            case 'South':
                result = m3Tarif[3][1];
                break;
            case 'West':
                result = m3Tarif[4][1];
                break;
        }
    }
    else if (volume > 0.004 && volume <= 0.02) {
        switch (currentZone) {
            case 'Сentre':
                result = m3Tarif[0][2];
                break;
            case 'North':
                result = m3Tarif[1][2];
                break;
            case 'Lnr':
                result = m3Tarif[2][2];
                break;
            case 'South':
                result = m3Tarif[3][2];
                break;
            case 'West':
                result = m3Tarif[4][2];
                break;
        }
    }
    else if (volume > 0.02 && volume <= 0.11 && weight > 0 && weight <= 20) {
        switch (currentZone) {
            case 'Сentre':
                result = m3Tarif[0][3];
                break;
            case 'North':
                result = m3Tarif[1][3];
                break;
            case 'Lnr':
                result = m3Tarif[2][3];
                break;
            case 'South':
                result = m3Tarif[3][3];
                break;
            case 'West':
                result = m3Tarif[4][3];
                break;
        }
    }
    else if (volume > 0.02 && volume <= 0.11 && weight > 20) {
        switch (currentZone) {
            case 'Сentre':
                result = m3Tarif[0][4];
                break;
            case 'North':
                result = m3Tarif[1][4];
                break;
            case 'Lnr':
                result = m3Tarif[2][4];
                break;
            case 'South':
                result = m3Tarif[3][4];
                break;
            case 'West':
                result = m3Tarif[4][4];
                break;
        }
    }
    else if (volume > 0.11 && volume <= 1) {
        switch (currentZone) {
            case 'Сentre':
                if (m3Tarif[0][5] * volume < minLimits[0][5])
                    result = minLimits[0][5];
                else if (m3Tarif[0][5] * volume > maxLimits[0][5])
                    result = maxLimits[0][5];
                else
                    result = m3Tarif[0][5] * volume;
                break;
            case 'North':
                if (m3Tarif[1][5] * volume < minLimits[1][5])
                    result = minLimits[1][5];
                else if (m3Tarif[1][5] * volume > maxLimits[1][5])
                    result = maxLimits[1][5];
                else
                    result = m3Tarif[1][5] * volume;
                break;
            case 'Lnr':
                if (m3Tarif[2][5] * volume < minLimits[2][5])
                    result = minLimits[2][5];
                else if (m3Tarif[2][5] * volume > maxLimits[2][5])
                    result = maxLimits[2][5];
                else
                    result = m3Tarif[2][5] * volume;
                break;
            case 'South':
                if (m3Tarif[3][5] * volume < minLimits[3][5])
                    result = minLimits[3][5];
                else if (m3Tarif[3][5] * volume > maxLimits[3][5])
                    result = maxLimits[3][5];
                else
                    result = m3Tarif[3][5] * volume;
                break;
            case 'West':
                if (m3Tarif[4][5] * volume < minLimits[4][5])
                    result = minLimits[4][5];
                else if (m3Tarif[4][5] * volume > maxLimits[4][5])
                    result = maxLimits[4][5];
                else
                    result = m3Tarif[4][5] * volume;
                break;
        }
    }
    else if (volume > 1 && volume <= 2) {
        switch (currentZone) {
            case 'Сentre':
                result = m3Tarif[0][6] * volume < minLimits[0][6] ? minLimits[0][6] : m3Tarif[0][6] * volume;
                break;
            case 'North':
                result = m3Tarif[1][6] * volume < minLimits[1][6] ? minLimits[1][6] : m3Tarif[1][6] * volume;
                break;
            case 'Lnr':
                result = m3Tarif[2][6] * volume < minLimits[2][6] ? minLimits[2][6] : m3Tarif[2][6] * volume;
                break;
            case 'South':
                result = m3Tarif[3][6] * volume < minLimits[3][6] ? minLimits[3][6] : m3Tarif[3][6] * volume;
                break;
            case 'West':
                result = m3Tarif[4][6] * volume < minLimits[4][6] ? minLimits[4][6] : m3Tarif[4][6] * volume;
                break;
        }
    }
    else if (volume > 2 && volume <= 3) {
        switch (currentZone) {
            case 'Сentre':
                result = m3Tarif[0][7] * volume < minLimits[0][7] ? minLimits[0][7] : m3Tarif[0][7] * volume;
                break;
            case 'North':
                result = m3Tarif[1][7] * volume < minLimits[1][7] ? minLimits[1][7] : m3Tarif[1][7] * volume;
                break;
            case 'Lnr':
                result = m3Tarif[2][7] * volume < minLimits[2][7] ? minLimits[2][7] : m3Tarif[2][7] * volume;
                break;
            case 'South':
                result = m3Tarif[3][7] * volume < minLimits[3][7] ? minLimits[3][7] : m3Tarif[3][7] * volume;
                break;
            case 'West':
                result = m3Tarif[4][7] * volume < minLimits[4][7] ? minLimits[4][7] : m3Tarif[4][7] * volume;
                break;
        }
    }
    else if (volume > 3 && volume <= 4) {
        switch (currentZone) {
            case 'Сentre':
                result = m3Tarif[0][8] * volume < minLimits[0][8] ? minLimits[0][8] : m3Tarif[0][8] * volume;
                break;
            case 'North':
                result = m3Tarif[1][8] * volume < minLimits[1][8] ? minLimits[1][8] : m3Tarif[1][8] * volume;
                break;
            case 'Lnr':
                result = m3Tarif[2][8] * volume < minLimits[2][8] ? minLimits[2][8] : m3Tarif[2][8] * volume;
                break;
            case 'South':
                result = m3Tarif[3][8] * volume < minLimits[3][8] ? minLimits[3][8] : m3Tarif[3][8] * volume;
                break;
            case 'West':
                result = m3Tarif[4][8] * volume < minLimits[4][8] ? minLimits[4][8] : m3Tarif[4][8] * volume;
                break;
        }
    }
    else if (volume > 4 && volume <= 15) {
        switch (currentZone) {
            case 'Сentre':
                result = m3Tarif[0][9] * volume < minLimits[0][9] ? minLimits[0][9] : m3Tarif[0][9] * volume;
                break;
            case 'North':
                result = m3Tarif[1][9] * volume < minLimits[1][9] ? minLimits[1][9] : m3Tarif[1][9] * volume;
                break;
            case 'Lnr':
                result = m3Tarif[2][9] * volume < minLimits[2][9] ? minLimits[2][9] : m3Tarif[2][9] * volume;
                break;
            case 'South':
                result = m3Tarif[3][9] * volume < minLimits[3][9] ? minLimits[3][9] : m3Tarif[3][9] * volume;
                break;
            case 'West':
                result = m3Tarif[4][9] * volume < minLimits[4][9] ? minLimits[4][9] : m3Tarif[4][9] * volume;
                break;
        }
    }
    else if (volume > 15) {
        switch (currentZone) {
            case 'Сentre':
                result = m3Tarif[0][10] * volume < minLimits[0][10] ? minLimits[0][10] : m3Tarif[0][10] * volume;
                break;
            case 'North':
                result = m3Tarif[1][10] * volume < minLimits[1][10] ? minLimits[1][10] : m3Tarif[1][10] * volume;
                break;
            case 'Lnr':
                result = m3Tarif[2][10] * volume < minLimits[2][10] ? minLimits[2][10] : m3Tarif[2][10] * volume;
                break;
            case 'South':
                result = m3Tarif[3][10] * volume < minLimits[3][10] ? minLimits[3][10] : m3Tarif[3][10] * volume;
                break;
            case 'West':
                result = m3Tarif[4][10] * volume < minLimits[4][10] ? minLimits[4][10] : m3Tarif[4][10] * volume;
                break;
        }
    }
    return Math.round(result / 50) * 50;
}

//общий рачет
GetResult = () => {
    let type = document.getElementById("type").value;
    let resultField = document.getElementById("result-field");

    if (type == 'Конверт' && type != '' && type.length) {
        resultField.innerHTML = GetLetterResult() + " р.";
    }
    else if (CheckFieldsIsNotEmpty()) {
        kgResult = GetKgResult();
        m3Result = GetM3Result();
        finalResult = kgResult > m3Result ? kgResult : m3Result;
        resultField.innerHTML = finalResult + " р.";
    }
    else {
        alert("Все поля должны быть заполнены!");
    }
}

// $('.decimal').keyup(function () {
//     var val = $(this).val();
//     if (isNaN(val)) {
//         val = val.replace(/[^0-9\.]/g, '');
//         if (val.split('.').length > 2)
//             val = val.replace(/\.+$/, "");
//     }
//     $(this).val(val);
// });
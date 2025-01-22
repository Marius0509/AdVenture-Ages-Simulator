const epochs = [
    ['bronze', 'weapon', 'gladiator', 'chariot', 'arena', 'road', 'spartan', 'legionarie', 'academy', 'aqueduct', 'law', 'senator', 'empire'],
    ['medieval', 'knowledge', 'monk', 'chapel', 'knight', 'crusader', 'artifact', 'library', 'bishop', 'castle', 'king', 'cathedral', 'basilica'],
    ['renaissance', 'art', 'artist', 'gallery', 'musketeer', 'gadget', 'inventor', 'scholar', 'observatory', 'philosopher', 'museum', 'university', 'geographer'],
    ['industrial', 'machine', 'worker', 'foundry', 'light bulb', 'engineer', 'train', 'factory', 'radio', 'airship', 'power plant', 'entrepreneur'],
    ['atomic', 'science', 'scientist', 'lab', 'laser', 'robot', 'computer', 'spy', 'television', 'astronaut', 'rocket', 'nuke']
]

// [[10,10,10,10,10,10,9,9,9,9,9,7,10,10,9],[10,10,10,10,10,10,10,10,10,10,10,7,10,10,9],[10,10,10,10,10,10,10,10,10,10,10,7,10,10,9],[10,10,10,10,10,10,10,10,10,10,7,10,10,9],[10,10,10,10,10,10,10,10,10,10,7,11,10,9],[5,5,4,1]]

function getLabel(textContent) {
    let label = document.createElement('label')
    label.textContent = textContent
    return label
}

function getNumberInput(max) {
    let numberInput = document.createElement('input')
    numberInput.type = 'number'
    numberInput.min = 0
    numberInput.max = max
    numberInput.value = 0
    return numberInput
}

function getOption(value, textContent) {
    let option = document.createElement('option')
    option.value = value
    option.textContent = textContent
    return option
}

function saveEpoch() {
    epochDivs.forEach(div => {
        div.style.display = 'none'
    })
    if (epochSelect.value !== '') {
        epochDivs[parseInt(epochSelect.value)].style.display = 'block'
    }
    localStorage.setItem('epoch', epochSelect.value)
}

function saveLevels() {
    levels = []
    epochDivs[epochs.length].querySelectorAll('fieldset').forEach((fieldset, fieldsetIndex) => {
        levels.push([])
        fieldset.querySelectorAll('input').forEach((input) => {
            levels[fieldsetIndex].push(parseInt(input.value))
        })
    })
    localStorage.setItem('levels', JSON.stringify(levels))
}

function loadEpoch() {
    let value = localStorage.getItem('epoch')
    if (value !== null) {
        epochSelect.value = value
        saveEpoch()
    }
}

function loadLevels() {
    let levels = localStorage.getItem('levels')
    if (levels !== null) {
        levels = JSON.parse(levels)
        epochDivs[epochs.length].querySelectorAll('fieldset').forEach((fieldset, fieldsetIndex) => {
            fieldset.querySelectorAll('input').forEach((input, inputIndex) => {
                input.value = levels[fieldsetIndex][inputIndex]
            })
        })
    } else {
        saveLevels()
    }
}

function factorial(x) {
    let prod = 1
    for (let i = 2; i <= x; i++) {
        prod *= i
    }
    return prod
}

function intPow(x, y) {
    let prod = 1
    for (let i = 0; i < y; i++) {
        prod *= x
    }
    return prod
}

function format(x) {
    if (x === Infinity) {
        return Infinity
    }
    p = 0
    while (x >= 1000) {
        p += 1
        x /= 1000
    }
    if (p < 5) {
        p = ['', 'K', 'M', 'B', 'T'][p]
    } else {
        p -= 5
        p = String.fromCharCode(65 + p % 26).repeat(Math.floor(p / 26) + 2)
    }
    return x + p
}

function deformat(s) {
    x = parseFloat(s)
    p = s.slice(x.toString().length)
    let index = ['', 'K', 'M', 'B', 'T'].indexOf(p)
    if (index !== -1) {
        p = index
    } else if (p.length >= 2 && p.split('').every(char => char === p[0])) {
        p = (p.length - 2) * 26 + p.charCodeAt(0) - 65
        p += 5
    } else {
        throw new Error('invalid suffix')
    }
    return x * intPow(1000, p)
}

let epochSelect = document.createElement('select')
epochSelect.append(getOption('', '-- Select an option --'))
epochs.forEach((epoch, index) => {
    epochSelect.append(getOption(index.toString(), epoch[0]))
})
epochSelect.append(getOption(epochs.length, 'levels'))
document.body.append(epochSelect)
epochSelect.addEventListener('change', () => {
    saveEpoch()
})

let epochDivs = []
epochs.forEach((epoch, epochIndex) => {
    epochDivs.push(document.createElement('div'))
    epochDivs[epochIndex].style.display = 'none'
    epoch.slice(1).forEach((tower, towerIndex) => {
        let fieldset = document.createElement('fieldset'), legend = document.createElement('legend'), valueInput = document.createElement('input')
        legend.textContent = tower
        valueInput.value = 0
        fieldset.append(legend, getLabel('value: '), valueInput, document.createElement('br'))
        if (towerIndex !== 0) {
            fieldset.append(getLabel('production/second: 0'))
        }
        epochDivs[epochIndex].append(fieldset, document.createElement('br'))
    })
    let timeInput = getNumberInput(), timeSelect = document.createElement('select'), advanceButton = document.createElement('button'), resetButton = document.createElement('button')
    timeSelect.append(getOption(1, 'seconds'), getOption(60, 'minutes'), getOption(60 * 60, 'hours'), getOption(24 * 60 * 60, 'days'))
    advanceButton.textContent = 'Advance'
    advanceButton.onclick = () => {
        let levels = JSON.parse(localStorage.getItem('levels'))
        let multipliers = []
        for (let i = 0; i < epoch.length - 2; i++) {
            let speed, power, chance, bonus
            speed = intPow(2, levels[epochIndex][i])
            power = intPow(2, levels[epochIndex][epoch.length - 1] + levels[epochs.length][1] + levels[epochs.length][3])
            if (i === 0 && levels[epochIndex][epoch.length + 1] !== 0) {
                power *= 9 * intPow(2, levels[epochIndex][epoch.length + 1] - 1)
            }
            chance = 0.25 * levels[epochIndex][epoch.length] * levels[epochIndex][epoch.length] + 1.5 * levels[epochIndex][epoch.length] + 3.25 + 0.5 * levels[epochs.length][2] * levels[epochs.length][2] + 3.5 * levels[epochs.length][2] + 4 + 1
            bonus = intPow(4, levels[epochIndex][epoch.length - 2] + levels[epochs.length][0]) * 2
            multipliers[i] = (i + epochIndex + 3) * power * (chance / 100 * (bonus - 1) + 1) * speed / ((epochIndex + 2) * 2 ** i)
        }
        let seconds = timeInput.value * timeSelect.value
        let oldValues = Array.from(epochDivs[epochIndex].querySelectorAll('fieldset')).map(fieldset => deformat(fieldset.children[2].value))
        let index = null
        oldValues.forEach((value, valueIndex) => {
            if (value !== 0) {
                index = valueIndex
            }
        })
        if (index === null) {
            return
        }
        let newValues = new Array(oldValues.length).fill(0)
        for (let i = index; i >= 0; i--) {
            newValues[i] = oldValues[i]
            let multiplier = 1
            for (let j = i + 1; j <= index; j++) {
                multiplier *= multipliers[j - 1]
                newValues[i] += oldValues[j] * multiplier * intPow(seconds, j - i) / factorial(j - i)
            }
        }
        epochDivs[epochIndex].querySelectorAll('fieldset').forEach((fieldset, fieldsetIndex) => {
            fieldset.children[2].value = format(newValues[fieldsetIndex])
            if (fieldsetIndex !== 0) {
                fieldset.children[4].textContent = 'production/second: ' + format(newValues[fieldsetIndex] * multipliers[fieldsetIndex - 1])
            }
        })
    }
    resetButton.textContent = 'Reset'
    resetButton.onclick = () => {
        epochDivs[epochIndex].querySelectorAll('fieldset').forEach((fieldset, fieldsetIndex) => {
            fieldset.children[2].value = 0
            if (fieldsetIndex !== 0) {
                fieldset.children[4].textContent = 'production/second: 0'
            }
        })
    }
    epochDivs[epochIndex].append(timeInput, timeSelect, document.createElement('br'), advanceButton, resetButton)
    document.body.append(epochDivs[epochIndex])
})
epochDivs.push(document.createElement('div'))
epochDivs[epochs.length].style.display = 'none'
epochs.forEach(epoch => {
    let fieldset = document.createElement('fieldset'), legend = document.createElement('legend')
    legend.textContent = epoch[0]
    fieldset.append(legend)
    epoch.slice(2).forEach(tower => {
        fieldset.append(getLabel(tower + ' speed: '), getNumberInput(13), document.createElement('br'))
    })
    fieldset.append(getLabel(epoch[0] + ' bonus: '), getNumberInput(8), document.createElement('br'))
    fieldset.append(getLabel(epoch[0] + ' power: '), getNumberInput(11), document.createElement('br'))
    fieldset.append(getLabel(epoch[0] + ' chance: '), getNumberInput(11), document.createElement('br'))
    fieldset.append(getLabel(epoch[2] + ' power: '), getNumberInput(11), document.createElement('br'))
    epochDivs[epochs.length].append(fieldset, document.createElement('br'))
})
let fieldset = document.createElement('fieldset'), legend = document.createElement('legend')
legend.textContent = 'all'
fieldset.append(legend)
fieldset.append(getLabel('bonus: '), getNumberInput(5), document.createElement('br'))
fieldset.append(getLabel('power: '), getNumberInput(5), document.createElement('br'))
fieldset.append(getLabel('chance: '), getNumberInput(5), document.createElement('br'))
fieldset.append(getLabel('ad boost: '), getNumberInput(1), document.createElement('br'))
epochDivs[epochs.length].append(fieldset)
document.body.append(epochDivs[epochs.length])
epochDivs[epochs.length].querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
        saveLevels()
    })
})

loadEpoch()
loadLevels()

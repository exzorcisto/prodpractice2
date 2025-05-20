// Массив алфавита (английские буквы верхнего и нижнего регистра)
const alphabet = [
'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

// Отображение алфавита на странице
const alphabetDisplay = document.getElementById('alphabetDisplay');
alphabetDisplay.textContent = alphabet.join(' ');

// Получаем элементы DOM
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const operationsLog = document.getElementById('operationsLog');

// Функция ROT13 (и шифрование, и дешифрование)
function rot13(str, operation) {
let result = []; // Массив для хранения результата
let operations = []; // Массив для лога операций

// Перебираем каждый символ входной строки
for (let i = 0; i < str.length; i++) {
    const char = str[i]; // Текущий символ
    let found = false; // Флаг, найден ли символ в алфавите
    
    // Ищем символ в нашем алфавите
    for (let j = 0; j < alphabet.length; j++) {
        if (alphabet[j] === char) {
            found = true;
            let newIndex;
            
            // Обрабатываем заглавные буквы (первые 26 символов массива)
            if (j < 26) {
                newIndex = (j + 13) % 26; // Сдвиг на 13 позиций
                result.push(alphabet[newIndex]);
                operations.push(`${char} → ${alphabet[newIndex]} (Заглавная, позиция ${j} → ${newIndex})`);
            } 
            // Обрабатываем строчные буквы (последние 26 символов массива)
            else {
                newIndex = 26 + ((j - 26 + 13) % 26);
                result.push(alphabet[newIndex]);
                operations.push(`${char} → ${alphabet[newIndex]} (Строчная, позиция ${j} → ${newIndex})`);
            }
            break;
        }
    }
    
    // Если символ не найден в алфавите, добавляем как есть
    if (!found) {
        result.push(char);
        operations.push(`${char} → ${char} (Не буква)`);
    }
}

// Отображаем лог операций
operationsLog.innerHTML = operations.map(op => `<div>${op}</div>`).join('');

// Собираем итоговую строку без использования join
let finalResult = '';
for (let i = 0; i < result.length; i++) {
    finalResult += result[i];
}

return finalResult;
}

// Обработчики событий для кнопок
encryptBtn.addEventListener('click', function() {
const text = inputText.value;
outputText.textContent = rot13(text, 'encrypt');
});

decryptBtn.addEventListener('click', function() {
const text = inputText.value;
outputText.textContent = rot13(text, 'decrypt'); // ROT13 - самодвойственный шифр
});
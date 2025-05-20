// массив алфавита
const alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

function rot13(str) {
    let result = '';

    for (let i = 0; i < str.length; i++) {
        let char = str[i]; // текущий символ
        let found = false;

        for (let j = 0; j < alphabet.length; j++) {
            if (alphabet[j] === char) {
                let newIndex;
                // обрабатываем заглавные буквы
                if (j < 26) {
                    newIndex = (j + 13) % 26; // cдвиг на 13 позиций
                    result += alphabet[newIndex];
                } 
                // обрабатываем строчные буквы
                else if (j >= 26) {
                    newIndex = 26 + ((j - 26 + 13) % 26);
                    result += alphabet[newIndex];
                }
                found = true;
                break;
            }
        }
        
        // если символ не является буквой, то просто добавляем его в результат
        if (!found) {
            result += char;
        }
    }
    return result;
}

// Получаем элементы DOM
const encryptBtn = document.getElementById('encryptBtn');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');

// Обработчики событий для кнопок
encryptBtn.addEventListener('click', function() {
    const text = inputText.value;
    outputText.textContent = rot13(text);
});
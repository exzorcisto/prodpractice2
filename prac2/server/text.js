const TEXT_CONSTANTS = {
    PAGE_TITLE: "Шифрование/дешифрование ROT13",
    MAIN_HEADING: "Шифрование/дешифрование ROT13",
    INPUT_LABEL: "Исходный текст",
    OUTPUT_LABEL: "Результат",
    INPUT_PLACEHOLDER: "Введите текст здесь...",
    OUTPUT_PLACEHOLDER: "Введите текст здесь...",
    BUTTON_TEXT: "Преобразовать ROT13"
};

if (typeof document !== 'undefined') {
    document.getElementById("pageTitle").textContent = TEXT_CONSTANTS.PAGE_TITLE;
    document.getElementById("mainHeading").textContent = TEXT_CONSTANTS.MAIN_HEADING;
    document.getElementById("inputLabel").textContent = TEXT_CONSTANTS.INPUT_LABEL;
    document.getElementById("outputLabel").textContent = TEXT_CONSTANTS.OUTPUT_LABEL;
    document.getElementById("inputText").placeholder = TEXT_CONSTANTS.INPUT_PLACEHOLDER;
    document.getElementById("outputText").placeholder = TEXT_CONSTANTS.OUTPUT_PLACEHOLDER;
    document.getElementById("encryptBtn").textContent = TEXT_CONSTANTS.BUTTON_TEXT;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TEXT_CONSTANTS };
}
const form = document.getElementById("cypherForm");
const keyInput = document.getElementById("key");
const messageInput = document.getElementById("message");
const output = document.querySelector("#output span");

function caesarCipher(text, key) {
    let result = "";

    for (let char of text) {

        // Majuscules
        if (char >= "A" && char <= "Z") {
            let code = char.charCodeAt(0);
            let shifted = ((code - 65 + key) % 26) + 65;
            result += String.fromCharCode(shifted);
        }

        // Minuscules
        else if (char >= "a" && char <= "z") {
            let code = char.charCodeAt(0);
            let shifted = ((code - 97 + key) % 26) + 97;
            result += String.fromCharCode(shifted);
        }

        // Espaces et caractères spéciaux
        else {
            result += char;
        }
    }

    return result;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const key = parseInt(keyInput.value);
    const message = messageInput.value;

    output.textContent = caesarCipher(message, key);
});
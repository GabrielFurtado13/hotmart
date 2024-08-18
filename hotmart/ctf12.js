const WebSocket = require('ws');
const crypto = require('crypto');
const { decode } = require('punycode');

const ws = new WebSocket('wss://ctf-challenges.devops.hotmart.com/echo', {
    perMessageDeflate: false
});

ws.on('open', function open() {
    ws.send('start cryptomix');
});
var metodo
var sentenc
var chave
var decoded
ws.on('message', function message(data) {
    console.log('received: %s', data);
    var msg = data.toString()
    if (msg.includes("[+] Sentence: ")) {
        sentenc = msg.split("[+] Sentence: ")[1]
        sentenc = sentenc.replace(/\n/g, '')
    }
    if (msg.includes("[+] Method: ")) {
        metodo = msg.split(" ")[2]
        metodo = metodo.replace(/\n/g, '')


    }
    if (msg.includes("[+] Encoded: ")) {
        decoded = msg.split("[+] Encoded: ")[1]
        decoded = decoded.replace(/\n/g, '')
    }
    if (msg.includes("[+] Key: ")) {
        chave = msg.split(" ")[2]
        chave = chave.replace(/\n/g, '')
    }
    //console.log(metodo, movimentos, endecode)
    if (msg.includes('Resposta:')) {
        console.log(processMessage(metodo, sentenc, chave, decoded))
        ws.send(processMessage(metodo, sentenc, chave, decoded));

    }
})

function processMessage(method, sentence, chave, decoded) {
    if (method === 'md5' || method === 'sha1') {
        return generateHash(method, sentence);
    } else {
        return decodeString(decoded, metodo, chave)
    }


}
function generateHash(method, text) {
    let hash;
    if (method === 'md5') {
        hash = crypto.createHash('md5');
    } else if (method === 'sha1') {
        hash = crypto.createHash('sha1');
    } else {
        return 'Método não suportado';
    }
    hash.update(text);
    return hash.digest('hex');
}
function decodeString(encodedString, metodo, chave) {
    let decodedString;

    switch (metodo) {
        case 'base64':
            // Decodifica de base64
            decodedString = Buffer.from(encodedString, metodo).toString('utf-8');
            break;

        case 'hex':
            // Decodifica de hexadecimal
            decodedString = Buffer.from(encodedString, metodo).toString('utf-8');
            break;

        case 'binary':
            // Decodifica de binário
            decodedString = binaryToString(encodedString);
            break;

        case 'rot-13':
            // Decodifica Tota13 (assumindo que é um método específico)
            decodedString = rot13(encodedString);
            break;

        case 'single_byte_xor':
            // Decodifica com XOR de byte único
            if (chave === null) {
                throw new Error('Key must be provided for single_byte_xor format.');
            }
            decodedString = decodeSingleByteXor(encodedString, chave);
            break;

        default:
            throw new Error('Unknown format.');
    }

    return decodedString;
}
function decodeSingleByteXor(encodedString, key) {
    const decodedBytes = Buffer.from(encodedString, 'base64');
    const keyByte = Buffer.from([key]);
    const decodedBytesXor = decodedBytes.map(byte => byte ^ keyByte[0]);
    return Buffer.from(decodedBytesXor).toString('utf-8');
}

function tota13Decode(encodedString) {
    // Implementa a decodificação Tota13 se necessário
    // Placeholder para implementação específica
    return encodedString; // Substitua com lógica real
}

function rot13(str) {
    return str.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode(
            c.charCodeAt(0) + (c.toLowerCase() < 'n' ? 13 : -13)
        );
    });
}
function binaryToString(binary) {
    // Verifica se o comprimento da string binária é um múltiplo de 8
    

    // Divide a string binária em blocos de 8 bits
    const byteArray = binary.match(/.{7}/g);

    // Converte cada bloco de 8 bits para um caractere e junta em uma string
    return byteArray
        .map(byte => String.fromCharCode(parseInt(byte, 2)))
        .join('')}


console.log("acabou")
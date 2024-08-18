const WebSocket = require("ws");

// Conectar ao servidor WebSocket
const ws = new WebSocket('wss://ctf-challenges.devops.hotmart.com/echo', {
    perMessageDeflate: false
});

let flag = ""; // Variável para armazenar todos os caracteres

ws.on('open', function open() {
    ws.send('start spy');
});

ws.on('message', function message(data) {
    console.log('received: %s', data);
    let msg = data.toString();
    //messageStr.match(/\[\\] Sucesso: *\[(.?)\]/);
    //console.log("flag: ", msg.match(/\[\\] Sucesso! *\[(.?)\]/));
    let match = msg.match(/\[\*\] Sucesso! .*?\[(.)\]/);
    if (match) {
        let character = match[1]; // O caractere capturado está no grupo 1
        console.log("Caractere encontrado:", character);
        // Adicione o caractere à flag
        flag += character;
    } else {
        console.log("Nenhum caractere encontrado");
    }

    if (msg.includes('[*] Mapa:')) {
        msg = msg.split('[*] Mapa:')[1];
        let matriz = convertToMatrix(msg);
        let matrizVigiada = marcarPosicoes(matriz);
        console.log(matrizVigiada);

        const posLoid = findPosition(matrizVigiada, '🥷');
        const posTerminal = findPosition(matrizVigiada, '💻');

        if (!posLoid || !posTerminal) {
            ws.send('Espere!');
            console.log('Espere!');
            return;
        }

        const rota = encontrarRota(matrizVigiada, posLoid, posTerminal);
        console.log(rota);

        if (rota) {
            ws.send('Vai!');
            console.log('Vai!');
        } else {
            ws.send('Espere!');
            console.log('Espere!');
        }
    }
});

function convertToMatrix(input) {
    const rows = input.trim().split('\n');
    const matrix = [];

    for (let row of rows) {
        const tempRow = [];
        let i = 0;

        while (i < row.length) {
            const codePoint = row.codePointAt(i);
            const char = String.fromCodePoint(codePoint);
            tempRow.push(char);
            i += char.length;
        }

        matrix.push(tempRow);
    }

    return matrix;
}

function marcarPosicoes(matriz) {
    const numRows = matriz.length;
    const numCols = matriz[0].length;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const current = matriz[i][j];

            if (current === '^') {
                for (let k = i - 1; k >= 0; k--) {
                    if (matriz[k][j] === '🏠' || matriz[k][j] === '^' || matriz[k][j] === 'v' || matriz[k][j] === '<' || matriz[k][j] === '>') break;
                    matriz[k][j] = 'G';
                }
            }

            if (current === 'v') {
                for (let k = i + 1; k < numRows; k++) {
                    if (matriz[k][j] === '🏠' || matriz[k][j] === '^' || matriz[k][j] === 'v' || matriz[k][j] === '<' || matriz[k][j] === '>') break;
                    matriz[k][j] = 'G';
                }
            }

            if (current === '<') {
                for (let k = j - 1; k >= 0; k--) {
                    if (matriz[i][k] === '🏠' || matriz[i][k] === '^' || matriz[i][k] === 'v' || matriz[i][k] === '<' || matriz[i][k] === '>') break;
                    matriz[i][k] = 'G';
                }
            }

            if (current === '>') {
                for (let k = j + 1; k < numCols; k++) {
                    if (matriz[i][k] === '🏠' || matriz[i][k] === '^' || matriz[i][k] === 'v' || matriz[i][k] === '<' || matriz[i][k] === '>') break;
                    matriz[i][k] = 'G';
                }
            }
        }
    }

    return matriz;
}

function encontrarRota(matriz, inicio, destino) {
    const direcoes = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // direita, baixo, esquerda, cima
    const filas = [[inicio]]; // Filas de caminhos em andamento
    const visitado = new Set(); // Conjunto para verificar células visitadas
    const [inicioLinha, inicioColuna] = inicio;
    visitado.add(`${inicioLinha},${inicioColuna}`);

    while (filas.length > 0) {
        const caminhoAtual = filas.shift(); // Pega o caminho mais curto na fila
        const [linha, coluna] = caminhoAtual[caminhoAtual.length - 1]; // Pega a posição atual

        if (linha === destino[0] && coluna === destino[1]) {
            return caminhoAtual; // Retorna o caminho se o destino for alcançado
        }

        for (const [dL, dC] of direcoes) {
            const novaLinha = linha + dL;
            const novaColuna = coluna + dC;

            // Verifica se a nova posição está dentro dos limites da matriz e se não foi visitada
            if (novaLinha >= 0 && novaLinha < matriz.length &&
                novaColuna >= 0 && novaColuna < matriz[0].length &&
                !visitado.has(`${novaLinha},${novaColuna}`) &&
                matriz[novaLinha][novaColuna] !== '🏠' &&
                matriz[novaLinha][novaColuna] !== '^' &&
                matriz[novaLinha][novaColuna] !== 'v' &&
                matriz[novaLinha][novaColuna] !== '<' &&
                matriz[novaLinha][novaColuna] !== '>' &&
                matriz[novaLinha][novaColuna] !== 'G') {
                visitado.add(`${novaLinha},${novaColuna}`);
                filas.push([...caminhoAtual, [novaLinha, novaColuna]]);
            }
        }
    }

    return null; // Retorna null se não encontrar nenhum caminho
}

function findPosition(matriz, simbolo) {
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] === simbolo) {
                return [i, j];
            }
        }
    }
    return null;
}

// Escutar evento de fechamento do WebSocket para mostrar a flag final
ws.on('close', function close() {
    console.log("acabou, toma a flag:", flag);
});

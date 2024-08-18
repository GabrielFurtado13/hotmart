import asyncio
import websockets

def is_palindrome(s):
    return s == s[::-1]

def find_palindromes(s):
    palindromes = set()
    n = len(s)
    for i in range(n):
        for j in range(i + 1, n + 1):
            substring = s[i:j]
            if is_palindrome(substring):
                palindromes.add(substring)
    return sorted(palindromes, key=len, reverse=True)

async def process_message(message):
    prefix = "Word: "
    if prefix in message:
        start_index = message.index(prefix) + len(prefix)
        word = message[start_index:].strip().split()[0]
        palindromes = find_palindromes(word)
        
        if len(palindromes) == 0:
            return "Sem palindromo"
        elif len(palindromes) == 1:
            if len(palindromes[0]) == 1:
                return "Sem palindromo"
            elif palindromes[0] == word:
                return word
            else:
                return palindromes[0]
        else:
            longest_palindrome = palindromes[0]
            if len(longest_palindrome) == 1:
                return "Sem palindromo"
            return longest_palindrome
    return ""

async def connect_and_run():
    uri = "wss://ctf-challenges.devops.hotmart.com/echo"
    
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                # Enviar comando para iniciar o desafio
                await websocket.send("start palindromo")
                print("Comando 'start palindromo' enviado")

                while True:
                    message = await websocket.recv()
                    print(f"Mensagem recebida: {message}")  # Log para depuração
                    result = await process_message(message)
                    if result:
                        await websocket.send(result)
                        print(f"Resposta enviada: {result}")
                    else:
                        print("Nenhuma mensagem para enviar")
        except websockets.exceptions.ConnectionClosedOK:
            print("Conexão fechada pelo servidor. Tentando reconectar...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"Erro na conexão WebSocket: {e}")
            await asyncio.sleep(5)

asyncio.run(connect_and_run())

import asyncio
import websockets
import re

def kadane_algorithm(array):
    max_atual = array[0]
    max_global = array[0]
    
    for i in range(1, len(array)):
        max_atual = max(array[i], max_atual + array[i])
        if max_atual > max_global:
            max_global = max_atual
    
    return max_global

async def process_message(message):
    array_match = re.search(r"Array:\s*\[([-0-9,\s]+)\]", message)
    
    if array_match:
        array_str = array_match.group(1)
        array = list(map(int, array_str.split(',')))
        max_sum = kadane_algorithm(array)
        return str(max_sum)
    return None

async def connect_and_run():
    uri = "wss://ctf-challenges.devops.hotmart.com/echo"
    
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                await websocket.send("start lost_treasure")
                print("Comando 'start lost_treasure' enviado")

                while True:
                    message = await websocket.recv()
                    print(f"Mensagem recebida: {message}") 
                    
                    result = await process_message(message)
                    if result:
                        await websocket.send(result)
                        print(f"{result}")
        except websockets.exceptions.ConnectionClosedOK:
            print("Conexão fechada pelo servidor. Tentando reconectar...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"Erro na conexão WebSocket: {e}")
            await asyncio.sleep(5)

asyncio.run(connect_and_run())

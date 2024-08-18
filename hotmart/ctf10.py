import asyncio
import websockets
import re

def solve_hanoi(num_disks, source, auxiliary, target):
    if num_disks == 1:
        return [(source, target)]
    else:
        return (
            solve_hanoi(num_disks - 1, source, target, auxiliary) +
            [(source, target)] +
            solve_hanoi(num_disks - 1, auxiliary, source, target)
        )

async def process_message(message):
    princes_match = re.search(r"Príncipes:\s*\[(\d+)\]", message)
    
    if princes_match:
        num_disks = int(princes_match.group(1))
        movements = solve_hanoi(num_disks, 'A', 'B', 'C')
        return str(movements)
    return None

async def connect_and_run():
    uri = "wss://ctf-challenges.devops.hotmart.com/echo"
    
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                await websocket.send("start towerofhanoi")
                print("Comando 'start towerofhanoi' enviado")

                while True:
                    message = await websocket.recv()
                    print(f"Mensagem recebida: {message}") 
                    
                    result = await process_message(message)
                    if result:
                        await websocket.send(result)
                        print(f"Resposta enviada: {result}")
        except websockets.exceptions.ConnectionClosedOK:
            print("Conexão fechada pelo servidor. Tentando reconectar...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"Erro na conexão WebSocket: {e}")
            await asyncio.sleep(5)

asyncio.run(connect_and_run())

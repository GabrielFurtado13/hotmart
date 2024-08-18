import heapq

def dijkstra(ruas, ponto_inicial, ponto_final):
    grafo = {}
    for u, v, peso in ruas:
        if u not in grafo:
            grafo[u] = []
        if v not in grafo:
            grafo[v] = []
        grafo[u].append((peso, v))
        grafo[v].append((peso, u))
    
    distancias = {ponto: float('infinity') for ponto in grafo}
    distancias[ponto_inicial] = 0
    
    fila_prioridade = [(0, ponto_inicial)]
    heapq.heapify(fila_prioridade)
    
    while fila_prioridade:
        dist_atual, ponto_atual = heapq.heappop(fila_prioridade)
        
        if ponto_atual == ponto_final:
            return dist_atual
        
        if dist_atual > distancias[ponto_atual]:
            continue
        
        for peso, vizinho in grafo[ponto_atual]:
            distancia = dist_atual + peso
            if distancia < distancias[vizinho]:
                distancias[vizinho] = distancia
                heapq.heappush(fila_prioridade, (distancia, vizinho))
    
    return float('infinity')

ruas = [('T', 'L', 20), ('X', 'T', 18), ('L', 'J', 8), ('J', 'X', 6), ('N', 'Y', 12), ('Y', 'T', 1), ('Y', 'G', 16), ('N', 'Y', 5), ('G', 'T', 13), ('T', 'X', 2), ('X', 'T', 4), ('J', 'G', 18), ('X', 'J', 16), ('Y', 'G', 11)]
ponto_inicial = 'X'
ponto_final = 'Y'

distancia_minima = dijkstra(ruas, ponto_inicial, ponto_final)
print(distancia_minima)

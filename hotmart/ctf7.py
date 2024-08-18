from itertools import combinations

herois = [988, 13, 275, 48, 766, 877, 383, 788, 364, 892, 738, 123, 131, 267, 694, 446, 920, 34, 567]
habilidade_necessaria = 1197

resultado = None
for trio in combinations(enumerate(herois), 3):
    indices, habilidades = zip(*trio)
    if sum(habilidades) == habilidade_necessaria:
        resultado = list(indices)
        break

print(f"IDs dos heróis: {resultado}")

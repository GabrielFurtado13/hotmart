def reorganizar_lista(lista):
    pares = [x for x in lista if x % 2 == 0]
    impares = [x for x in lista if x % 2 != 0]
    return pares + impares

lista =  [-9, -90, -20]
nova_lista = reorganizar_lista(lista)

print("Nova lista reorganizada:", nova_lista)

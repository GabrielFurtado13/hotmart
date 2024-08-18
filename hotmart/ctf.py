def find_pair_with_sum(array, alvo):
    num_dict = {}
    for num in array:
        complemento = alvo - num
        if complemento in num_dict:
            return [complemento, num]
        num_dict[num] = True
    return []

array = [42, 93, 61, 58, 25, 36, 7, 78, 71, 98, 91, 37, 29, 28, 92, 48, 74, 46, 44, 85, 17, 45, 43, 20, 51, 83, 3, 27, 33, 55, 87, 13, 90, 82, 11, 39, 76, 65]
alvo = 93

resultado = find_pair_with_sum(array, alvo)
print(resultado)
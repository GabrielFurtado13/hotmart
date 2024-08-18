def merge_and_count(arr, temp_arr, esquerda, meio, direita):
    i = esquerda 
    j = meio + 1 
    k = esquerda
    inv_count = 0

    while i <= meio and j <= direita:
        if arr[i] <= arr[j]:
            temp_arr[k] = arr[i]
            i += 1
        else:
            temp_arr[k] = arr[j]
            inv_count += (meio - i + 1)
            j += 1
        k += 1

    while i <= meio:
        temp_arr[k] = arr[i]
        i += 1
        k += 1
  
    while j <= direita:
        temp_arr[k] = arr[j]
        j += 1
        k += 1

    for i in range(esquerda, direita + 1):
        arr[i] = temp_arr[i]
          
    return inv_count
  
def merge_sort_and_count(arr, temp_arr, esquerda, direita):
    inv_count = 0
    if esquerda < direita:
        meio = (esquerda + direita) // 2
  
        inv_count += merge_sort_and_count(arr, temp_arr, esquerda, meio)
        inv_count += merge_sort_and_count(arr, temp_arr, meio + 1, direita)
        inv_count += merge_and_count(arr, temp_arr, esquerda, meio, direita)
  
    return inv_count

array = [43, 27, 62, 75, 78]
n = len(array)
temp_arr = [0] * n

inversion_count = merge_sort_and_count(array, temp_arr, 0, n - 1)
print(inversion_count)
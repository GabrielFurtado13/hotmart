def is_happy_number(n):
    def get_next_number(num):
        return sum(int(digit) ** 2 for digit in str(num))
    
    seen_numbers = set()
    
    while n != 1 and n not in seen_numbers:
        seen_numbers.add(n)
        n = get_next_number(n)
    
    return n == 1

number = 3513

if is_happy_number(number):
    print("Feliz")
else:
    print("Infeliz")
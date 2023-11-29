import pdb
 
 
def addition(a, b):
    answer = a * b
    return answer
 
 
pdb.set_trace()
x = input("Enter first number : ")
y = input("Enter second number : ")
sum = addition(x, y)
print(sum)
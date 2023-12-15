# import psycopg as psy
from abc import ABC, abstractmethod

class shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

class square(shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side * self.side

    def perimeter(self):
        return 4 * self.side

class circle(shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3 * self.radius * self.radius

    def perimeter(self):
        return 2 * 3 * self.radius


s = square(5)
print(s.area())
print(s.perimeter())
c = circle(5)
print(c.area())
print(c.perimeter())

# with psy.connect("dbname=test user=postgres") as conn:
#     with conn.cursor() as cur:
#         cur.execute("""
#             CREATE TABLE IF NOT EXISTS test (
#                 id serial PRIMARY KEY,
#                 num integer,)
#             """)
#         cur.execute(
#             "INSERT INTO test (num,data) VALUES (%s, %s)",
#             (100, "abc'def"))
#         cur.execute("SELECT * FROM test")
#         cur.fetchone()
#         for r in cur:
#             print(r)
#         conn.commit()
#         conn.close()

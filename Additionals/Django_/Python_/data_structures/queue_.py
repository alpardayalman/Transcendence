class Deque:
  def __init__(self):
    self.elements = []
  def add_first(self, item):
    self.elements.append(item)
  def add_last(self, item):
    self.elements.insert(0, item)
  def remove_first(self):
    return self.elements.pop()
  def remove_last(self):
    return self.elements.pop(0)
  def is_empty(self):
    return (len(self.elements) is 0)
  def size(self):
    return len(self.elements)
  def peek_first(self):
    return self.elements[-1]
  def peek_last(self):
    return self.elements[0]
  def display_deque(self):
    print('\t | \t'.join(str(item) for item in self.elements))

# easy queue

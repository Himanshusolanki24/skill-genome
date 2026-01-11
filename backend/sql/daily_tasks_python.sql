-- Python Daily Tasks Questions

-- BEGINNER (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('Python', 'beginner', 'Print "Hello, World!" to the console.', 'Use print() function', 10),
('Python', 'beginner', 'Create a variable and print its type.', 'Use type() function', 10),
('Python', 'beginner', 'Write a function that adds two numbers.', 'Use def function_name(a, b): return a + b', 10),
('Python', 'beginner', 'Create a list and print its length.', 'Use len() function', 10),
('Python', 'beginner', 'Write a for loop that prints numbers 1 to 10.', 'Use range(1, 11)', 10),
('Python', 'beginner', 'Create a dictionary with name and age keys.', 'Use {key: value} syntax', 10),
('Python', 'beginner', 'Write an if-else to check if a number is even.', 'Use modulo operator %', 10),
('Python', 'beginner', 'Take user input and print it.', 'Use input() function', 10),
('Python', 'beginner', 'Create a string and convert it to uppercase.', 'Use .upper() method', 10),
('Python', 'beginner', 'Write a function with a default parameter.', 'Use def func(param=default):', 10);

-- INTERMEDIATE (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('Python', 'intermediate', 'Use list comprehension to create squares of numbers.', '[x**2 for x in range(10)]', 20),
('Python', 'intermediate', 'Write a function using *args and **kwargs.', 'Args is tuple, kwargs is dictionary', 20),
('Python', 'intermediate', 'Create a class with constructor and methods.', 'Use __init__ for constructor', 20),
('Python', 'intermediate', 'Read and write to a JSON file.', 'Use json.load() and json.dump()', 20),
('Python', 'intermediate', 'Implement error handling with try-except.', 'Catch specific exceptions', 20),
('Python', 'intermediate', 'Use lambda functions with map and filter.', 'lambda x: expression', 20),
('Python', 'intermediate', 'Create a decorator function.', 'Function that wraps another function', 20),
('Python', 'intermediate', 'Work with regular expressions using re module.', 'Use re.match(), re.search(), re.findall()', 20),
('Python', 'intermediate', 'Create a generator function using yield.', 'Yield pauses and returns value', 20),
('Python', 'intermediate', 'Use context managers with the with statement.', 'with open() as f:', 20);

-- ADVANCED (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('Python', 'advanced', 'Implement a class with magic methods (__str__, __repr__).', 'Magic methods customize behavior', 30),
('Python', 'advanced', 'Create an async function using asyncio.', 'Use async def and await', 30),
('Python', 'advanced', 'Implement a metaclass for class creation.', 'Class of a class, use type()', 30),
('Python', 'advanced', 'Create a thread-safe singleton pattern.', 'Use threading.Lock for safety', 30),
('Python', 'advanced', 'Implement a custom context manager class.', 'Define __enter__ and __exit__', 30),
('Python', 'advanced', 'Write a coroutine for concurrent tasks.', 'Use asyncio.gather() for concurrency', 30),
('Python', 'advanced', 'Create a property with getter and setter.', 'Use @property and @name.setter', 30),
('Python', 'advanced', 'Implement memoization using functools.', 'Use @functools.lru_cache', 30),
('Python', 'advanced', 'Create a dataclass with validation.', 'Use @dataclass and __post_init__', 30),
('Python', 'advanced', 'Implement the observer pattern.', 'Subjects notify observers of changes', 30);

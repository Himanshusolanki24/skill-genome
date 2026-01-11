-- JavaScript Daily Tasks Questions

-- BEGINNER (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('JavaScript', 'beginner', 'Write a function that takes two numbers and returns their sum.', 'Use the + operator to add numbers', 10),
('JavaScript', 'beginner', 'Create a variable that stores your name and log it to the console.', 'Use let or const to declare variables', 10),
('JavaScript', 'beginner', 'Write a function that checks if a number is even or odd.', 'Use the modulo operator % to check divisibility', 10),
('JavaScript', 'beginner', 'Create an array of 5 fruits and log the first and last element.', 'Arrays are zero-indexed, use [0] and [length-1]', 10),
('JavaScript', 'beginner', 'Write a for loop that prints numbers from 1 to 10.', 'Use for(let i=1; i<=10; i++)', 10),
('JavaScript', 'beginner', 'Create an object representing a person with name, age, and city properties.', 'Use curly braces {} to create objects', 10),
('JavaScript', 'beginner', 'Write a function that converts Celsius to Fahrenheit.', 'Formula: F = (C × 9/5) + 32', 10),
('JavaScript', 'beginner', 'Use an if-else statement to check if a person is an adult (age >= 18).', 'Compare the age variable with 18', 10),
('JavaScript', 'beginner', 'Create a function that returns the length of a string.', 'Use the .length property of strings', 10),
('JavaScript', 'beginner', 'Write code to concatenate two strings with a space between them.', 'Use + operator or template literals', 10);

-- INTERMEDIATE (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('JavaScript', 'intermediate', 'Write a function that removes duplicates from an array.', 'Use Set or filter with indexOf', 20),
('JavaScript', 'intermediate', 'Create a function that reverses a string without using built-in reverse.', 'Use a loop or split, reverse, join', 20),
('JavaScript', 'intermediate', 'Implement a function that finds the maximum value in an array.', 'Use Math.max with spread or reduce', 20),
('JavaScript', 'intermediate', 'Write a function that counts the occurrences of each character in a string.', 'Use an object to store counts', 20),
('JavaScript', 'intermediate', 'Create a function that flattens a nested array one level deep.', 'Use concat with spread or flat(1)', 20),
('JavaScript', 'intermediate', 'Implement a debounce function that delays function execution.', 'Use setTimeout and clearTimeout', 20),
('JavaScript', 'intermediate', 'Write a function that checks if a string is a palindrome.', 'Compare string with its reverse', 20),
('JavaScript', 'intermediate', 'Create a function that groups array elements by a property.', 'Use reduce to build grouped object', 20),
('JavaScript', 'intermediate', 'Implement a function that deep clones an object.', 'Use JSON.parse(JSON.stringify()) or recursion', 20),
('JavaScript', 'intermediate', 'Write a function that sorts an array of objects by a specific key.', 'Use sort() with a compare function', 20);

-- ADVANCED (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('JavaScript', 'advanced', 'Implement a Promise.all from scratch.', 'Track resolved promises count and reject on first error', 30),
('JavaScript', 'advanced', 'Create a memoization function for expensive computations.', 'Use a cache object with function arguments as key', 30),
('JavaScript', 'advanced', 'Implement a simple event emitter with on, off, and emit methods.', 'Use an object to store event listeners', 30),
('JavaScript', 'advanced', 'Write a function that performs deep comparison of two objects.', 'Recursively compare all nested properties', 30),
('JavaScript', 'advanced', 'Implement a throttle function that limits function calls.', 'Track last execution time', 30),
('JavaScript', 'advanced', 'Create a function that curries any function with any number of arguments.', 'Return functions until all arguments collected', 30),
('JavaScript', 'advanced', 'Implement a simple Observable pattern.', 'Create subscribe, unsubscribe, and notify methods', 30),
('JavaScript', 'advanced', 'Write an async function that retries failed API calls with exponential backoff.', 'Double wait time after each failure', 30),
('JavaScript', 'advanced', 'Implement a Least Recently Used (LRU) cache.', 'Use Map to maintain insertion order', 30),
('JavaScript', 'advanced', 'Create a function that implements the pipe/compose pattern.', 'Chain functions using reduce', 30);

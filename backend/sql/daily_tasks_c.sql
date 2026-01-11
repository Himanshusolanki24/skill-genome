-- C Programming Daily Tasks Questions

-- BEGINNER (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('C', 'beginner', 'Write a program that prints "Hello, World!" to the console.', 'Use printf() from stdio.h', 10),
('C', 'beginner', 'Declare an integer variable and print its value.', 'Use int and printf with %d', 10),
('C', 'beginner', 'Write a program that adds two numbers entered by user.', 'Use scanf() to read input', 10),
('C', 'beginner', 'Create a program that checks if a number is positive or negative.', 'Use if-else statement', 10),
('C', 'beginner', 'Write a for loop that prints numbers 1 to 10.', 'Use for(int i=1; i<=10; i++)', 10),
('C', 'beginner', 'Create an array of 5 integers and print all elements.', 'Use int arr[5] and loop to print', 10),
('C', 'beginner', 'Write a function that returns the square of a number.', 'Use return num * num', 10),
('C', 'beginner', 'Create a program using a while loop to sum numbers.', 'Initialize sum, loop while condition', 10),
('C', 'beginner', 'Write a program that finds the largest of three numbers.', 'Use nested if-else or logical operators', 10),
('C', 'beginner', 'Create a program that calculates factorial using a loop.', 'Multiply 1*2*3*...*n', 10);

-- INTERMEDIATE (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('C', 'intermediate', 'Write a program using pointers to swap two numbers.', 'Pass addresses and dereference with *', 20),
('C', 'intermediate', 'Create a function that reverses a string in place.', 'Swap characters from both ends', 20),
('C', 'intermediate', 'Implement a structure for a student with name and grade.', 'Use struct keyword', 20),
('C', 'intermediate', 'Write a program that dynamically allocates an array.', 'Use malloc() and free()', 20),
('C', 'intermediate', 'Create a recursive function to calculate Fibonacci.', 'fib(n) = fib(n-1) + fib(n-2)', 20),
('C', 'intermediate', 'Implement a simple bubble sort algorithm.', 'Compare and swap adjacent elements', 20),
('C', 'intermediate', 'Write a program that reads and writes to a file.', 'Use fopen, fprintf, fscanf, fclose', 20),
('C', 'intermediate', 'Create a function that counts words in a string.', 'Count space-separated tokens', 20),
('C', 'intermediate', 'Implement a linear search algorithm.', 'Loop through array comparing each element', 20),
('C', 'intermediate', 'Write a program using command line arguments.', 'Use argc and argv in main()', 20);

-- ADVANCED (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('C', 'advanced', 'Implement a linked list with insert and delete operations.', 'Use struct for node with data and next pointer', 30),
('C', 'advanced', 'Create a binary search tree with insertion.', 'Recursively insert based on comparison', 30),
('C', 'advanced', 'Implement a stack using an array with push/pop.', 'Track top index for operations', 30),
('C', 'advanced', 'Write a program using function pointers.', 'Declare as return_type (*name)(params)', 30),
('C', 'advanced', 'Implement a hash table with chaining.', 'Use array of linked lists for collisions', 30),
('C', 'advanced', 'Create a program that handles signals.', 'Use signal() to register handlers', 30),
('C', 'advanced', 'Implement a memory pool allocator.', 'Pre-allocate block, manage free list', 30),
('C', 'advanced', 'Write a multi-threaded program using pthreads.', 'Use pthread_create and pthread_join', 30),
('C', 'advanced', 'Implement quicksort algorithm.', 'Partition around pivot recursively', 30),
('C', 'advanced', 'Create a simple shell that executes commands.', 'Use fork(), exec(), and waitpid()', 30);

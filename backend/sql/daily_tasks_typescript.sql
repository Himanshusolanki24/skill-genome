-- TypeScript Daily Tasks Questions

-- BEGINNER (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('TypeScript', 'beginner', 'Create a variable with explicit type annotation for a string.', 'Use let name: string = "value"', 10),
('TypeScript', 'beginner', 'Write a function that takes a number parameter and returns a number.', 'Use function name(param: number): number', 10),
('TypeScript', 'beginner', 'Create an interface for a User with name and age properties.', 'Use interface keyword with property types', 10),
('TypeScript', 'beginner', 'Define an array type that only contains numbers.', 'Use number[] or Array<number>', 10),
('TypeScript', 'beginner', 'Create a type alias for a string or number union type.', 'Use type Alias = string | number', 10),
('TypeScript', 'beginner', 'Write a function with an optional parameter.', 'Use ? after parameter name: param?: type', 10),
('TypeScript', 'beginner', 'Create an object that implements an interface.', 'Object must have all required interface properties', 10),
('TypeScript', 'beginner', 'Define a tuple type for [string, number].', 'Use [string, number] as the type', 10),
('TypeScript', 'beginner', 'Create an enum for days of the week.', 'Use enum DayOfWeek { Monday, Tuesday, ... }', 10),
('TypeScript', 'beginner', 'Write a function with a default parameter value.', 'Use param: type = defaultValue', 10);

-- INTERMEDIATE (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('TypeScript', 'intermediate', 'Create a generic function that works with any array type.', 'Use <T> to define generic type parameter', 20),
('TypeScript', 'intermediate', 'Write an interface that extends another interface.', 'Use interface Child extends Parent', 20),
('TypeScript', 'intermediate', 'Create a type guard function using is keyword.', 'Use param is Type as return type', 20),
('TypeScript', 'intermediate', 'Define a mapped type that makes all properties optional.', 'Use { [K in keyof T]?: T[K] }', 20),
('TypeScript', 'intermediate', 'Create a class with private and public members.', 'Use private and public access modifiers', 20),
('TypeScript', 'intermediate', 'Write a function using function overloading.', 'Define multiple function signatures', 20),
('TypeScript', 'intermediate', 'Create a discriminated union type.', 'Use a common literal type property for discrimination', 20),
('TypeScript', 'intermediate', 'Implement a generic interface with constraints.', 'Use <T extends SomeType>', 20),
('TypeScript', 'intermediate', 'Create a readonly array and object type.', 'Use readonly keyword or Readonly<T>', 20),
('TypeScript', 'intermediate', 'Write a type that extracts keys of a specific value type from an object.', 'Use conditional types with keyof', 20);

-- ADVANCED (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('TypeScript', 'advanced', 'Implement a DeepReadonly type that recursively makes properties readonly.', 'Use conditional and mapped types recursively', 30),
('TypeScript', 'advanced', 'Create a type-safe event emitter using generics.', 'Map event names to their payload types', 30),
('TypeScript', 'advanced', 'Implement template literal types for route parsing.', 'Use template literal type inference', 30),
('TypeScript', 'advanced', 'Create a Promisify type that converts callback functions to promises.', 'Extract callback parameters and create Promise return', 30),
('TypeScript', 'advanced', 'Write a type that flattens nested object types.', 'Use recursive conditional types', 30),
('TypeScript', 'advanced', 'Implement a type-safe builder pattern.', 'Chain methods that update type state', 30),
('TypeScript', 'advanced', 'Create conditional types that infer function return types.', 'Use infer keyword in conditional types', 30),
('TypeScript', 'advanced', 'Implement a Pick type from scratch without using built-in.', 'Use mapped types with key filtering', 30),
('TypeScript', 'advanced', 'Create a type for deep partial objects.', 'Recursively apply Partial to nested objects', 30),
('TypeScript', 'advanced', 'Implement variadic tuple types for a zip function.', 'Use spread in tuple types', 30);

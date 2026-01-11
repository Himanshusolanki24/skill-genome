-- Question Bank Table
-- Run this in Supabase SQL Editor

-- Create the question_bank table
CREATE TABLE IF NOT EXISTS question_bank (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
    category VARCHAR(50) DEFAULT 'technical', -- technical, conceptual, practical
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast skill lookups
CREATE INDEX IF NOT EXISTS idx_question_bank_skill ON question_bank(skill);

-- Insert JavaScript questions
INSERT INTO question_bank (skill, question, difficulty) VALUES
('JavaScript', 'Explain the difference between let, const, and var in JavaScript. When would you use each?', 'easy'),
('JavaScript', 'What is the event loop in JavaScript and how does it handle asynchronous operations?', 'medium'),
('JavaScript', 'Describe closures in JavaScript with a practical example of where you would use them.', 'medium'),
('JavaScript', 'What is the difference between == and === in JavaScript?', 'easy'),
('JavaScript', 'Explain prototypal inheritance in JavaScript. How does it differ from classical inheritance?', 'hard'),
('JavaScript', 'What are Promises and how do they differ from callbacks? Explain async/await.', 'medium');

-- Insert TypeScript questions
INSERT INTO question_bank (skill, question, difficulty) VALUES
('TypeScript', 'What are the main benefits of using TypeScript over JavaScript?', 'easy'),
('TypeScript', 'Explain the difference between interface and type in TypeScript.', 'medium'),
('TypeScript', 'What are generics in TypeScript and when would you use them?', 'medium'),
('TypeScript', 'How do you handle null and undefined in TypeScript? Explain optional chaining.', 'easy');

-- Insert React questions
INSERT INTO question_bank (skill, question, difficulty) VALUES
('React', 'Explain the difference between functional and class components in React.', 'easy'),
('React', 'What is the useEffect hook and how does its cleanup function work?', 'medium'),
('React', 'Explain the concept of lifting state up in React. When would you do this?', 'medium'),
('React', 'What is React Context and when would you use it over props?', 'medium'),
('React', 'How does React Virtual DOM work and why is it beneficial for performance?', 'hard');

-- Insert Python questions
INSERT INTO question_bank (skill, question, difficulty) VALUES
('Python', 'What is the difference between a list and a tuple in Python?', 'easy'),
('Python', 'Explain list comprehensions in Python with an example.', 'easy'),
('Python', 'What are decorators in Python and how do they work?', 'medium'),
('Python', 'Explain the GIL (Global Interpreter Lock) in Python and its implications.', 'hard'),
('Python', 'What is the difference between *args and **kwargs?', 'medium');

-- Insert Node.js questions
INSERT INTO question_bank (skill, question, difficulty) VALUES
('Node.js', 'Explain the Node.js event loop and how it handles non-blocking I/O.', 'medium'),
('Node.js', 'What is the difference between require and import in Node.js?', 'easy'),
('Node.js', 'How do you handle errors in Node.js async code?', 'medium'),
('Node.js', 'What are streams in Node.js and when would you use them?', 'hard');

-- Insert CSS questions
INSERT INTO question_bank (skill, question, difficulty) VALUES
('CSS', 'Explain the CSS box model and how padding, margin, and border work together.', 'easy'),
('CSS', 'What is the difference between Flexbox and Grid? When would you use each?', 'medium'),
('CSS', 'Explain CSS specificity and how conflicts are resolved.', 'medium'),
('CSS', 'What are CSS custom properties (variables) and how do they work?', 'easy');

-- Insert HTML questions
INSERT INTO question_bank (skill, question, difficulty) VALUES
('HTML', 'What is semantic HTML and why is it important for accessibility?', 'easy'),
('HTML', 'Explain the difference between block and inline elements in HTML.', 'easy'),
('HTML', 'What are data attributes in HTML and how are they used?', 'medium');

-- Insert SQL questions
INSERT INTO question_bank (skill, question, difficulty) VALUES
('SQL', 'What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN?', 'medium'),
('SQL', 'Explain database normalization and the first three normal forms.', 'medium'),
('SQL', 'What are indexes in databases and when should you use them?', 'medium'),
('SQL', 'What is the difference between WHERE and HAVING clauses?', 'easy');

-- Insert Git questions
INSERT INTO question_bank (skill, question, difficulty) VALUES
('Git', 'What is the difference between git merge and git rebase?', 'medium'),
('Git', 'How do you resolve a merge conflict in Git?', 'medium'),
('Git', 'Explain git cherry-pick and when you would use it.', 'hard');

-- Insert API/REST questions
INSERT INTO question_bank (skill, question, difficulty) VALUES
('REST', 'What are the main HTTP methods and when would you use each?', 'easy'),
('REST', 'Explain the difference between REST and GraphQL APIs.', 'medium'),
('REST', 'What is CORS and how do you handle it?', 'medium');

-- Insert Docker questions
INSERT INTO question_bank (skill, question, difficulty) VALUES
('Docker', 'What is the difference between a Docker image and a container?', 'easy'),
('Docker', 'Explain Docker Compose and when you would use it.', 'medium'),
('Docker', 'What are Docker volumes and why are they important?', 'medium');

-- Insert generic programming questions (fallback)
INSERT INTO question_bank (skill, question, difficulty) VALUES
('General', 'Explain the difference between authentication and authorization.', 'easy'),
('General', 'What is Big O notation? Give examples of O(1), O(n), and O(n²).', 'medium'),
('General', 'Explain the SOLID principles in software development.', 'hard'),
('General', 'What is the difference between a stack and a queue data structure?', 'easy'),
('General', 'Explain the concept of recursion with an example.', 'medium'),
('General', 'What is caching and when would you use it?', 'medium');

-- Enable Row Level Security (optional - for public read access)
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;

-- Allow public read access to questions
CREATE POLICY "Questions are publicly readable" ON question_bank
    FOR SELECT USING (true);

-- Success message
SELECT 'Question bank created successfully with ' || COUNT(*) || ' questions!' as message FROM question_bank;

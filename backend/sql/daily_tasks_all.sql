-- Master file to run all daily tasks SQL files
-- Run this file to create the table and insert all questions

-- First create the table
\i daily_tasks.sql

-- Then insert all questions
\i daily_tasks_javascript.sql
\i daily_tasks_typescript.sql
\i daily_tasks_html.sql
\i daily_tasks_css.sql
\i daily_tasks_react.sql
\i daily_tasks_c.sql
\i daily_tasks_python.sql

-- Verify the data
SELECT technology, difficulty, COUNT(*) as question_count 
FROM daily_tasks 
GROUP BY technology, difficulty 
ORDER BY technology, difficulty;

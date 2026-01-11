-- React Daily Tasks Questions

-- BEGINNER (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('React', 'beginner', 'Create a functional component that displays "Hello World".', 'Use function ComponentName() { return <div>...</div> }', 10),
('React', 'beginner', 'Pass a prop to a child component and display it.', 'Define props in function parameter, access with props.name', 10),
('React', 'beginner', 'Create a component with a click handler that shows an alert.', 'Use onClick={handleClick} in JSX', 10),
('React', 'beginner', 'Use useState to create a counter with increment button.', 'const [count, setCount] = useState(0)', 10),
('React', 'beginner', 'Render a list of items using map().', 'Use array.map() inside JSX with key prop', 10),
('React', 'beginner', 'Create a component that conditionally renders content.', 'Use ternary operator or && in JSX', 10),
('React', 'beginner', 'Style a component using inline styles.', 'Use style={{ property: value }}', 10),
('React', 'beginner', 'Create an input field that updates state on change.', 'Use onChange with e.target.value', 10),
('React', 'beginner', 'Import and use an external CSS file.', 'Use import "./styles.css"', 10),
('React', 'beginner', 'Create a component that receives and renders children.', 'Use props.children to render nested content', 10);

-- INTERMEDIATE (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('React', 'intermediate', 'Use useEffect to fetch data on component mount.', 'Pass empty dependency array [] for mount only', 20),
('React', 'intermediate', 'Create a controlled form with multiple inputs.', 'Store form state in single object with useState', 20),
('React', 'intermediate', 'Implement a custom hook for form handling.', 'Extract form logic into useForm hook', 20),
('React', 'intermediate', 'Use React.memo to prevent unnecessary re-renders.', 'Wrap component in React.memo()', 20),
('React', 'intermediate', 'Create a context for theme management.', 'Use createContext, Provider, and useContext', 20),
('React', 'intermediate', 'Implement error boundaries for graceful error handling.', 'Use componentDidCatch or react-error-boundary', 20),
('React', 'intermediate', 'Use useCallback to memoize a function.', 'Wrap function in useCallback with dependencies', 20),
('React', 'intermediate', 'Create a reusable modal component.', 'Use portal and manage open/close state', 20),
('React', 'intermediate', 'Implement lazy loading for a component.', 'Use React.lazy() with Suspense', 20),
('React', 'intermediate', 'Use useReducer for complex state management.', 'Define reducer function with switch cases', 20);

-- ADVANCED (10 questions)
INSERT INTO daily_tasks (technology, difficulty, question, hint, xp_reward) VALUES
('React', 'advanced', 'Implement infinite scroll with useEffect and IntersectionObserver.', 'Observe last element for loading more', 30),
('React', 'advanced', 'Create a compound component pattern for a tabs system.', 'Use React.Children and cloneElement', 30),
('React', 'advanced', 'Implement optimistic updates with rollback on error.', 'Update UI immediately, revert if API fails', 30),
('React', 'advanced', 'Build a render props pattern for data fetching.', 'Pass render function as child or prop', 30),
('React', 'advanced', 'Create a higher-order component for authentication.', 'Wrap component and check auth status', 30),
('React', 'advanced', 'Implement virtualization for a large list.', 'Use react-window or react-virtual', 30),
('React', 'advanced', 'Create a custom hook for WebSocket connections.', 'Manage connection lifecycle in useEffect', 30),
('React', 'advanced', 'Implement undo/redo functionality using useReducer.', 'Maintain history stack of states', 30),
('React', 'advanced', 'Build a drag and drop interface without libraries.', 'Use HTML5 drag events with React', 30),
('React', 'advanced', 'Create a suspense-compatible data fetching solution.', 'Throw promise for pending state', 30);
